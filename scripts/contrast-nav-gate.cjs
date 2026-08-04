// Gate: G1 rendered contrast (fg vs actual computed parent background, incl. gradient stops)
//       G2 navigation reachability (every internal link resolves; every page has a route back)
// Usage: serve the site (e.g. `python3 -m http.server 8899`) then `BASE=http://localhost:8899 node scripts/contrast-nav-gate.cjs`
// Requires Playwright (chromium). Resolves it from local node_modules or a /tmp install.
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/tmp/ir-uat/node_modules/playwright')); }
const BASE = process.env.BASE || 'http://localhost:8899';
const PAGES = ['index.html','platform.html','use-cases.html','inspectorates.html','compliance.html','about.html','resources.html','contact.html','trust.html','governance.html','terms.html','cookies.html','privacy.html','system-demo.html'];
const okHost = h => ['localhost','127.0.0.1','[::1]'].includes(h);

// in-page contrast auditor
const AUDIT = () => {
  const parse = c => { const m=c.match(/rgba?\(([^)]+)\)/); if(!m) return null; const p=m[1].split(',').map(s=>parseFloat(s.trim())); return {r:p[0],g:p[1],b:p[2],a:p[3]===undefined?1:p[3]}; };
  const comp = (top,bot)=>({ r:top.r*top.a+bot.r*(1-top.a), g:top.g*top.a+bot.g*(1-top.a), b:top.b*top.a+bot.b*(1-top.a), a:1 });
  const lin = v => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
  const lum = c => 0.2126*lin(c.r)+0.7152*lin(c.g)+0.0722*lin(c.b);
  const ratio = (f,b)=>{ const L1=lum(f),L2=lum(b); return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05); };
  const parseStops = img => { const out=[]; const re=/rgba?\([^)]+\)/g; let m; while((m=re.exec(img))) { const c=parse(m[0]); if(c&&c.a>0) out.push(c); } return out; };
  // walk up; stop at first OPAQUE paint (opaque colour OR gradient); composite nearer semi-transparent layers over it
  const effBg = el => {
    let trans=[]; let node=el; let gradient=false; let bases=null;
    while(node){
      const s=getComputedStyle(node);
      if(s.backgroundImage&&/gradient/.test(s.backgroundImage)){ const st=parseStops(s.backgroundImage); if(st.length){ gradient=true; bases=st; break; } }
      const bc=parse(s.backgroundColor);
      if(bc&&bc.a>=1){ bases=[bc]; break; }
      if(bc&&bc.a>0) trans.push(bc);
      node=node.parentElement;
    }
    if(!bases) bases=[{r:255,g:255,b:255,a:1}]; // page fallback white
    // composite nearer transparent layers (nearest last) over each base candidate
    const cand = bases.map(b=>{ let base={...b,a:1}; for(let i=trans.length-1;i>=0;i--) base=comp(trans[i],base); return base; });
    return {candidates:cand, gradient};
  };
  const hasDirectText = el => [...el.childNodes].some(n=>n.nodeType===3 && n.textContent.trim().length>0);
  const out=[];
  for(const el of document.querySelectorAll('a,button,.btn,h1,h2,h3,h4,h5,h6,p,span,li,label,strong,em,.pill,.chip,td,th')){
    if(!hasDirectText(el)) continue;
    const rects=el.getClientRects(); if(!rects.length) continue;
    const s=getComputedStyle(el); if(s.visibility==='hidden'||parseFloat(s.opacity)===0) continue;
    const fg=parse(s.color); if(!fg) continue;
    const {candidates,gradient}=effBg(el);
    const size=parseFloat(s.fontSize); const wt=parseInt(s.fontWeight)||400;
    const large = size>=24 || (size>=18.66 && wt>=700);
    const thr = large?3.0:4.5;
    // worst-case across every candidate background (gradient stops or the single solid bg)
    let r=Infinity, worstBg=candidates[0];
    for(const bgc of candidates){ const fgc=fg.a<1?comp(fg,bgc):fg; const rr=ratio(fgc,bgc); if(rr<r){r=rr; worstBg=bgc;} }
    const fgc=fg.a<1?comp(fg,worstBg):fg;
    if(r < thr){
      out.push({ tag:el.tagName.toLowerCase(), cls:(el.className&&el.className.toString().slice(0,30))||'', text:el.textContent.trim().slice(0,42), fg:`rgb(${Math.round(fgc.r)},${Math.round(fgc.g)},${Math.round(fgc.b)})`, bg:`rgb(${Math.round(worstBg.r)},${Math.round(worstBg.g)},${Math.round(worstBg.b)})`, ratio:Math.round(r*100)/100, thr, large, gradient });
    }
  }
  return out;
};

(async () => {
  const b = await chromium.launch();
  const g1={}; const g2={}; const linkStatus={};
  for (const pg of PAGES) {
    const ctx = await b.newContext({ viewport:{width:1280,height:900} });
    ctx.route('**/*', r => okHost(new URL(r.request().url()).hostname)?r.continue():r.abort());
    const p = await ctx.newPage();
    await p.goto(`${BASE}/${pg}`,{waitUntil:'domcontentloaded'}).catch(()=>{});
    await p.waitForTimeout(250); // let nav.js inject
    // G1
    g1[pg] = await p.evaluate(AUDIT);
    // G2 — enumerate internal links (post nav.js)
    const links = await p.evaluate(()=>{
      const set=new Set();
      for(const a of document.querySelectorAll('a[href]')){
        const h=a.getAttribute('href');
        if(!h||h.startsWith('#')||h.startsWith('mailto:')||h.startsWith('tel:')||/^https?:\/\//i.test(h)) continue;
        set.add(h.split('#')[0].split('?')[0]);
      }
      return [...set];
    });
    const hasNavbar = await p.evaluate(()=>!!document.querySelector('.navbar a, nav.navbar'));
    const routeBack = hasNavbar || links.some(h=>['index.html','platform.html'].includes(h));
    g2[pg] = { internalLinks: links, count: links.length, hasNavbar, routeBack };
    await ctx.close();
  }
  // resolve every unique internal link once
  const uniq = new Set(); for(const pg of PAGES) g2[pg].internalLinks.forEach(h=>uniq.add(h));
  const ctx = await b.newContext(); const pr = await ctx.newPage();
  ctx.route('**/*', r => okHost(new URL(r.request().url()).hostname)?r.continue():r.abort());
  for(const h of uniq){ try{ const resp=await pr.goto(`${BASE}/${h}`,{waitUntil:'domcontentloaded'}); linkStatus[h]=resp?resp.status():0; }catch(e){ linkStatus[h]='ERR'; } }
  await ctx.close(); await b.close();

  // ===== REPORT =====
  console.log('\n########## G1 — RENDERED CONTRAST (fg vs computed parent bg) ##########');
  let g1fail=0;
  for(const pg of PAGES){
    const fails=g1[pg];
    if(!fails.length){ console.log(`PASS  ${pg}`); continue; }
    g1fail+=fails.length;
    console.log(`FAIL  ${pg}  (${fails.length})`);
    for(const f of fails) console.log(`        ${f.ratio}:1 (need ${f.thr}) ${f.large?'[large]':''} <${f.tag}${f.cls?'.'+f.cls:''}> "${f.text}"  fg=${f.fg} bg=${f.bg}${f.gradient?' [gradient-ancestor]':''}`);
  }
  console.log(g1fail? `G1 RESULT: ${g1fail} failing pair(s)` : 'G1 RESULT: PASS — no pair below threshold');

  console.log('\n########## G2 — NAVIGATION REACHABILITY ##########');
  console.log('Per-page:  navbar  routeBack  #links');
  let g2fail=0;
  for(const pg of PAGES){ const g=g2[pg]; const bad=!g.routeBack; if(bad)g2fail++; console.log(`${bad?'FAIL':'PASS'}  ${pg.padEnd(20)} navbar=${g.hasNavbar?'Y':'N'}  routeBack=${g.routeBack?'Y':'N'}  links=${g.count}`); }
  console.log('\nLink resolution (unique internal targets):');
  let broken=0;
  for(const h of [...uniq].sort()){ const s=linkStatus[h]; const bad=s!==200; if(bad)broken++; console.log(`${bad?'BROKEN':'  OK  '} ${s}  ${h}`); }
  console.log((g2fail||broken)? `G2 RESULT: ${g2fail} page(s) with no route back, ${broken} broken link(s)` : 'G2 RESULT: PASS — every page has a route back; all links resolve');
})();
