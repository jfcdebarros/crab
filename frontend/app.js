/* ---------- marca ---------- */
function crabLogo(s, edge){
  const O = "#e5482b", OD = "#b4351b", OL = "#f47a58", K = "#0e0e0f", ST = "#3d3a37", id = "c" + s + Math.random().toString(36).slice(2,6);
  const ed = edge && edge !== "none" ? edge : null;
  const e = ed ? `stroke="${ed}" stroke-width="1.3" stroke-linejoin="round"` : "";
  const leg = (pts, w) => `<polyline points="${pts}" fill="none" stroke="${OD}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const half = `
${leg("30,66 17,63 7,71 3,84",4.6)}${leg("31,71 19,74 11,85 9,97",4.6)}${leg("35,76 25,83 20,95 20,104",4.4)}
${leg("34,56 22,49 18,37",6.2)}
<path d="M10 37 C5 31 6 22 12 19 L25 19.5 C28 25 27 34 20 39 C16 41 12 40 10 37 Z" fill="${O}"/>
<path d="M12 20 C8 13 9 6 13.5 1.5 C14.6 8 16.4 13.6 18.6 19 Z" fill="${O}"/>
<path d="M25 20 C29 13 28.4 6 24.6 1.5 C22.6 8 20.8 13.6 19.4 19 Z" fill="${OD}"/>
<path d="M11 25 C12 22.5 14.5 21.5 17 22" stroke="${OL}" stroke-width="2" fill="none" stroke-linecap="round"/>
<g fill="${OD}"><circle cx="15" cy="30" r="1.3"/><circle cx="20" cy="33" r="1.1"/><circle cx="13" cy="35" r="1"/></g>
<path d="M52 41 L48 28" stroke="${OD}" stroke-width="3.4" stroke-linecap="round"/>
<circle cx="47.5" cy="25" r="5.6" fill="#fff" stroke="${K}" stroke-width="1.8"/>
<circle cx="49.2" cy="26" r="2.8" fill="${K}"/><circle cx="50.1" cy="25" r=".85" fill="#fff"/>
<path d="M40 17.2 L54.2 21.8" stroke="${ed?ed:K}" stroke-width="${ed?5.2:0}" stroke-linecap="round"/>
<path d="M40 17.2 L54.2 21.8" stroke="${K}" stroke-width="3.1" stroke-linecap="round"/>`;
  return `<svg width="${s}" height="${Math.round(s*0.9)}" viewBox="0 0 120 108" aria-hidden="true">
<defs><clipPath id="${id}"><path d="M25 62 C24 47 41 39 60 39 C79 39 96 47 95 62 C94 77 80 86 60 86 C40 86 26 77 25 62 Z"/></clipPath></defs>
${half}<g transform="translate(120 0) scale(-1 1)">${half}</g>
<path d="M25 62 C24 47 41 39 60 39 C79 39 96 47 95 62 C94 77 80 86 60 86 C40 86 26 77 25 62 Z" fill="${O}"/>
<g clip-path="url(#${id})">
 <path d="M20 68 C40 78 80 78 100 68 L100 92 L20 92 Z" fill="${OD}" opacity=".5"/>
 <ellipse cx="60" cy="47" rx="24" ry="6" fill="${OL}" opacity=".5"/>
 <g fill="${OD}" opacity=".7"><circle cx="40" cy="52" r="1.6"/><circle cx="47" cy="48.6" r="1.2"/><circle cx="80" cy="52" r="1.6"/><circle cx="73" cy="48.6" r="1.2"/><circle cx="35" cy="58" r="1.1"/><circle cx="85" cy="58" r="1.1"/></g>
 <path d="M18 62.5 C40 72.5 80 72.5 102 62.5 L102 72 C80 82 40 82 18 72 Z" fill="${K}"/>
 <path d="M18 65.5 C40 75.5 80 75.5 102 65.5" stroke="${ST}" stroke-width=".7" fill="none"/>
 <path d="M18 69 C40 79 80 79 102 69" stroke="${ST}" stroke-width=".7" fill="none"/>
</g>
<path d="M52.5 58 Q60 61.8 67.5 58" stroke="${K}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<g fill="${K}" ${e}>
 <path d="M55.5 76.5 L42.5 100 L50.6 103 L60.4 78.5 Z"/>
 <path d="M64.5 76.5 L80.5 98 L73 101.8 L59.6 78.5 Z"/>
</g>
<g stroke="${ST}" stroke-width=".6"><path d="M57 78 L45.2 100.9"/><path d="M59 78.6 L48.2 102.1"/><path d="M62 78 L76.6 99.6"/><path d="M60.6 79.2 L74.8 100.6"/></g>
<path d="M76.2 92.2 L80.5 98 L73 101.8 L69.8 96 Z" fill="#d62f2a"/>
<g stroke="#fff" stroke-width="1.15"><path d="M70.9 95.2 L74 101.1"/><path d="M72.6 94.4 L75.8 100.2"/><path d="M74.3 93.6 L77.5 99.3"/></g>
<path d="M51.8 67.6 L68.2 67.6 L69.6 79.6 L50.4 79.6 Z" fill="${K}" ${e}/>
<path d="M52.6 79 L67.6 68.4" stroke="${ST}" stroke-width="1.6"/>
<path d="M51.6 72.2 L68.6 72.2" stroke="${ST}" stroke-width=".6"/><path d="M51.2 75.6 L69 75.6" stroke="${ST}" stroke-width=".6"/>
</svg>`;
}
document.getElementById("logo").innerHTML = crabLogo(64, "#5a5550");

/* ---------- componentes ---------- */
const chev = `<svg class="chev" width="8" height="12" viewBox="0 0 8 12" aria-hidden="true"><path d="M2 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const blocked = (why, o={}) => `<div class="sp blk"><div class="top"><span class="nop">não operar</span></div><span class="sub" title="${esc(why)}">${esc(why)}</span></div>`;
const manualTag = o => o && o.manual ? ` <span class="mtag">manual</span>` : "";
function spread(s, scale=0.08, o={}){
  if (o.block) return blocked(o.block);
  if (!Number.isFinite(s)) return `<div class="sp na"><div class="top"><span class="num">${o.missing?"sem preço":"—"}</span></div>${o.sub?`<span class="sub">${o.sub}</span>`:""}</div>`;
  const w = Math.min(Math.abs(s)/scale,1)*100, cls = s>0.0005 ? "pos" : s<-0.0005 ? "neg" : "";
  return `<div class="sp ${cls} ${o.lg?"lg":""}"><div class="top"><span class="meter"><i style="width:${w}%"></i></span><span class="num">${P(s)}</span></div>${o.sub?`<span class="sub">${o.sub}</span>`:""}</div>`;
}
function disc(d, o={}){
  if (o.block) return blocked(o.block);
  if (!Number.isFinite(d)) return `<div class="sp na"><div class="top"><span class="num">—</span></div></div>`;
  const w = Math.min(Math.max(d,0)/0.4,1)*100;
  return `<div class="sp disc"><div class="top"><span class="meter"><i style="width:${w}%"></i></span><span class="num">${nf(d*100,1)}%</span></div>${o.sub?`<span class="sub">${o.sub}</span>`:""}</div>`;
}
function stageChip(e){
  if (e.status === "watch") return `<span class="chip watch">${esc(e.stage)}</span>`;
  const n = e.deadline ? dcal(TODAY,e.deadline) : 99;
  return `<span class="chip ${n<=7&&n>=0?"soon":"active"}">${esc(e.stage)}</span>`;
}
function countdown(d){ if (!d) return `<span class="cd">a definir</span>`; const n = dcal(TODAY,d); if (n<0) return `<span class="cd">encerrado</span>`; if (n===0) return `<span class="cd hot">hoje</span>`; return `<span class="cd ${n<=7?"hot":""}">${n} d</span>`; }
const MES = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const MESL = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const WD = ["domingo","segunda","terça","quarta","quinta","sexta","sábado"];
const dblock = s => `<div class="dblock"><b>${s.slice(8,10)}</b><span>${MES[+s.slice(5,7)-1]}</span></div>`;
function todayLong(){ const d = D(TODAY); return `${WD[d.getUTCDay()]}, ${+TODAY.slice(8,10)} de ${MESL[+TODAY.slice(5,7)-1]}`; }
function stamp(){
  const n = Object.keys(store.overrides).length;
  const src = !liveOn() ? `Preços <b>${esc(DATA.snapshot.label.replace("Fechamento ","fech. "))}</b>` : LIVE.mode==="mock" ? `Fonte <b>simulação</b>` : `Fonte <b>Cedro ao vivo</b>`;
  const sh = selicHealth(), fh = fxHealth(false);
  const fxsrc = liveOn() && LIVE.snap.fx && !Number.isFinite(parseFloat(store.params.fx)) ? ` <b style="color:var(--muted)">${esc(LIVE.snap.fx.source)}</b>` : "";
  return `<div class="stamp"><span><i class="live ${liveOn()&&liveAge()>staleLimit()?"off":""}"></i>${src}</span>${n?`<span>Manuais <b>${n}</b></span>`:""}<span>Selic <b>${nf(selic()*100,2)}%</b>${sh.s==="manual"?" <b>manual</b>":""}</span><span>USD/BRL <b>${nf(fx(),4)}</b>${fh.s==="manual"?" <b>manual</b>":fxsrc}</span></div>`;
}
function head(title, lede){ return `<div class="phead"><div><h1>${title}</h1>${lede?`<p class="lede">${lede}</p>`:""}</div>${stamp()}</div>`; }
function seg(name, opts, cur){ return `<div class="seg" role="group">${opts.map(o=>`<button type="button" data-seg="${name}" data-val="${o[0]}" aria-pressed="${cur===o[0]}">${o[1]}${o[2]!=null?`<span class="ct">${o[2]}</span>`:""}</button>`).join("")}</div>`; }

/* ---------- abas ---------- */
const TABS = [["overview","Visão geral"],["events","Eventos"],["holdings","Holdings"],["classes","ON × PN"],["units","Units"],["adr","ADR × local"],["calendar","Calendário"],["docs","Documentos"]];
function counts(){ return {events: DATA.events.length, holdings: DATA.holdings.length, classes: DATA.classes.length, units: DATA.units.length, adr: DATA.adrs.length, calendar: DATA.calendar.filter(c=>c[0]>=TODAY).length, docs: allDocs().length}; }
function renderTabs(){
  const c = counts();
  document.getElementById("tabs").innerHTML = TABS.map(([id,l]) => `<button class="tab" role="tab" id="tab-${id}" aria-selected="${store.tab===id}" aria-controls="main" tabindex="${store.tab===id?0:-1}" data-tab="${id}">${l}${c[id]!=null?`<span class="ct">${c[id]}</span>`:""}</button>`).join("");
}
document.getElementById("tabs").addEventListener("click", ev => { const b = ev.target.closest("[data-tab]"); if (b) go(b.dataset.tab); });
document.getElementById("tabs").addEventListener("keydown", ev => {
  if (ev.key!=="ArrowRight" && ev.key!=="ArrowLeft") return;
  const i = TABS.findIndex(t=>t[0]===store.tab), j = (i + (ev.key==="ArrowRight"?1:-1) + TABS.length) % TABS.length;
  go(TABS[j][0]); document.getElementById("tab-"+TABS[j][0]).focus();
});
function go(id){ store.tab = id; save(); try { history.replaceState(null,"","#"+id); } catch(e) {} render(); window.scrollTo({top:0}); }

/* ---------- visão geral ---------- */
function overviewRows(){
  const rows = [];
  DATA.events.filter(e=>e.status!=="watch").map(evalEvent).forEach(o => rows.push({k:"events", strat:"Evento", name:o.e.title, ticker:o.e.target, val:o.spread, sub:o.e.stage, open:()=>openEvent(o.e.id), missing:!!o.needs, block:o.block}));
  DATA.units.map(evalUnit).forEach(o => { if (o.block || Math.abs(o.spread)>=0.003) rows.push({k:"units", block:o.block, strat:"Unit", name:o.u.name + " · unit contra partes", ticker:o.u.unit, val:o.spread, sub:`${o.u.n_on} ON + ${o.u.n_pn} PN`, open:()=>go("units"), scale:0.03}); });
  DATA.adrs.map(evalAdr).forEach(o => { if (Number.isFinite(o.prem) && Math.abs(o.prem)>=0.003) rows.push({k:"adr", block:o.block, strat:"ADR", name:o.a.name + " · ADR contra local", ticker:o.a.adr, val:o.prem, sub:"1 ADR = " + o.a.ratio + " " + o.a.local, open:()=>go("adr"), scale:0.03}); });
  DATA.classes.map(evalClass).forEach(o => { if (Number.isFinite(o.dev)) rows.push({k:"classes", block:o.block, strat:"ON × PN", name:o.c.name + " · desvio da referência", ticker:o.c.on+"/"+o.c.pn, val:o.dev, sub:"Ref. " + nf(o.ref,3), open:()=>go("classes"), scale:0.1}); });
  const mag = r => r.block ? -1 : Number.isFinite(r.val) ? Math.abs(r.val) : -2;
  return rows.sort((a,b)=>mag(b)-mag(a));
}
function viewOverview(){
  const ev = DATA.events.filter(e=>e.status!=="watch").map(evalEvent);
  const hs = DATA.holdings.map(evalHolding);
  const all = overviewRows(), f = store.ovf || "all";
  const shown = f==="all" ? all : all.filter(r=>r.k===f);
  window._ov = shown;
  const cnt = k => all.filter(r=>r.k===k).length;
  const bestEv = ev.filter(o=>!o.block && Number.isFinite(o.spread)).sort((a,b)=>b.spread-a.spread)[0];
  const bestH = hs.filter(o=>!o.block).sort((a,b)=>b.disc-a.disc)[0];
  const up = DATA.calendar.filter(c=>c[0]>=TODAY).sort((a,b)=>a[0]<b[0]?-1:1);
  const kp = `<div class="kpis">
    <div class="kpi"><div class="k">Situações monitoradas</div><div class="v">${DATA.events.length + DATA.holdings.length + DATA.classes.length + DATA.units.length + DATA.adrs.length}</div><div class="s">${ev.length} eventos ativos · ${DATA.events.length-ev.length} em observação</div></div>
    <div class="kpi"><div class="k">Maior spread de evento</div><div class="v pos">${bestEv?P(bestEv.spread):"—"}</div>${bestEv?`<button class="s" data-open-ev="${bestEv.e.id}">${esc(bestEv.e.title)}</button>`:""}</div>
    <div class="kpi"><div class="k">Maior desconto de holding</div><div class="v">${bestH?nf(bestH.disc*100,1)+"%":"—"}</div>${bestH?`<button class="s" data-open-h="${bestH.h.id}">${esc(bestH.h.name)} · ref. ${bestH.ref?nf(bestH.ref[1],1)+"%":"—"}</button>`:""}</div>
    <div class="kpi"><div class="k">Próximo catalisador</div><div class="v">${up[0]?shortDate(up[0][0]):"—"}</div><div class="s">${up[0]?esc(up[0][1]+" · "+up[0][2]):""}</div></div>
  </div>`;
  const rank = `<div class="card"><div class="card-h"><h2>Ranking de spreads</h2>${seg("ovf",[["all","Todos",all.length],["events","Eventos",cnt("events")],["units","Units",cnt("units")],["adr","ADR",cnt("adr")],["classes","ON × PN",cnt("classes")]],f)}</div>
    <div class="list rank">${shown.length?shown.slice(0,12).map((r,i)=>`<button class="row" type="button" data-ov="${i}">
      <div class="r-main"><div class="r-title">${esc(r.name)}</div><div class="r-sub"><span class="eyebrow" style="margin-right:6px">${r.strat}</span>${esc(r.sub)}</div></div>
      <div class="c-tk">${tk(r.ticker)}</div>
      ${spread(r.val, r.scale||0.08, {missing:r.missing, lg:true, block:r.block})}</button>`).join(""):`<div class="note" style="border-top:1px solid var(--line-2)">${f==="adr"?"Informe preços de ADR na aba ADR × local para ver sinais aqui.":f==="classes"?"Defina razões de referência na aba ON × PN para ver desvios aqui.":"Nenhum sinal acima de 0,3%."}</div>`}</div>
    <p class="note">Sinal = spread, prêmio ou desvio, antes de custos e aluguel. Units e ADRs entram a partir de 0,3%.</p></div>`;
  const hold = `<div class="card"><div class="card-h"><h2>Descontos de holding</h2><button class="link" data-go="holdings" type="button">Ver holdings</button></div>
    <div class="list mini">${hs.map(o=>`<button class="row" type="button" data-open-h="${o.h.id}"><div class="r-main"><div class="r-title">${esc(o.h.name)}</div><div class="r-sub">${o.h.quote} · ref. ${o.ref?nf(o.ref[1],1)+"%":"—"}</div></div>${disc(o.disc,{block:o.block})}<span class="num" style="text-align:right;font-size:12px;color:var(--muted)">${Number.isFinite(o.dRef)?PP(o.dRef):"—"}</span></button>`).join("")}</div></div>`;
  const cal = `<div class="card"><div class="card-h"><h2>Próximos catalisadores</h2><button class="link" data-go="calendar" type="button">Calendário</button></div>
    <div class="tl mini">${up.slice(0,5).map(c=>`<div class="tl-row">${dblock(c[0])}<div class="tx"><span>${tk(c[1])} <span style="color:var(--fg-2)">${esc(c[2])}</span></span></div>${countdown(c[0])}</div>`).join("")}</div></div>`;
  const hr = +new Intl.DateTimeFormat("en-GB",{timeZone:"America/Sao_Paulo",hour:"2-digit",hour12:false}).format(new Date());
  return head((hr<12?"Bom dia, ":hr<18?"Boa tarde, ":"Boa noite, ") + esc(DATA.user_name || "mesa"), `${todayLong()[0].toUpperCase()+todayLong().slice(1)}. Todos os spreads são recalculados a partir das cotações e dos parâmetros da barra superior.`) + kp + `<div class="grid2">${rank}<div class="stack">${hold}${cal}</div></div>`;
}

/* ---------- eventos ---------- */
function viewEvents(){
  const all = DATA.events.map(evalEvent);
  const act = all.filter(o=>o.e.status!=="watch"), wat = all.filter(o=>o.e.status==="watch");
  const s = store.evs || "active";
  const row = o => {
    const e = o.e, cur = o.ccy==="USD" ? U : R, nc = o.next;
    const sub = Number.isFinite(o.ann) ? P(o.ann,0)+" a.a." : (o.sub || "");
    return `<button class="row" type="button" data-open-ev="${e.id}">
      <div class="r-main"><div class="r-title">${esc(e.title)}</div><div class="meta">${stageChip(e)}<span class="k">${esc(e.kind)}</span></div></div>
      <div class="c-pair pair">${tk(e.target)}${e.model.startsWith("ratio")?`<span class="ar">→</span>${tk(e.acquirer)}`:""}</div>
      <div class="c-vals vals"><div><span class="l">Preço</span><span class="b">${cur(o.price,2)}</span></div><div><span class="l">Implícito</span><span class="${Number.isFinite(o.implied)?"m":"miss"}">${Number.isFinite(o.implied)?cur(o.implied,2):"pendente"}</span></div></div>
      ${spread(o.spread,0.08,{missing:!!o.needs, lg:true, sub, block:o.block})}${manualTag(o)}
      <div class="c-cat cat">${countdown(nc?nc[0]:"")}<span class="tx">${nc?esc(nc[1]):"—"}</span></div>
      ${chev}</button>`;
  };
  const wrow = o => `<button class="row watch" type="button" data-open-ev="${o.e.id}">
      <div class="r-main"><div class="r-title">${esc(o.e.title)}</div><div class="meta">${stageChip(o.e)}<span class="k">${esc(o.e.kind)}</span></div></div>
      <div class="c-pair pair">${tk(o.e.target)}</div>
      <div class="c-cat cat">${countdown(o.next?o.next[0]:"")}<span class="tx">${o.next?esc(o.next[1]):"—"}</span></div>${chev}</button>`;
  return head("Eventos corporativos", "OPAs, incorporações, permutas e cisões. O valor implícito segue os termos de cada fato relevante; abra um evento para ver a conta, as cláusulas e as fontes.")
    + `<div class="card ev"><div class="card-h">${seg("evs",[["active","Em andamento",act.length],["watch","Em observação",wat.length]],s)}<span class="hint">${s==="active"?"Spread = valor implícito ÷ preço − 1, antes de custos e aluguel":"Sem termos suficientes para calcular paridade"}</span></div>
      <div class="list">${s==="active"?act.map(row).join(""):wat.map(wrow).join("")}</div></div>`;
}

/* ---------- holdings ---------- */
function viewHoldings(){
  const hs = DATA.holdings.map(evalHolding);
  const card = o => {
    const refW = o.ref ? Math.min(o.ref[1]/40,1)*100 : null;
    return `<button class="hcard" type="button" data-open-h="${o.h.id}">
      <div class="top"><div><h3>${esc(o.h.name)}</h3><div class="r-sub">${o.h.classes.map(c=>c[0]).join(" · ")} sobre ${o.pos.map(p=>p.used).join(", ")}${o.h.others?" e outras":""}</div></div>${chev}</div>
      <div style="display:grid;gap:10px"><div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px">${o.block?`<span class="big nop" title="${esc(o.block)}">não operar</span>`:`<span class="big">${nf(o.disc*100,1)}%</span>`}<span class="num" style="color:var(--muted);font-size:12.5px">${o.ref?`ref. ${nf(o.ref[1],1)}% · ${PP(o.dRef)}`:"sem referência"}</span></div>
        <div class="bar"><i style="width:${Math.min(Math.max(o.disc,0)/0.4,1)*100}%"></i>${refW!=null?`<b style="left:${refW}%" title="Referência"></b>`:""}</div></div>
      <div class="kv"><div><span>Valor de mercado</span><strong>${BI(o.mcap)}</strong></div><div><span>NAV</span><strong>${BI(o.nav)}</strong></div>
        <div><span>NAV por ação</span><strong>${R(o.navps,2)}</strong></div><div><span>${o.h.quote}</span><strong>${R(o.q,2)} <span style="color:var(--muted);font-size:12px">${P(-o.discQ,1)}</span></strong></div></div>
      <div class="hedge"><span style="color:var(--muted)">Hedge por ação</span>${o.pos.map(p=>`<span class="num">${nf(p.per,4)}</span>${tk(p.used)}`).join(" ")}</div></button>`;
  };
  return head("Holding × subsidiária", "Participações a preço de mercado contra o valor de mercado da holding. Desconto acima da referência recente sugere compra da holding contra venda da subsidiária.")
    + `<div class="hcards">${hs.map(card).join("")}</div>`
    + `<p class="note" style="border:0;padding:0 2px">Desconto = 1 − valor de mercado (todas as classes) ÷ NAV. A marca na barra é a referência publicada mais recente. Hedge = ações da subsidiária por ação da holding.</p>`
    + `<div class="card"><div class="card-h"><h2>Em preparação</h2><span class="hint">Faltam dados verificados para calcular o NAV</span></div><div class="tw"><table><thead><tr><th>Holding</th><th>Participações</th><th>Pendência</th></tr></thead><tbody>${DATA.holdings_watch.map(w=>`<tr><td><div class="t1">${esc(w[0])}</div><div class="t2">${esc(w[1])}</div></td><td><span class="t2 wrap" style="color:var(--fg-2)">${esc(w[2])}</span></td><td><span class="t2 wrap">${esc(w[3])}</span></td></tr>`).join("")}</tbody></table></div></div>`;
}

/* ---------- ON × PN ---------- */
function viewClasses(){
  const cs = DATA.classes.map(evalClass);
  return head("ON × PN", "Razão entre as classes do mesmo emissor. Informe a razão de referência da mesa (média histórica, por exemplo) para medir o desvio.")
    + `<div class="card"><div class="tw"><table><thead><tr><th>Emissor</th><th class="r">ON · PN</th><th class="r">ON ÷ PN</th><th class="r">Referência</th><th class="r">Desvio</th><th>Observação</th></tr></thead><tbody>
    ${cs.map(o=>`<tr><td><div class="t1">${esc(o.c.name)}</div><div class="t2">${o.c.on} · ${o.c.pn}</div></td>
      <td class="r num">${R(o.on)}<div class="t2">${R(o.pn)}</div></td>
      <td class="r"><span class="num" style="font-weight:600">${nf(o.r,4)}</span><div class="t2">prêmio da ON ${P(o.prem,1)}</div></td>
      <td class="r"><input class="inl ${Number.isFinite(o.ref)?"set":""}" type="number" step="0.001" inputmode="decimal" placeholder="—" aria-label="Razão de referência ${o.c.on}/${o.c.pn}" data-ref="${o.c.on}" value="${Number.isFinite(o.ref)?o.ref:""}"></td>
      <td class="r">${spread(o.dev,0.1,{block: Number.isFinite(o.dev)?o.block:null, sub: Number.isFinite(o.dev) ? (Math.abs(o.dev)<0.01?"na referência": o.dev>0?`vende ${o.c.on}, compra ${o.c.pn}`:`compra ${o.c.on}, vende ${o.c.pn}`) : ""})}</td>
      <td><span class="t2 wrap">${esc(o.c.note||"—")}</span></td></tr>`).join("")}
    </tbody></table></div><p class="note">Sem série histórica conectada, a referência é digitada e fica salva neste navegador. Diferenças de direitos (voto, tag along, dividendo) explicam parte do prêmio ou desconto.</p></div>`;
}

/* ---------- units ---------- */
function viewUnits(){
  const us = DATA.units.map(evalUnit);
  return head("Units", "Unit contra a soma das ações que a compõem. Spread positivo: compre as ações, monte a unit e venda; negativo: compre a unit, desmembre e venda as ações.")
    + `<div class="card"><div class="tw"><table><thead><tr><th>Emissor</th><th class="r">Unit</th><th class="r">Soma das partes</th><th class="r">Spread</th></tr></thead><tbody>
    ${us.map(o=>`<tr><td><div class="t1">${esc(o.u.name)} <span class="tk" style="margin-left:4px">${o.u.unit}</span></div><div class="t2">${o.u.n_on} ${o.u.on} + ${o.u.n_pn} ${o.u.pn}</div></td>
      <td class="r num">${R(o.unit)}</td>
      <td class="r num">${R(o.parts)}<div class="t2">${o.u.on} ${nf(o.on)} · ${o.u.pn} ${nf(o.pn)}</div></td>
      <td class="r">${spread(o.spread,0.03,{block:o.block, lg:true, sub: Math.abs(o.spread)<0.002?"sem distorção": o.spread>0?`vende unit · monta`:`compra unit · desmembra`})}</td></tr>`).join("")}
    </tbody></table></div><p class="note">Montagem e desmembramento passam pelo escriturador e levam dias; desconte custo de conversão, corretagem e a liquidez das ações ON antes de operar.</p></div>`;
}

/* ---------- ADR ---------- */
function viewAdr(){
  const as = DATA.adrs.map(evalAdr);
  return head("ADR × local", "Paridade entre o ADR em Nova York e a ação na B3. Informe o preço do ADR; o câmbio vem da barra superior.")
    + `<div class="card"><div class="tw"><table><thead><tr><th>Emissor</th><th class="r">ADR (US$)</th><th class="r">Local</th><th class="r">Paridade (R$)</th><th class="r">Prêmio do ADR</th></tr></thead><tbody>
    ${as.map(o=>`<tr><td><div class="t1">${esc(o.a.name)}</div><div class="t2">${o.a.adr} ↔ ${o.a.local} · 1 ADR = ${o.a.ratio} ação${o.a.ratio>1?"ões":""}</div></td>
      <td class="r"><input class="inl ${Number.isFinite(o.ad)?"set":""}" type="number" step="0.01" inputmode="decimal" placeholder="—" aria-label="Preço ${o.a.adr} em US$" data-ext="${o.a.adr}" value="${Number.isFinite(o.ad)?o.ad:""}"></td>
      <td class="r num">${R(o.loc)}</td><td class="r num">${Number.isFinite(o.parity)?R(o.parity,2):"—"}</td>
      <td class="r">${spread(o.prem,0.03,{block: Number.isFinite(o.ad)?o.block:null, missing:!Number.isFinite(o.ad), sub: !Number.isFinite(o.prem)?"informe o ADR": Math.abs(o.prem)<0.003?"paridade": o.prem>0?`vende ${o.a.adr}, compra ${o.a.local}`:`compra ${o.a.adr}, vende ${o.a.local}`})}</td></tr>`).join("")}
    </tbody></table></div><p class="note">Paridade = ADR × USD/BRL ÷ ações por ADR. Compare preços do mesmo instante (fechamento da B3 contra o ADR às 17h, não o fechamento de NY). Custos do depositário não incluídos.</p></div>`;
}

/* ---------- calendário ---------- */
function viewCalendar(){
  const items = DATA.calendar.slice().sort((a,b)=>a[0]<b[0]?-1:1);
  let last = "", html = "";
  items.forEach(c => {
    const m = c[0].slice(0,7);
    if (m !== last){ html += `<div class="tl-month">${MESL[+c[0].slice(5,7)-1]} de ${c[0].slice(0,4)}</div>`; last = m; }
    const ev = DATA.events.find(e=>e.target===c[1] || e.acquirer===c[1]);
    html += `<div class="tl-row ${c[0]<TODAY?"past":""} ${ev?"click":""}" ${ev?`tabindex="0" role="button" data-open-ev="${ev.id}"`:""}>${dblock(c[0])}<div class="tx"><span>${tk(c[1])} <span style="color:var(--fg)">${esc(c[2])}</span></span><span class="w">${WD[D(c[0]).getUTCDay()]} · ${du(TODAY,c[0])} dias úteis</span></div>${countdown(c[0])}</div>`;
  });
  return head("Calendário", "Datas que mudam preço, prazo ou probabilidade das situações monitoradas.") + `<div class="card"><div class="tl">${html}</div></div>`;
}

/* ---------- painel lateral ---------- */
const dr = document.getElementById("drawer"), scrim = document.getElementById("scrim");
let lastFocus = null, drawerFn = null;
function openDrawer(title, meta, body, fn){
  document.getElementById("d-title").textContent = title;
  document.getElementById("d-meta").innerHTML = meta;
  document.getElementById("d-body").innerHTML = body;
  drawerFn = fn || null;
  if (!dr.classList.contains("on")) lastFocus = document.activeElement;
  dr.classList.add("on"); scrim.classList.add("on"); dr.setAttribute("aria-hidden","false");
  document.getElementById("d-body").scrollTop = 0;
  setTimeout(()=>document.getElementById("d-close").focus({preventScroll:true}), 30);
}
function closeDrawer(){ dr.classList.remove("on"); scrim.classList.remove("on"); dr.setAttribute("aria-hidden","true"); drawerFn = null; if (lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true}); }
document.getElementById("d-close").onclick = closeDrawer; scrim.onclick = closeDrawer;
document.addEventListener("keydown", e => { if (e.key==="Escape" && dr.classList.contains("on")) closeDrawer(); });
function refreshDrawer(){ if (drawerFn) drawerFn(true); }
function tradeHtml(legs){ return legs ? `<div class="trade">${legs.map(l=>`<div class="leg ${l[0]}"><b>${l[0]==="buy"?"COMPRA":"VENDE"}</b><span class="num">${nf(l[2],0)}</span>${tk(l[1])}</div>`).join("")}</div>` : ""; }
function sourcesHtml(s){ return `<div class="sec"><h4>Fontes</h4><ul class="plain">${s.map(x=>`<li><a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a></li>`).join("")}<li><a href="${esc(DATA.snapshot.url)}" target="_blank" rel="noopener">Cotações: ${esc(DATA.snapshot.source)}</a></li></ul></div>`; }
const calcTable = legs => `<table class="calc"><tbody>${legs.map(l=>`<tr class="${l[2]||""}"><td>${esc(l[0])}</td><td>${l[1]}</td></tr>`).join("")}</tbody></table>`;

function openEvent(id, keep){
  const e = DATA.events.find(x=>x.id===id), o = evalEvent(e);
  let inputs = "";
  if (e.model==="cash_selic") inputs = `<div class="inputs"><div class="inp"><label for="a-nd">Ajuste de dívida líquida (R$/ação)</label><input id="a-nd" type="number" step="0.01" data-asm="${id}:nd_adj" value="${asm(id,"nd_adj",e.terms.nd_adj)}"></div><label class="chk"><input type="checkbox" data-asm-chk="${id}:include_retained" ${asm(id,"include_retained",true)?"checked":""}> Incluir parcela retida</label></div>`;
  if (e.model==="ratio_fx") inputs = `<div class="inputs"><div class="inp"><label for="a-ad">Distribuição Yduqs até o fechamento (R$/ação)</label><input id="a-ad" type="number" step="0.01" data-asm="${id}:acq_div" value="${asm(id,"acq_div",e.terms.acq_div)}"></div><div class="inp"><label for="a-td">Distribuição Afya (US$/ação)</label><input id="a-td" type="number" step="0.01" data-asm="${id}:target_div" value="${asm(id,"target_div",e.terms.target_div)}"></div></div>`;
  if (e.model==="ratio_fx_input") inputs = `<div class="inputs"><div class="inp"><label for="a-san">SAN na NYSE (US$)</label><input id="a-san" type="number" step="0.01" data-ext-d="SAN" value="${Number.isFinite(ext("SAN"))?ext("SAN"):""}" placeholder="informe"></div></div>`;
  if (e.model==="debenture") inputs = `<div class="inputs"><div class="inp"><label for="a-par">Valor justo das debêntures (% do nominal)</label><input id="a-par" type="number" step="1" data-asm="${id}:pct_par" value="${asm(id,"pct_par","")}" placeholder="informe"></div></div>`;
  const cur = o.ccy==="USD"?U:R;
  const hero = e.model==="watch" ? "" : `<div class="hero"><div><div class="k">Preço ${esc(e.target)}</div><div class="v">${cur(o.price,2)}</div></div><div><div class="k">Valor implícito</div><div class="v">${Number.isFinite(o.implied)?cur(o.implied,2):"—"}</div></div><div><div class="k">Spread</div><div class="v ${o.spread>0?"pos":o.spread<0?"neg":""}">${P(o.spread)}</div></div></div>`;
  const warn = o.block ? `<div class="warnbox"><b>Não operar.</b> ${esc(o.block)}. Os números abaixo usam o último dado recebido e servem só como referência.</div>` : (o.manual ? `<div class="warnbox info">Este cálculo usa insumos digitados manualmente.</div>` : "");
  const body = warn + hero
    + (o.needs?`<div class="miss">${esc(o.needs)} para calcular o spread.</div>`:"")
    + (o.trade?`<div class="sec"><h4>Estrutura da operação</h4>${tradeHtml(o.trade)}</div>`:"")
    + (inputs?`<div class="sec"><h4>Premissas</h4>${inputs}</div>`:"")
    + (o.legs.length?`<div class="sec"><h4>Memória de cálculo</h4>${calcTable(o.legs)}</div><div class="sec"><h4>Fórmula</h4><div class="formula">${esc(o.formula)}</div></div>`:"")
    + `<div class="sec"><h4>Termos</h4><dl class="terms">${e.clauses.map(c=>`<dt>${esc(c[0])}</dt><dd>${esc(c[1])}</dd>`).join("")}</dl></div>`
    + `<div class="two"><div class="sec"><h4>Catalisadores</h4><ul class="plain">${e.catalysts.map(c=>`<li><span class="mono">${brDate(c[0])}</span> · ${esc(c[1])}</li>`).join("")}</ul></div><div class="sec"><h4>Riscos</h4><ul class="plain">${e.risks.map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div></div>`
    + docsSection(id) + sourcesHtml(e.sources);
  if (keep){ document.getElementById("d-body").innerHTML = body; return; }
  openDrawer(e.title, `${stageChip(e)}<span class="chip plain">${esc(e.kind)}</span>`, body, k => openEvent(id, k));
}
function openHolding(id, keep){
  const h = DATA.holdings.find(x=>x.id===id), o = evalHolding(h), p0 = o.pos[0];
  const legs = [...h.classes.map(c=>[`${c[0]}: ${nf(c[1]/1e6,1)} mi × ${R(px(c[0]))}`, BI(c[1]*px(c[0]))]),["Valor de mercado da holding", BI(o.mcap), "tot"],
    ...o.pos.map(p=>[`${p.label}: ${nf(p.shares/1e6,2)} mi × ${R(p.price)} (${p.used})`, BI(p.value)]),
    ...(h.others?[["Outras participações", BI(h.others)]]:[]), ["Caixa (dívida) líquido", BI(h.net_cash)], ["NAV", BI(o.nav), "tot"], ["Desconto", nf(o.disc*100,2)+"%", "tot"]];
  const alt = p0.alt ? `<label class="chk" style="padding-top:0"><input type="checkbox" data-asm-chk="${id}:alt" ${asm(id,"alt",false)?"checked":""}> Avaliar a participação a ${p0.alt} em vez de ${p0.ticker}</label>` : "";
  const body = (o.block ? `<div class="warnbox"><b>Não operar.</b> ${esc(o.block)}.</div>` : "") + `<div class="hero"><div><div class="k">Desconto</div><div class="v">${nf(o.disc*100,1)}%</div></div><div><div class="k">Ref. recente</div><div class="v">${o.ref?nf(o.ref[1],1)+"%":"—"}</div></div><div><div class="k">Δ vs. ref.</div><div class="v">${PP(o.dRef)}</div></div></div>`
    + `<div class="sec"><h4>Estrutura da operação (desconto acima da referência)</h4>${tradeHtml([["buy",h.quote,1000],...o.pos.map(p=>["sell",p.used,Math.round(1000*p.per)])])}</div>`
    + (alt?`<div class="sec"><h4>Premissas</h4>${alt}</div>`:"")
    + `<div class="sec"><h4>Memória de cálculo</h4>${calcTable(legs)}</div>`
    + `<div class="sec"><h4>Por ação</h4>${calcTable([[`${p0.label} por ação da holding`, `${nf(p0.per,4)} ${p0.used}`],["NAV por ação", R(o.navps,2)],[h.quote, R(o.q,2)],[`Desconto pela ${h.quote}`, nf(o.discQ*100,2)+"%","tot"]])}</div>`
    + `<div class="sec"><h4>Fórmula</h4><div class="formula">NAV = Σ ações detidas × preço + outras participações + caixa líquido\nDesconto = 1 − Σ ações da holding × preço ÷ NAV</div></div>`
    + `<div class="sec"><h4>Dados e premissas</h4><ul class="plain">${o.pos.map(p=>`<li>${esc(p.note)}</li>`).join("")}${h.others_note?`<li>${esc(h.others_note)}</li>`:""}<li>${esc(h.net_cash_note)}</li>${h.refs.map(r=>`<li>Desconto publicado de ${nf(r[1],1)}% em ${brDate(r[0])}</li>`).join("")}</ul></div>`
    + sourcesHtml(h.sources);
  if (keep){ document.getElementById("d-body").innerHTML = body; return; }
  openDrawer(h.name, `<span class="chip active">${h.quote}</span><span class="chip plain">Holding × subsidiária</span>`, body, k => openHolding(id, k));
}

/* ---------- cotações ---------- */
function openPrices(keep){
  const q = (document.getElementById("px-q")||{}).value || "";
  const list = Object.keys(DATA.prices).sort().filter(t=>t.includes(q.toUpperCase()));
  const body = `<div class="sec"><h4>Colar cotações</h4><textarea class="paste" id="px-paste" placeholder="Uma por linha: TICKER PREÇO&#10;DESK3 19,41&#10;SBSP3 32.60&#10;SAN 13.70"></textarea>
      <div class="row-actions" style="margin-top:10px"><button class="btn primary" id="px-apply" type="button">Aplicar</button><button class="btn" id="px-reset" type="button">Voltar ao snapshot</button><span class="msg" id="px-msg" role="status"></span></div></div>
    <div class="sec"><div class="row-actions" style="justify-content:space-between;margin-bottom:10px"><h4 style="margin:0">Cotações em uso</h4><input class="search" id="px-q" placeholder="Filtrar ticker" value="${esc(q)}" aria-label="Filtrar ticker"></div>
    <div class="card"><div class="tw"><table class="ptable"><thead><tr><th>Ticker</th><th class="r">${liveOn()?"Feed":"Snapshot"}</th><th class="r">Em uso</th><th>Origem</th></tr></thead><tbody id="px-body">${pxRows(list)}</tbody></table></div></div>
    <p class="note" style="border:0;padding:10px 0 0">Snapshot: ${esc(DATA.snapshot.source)}. Alterações ficam salvas neste navegador e valem em todas as abas.</p></div>`;
  if (keep){ document.getElementById("px-body").innerHTML = pxRows(list); return; }
  openDrawer("Cotações", `<span class="chip plain">${esc(DATA.snapshot.label)}</span>`, body, k => openPrices(k));
}
function pxRows(list){ return list.map(t=>{ const o = store.overrides[t], m = DATA.price_meta[t], h = health(t), q = quoteOf(t); const ccy = m && m.ccy && m.ccy!=="BRL" ? m.ccy+" " : "R$ ";
  const live = liveOn() ? (q && q.last ? nf(q.last) : "—") : nf(DATA.prices[t]);
  const lbl = {ok:"ao vivo", snapshot:"snapshot", manual:"manual "+(o&&o.ts||""), stale:"atrasado", suspect:"suspeito", missing:"sem dado"}[h.s] || h.s;
  return `<tr><td>${tk(t)}</td><td class="r num" style="color:var(--muted)">${live}</td><td class="r"><input class="inl ${o?"set":""}" type="number" step="0.01" inputmode="decimal" aria-label="Preço ${t}" data-px="${t}" value="${Number.isFinite(px(t))?px(t):""}"></td><td><span class="src-chip st-${h.s}" title="${esc(h.why||"")}">${ccy}${lbl}</span></td></tr>`; }).join(""); }
function hhmm(){ return new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",minute:"2-digit"}).format(new Date()); }
function setPx(t, v){ if (!Number.isFinite(v) || v<=0) { delete store.overrides[t]; return false; } if (!liveOn() && Math.abs(v - DATA.prices[t]) < 1e-9) delete store.overrides[t]; else store.overrides[t] = {v, ts: hhmm()}; return true; }

/* ---------- interação ---------- */
document.addEventListener("click", ev => {
  const el = ev.target; let t;
  if ((t = el.closest("[data-seg]"))) { store[t.dataset.seg] = t.dataset.val; save(); render(); return; }
  if ((t = el.closest("[data-open-ev]"))) return openEvent(t.dataset.openEv);
  if ((t = el.closest("[data-open-h]"))) return openHolding(t.dataset.openH);
  if ((t = el.closest("[data-go]"))) return go(t.dataset.go);
  if ((t = el.closest("[data-ov]"))) { const r = window._ov[+t.dataset.ov]; return r && r.open(); }
  if (el.closest("#open-prices")) return openPrices();
  if (el.id === "px-apply"){
    const lines = document.getElementById("px-paste").value.split(/\n+/); let ok = 0; const bad = [];
    lines.forEach(l => { const m = l.trim().match(/^([A-Za-z0-9.]+)[\s;,\t]+([0-9.,]+)/); if (!m) { if (l.trim()) bad.push(l.trim()); return; }
      const tkr = m[1].toUpperCase(); let s = m[2]; if (s.includes(",")) s = s.replace(/\./g,"").replace(",","."); const v = parseFloat(s);
      if (DATA.prices[tkr] != null && setPx(tkr, v)) ok++; else if (DATA.adrs.some(a=>a.adr===tkr) || tkr==="SAN") { store.ext[tkr] = v; ok++; } else bad.push(tkr); });
    save(); render(); openPrices(true);
    document.getElementById("px-msg").textContent = `${ok} cotação(ões) aplicada(s)` + (bad.length ? ` · não reconhecido: ${bad.slice(0,4).join(", ")}` : "");
    return;
  }
  if (el.id === "px-reset"){ store.overrides = {}; save(); render(); openPrices(true); document.getElementById("px-msg").textContent = "Snapshot restaurado"; }
});
document.addEventListener("keydown", ev => { if ((ev.key==="Enter"||ev.key===" ") && ev.target.matches(".tl-row.click")){ ev.preventDefault(); ev.target.click(); } });
document.addEventListener("change", ev => {
  const el = ev.target, d = el.dataset;
  if (d.px){ setPx(d.px, parseFloat(el.value)); save(); render(); openPrices(true); return; }
  if (d.ref !== undefined){ const v = parseFloat(el.value); if (Number.isFinite(v)&&v>0) store.refs[d.ref] = v; else delete store.refs[d.ref]; save(); render(); return; }
  if (d.ext){ const v = parseFloat(el.value); if (Number.isFinite(v)&&v>0) store.ext[d.ext] = v; else delete store.ext[d.ext]; save(); render(); return; }
  if (d.extD){ const v = parseFloat(el.value); if (Number.isFinite(v)&&v>0) store.ext[d.extD] = v; else delete store.ext[d.extD]; save(); render(); refreshDrawer(); return; }
  if (d.asm){ const [id,k] = d.asm.split(":"); (store.asm[id] = store.asm[id]||{})[k] = el.value; save(); render(); refreshDrawer(); return; }
  if (d.asmChk){ const [id,k] = d.asmChk.split(":"); (store.asm[id] = store.asm[id]||{})[k] = el.checked; save(); render(); refreshDrawer(); }
});
document.addEventListener("input", ev => { if (ev.target.id === "px-q") openPrices(true); });
const pSel = document.getElementById("p-selic"), pFx = document.getElementById("p-fx");

pSel.title = DATA.params.selic_note; pFx.title = DATA.params.usdbrl_note;
pSel.addEventListener("change", () => { if (pSel.value === "") delete store.params.selic; else store.params.selic = pSel.value; save(); render(); refreshDrawer(); });
pFx.addEventListener("change", () => { if (pFx.value === "") delete store.params.fx; else store.params.fx = pFx.value; save(); render(); refreshDrawer(); });

/* ---------- render ---------- */
const VIEWS = {overview:viewOverview, events:viewEvents, holdings:viewHoldings, classes:viewClasses, units:viewUnits, adr:viewAdr, calendar:viewCalendar, docs:viewDocs};
function syncHeader(){
  const n = Object.keys(store.overrides).length, dot = document.getElementById("px-dot"), lbl = document.getElementById("px-label");
  if (!liveOn()){ dot.className = "dot" + (n ? " live" : ""); lbl.textContent = n ? `Cotações · ${n} manual` : `Cotações · ${shortDate(DATA.snapshot.date)}`; }
  else if (liveAge() > staleLimit()){ dot.className = "dot off"; lbl.textContent = `Sem conexão · ${Math.round(liveAge())}s`; }
  else { dot.className = "dot live"; lbl.textContent = (LIVE.mode==="mock" ? "Simulado · " : "Ao vivo · ") + new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date(LIVE.lastOk)); }
  for (const [el, key, val, d] of [[pSel,"selic",selic()*100,2],[pFx,"fx",fx(),4]]){
    const man = Number.isFinite(parseFloat(store.params[key]));
    el.closest(".pfield").classList.toggle("man", man);
    el.title = man ? "Valor manual. Apague o campo para voltar ao automático." : (key==="selic" ? (liveOn() ? "Selic anualizada base 252 do Banco Central (SGS 1178)" : DATA.params.selic_note) : (liveOn() && LIVE.snap.fx ? LIVE.snap.fx.source : DATA.params.usdbrl_note));
    if (document.activeElement !== el) el.value = man ? store.params[key] : (Number.isFinite(val) ? val.toFixed(d) : "");
  }
  const ban = document.getElementById("banner");
  const down = liveOn() && liveAge() > staleLimit();
  const msg = down ? `Sem conexão com o servidor há ${Math.round(liveAge())}s. Spreads bloqueados até a reconexão.` : LIVE.mode==="mock" ? "SIMULADO · preços fictícios gerados no servidor para teste. Não operar." : "";
  ban.hidden = !msg; ban.textContent = msg; ban.className = "banner" + (!down && LIVE.mode==="mock" ? " sim" : "");
  document.getElementById("foot-txt").textContent = liveOn() ? (LIVE.mode==="mock" ? `Fonte: simulação · taxas simuladas · termos: base ${DATA.version}` : `Fonte: Cedro · taxas: Banco Central (SGS e PTAX) · termos: base ${DATA.version}`) : `Preços: ${DATA.snapshot.source} · base ${DATA.version}`;
}
function render(){
  if (!VIEWS[store.tab]) store.tab = "overview";
  renderTabs(); syncHeader();
  const y = window.scrollY;
  document.getElementById("main").innerHTML = `<section class="view" role="tabpanel" aria-labelledby="tab-${store.tab}">${VIEWS[store.tab]()}</section>`;
  window.scrollTo({top:y});
}
function editing(){ const a = document.activeElement; return a && a.matches && a.matches("input,textarea,select") && a.id !== "p-selic" && a.id !== "p-fx"; }
function softRender(){ syncHeader(); if (editing()) return; render(); if (dr.classList.contains("on")) refreshDrawer(); }
async function poll(){
  try {
    const r = await fetch("api/snapshot", {cache:"no-store", headers:{Accept:"application/json"}});
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json();
    if (!j || !j.quotes) throw new Error("resposta inválida");
    LIVE.snap = j; LIVE.mode = j.mode === "cedro" ? "live" : "mock"; LIVE.lastOk = Date.now(); LIVE.everOk = true; LIVE.error = null;
  } catch (e) {
    LIVE.error = String(e);
    if (!LIVE.everOk) return false;   // sem servidor (ex.: página publicada no Claude): fica no snapshot
  }
  softRender();
  return true;
}
const h0 = (location.hash||"").slice(1); if (VIEWS[h0]) store.tab = h0;
render();
poll().then(ok => { if (ok) setInterval(poll, 2000); });
