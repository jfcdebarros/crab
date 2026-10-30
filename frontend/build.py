"""Gera frontend/dist/index.html a partir de head.html + data.json + engine.js + docs.js + app.js."""
import json
from pathlib import Path
here = Path(__file__).parent
d = json.loads((here / "data.json").read_text(encoding="utf-8"))
seed = json.dumps(d, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
out = (here / "head.html").read_text(encoding="utf-8") + '\n<script id="seed" type="application/json">' + seed + "</script>\n<script>\n" \
    + (here / "engine.js").read_text(encoding="utf-8") + (here / "docs.js").read_text(encoding="utf-8") + (here / "app.js").read_text(encoding="utf-8") + "</script>\n"
page = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>\n' + out + "</body></html>\n"
(here / "dist").mkdir(exist_ok=True)
(here / "dist" / "index.html").write_text(page, encoding="utf-8")
(here / "dist" / "fragment.html").write_text(out, encoding="utf-8")  # mesma página sem o esqueleto, para publicar no Claude
print("dist/index.html", len(page), "bytes")
