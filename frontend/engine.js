"use strict";
const DATA = JSON.parse(document.getElementById("seed").textContent);
const LS = "edarb.monitor.v1";
let store = {overrides:{}, params:{}, asm:{}, refs:{}, ext:{}, tab:"overview"};
try { const s = JSON.parse(localStorage.getItem(LS) || "null"); if (s) store = Object.assign(store, s); } catch(e) {}
function save(){ try { localStorage.setItem(LS, JSON.stringify(store)); } catch(e) {} }

/* ---------- calendário e taxas ---------- */
const HOL = new Set(["2026-01-01","2026-02-16","2026-02-17","2026-04-03","2026-04-21","2026-05-01","2026-06-04","2026-09-07","2026-10-12","2026-11-02","2026-11-20","2026-12-25","2027-01-01","2027-02-08","2027-02-09","2027-03-26","2027-04-21","2027-05-27","2027-09-07","2027-10-12","2027-11-02","2027-11-15","2028-02-28","2028-02-29","2028-04-14","2028-04-21","2028-05-01","2028-06-15","2028-09-07","2028-10-12","2028-11-02","2028-11-15","2028-11-20","2028-12-25"]);
const D = s => new Date(s + "T12:00:00Z");
const iso = d => d.toISOString().slice(0,10);
function du(a,b){ let n=0,d=D(a),e=D(b); if(e<=d) return 0; while(d<e){ const w=d.getUTCDay(); if(w&&w!==6&&!HOL.has(iso(d))) n++; d.setUTCDate(d.getUTCDate()+1);} return n; }
const dcal = (a,b) => Math.round((D(b)-D(a))/864e5);
const TODAY = new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo"}).format(new Date());

/* ---------- formatação ---------- */
const nf = (x,d=2) => Number.isFinite(x) ? x.toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d}) : "—";
const R = (x,d=2) => Number.isFinite(x) ? "R$ " + nf(x,d) : "—";
const U = (x,d=2) => Number.isFinite(x) ? "US$ " + nf(x,d) : "—";
const P = (x,d=2) => Number.isFinite(x) ? (x>0?"+":x<0?"−":"") + nf(Math.abs(x)*100,d) + "%" : "—";
const PP = x => Number.isFinite(x) ? (x>0?"+":x<0?"−":"") + nf(Math.abs(x),1) + " p.p." : "—";
const BI = x => Number.isFinite(x) ? "R$ " + nf(x/1e9,2) + " bi" : "—";
const brDate = s => s ? s.slice(8,10) + "/" + s.slice(5,7) + "/" + s.slice(0,4) : "a definir";
const shortDate = s => s ? s.slice(8,10) + "/" + s.slice(5,7) : "—";
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const tk = t => `<span class="tk">${esc(t)}</span>`;

/* ---------- mercado (snapshot local ou feed ao vivo) ---------- */
const LIVE = {mode:"offline", snap:null, lastOk:0, everOk:false, error:null};
const liveOn = () => LIVE.mode !== "offline";
const liveAge = () => (Date.now() - LIVE.lastOk)/1000;
const staleLimit = () => (LIVE.snap && LIVE.snap.stale_after_s) || 15;
const quoteOf = t => LIVE.snap && LIVE.snap.quotes ? LIVE.snap.quotes[t] : null;
const isForeign = t => !!(DATA.price_meta[t] && DATA.price_meta[t].ccy && DATA.price_meta[t].ccy !== "BRL");
function px(t){
  const o = store.overrides[t]; if (o) return o.v;
  if (!liveOn()) return DATA.prices[t];
  const q = quoteOf(t); return q && q.last > 0 ? q.last : NaN;
}
function health(t){
  if (store.overrides[t]) return {s:"manual", why:`${t} manual`};
  if (!liveOn()) return {s:"snapshot"};
  if (isForeign(t)) return {s:"missing", why:`${t} sem preço ao vivo: informe em Cotações`};
  const q = quoteOf(t);
  if (!q) return {s:"missing", why:`${t} fora do feed`};
  if (liveAge() > staleLimit()) return {s:"stale", why:`sem conexão há ${Math.round(liveAge())}s`};
  if (q.status !== "ok") return {s:q.status, why:`${t}: ${(q.flags||[])[0] || q.status}`};
  return {s:"ok"};
}
function pxSrc(t){ return health(t).s; }
function selic(){
  const v = parseFloat(store.params.selic); if (Number.isFinite(v)) return v/100;
  const r = liveOn() && LIVE.snap.rates && LIVE.snap.rates.selic;
  return (r ? r.value : DATA.params.selic)/100;
}
function selicHealth(){
  if (Number.isFinite(parseFloat(store.params.selic))) return {s:"manual", why:"Selic manual"};
  if (!liveOn()) return {s:"snapshot"};
  const r = LIVE.snap.rates && LIVE.snap.rates.selic;
  if (!r) return {s:"missing", why:"Selic do Banco Central indisponível"};
  if (r.status !== "ok") return {s:"stale", why:`Selic do Banco Central de ${brDate(r.date)}`};
  return {s:"ok"};
}
function fx(){
  const v = parseFloat(store.params.fx); if (Number.isFinite(v)) return v;
  const f = liveOn() && LIVE.snap.fx;
  return f && f.value ? f.value : (liveOn() ? NaN : DATA.params.usdbrl);
}
function fxHealth(intraday){
  if (Number.isFinite(parseFloat(store.params.fx))) return {s:"manual", why:"câmbio manual"};
  if (!liveOn()) return {s:"snapshot"};
  const f = LIVE.snap.fx;
  if (!f || !f.value) return {s:"missing", why:"câmbio indisponível"};
  if (liveAge() > staleLimit()) return {s:"stale", why:`sem conexão há ${Math.round(liveAge())}s`};
  if (f.status !== "ok") return {s:f.status, why:`câmbio: ${(f.flags||[])[0] || f.status}`};
  if (intraday && !f.intraday) return {s:"suspect", why:"câmbio intradiário indisponível (só PTAX)"};
  return {s:"ok"};
}
function ext(k){ const v = parseFloat(store.ext[k]); return Number.isFinite(v) && v>0 ? v : NaN; }
function extHealth(k){ return Number.isFinite(ext(k)) ? {s:"manual", why:`${k} manual`} : {s:"missing", why:`informe ${k}`}; }
function gate(o, checks){
  const bad = checks.find(c => c && ["stale","suspect","missing"].includes(c.s));
  o.block = bad ? bad.why : null;
  o.manual = checks.some(c => c && c.s === "manual");
  o.snapshot = checks.some(c => c && c.s === "snapshot");
  return o;
}
function asm(id, key, dflt){ const a = store.asm[id]; return a && a[key] !== undefined && a[key] !== "" ? a[key] : dflt; }

/* ---------- motores ---------- */
function evalEvent(e){
  const t = e.terms || {}, out = {e, spread:NaN, implied:NaN, price:px(e.target), legs:[], formula:"", trade:null, ccy:"BRL"};
  if (e.model === "cash_selic"){
    const n = du(t.base_date, TODAY), f = Math.pow(1+selic(), n/252);
    const nd = parseFloat(asm(e.id,"nd_adj",t.nd_adj)) || 0;
    const inc = asm(e.id,"include_retained",t.include_retained);
    const a = t.base*f, c = inc ? t.retained : 0;
    out.implied = a + nd + c; out.spread = out.implied/out.price - 1; out.cashOnly = a/out.price - 1;
    out.legs = [["Dias úteis desde " + brDate(t.base_date), String(n)],["Fator Selic (1 + " + nf(selic()*100,2) + "%)^(" + n + "/252)", f.toFixed(6)],["(a) " + nf(t.base,4) + " × fator", R(a,4)],["(b) Ajuste de dívida líquida", R(nd,4)],["(c) Parcela retida" + (inc?"":" (excluída)"), R(c,4)],["Valor da OPA hoje", R(out.implied,4), "tot"],["Preço na bolsa", R(out.price,2)],["Spread", P(out.spread), "tot"],["Spread só da perna caixa (a)", P(out.cashOnly)]];
    out.formula = `Valor hoje = ${nf(t.base,4)} × (1 + Selic)^(du/252) + ajuste de dívida + parcela retida\nSpread = valor hoje ÷ preço − 1`;
    out.trade = [["buy", e.target, 1000]];
    out.sub = "Selic + spread";
  } else if (e.model === "ratio"){
    const pa = px(e.acquirer);
    out.implied = t.ratio*pa; out.spread = out.implied/out.price - 1;
    out.legs = [["Relação de troca", nf(t.ratio,8)],["Preço " + e.acquirer, R(pa,2)],["Valor implícito por " + e.target, R(out.implied,4), "tot"],["Preço " + e.target, R(out.price,2)],["Spread bruto", P(out.spread), "tot"]];
    out.formula = `Valor implícito = ${nf(t.ratio,8)} × ${e.acquirer}\nSpread = valor implícito ÷ ${e.target} − 1`;
    out.trade = [["buy", e.target, 1000],["sell", e.acquirer, Math.round(1000*t.ratio)]];
  } else if (e.model === "ratio_fx"){
    const pa = px(e.acquirer), ad = parseFloat(asm(e.id,"acq_div",t.acq_div))||0, td = parseFloat(asm(e.id,"target_div",t.target_div))||0;
    out.ccy = "USD";
    out.implied = t.ratio*(pa-ad)/fx() + td; out.spread = out.implied/out.price - 1;
    out.legs = [["Relação de troca", nf(t.ratio,6)],[e.acquirer + " ex-distribuição: " + nf(pa,2) + " − " + nf(ad,2), R(pa-ad,2)],["USD/BRL", nf(fx(),4)],["Distribuição esperada à Afya (US$)", nf(td,2)],["Valor implícito da Afya", U(out.implied,2), "tot"],["Preço AFYA (Nasdaq)", U(out.price,2)],["Spread (compra AFYA)", P(out.spread), "tot"]];
    out.formula = "AFYA implícita = " + nf(t.ratio,6) + " × (YDUQ3 − distribuição Yduqs) ÷ USD/BRL + distribuição Afya\nSpread = implícita ÷ AFYA − 1  (negativo: AFYA cara contra YDUQ3)";
    const r = Math.round(1000*t.ratio);
    out.trade = out.spread >= 0 ? [["buy","AFYA",1000],["sell","YDUQ3",r]] : [["buy","YDUQ3",r],["sell","AFYA",1000]];
  } else if (e.model === "ratio_fx_input"){
    const s = ext("SAN");
    out.implied = t.ratio*s*fx(); out.spread = out.implied/out.price - 1; out.needs = !Number.isFinite(s) ? "Informe o preço de SAN (US$)" : "";
    out.legs = [["Relação de troca por unit", nf(t.ratio,4)],["SAN (NYSE, US$)", Number.isFinite(s)?U(s,2):"—"],["USD/BRL", nf(fx(),4)],["Valor implícito por unit", R(out.implied,4), "tot"],["SANB11", R(out.price,2)],["Spread", P(out.spread), "tot"]];
    out.formula = "Valor implícito = " + nf(t.ratio,4) + " × SAN (US$) × USD/BRL\nSpread = valor implícito ÷ SANB11 − 1";
    out.trade = [["buy","SANB11",1000],["sell","SAN",Math.round(1000*t.ratio)]];
  } else if (e.model === "cash_fixed"){
    out.implied = t.offer; out.spread = t.offer/out.price - 1;
    out.legs = [["Preço da oferta", R(t.offer,2)],["Preço na bolsa", R(out.price,2)],["Spread", P(out.spread), "tot"]];
    out.formula = "Spread = preço da oferta ÷ preço na bolsa − 1";
    out.trade = [["buy", e.target, 1000]];
  } else if (e.model === "debenture"){
    const par = t.units*t.vna, pct = parseFloat(asm(e.id,"pct_par",""));
    out.breakeven = out.price/par;
    if (Number.isFinite(pct)){ out.implied = par*pct/100; out.spread = out.implied/out.price - 1; }
    else out.needs = "Informe o valor das debêntures (% do nominal)";
    out.legs = [["Debêntures por ação", String(t.units)],["Valor nominal atualizado", R(t.vna,2)],["Nominal do pacote", R(par,2)],["Valor justo assumido", Number.isFinite(pct)? nf(pct,1)+"% do nominal":"—"],["Valor implícito por ação", R(out.implied,2), "tot"],[e.target, R(out.price,2)],["Equilíbrio: debêntures a", nf(out.breakeven*100,1) + "% do nominal", "tot"]];
    out.formula = `Valor = ${t.units} × ${R(t.vna,2)} × (% do nominal)\nEquilíbrio = ${e.target} ÷ (${t.units} × ${R(t.vna,2)})`;
    out.trade = [["buy",e.target,1000]];
  }
  if (e.deadline){ const d = dcal(TODAY, e.deadline); out.days = d; if (d>0 && Number.isFinite(out.spread) && e.model!=="cash_selic") out.ann = Math.pow(1+out.spread, 365/d) - 1; }
  out.next = nextCat(e);
  if (e.model === "watch") return out;
  const ch = [health(e.target)];
  if (e.model === "ratio" || e.model === "ratio_fx") ch.push(health(e.acquirer));
  if (e.model === "cash_selic") ch.push(selicHealth());
  if (e.model === "ratio_fx") ch.push(fxHealth(true));
  if (e.model === "ratio_fx_input") ch.push(fxHealth(true), extHealth("SAN"));
  return gate(out, ch);
}
function nextCat(e){ const fut = (e.catalysts||[]).filter(c => c[0] && c[0] >= TODAY).sort((a,b)=>a[0]<b[0]?-1:1); return fut[0] || (e.catalysts||[]).find(c=>!c[0]) || null; }

function evalHolding(h){
  const useAlt = asm(h.id,"alt",false);
  const tot = h.classes.reduce((s,c)=>s+c[1],0);
  const mcap = h.classes.reduce((s,c)=>s+c[1]*px(c[0]),0);
  const pos = h.positions.map(p => { const t = useAlt && p.alt ? p.alt : p.ticker; return {...p, used:t, price:px(t), value:p.shares*px(t), per:p.shares/tot}; });
  const nav = pos.reduce((s,p)=>s+p.value,0) + h.others + h.net_cash;
  const navps = nav/tot, q = px(h.quote);
  const disc = 1 - mcap/nav, discQ = 1 - q/navps;
  const ref = h.refs.length ? h.refs[h.refs.length-1] : null;
  return gate({h, tot, mcap, pos, nav, navps, q, disc, discQ, ref, dRef: ref ? disc*100 - ref[1] : NaN}, [...h.classes.map(c=>health(c[0])), ...pos.map(p=>health(p.used))]);
}
function evalClass(c){ const on = px(c.on), pn = px(c.pn), r = on/pn, ref = parseFloat(store.refs[c.on]); return gate({c, on, pn, r, prem:r-1, ref, dev: Number.isFinite(ref) ? r/ref - 1 : NaN}, [health(c.on), health(c.pn)]); }
function evalUnit(u){ const unit = px(u.unit), on = px(u.on), pn = px(u.pn), parts = u.n_on*on + u.n_pn*pn; return gate({u, unit, on, pn, parts, spread: unit/parts - 1}, [health(u.unit), health(u.on), health(u.pn)]); }
function evalAdr(a){ const loc = px(a.local), ad = ext(a.adr), parity = ad*fx()/a.ratio; return gate({a, loc, ad, parity, prem: parity/loc - 1}, [health(a.local), extHealth(a.adr), fxHealth(true)]); }

