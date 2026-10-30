"""Taxas oficiais do Banco Central (gratuito, sem chave).

SGS (api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo}/dados/ultimos/1?formato=json):
  1178 = Selic anualizada base 252 (taxa efetiva, usada na correção da OPA DESK3)
  4389 = CDI anualizado base 252
  432  = Meta Selic definida pelo Copom
PTAX (Olinda): CotacaoDolarDia(dataCotacao=@dataCotacao)
"""
from __future__ import annotations

import asyncio
import logging
from datetime import date, datetime, timedelta
from typing import Optional

import httpx

from .quality import utcnow

log = logging.getLogger("crab.bcb")
SGS = {"selic": 1178, "cdi": 4389, "selic_meta": 432}
SGS_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.{code}/dados/ultimos/1?formato=json"
PTAX_URL = ("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)"
            "?@dataCotacao='{mdY}'&$format=json")


def parse_sgs(payload) -> tuple[Optional[float], Optional[str]]:
    """[{'data': '23/10/2026', 'valor': '13.65'}] -> (13.65, '2026-10-23')"""
    if not isinstance(payload, list) or not payload:
        return None, None
    row = payload[-1]
    try:
        d, m, y = str(row["data"]).split("/")
        return float(str(row["valor"]).replace(",", ".")), f"{y}-{m}-{d}"
    except (KeyError, ValueError):
        return None, None


def parse_ptax(payload) -> tuple[Optional[float], Optional[str]]:
    """{'value': [{'cotacaoCompra': 5.01, 'cotacaoVenda': 5.0134, 'dataHoraCotacao': '2026-10-20 13:04:00.000'}]}"""
    try:
        rows = payload["value"]
        if not rows:
            return None, None
        r = rows[-1]
        return float(r["cotacaoVenda"]), str(r["dataHoraCotacao"])[:10]
    except (KeyError, TypeError, ValueError):
        return None, None


class Rates:
    def __init__(self, refresh_seconds: float = 3600, stale_days: int = 4, timeout: float = 10):
        self.refresh, self.stale_days, self.timeout = refresh_seconds, stale_days, timeout
        self.values: dict[str, dict] = {}
        self.last_error: Optional[str] = None
        self._task: Optional[asyncio.Task] = None

    def _put(self, key: str, value, as_of, source: str) -> None:
        if value is None:
            return
        self.values[key] = {"value": value, "date": as_of, "source": source, "fetched_at": utcnow().isoformat()}

    async def refresh_once(self, client: httpx.AsyncClient) -> None:
        for key, code in SGS.items():
            try:
                r = await client.get(SGS_URL.format(code=code))
                r.raise_for_status()
                self._put(key, *parse_sgs(r.json()), source=f"BCB SGS {code}")
            except Exception as exc:
                self.last_error = f"SGS {code}: {exc}"[:200]
                log.warning(self.last_error)
        d = date.today()
        for _ in range(8):  # PTAX só existe em dia útil: volta até achar a última
            try:
                r = await client.get(PTAX_URL.format(mdY=d.strftime("%m-%d-%Y")))
                r.raise_for_status()
                v, as_of = parse_ptax(r.json())
                if v:
                    self._put("ptax", v, as_of, "BCB PTAX venda")
                    break
            except Exception as exc:
                self.last_error = f"PTAX: {exc}"[:200]
            d -= timedelta(days=1)

    async def _loop(self) -> None:
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            while True:
                await self.refresh_once(client)
                await asyncio.sleep(self.refresh)

    async def start(self) -> None:
        self._task = asyncio.create_task(self._loop())

    async def stop(self) -> None:
        if self._task:
            self._task.cancel()

    def snapshot(self, today: Optional[date] = None) -> dict:
        today = today or date.today()
        out = {}
        for k, v in self.values.items():
            age = (today - datetime.strptime(v["date"], "%Y-%m-%d").date()).days if v.get("date") else 999
            out[k] = {**v, "status": "ok" if age <= self.stale_days else "stale", "age_days": age}
        return out
