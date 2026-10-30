"""Cliente da API REST de market data da Cedro.

Documentação pública usada (docs.cedrotech.com):
  - Autenticação: POST {base}/SignIn?login=...&password=...  -> sessão em cookie, corpo true/false
  - Cotação:      GET  {base}/services/quotes/quote/{codAtivo} -> JSON com lastTrade, bid, ask, previous, ...

O formato das mensagens de streaming (WebSocket "Web Feeder") só é entregue após a contratação;
quando chegar, implemente outra classe com a mesma interface (`start`, `stop`, `snapshot`).
"""
from __future__ import annotations

import asyncio
import logging
import random
from datetime import datetime
from typing import Iterable, Optional

import httpx

from .quality import Quote, utcnow

log = logging.getLogger("crab.cedro")


def _num(v) -> Optional[float]:
    """Converte números da API (float, int ou texto com vírgula) para float; None se inválido."""
    if v is None or isinstance(v, bool):
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip()
    if not s:
        return None
    if "," in s:
        s = s.replace(".", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return None


def parse_quote(symbol: str, payload) -> Quote:
    """Extrai os campos que o crab usa. Aceita objeto ou lista (quando a API devolve vários ativos)."""
    if isinstance(payload, list):
        match = [p for p in payload if isinstance(p, dict) and str(p.get("symbol", "")).upper() == symbol.upper()]
        payload = match[0] if match else (payload[0] if payload and isinstance(payload[0], dict) else {})
    if not isinstance(payload, dict):
        return Quote(symbol=symbol, error="resposta em formato inesperado")
    sym = str(payload.get("symbol") or symbol).upper()
    if sym != symbol.upper():
        return Quote(symbol=symbol, error=f"resposta para outro ativo ({sym})")
    trade_time = " ".join(str(payload[k]) for k in ("dateLastTradeString", "timeLastTradeSting", "timeLastTrade") if payload.get(k))
    return Quote(
        symbol=symbol,
        last=_num(payload.get("lastTrade")),
        bid=_num(payload.get("bid")),
        ask=_num(payload.get("ask")),
        prev=_num(payload.get("previous")),
        trade_time=trade_time or None,
        situation=None if payload.get("situation") is None else str(payload.get("situation")),
    )


class CedroRestFeed:
    def __init__(self, base_url: str, login: str, password: str, symbols: Iterable[str],
                 poll_seconds: float = 2.0, timeout: float = 5.0, concurrency: int = 8):
        if not login or not password:
            raise RuntimeError("Defina CEDRO_LOGIN e CEDRO_PASSWORD para usar CRAB_FEED=cedro")
        self.base, self.login, self.password = base_url, login, password
        self.symbols = sorted(set(s.upper() for s in symbols))
        self.poll_seconds, self.timeout = poll_seconds, timeout
        self.sem = asyncio.Semaphore(concurrency)
        self.quotes: dict[str, Quote] = {s: Quote(symbol=s) for s in self.symbols}
        self.connected = False
        self.last_success: Optional[datetime] = None
        self.last_error: Optional[str] = None
        self.errors = 0
        self._client: Optional[httpx.AsyncClient] = None
        self._task: Optional[asyncio.Task] = None

    async def _sign_in(self) -> None:
        r = await self._client.post(f"{self.base}/SignIn", params={"login": self.login, "password": self.password})
        ok = r.status_code == 200 and r.text.strip().strip('"').lower() == "true"
        if not ok:
            self.connected = False
            raise RuntimeError(f"SignIn falhou (HTTP {r.status_code})")
        self.connected = True
        log.info("Sessão Cedro aberta")

    async def _fetch(self, symbol: str) -> None:
        async with self.sem:
            try:
                r = await self._client.get(f"{self.base}/services/quotes/quote/{symbol}")
                if r.status_code == 401:
                    await self._sign_in()
                    r = await self._client.get(f"{self.base}/services/quotes/quote/{symbol}")
                r.raise_for_status()
                q = parse_quote(symbol, r.json())
                q.recv_at = utcnow() if q.error is None else None
                if q.error is None:
                    self.quotes[symbol] = q
                else:
                    self.quotes[symbol].error = q.error
                    self.errors += 1
            except Exception as exc:  # mantém o último preço, que vai envelhecer e virar "stale"
                self.quotes[symbol].error = f"{type(exc).__name__}: {exc}"[:200]
                self.errors += 1
                self.last_error = self.quotes[symbol].error

    async def _loop(self) -> None:
        while True:
            started = asyncio.get_running_loop().time()
            try:
                if not self.connected:
                    await self._sign_in()
                await asyncio.gather(*(self._fetch(s) for s in self.symbols))
                if any(q.recv_at and (utcnow() - q.recv_at).total_seconds() < self.poll_seconds * 2 for q in self.quotes.values()):
                    self.last_success = utcnow()
            except Exception as exc:
                self.connected = False
                self.last_error = f"{type(exc).__name__}: {exc}"[:200]
                self.errors += 1
                log.warning("Falha no ciclo da Cedro: %s", self.last_error)
            elapsed = asyncio.get_running_loop().time() - started
            await asyncio.sleep(max(0.2, self.poll_seconds - elapsed))

    async def start(self) -> None:
        self._client = httpx.AsyncClient(timeout=self.timeout, headers={"Accept": "application/json"})
        self._task = asyncio.create_task(self._loop())

    async def stop(self) -> None:
        if self._task:
            self._task.cancel()
        if self._client:
            await self._client.aclose()

    def status(self) -> dict:
        return {"source": "cedro", "connected": self.connected,
                "last_success": self.last_success.isoformat() if self.last_success else None,
                "errors": self.errors, "last_error": self.last_error}


class MockFeed:
    """Simulação local: passeio aleatório em torno dos preços de referência do data.json.
    Serve só para desenvolver e demonstrar; a tela mostra a faixa SIMULADO."""

    def __init__(self, reference: dict[str, float], symbols: Iterable[str], poll_seconds: float = 2.0, seed: int = 7):
        self.ref = {k.upper(): v for k, v in reference.items()}
        self.symbols = sorted(set(s.upper() for s in symbols))
        self.poll_seconds = poll_seconds
        self.rng = random.Random(seed)
        self.px = {s: self.ref.get(s) for s in self.symbols}
        self.quotes: dict[str, Quote] = {s: Quote(symbol=s) for s in self.symbols}
        self.last_success: Optional[datetime] = None
        self._task: Optional[asyncio.Task] = None

    def tick(self) -> None:
        now = utcnow()
        for s in self.symbols:
            p = self.px.get(s)
            if not p:
                continue
            p = round(p * (1 + self.rng.gauss(0, 0.002)), 2)
            self.px[s] = p
            spread = max(0.01, round(p * 0.0005, 2))
            self.quotes[s] = Quote(symbol=s, last=p, bid=round(p - spread, 2), ask=round(p + spread, 2),
                                   prev=self.ref.get(s), trade_time=now.strftime("%H:%M:%S"), situation="simulado", recv_at=now)
        self.last_success = now

    async def _loop(self) -> None:
        while True:
            self.tick()
            await asyncio.sleep(self.poll_seconds)

    async def start(self) -> None:
        self.tick()
        self._task = asyncio.create_task(self._loop())

    async def stop(self) -> None:
        if self._task:
            self._task.cancel()

    def status(self) -> dict:
        return {"source": "mock", "connected": True,
                "last_success": self.last_success.isoformat() if self.last_success else None, "errors": 0, "last_error": None}
