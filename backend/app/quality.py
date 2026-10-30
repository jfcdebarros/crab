"""Regras de qualidade de dado. Princípio: na dúvida, o insumo NÃO é 'ok' e o spread não é exibido como operável."""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

OK, STALE, SUSPECT, MISSING = "ok", "stale", "suspect", "missing"


@dataclass
class Quote:
    symbol: str
    last: Optional[float] = None
    bid: Optional[float] = None
    ask: Optional[float] = None
    prev: Optional[float] = None
    trade_time: Optional[str] = None
    situation: Optional[str] = None
    recv_at: Optional[datetime] = None
    error: Optional[str] = None
    status: str = MISSING
    flags: list = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "last": self.last, "bid": self.bid, "ask": self.ask, "prev": self.prev,
            "trade_time": self.trade_time, "situation": self.situation,
            "recv_at": self.recv_at.isoformat() if self.recv_at else None,
            "status": self.status, "flags": list(self.flags), "error": self.error,
        }


def _pos(x) -> bool:
    return isinstance(x, (int, float)) and math.isfinite(x) and x > 0


def assess(q: Quote, now: datetime, stale_after: float, jump_limit: float, whitelist=frozenset()) -> Quote:
    """Classifica a cotação. Ordem de gravidade: missing > stale > suspect > ok."""
    flags = []
    if not _pos(q.last):
        q.status, q.flags = MISSING, ["sem último preço válido"] + ([q.error] if q.error else [])
        return q
    if q.recv_at is None or (now - q.recv_at).total_seconds() > stale_after:
        age = "nunca recebida" if q.recv_at is None else f"{(now - q.recv_at).total_seconds():.0f}s sem atualizar"
        q.status, q.flags = STALE, [age] + ([q.error] if q.error else [])
        return q
    if _pos(q.bid) and _pos(q.ask) and q.bid > q.ask:
        flags.append(f"livro cruzado (bid {q.bid} > ask {q.ask})")
    if _pos(q.bid) and _pos(q.ask) and not (q.bid * 0.8 <= q.last <= q.ask * 1.2):
        flags.append("último preço fora do intervalo bid/ask")
    if _pos(q.prev) and abs(q.last / q.prev - 1) > jump_limit and q.symbol not in whitelist:
        flags.append(f"variação de {100 * (q.last / q.prev - 1):+.1f}% contra o fechamento anterior")
    q.status, q.flags = (SUSPECT if flags else OK), flags
    return q


def utcnow() -> datetime:
    return datetime.now(timezone.utc)
