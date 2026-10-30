"""Testes do backend: validação de cotações, leitura das respostas da Cedro e do Banco Central, API em modo simulado."""
import asyncio
import os
from datetime import date, timedelta

import httpx
import pytest

os.environ.setdefault("CRAB_FEED", "mock")

from app.bcb import Rates, parse_ptax, parse_sgs  # noqa: E402
from app.cedro import CedroRestFeed, _num, parse_quote  # noqa: E402
from app.quality import MISSING, OK, STALE, SUSPECT, Quote, assess, utcnow  # noqa: E402

NOW = utcnow()


def q(**kw):
    base = dict(symbol="DESK3", last=19.38, bid=19.37, ask=19.39, prev=19.40, recv_at=NOW)
    base.update(kw)
    return Quote(**base)


# ---------- regras de qualidade ----------
def test_ok_quote():
    assert assess(q(), NOW, 15, 0.2).status == OK


@pytest.mark.parametrize("last", [None, 0, -1, float("nan"), float("inf")])
def test_missing_when_last_invalid(last):
    assert assess(q(last=last), NOW, 15, 0.2).status == MISSING


def test_stale_when_old():
    r = assess(q(recv_at=NOW - timedelta(seconds=16)), NOW, 15, 0.2)
    assert r.status == STALE and "16s" in r.flags[0]


def test_stale_when_never_received():
    assert assess(q(recv_at=None), NOW, 15, 0.2).status == STALE


def test_suspect_crossed_book():
    assert assess(q(bid=19.50, ask=19.30), NOW, 15, 0.2).status == SUSPECT


def test_suspect_jump_and_whitelist():
    assert assess(q(last=25.0, bid=24.9, ask=25.1), NOW, 15, 0.2).status == SUSPECT
    assert assess(q(last=25.0, bid=24.9, ask=25.1), NOW, 15, 0.2, frozenset({"DESK3"})).status == OK


def test_missing_beats_stale():
    assert assess(q(last=None, recv_at=None), NOW, 15, 0.2).status == MISSING


# ---------- Cedro ----------
CEDRO_SAMPLE = {"symbol": "PETR4", "lastTrade": 58.21, "bid": 58.20, "ask": 58.22, "previous": 58.0,
                "timeLastTrade": "17:07:58", "dateLastTradeString": "20/10/2026", "situation": "2"}


def test_parse_quote_object():
    r = parse_quote("PETR4", CEDRO_SAMPLE)
    assert (r.last, r.bid, r.ask, r.prev, r.situation, r.error) == (58.21, 58.20, 58.22, 58.0, "2", None)


def test_parse_quote_list_picks_symbol():
    r = parse_quote("VALE3", [CEDRO_SAMPLE, {**CEDRO_SAMPLE, "symbol": "VALE3", "lastTrade": "65,44"}])
    assert r.last == 65.44


def test_parse_quote_rejects_other_symbol():
    assert parse_quote("VALE3", CEDRO_SAMPLE).error


@pytest.mark.parametrize("raw,val", [("1.234,56", 1234.56), ("19.38", 19.38), (7, 7.0), ("", None), (None, None), ("abc", None), (True, None)])
def test_num(raw, val):
    assert _num(raw) == val


def test_cedro_client_signin_quote_and_relogin():
    calls = {"signin": 0, "quote": 0}

    def handler(req: httpx.Request):
        if req.url.path == "/SignIn":
            calls["signin"] += 1
            assert req.url.params["login"] == "u" and req.url.params["password"] == "p"
            return httpx.Response(200, text="true")
        calls["quote"] += 1
        if calls["quote"] == 1:  # primeira chamada simula sessão expirada
            return httpx.Response(401)
        return httpx.Response(200, json={**CEDRO_SAMPLE, "symbol": "DESK3", "lastTrade": 19.38})

    async def run():
        f = CedroRestFeed("https://x", "u", "p", ["DESK3"])
        f._client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
        await f._sign_in()
        await f._fetch("DESK3")
        await f._client.aclose()
        return f

    f = asyncio.run(run())
    assert f.quotes["DESK3"].last == 19.38 and f.quotes["DESK3"].recv_at is not None
    assert calls["signin"] == 2  # login inicial + relogin após 401


def test_cedro_failure_keeps_old_price_without_refreshing_time():
    def handler(req):
        return httpx.Response(200, text="true") if req.url.path == "/SignIn" else httpx.Response(500)

    async def run():
        f = CedroRestFeed("https://x", "u", "p", ["DESK3"])
        old = NOW - timedelta(seconds=60)
        f.quotes["DESK3"] = q(recv_at=old)
        f._client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
        await f._fetch("DESK3")
        await f._client.aclose()
        return f, old

    f, old = asyncio.run(run())
    assert f.quotes["DESK3"].recv_at == old and f.quotes["DESK3"].error
    assert assess(f.quotes["DESK3"], NOW, 15, 0.2).status == STALE


def test_cedro_requires_credentials():
    with pytest.raises(RuntimeError):
        CedroRestFeed("https://x", "", "", ["DESK3"])


# ---------- Banco Central ----------
def test_parse_sgs():
    assert parse_sgs([{"data": "23/10/2026", "valor": "13.65"}]) == (13.65, "2026-10-23")
    assert parse_sgs([]) == (None, None)


def test_parse_ptax():
    assert parse_ptax({"value": [{"cotacaoVenda": 5.0134, "dataHoraCotacao": "2026-10-20 13:04:00.000"}]}) == (5.0134, "2026-10-20")
    assert parse_ptax({"value": []}) == (None, None)


def test_rates_staleness():
    r = Rates(stale_days=4)
    r._put("selic", 13.65, "2026-10-23", "t")
    assert r.snapshot(date(2026, 10, 24))["selic"]["status"] == "ok"
    assert r.snapshot(date(2026, 10, 30))["selic"]["status"] == "stale"


# ---------- API (modo simulado) ----------
def test_api_snapshot_mock():
    from fastapi.testclient import TestClient
    from app.main import app, universe, DATA
    with TestClient(app) as c:
        s = c.get("/api/snapshot").json()
        assert s["mode"] == "mock"
        assert set(s["quotes"]) == universe(DATA)
        assert all(v["status"] == OK for k, v in s["quotes"].items() if k in DATA["prices"])
        assert s["quotes"]["ARND3"]["status"] == "missing"  # sem referência no simulador: nunca aparece como ok
        assert "AFYA" not in s["quotes"]  # ativo em dólar não vem da Cedro


def test_universe_covers_engine_tickers():
    from app.main import universe, DATA
    u = universe(DATA)
    need = {e["target"] for e in DATA["events"] if e.get("model") != "watch"}
    need |= {c[0] for h in DATA["holdings"] for c in h["classes"]} | {p["ticker"] for h in DATA["holdings"] for p in h["positions"]}
    need |= {x for c in DATA["classes"] for x in (c["on"], c["pn"])} | {x for un in DATA["units"] for x in (un["unit"], un["on"], un["pn"])}
    need |= {a["local"] for a in DATA["adrs"]}
    need -= {"AFYA"}
    assert need <= u, need - u


def test_api_off_mode(monkeypatch):
    """Sem feed contratado: site no ar, /api/snapshot 404 (o site fica no fechamento), health 200."""
    from fastapi.testclient import TestClient
    import app.main as m
    monkeypatch.setattr(m, "OFF", True)
    with TestClient(m.app) as c:
        r = c.get("/api/snapshot")
        assert r.status_code == 404 and r.json()["mode"] == "off"
        h = c.get("/api/health")
        assert h.status_code == 200 and h.json()["mode"] == "off"
