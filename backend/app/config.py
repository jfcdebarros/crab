"""Configuração do crab, lida de variáveis de ambiente (nunca coloque credenciais no código)."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def _f(name: str, default: float) -> float:
    try:
        return float(os.getenv(name, default))
    except ValueError:
        return default


@dataclass(frozen=True)
class Settings:
    # Fonte de preços: "cedro" (produção) ou "mock" (simulação local, sem credenciais)
    feed: str = os.getenv("CRAB_FEED", "off").lower()   # off | mock | cedro
    cedro_base_url: str = os.getenv("CEDRO_BASE_URL", "https://webfeeder.cedrotech.com").rstrip("/")
    cedro_login: str = os.getenv("CEDRO_LOGIN", "")
    cedro_password: str = os.getenv("CEDRO_PASSWORD", "")
    # Ticker do dólar na Cedro, se o seu contrato incluir câmbio (ex.: o código informado pela Cedro). Vazio = usa PTAX.
    fx_symbol: str = os.getenv("CRAB_FX_SYMBOL", "").upper()

    poll_seconds: float = _f("CRAB_POLL_SECONDS", 2.0)
    request_timeout: float = _f("CRAB_REQUEST_TIMEOUT", 5.0)
    max_concurrency: int = int(_f("CRAB_MAX_CONCURRENCY", 8))
    stale_after_seconds: float = _f("CRAB_STALE_SECONDS", 15.0)
    jump_limit: float = _f("CRAB_JUMP_LIMIT", 0.20)  # variação contra o fechamento anterior que marca o preço como suspeito
    bcb_refresh_seconds: float = _f("CRAB_BCB_REFRESH_SECONDS", 3600.0)
    rates_stale_days: int = int(_f("CRAB_RATES_STALE_DAYS", 4))

    # Acesso: usuário/senha HTTP Basic opcionais (recomendado: Cloudflare Access na frente)
    app_user: str = os.getenv("CRAB_USER", "")
    app_password: str = os.getenv("CRAB_PASSWORD", "")

    data_file: Path = Path(os.getenv("CRAB_DATA_FILE", str(ROOT / "frontend" / "data.json")))
    dist_dir: Path = Path(os.getenv("CRAB_DIST_DIR", str(ROOT / "frontend" / "dist")))
    jump_whitelist: frozenset = field(default_factory=lambda: frozenset(
        t.strip().upper() for t in os.getenv("CRAB_JUMP_WHITELIST", "").split(",") if t.strip()))


settings = Settings()
