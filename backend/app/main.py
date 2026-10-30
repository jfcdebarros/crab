"""crab · API e servidor do site.

Rotas:
  GET /api/snapshot  cotações validadas, câmbio, taxas do Banco Central e estado do feed
  GET /api/health    resumo para monitoramento (HTTP 503 se o feed estiver parado)

CRAB_FEED: cedro (ao vivo) | mock (preços simulados) | off (sem feed: fechamento salvo + cotações digitadas)
  GET /              o site (frontend/dist/index.html)
"""
from __future__ import annotations

import base64
import json
import logging
import secrets
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse, Response

from .bcb import Rates
from .cedro import CedroRestFeed, MockFeed
from .config import settings
from .quality import OK, assess, utcnow

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
log = logging.getLogger("crab")


def universe(data: dict) -> set[str]:
    """Todos os tickers da B3 que o data.json usa (moedas estrangeiras ficam de fora)."""
    meta = data.get("price_meta", {})
    syms = {t for t in data.get("prices", {}) if meta.get(t, {}).get("ccy", "BRL") == "BRL"}
    for e in data.get("events", []):
        for k in ("target", "acquirer"):
            t = e.get(k, "")
            if t and t.isupper() and any(c.isdigit() for c in t) and meta.get(t, {}).get("ccy", "BRL") == "BRL":
                syms.add(t)
    return syms


DATA = json.loads(settings.data_file.read_text(encoding="utf-8"))
SYMBOLS = universe(DATA) | ({settings.fx_symbol} if settings.fx_symbol else set())


OFF = settings.feed == "off"   # sem fonte de preços: o site usa o fechamento salvo no data.json e cotações digitadas


def build_feed():
    if OFF:
        return None
    if settings.feed == "cedro":
        return CedroRestFeed(settings.cedro_base_url, settings.cedro_login, settings.cedro_password, SYMBOLS,
                             settings.poll_seconds, settings.request_timeout, settings.max_concurrency)
    ref = dict(DATA.get("prices", {}))
    if settings.fx_symbol:
        ref[settings.fx_symbol] = DATA.get("params", {}).get("usdbrl", 5.0)
    return MockFeed(ref, SYMBOLS, settings.poll_seconds)


feed = build_feed()
rates = Rates(settings.bcb_refresh_seconds, settings.rates_stale_days)


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("crab iniciando · feed=%s · %d ativos", settings.feed, len(SYMBOLS))
    if OFF:
        yield
        return
    await feed.start()
    await rates.start()
    yield
    await feed.stop()
    await rates.stop()


app = FastAPI(title="crab", lifespan=lifespan, docs_url=None, redoc_url=None)


@app.middleware("http")
async def basic_auth(request: Request, call_next):
    if settings.app_user and request.url.path != "/api/health":
        h = request.headers.get("authorization", "")
        ok = False
        if h.startswith("Basic "):
            try:
                u, _, p = base64.b64decode(h[6:]).decode().partition(":")
                ok = secrets.compare_digest(u, settings.app_user) and secrets.compare_digest(p, settings.app_password)
            except Exception:
                ok = False
        if not ok:
            return Response(status_code=401, headers={"WWW-Authenticate": 'Basic realm="crab"'})
    resp = await call_next(request)
    resp.headers["Cache-Control"] = "no-store"
    return resp


def snapshot_payload() -> dict:
    now = utcnow()
    quotes = {}
    for sym, q in feed.quotes.items():
        assess(q, now, settings.stale_after_seconds, settings.jump_limit, settings.jump_whitelist)
        quotes[sym] = q.to_dict()
    r = rates.snapshot()
    if settings.feed == "mock":  # simulação local sem internet: taxas fictícias, sempre rotuladas como simuladas
        prm = DATA.get("params", {})
        r.setdefault("selic", {"value": prm.get("selic"), "date": now.date().isoformat(), "source": "simulado", "status": "ok", "age_days": 0})
        r.setdefault("ptax", {"value": prm.get("usdbrl"), "date": now.date().isoformat(), "source": "simulado", "status": "ok", "age_days": 0})
    fx = None
    if settings.fx_symbol and settings.fx_symbol in quotes:
        fq = quotes.pop(settings.fx_symbol)
        fx = {"value": fq["last"], "source": f"feed {settings.fx_symbol}", "status": fq["status"], "flags": fq["flags"], "intraday": True}
    elif settings.feed == "mock" and "ptax" in r:
        fx = {"value": r["ptax"]["value"], "source": "simulado", "status": "ok", "flags": [], "intraday": True}
    elif "ptax" in r:
        p = r["ptax"]
        fx = {"value": p["value"], "source": f"PTAX {p['date']}", "status": p["status"], "flags": ["PTAX não é câmbio intradiário"], "intraday": False}
    return {
        "mode": settings.feed, "server_time": now.isoformat(), "stale_after_s": settings.stale_after_seconds,
        "quotes": quotes, "fx": fx, "rates": r, "feed": feed.status(), "rates_error": rates.last_error,
    }


@app.get("/api/snapshot")
async def snapshot():
    if OFF:  # o site entende a ausência como "sem feed" e fica no modo fechamento + cotações manuais
        return JSONResponse({"mode": "off", "detail": "sem fonte de preços ao vivo"}, status_code=404)
    return JSONResponse(snapshot_payload())


@app.get("/api/health")
async def health():
    if OFF:
        return JSONResponse({"healthy": True, "mode": "off", "detail": "site no ar sem preços ao vivo"})
    s = snapshot_payload()
    n = len(s["quotes"])
    ok = sum(1 for q in s["quotes"].values() if q["status"] == OK)
    healthy = n > 0 and ok / n >= 0.8 and s["feed"]["connected"]
    body = {"healthy": healthy, "mode": s["mode"], "quotes_ok": ok, "quotes_total": n, "feed": s["feed"],
            "rates": {k: v["status"] for k, v in s["rates"].items()}}
    return JSONResponse(body, status_code=200 if healthy else 503)


@app.get("/")
async def index():
    f = settings.dist_dir / "index.html"
    if not f.exists():
        return Response("Rode `python frontend/build.py` antes de iniciar o servidor.", status_code=500)
    return FileResponse(f, media_type="text/html")
