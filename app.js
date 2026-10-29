
(function(){
const PDF="https://www.aitkenspence.com/images/ar/2025-2026/aitken-spence-annual-report-2025-2026-high.pdf";
const still=matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------- key figures ---------- */
const K=[
 ["Revenue","96.6","Bn",1.6,"Rs. 95.1 Bn"],["EBITDA","26.6","Bn",4.5,"Rs. 25.5 Bn"],
 ["Profit before tax","12.8","Bn",18.3,"Rs. 10.8 Bn"],["Profit after tax","9.1","Bn",26.9,"Rs. 7.2 Bn"],
 ["Total assets","227.6","Bn",12.7,"Rs. 202.0 Bn"],["Total equity","104.3","Bn",16.0,"Rs. 89.9 Bn"],
 ["Net asset value / share","218.90","",15.1,"Rs. 190.23"],["Dividend per share","4.00","",0,"Rs. 4.00"]];
document.getElementById("kpis").innerHTML=K.map(k=>{
 const c=k[3]>0?"up":k[3]<0?"dn":"flat",a=k[3]>0?"▲":k[3]<0?"▼":"■";
 return `<div class="kpi"><div class="l">${k[0]}</div><div class="v num"><small>Rs.</small>${k[1]}<small>${k[2]}</small></div><span class="chip ${c}">${a} ${Math.abs(k[3]).toFixed(1)}%</span><span class="p">FY24/25: ${k[4]}</span></div>`;}).join("");

/* ---------- chart generator ---------- */
const D={
 rev:{n:"Group revenue",u:"Rs. Mn",y:["2021/22","2022/23","2024/25","2025/26"],v:[54696,98104,95095,96591],note:"FY2023/24 is not shown here; see the Ten Year Summary on p.496 of the full report."},
 pbt:{n:"Profit before tax",u:"Rs. Mn",y:["2021/22","2022/23","2024/25","2025/26"],v:[14244,11201,10826,12812],note:"FY2023/24 is not shown here; see the Ten Year Summary on p.496."},
 ebitda:{n:"EBITDA",u:"Rs. Mn",y:["2021/22","2022/23","2024/25","2025/26"],v:[23100,30100,25451,26590],note:"FY2021/22 and FY2022/23 rounded to Rs. 0.1 Bn as published in results announcements."},
 pat:{n:"Profit after tax",u:"Rs. Mn",y:["2024/25","2025/26"],v:[7179,9107]},
 att:{n:"Profit attributable to equity holders",u:"Rs. Mn",y:["2024/25","2025/26"],v:[5331,6796]},
 assets:{n:"Total assets",u:"Rs. Mn",y:["2024/25","2025/26"],v:[202027,227618]},
 equity:{n:"Total equity",u:"Rs. Mn",y:["2024/25","2025/26"],v:[89889,104253]},
 eps:{n:"Earnings per share",u:"Rs.",y:["2024/25","2025/26"],v:[13.13,16.74],d:2},
 navps:{n:"Net asset value per share",u:"Rs.",y:["2024/25","2025/26"],v:[190.23,218.90],d:2},
 roe:{n:"Return on equity",u:"%",y:["2024/25","2025/26"],v:[7.06,8.18],d:2},
 roce:{n:"Return on capital employed",u:"%",y:["2024/25","2025/26"],v:[14.34,14.54],d:2},
 tax:{n:"Taxes paid to governments",u:"Rs. Mn",y:["2024/25","2025/26"],v:[13594,14842]},
 va:{n:"Value added by the Group",u:"Rs. Mn",y:["2024/25","2025/26"],v:[44379,48535]},
 fx:{n:"Foreign exchange facilitated",u:"Rs. Mn",y:["2024/25","2025/26"],v:[163091,113789],note:"Lower money-transfer volumes after a decision to focus on higher-performing lines."},
 emp:{n:"Employees",u:"people",y:["2024/25","2025/26"],v:[16513,20300]},
 female:{n:"Female representation",u:"%",y:["2024/25","2025/26"],v:[42,37]},
 ghg:{n:"Scope 1 + 2 GHG emissions",u:"tCO₂e",y:["2024/25","2025/26"],v:[52402,53103]},
 avoid:{n:"Emissions reduced / offset",u:"tCO₂e",y:["2024/25","2025/26"],v:[208891,188922]},
 energy:{n:"Total energy consumption",u:"GJ",y:["2024/25","2025/26"],v:[734143,794758]},
 renew:{n:"Renewable energy consumed",u:"GJ",y:["2024/25","2025/26"],v:[215375,257375]},
 water:{n:"Water withdrawn",u:"m³",y:["2024/25","2025/26"],v:[1303811,1245545]},
 waste:{n:"Solid waste generated",u:"tonnes",y:["2024/25","2025/26"],v:[26888,22618]}};
const groups=[["Financial",["rev","pbt","ebitda","pat","att","assets","equity","eps","navps","roe","roce"]],["Economic contribution",["tax","va","fx"]],["Sustainability",["emp","female","ghg","avoid","energy","renew","water","waste"]]];
const sel=document.getElementById("kpiSel");
sel.innerHTML=groups.map(g=>`<optgroup label="${g[0]}">${g[1].map(k=>`<option value="${k}">${D[k].n}</option>`).join("")}</optgroup>`).join("");
let view="bar";
try{const s=localStorage.getItem("as-kpi");if(s&&D[s])sel.value=s;}catch(e){}
const fmt=(v,d)=>v.toLocaleString("en-US",{minimumFractionDigits:d||0,maximumFractionDigits:d||0});
function nice(max){const p=Math.pow(10,Math.floor(Math.log10(max)));const m=max/p;const s=m<=1.5?.25:m<=3?.5:m<=7?1:2;return{step:s*p,top:Math.ceil(max/(s*p))*s*p};}
function draw(){
 const o=D[sel.value];
 document.getElementById("chTitle").textContent=o.n;
 const ch=(o.v.at(-1)-o.v.at(-2))/o.v.at(-2)*100;
 document.getElementById("chSub").textContent=`${o.u} · FY${o.y.at(-1)}: ${fmt(o.v.at(-1),o.d)} (${ch>=0?"+":""}${ch.toFixed(1)}% vs prior year)`;
 document.getElementById("kpiNote").textContent=o.note||"Source: Annual Report 2025/26, pp.14–21.";
 const cw=document.getElementById("chartWrap"),tw=document.getElementById("tableWrap");
 if(view==="table"){cw.hidden=true;tw.hidden=false;
  tw.innerHTML=`<table><thead><tr><th>Financial year</th><th class="r">${o.u}</th><th class="r">Change</th></tr></thead><tbody>${o.y.map((y,i)=>{const c=i?(o.v[i]-o.v[i-1])/o.v[i-1]*100:null;return `<tr><td>FY${y}</td><td class="r">${fmt(o.v[i],o.d)}</td><td class="r">${c===null?"—":(c>=0?"+":"")+c.toFixed(1)+"%"}</td></tr>`;}).join("")}</tbody></table>`;return;}
 cw.hidden=false;tw.hidden=true;
 const W=720,H=340,L=72,R=20,T=28,B=40,pw=W-L-R,ph=H-T-B,{step,top}=nice(Math.max(...o.v));
 const y=v=>T+ph-(v/top)*ph,n=o.v.length,bw=pw/n;let s="";
 for(let t=0;t<=top+1e-9;t+=step)s+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${y(t)}" y2="${y(t)}" stroke="#dbe4ef"/><text x="${L-10}" y="${y(t)+4}" text-anchor="end" font-size="11" fill="#5b6f86" font-family="IBM Plex Mono, monospace">${fmt(t,o.d&&step<1?2:0)}</text>`;
 o.y.forEach((yr,i)=>s+=`<text x="${L+bw*i+bw/2}" y="${H-12}" text-anchor="middle" font-size="12" fill="#5b6f86" font-family="IBM Plex Mono, monospace">FY${yr}</text>`);
 if(view==="bar"){const w=Math.min(84,bw*.5);
  s+=`<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b93f4"/><stop offset="1" stop-color="#1d5fe6"/></linearGradient><linearGradient id="bl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6ff0"/><stop offset="1" stop-color="#0d3f9e"/></linearGradient></defs>`;
  o.v.forEach((v,i)=>{const x=L+bw*i+bw/2-w/2,last=i===n-1,h=T+ph-y(v);
   s+=`<rect class="bar" style="animation-delay:${i*.1}s" x="${x}" y="${y(v)}" width="${w}" height="${h}" rx="10" fill="url(#${last?"bl":"bg"})" opacity="${last?1:.6}"><title>FY${o.y[i]}: ${fmt(v,o.d)} ${o.u}</title></rect>`;
   s+=`<text class="vl cu" style="animation-delay:${.35+i*.1}s" x="${x+w/2}" y="${y(v)-9}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0d2440" font-family="Figtree, sans-serif">${fmt(v,o.d)}</text>`;});
 }else{const pts=o.v.map((v,i)=>[L+bw*i+bw/2,y(v)]);
  s+=`<path d="M${pts.map(p=>p.join(",")).join(" L")} L${pts.at(-1)[0]},${T+ph} L${pts[0][0]},${T+ph}Z" fill="#1d5fe6" opacity=".1" class="ar"/><polyline class="ln" pathLength="1" points="${pts.map(p=>p.join(",")).join(" ")}" fill="none" stroke="#1d5fe6" stroke-width="3" stroke-linejoin="round"/>`;
  pts.forEach((p,i)=>{const last=i===n-1;s+=`<circle class="dot" style="animation-delay:${.2+i*.25}s" cx="${p[0]}" cy="${p[1]}" r="${last?7:5}" fill="${last?"#c08a34":"#fff"}" stroke="${last?"#fff":"#1d5fe6"}" stroke-width="2.5"><title>FY${o.y[i]}: ${fmt(o.v[i],o.d)} ${o.u}</title></circle><text class="vl cu" style="animation-delay:${.35+i*.25}s" x="${p[0]}" y="${p[1]-14}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0d2440" font-family="Figtree, sans-serif">${fmt(o.v[i],o.d)}</text>`;});}
 const svg=document.getElementById("chart");svg.innerHTML=s;svg.setAttribute("aria-label",`${o.n} by financial year`);
 if(window.__countUp)svg.querySelectorAll(".cu").forEach(window.__countUp);
}
sel.addEventListener("change",()=>{try{localStorage.setItem("as-kpi",sel.value)}catch(e){};draw();});
document.querySelectorAll("#viewSeg button").forEach(b=>b.addEventListener("click",()=>{view=b.dataset.v;document.querySelectorAll("#viewSeg button").forEach(x=>x.setAttribute("aria-pressed",x===b));draw();}));
draw();


/* ---------- sectors ---------- */
const ic={tour:'<path d="M3 20h18M5 20V10l7-5 7 5v10M9 20v-5h6v5"/>',ship:'<path d="M3 17l2 3h14l2-3M5 17V11h14v6M8 11V7h8v4M12 3v4"/>',leaf:'<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7"/>',serv:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>'};
const S=[
 ["tour","Tourism","7.9",31.6,"Strongest year on record. Hotels in Sri Lanka, the Maldives and India all contributed; destination management rode higher inbound arrivals.",["Heritance & Adaaran","Destination management","Airline GSA"]],
 ["ship","Maritime & Freight Logistics","4.7",null,"Port operations grew and stayed largely insulated from March 2026 disruptions. New freight alliances replaced the DB Schenker agency.",["Ports & maritime","CINEC","Freight & courier","Containers"]],
 ["leaf","Strategic Investments","-0.94",null,"Apparel losses drove a sector loss. Printing and packaging had an exceptional year; plantations held up well.",["Power","Printing & packaging","Apparel","Plantations"]],
 ["serv","Services","1.2",276.5,"BPO scaled quickly and elevators improved. Insurance dipped slightly and money transfer recorded a loss.",["BPO","Elevators","Insurance","Property","Money transfer"]]];
document.getElementById("secCards").innerHTML=S.map(s=>`<article class="sec"><div class="ico"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${ic[s[0]]}</svg></div><h3>${s[1]}</h3><div class="pbt num">Rs. ${s[2]} Bn <small>PBT</small></div>${s[3]?`<span><span class="chip up">▲ ${s[3]}% YoY</span></span>`:""}<p>${s[4]}</p><div class="tags">${s[5].map(t=>`<span>${t}</span>`).join("")}</div></article>`).join("");
const minV=-1.5,maxV=8.5,span=maxV-minV,zero=(0-minV)/span*100;
document.getElementById("pbtBars").innerHTML=`<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><h3>Profit before tax by sector, FY2025/26</h3><span class="src">Rs. Bn · Source pp.41–43</span></div>`+S.map(s=>{const v=parseFloat(s[2]),neg=v<0,w=Math.abs(v)/span*100;
 return `<div class="pbtrow"><span>${s[1]}</span><div class="pbttrack"><span class="zero" style="left:${zero}%"></span><i style="left:${neg?zero-w:zero}%;width:${w}%;background:${neg?"var(--bad)":"linear-gradient(90deg,#5b93f4,#1d5fe6)"}"></i></div><b class="num" style="text-align:right">${s[2]}</b></div>`;}).join("");

/* ---------- report builder ---------- */
const CH=[
 ["Overview",[["About this report",4],["Financial highlights",14],["Non-financial highlights",15],["ESG performance",16],["Awards and accolades",25],["Our history",26],["Group structure",28],["Year at a glance",32]]],
 ["Strategy",[["Operating environment",34],["Chairperson's message",40],["Stakeholder engagement",48],["Our strategy",57],["Value creation model",62]]],
 ["Governance",[["Board of Directors",68],["Governance statement",91],["Risk management",128],["Audit & Risk Committee",144]]],
 ["Sector reviews",[["Tourism",160],["Maritime & Freight Logistics",182],["Strategic Investments",200],["Services",225]]],
 ["Capitals & ESG",[["Financial capital",248],["Human capital",256],["Natural capital",296],["Climate strategy",312],["SLFRS S1 & S2",317]]],
 ["Financials",[["Auditor's report",369],["Statements & notes",373],["Ten year summary",496],["GRI index",502]]]];
const box=document.getElementById("chapters");
box.innerHTML=CH.map((c,ci)=>`<fieldset><legend>${c[0]}</legend>${c[1].map((s,si)=>`<label class="ck"><input type="checkbox" id="ch-${ci}-${si}" data-t="${s[0]}" data-p="${s[1]}"><span>${s[0]}</span><em>p.${s[1]}</em></label>`).join("")}</fieldset>`).join("");
let saved=null;try{saved=JSON.parse(localStorage.getItem("as-build")||"null")}catch(e){}
(saved||["ch-0-1","ch-1-1","ch-3-0","ch-4-3"]).forEach(id=>{const el=document.getElementById(id);if(el)el.checked=true;});
function pack(){
 const on=[...box.querySelectorAll("input:checked")];
 try{localStorage.setItem("as-build",JSON.stringify(on.map(i=>i.id)))}catch(e){}
 document.getElementById("packCount").textContent=on.length?`${on.length} section${on.length>1?"s":""} selected`:"Nothing selected";
 document.getElementById("packList").innerHTML=on.length?on.sort((a,b)=>a.dataset.p-b.dataset.p).map(i=>`<li><a href="${PDF}#page=${+i.dataset.p+1}" target="_blank" rel="noopener">${i.dataset.t}</a> · p.${i.dataset.p}</li>`).join(""):`<li class="empty" style="list-style:none;margin-left:-20px">Tick a chapter to add it here.</li>`;
}
box.addEventListener("change",pack);
document.getElementById("clearBtn").addEventListener("click",()=>{box.querySelectorAll("input").forEach(i=>i.checked=false);pack();});
pack();

/* ---------- Aria: layered 2D mascot that watches the cursor ---------- */
const mCanvas=document.getElementById("mascot"),mWrap=mCanvas.parentElement,L=window.LEO;
let leo={};
(function setFace(){const url=L.face;const fi=document.getElementById("faceImg");fi.src=url;fi.hidden=false;
 const l=document.getElementById("launcher");const im=document.createElement("img");im.src=url;im.alt="";document.getElementById("pawIcon").remove();l.appendChild(im);})();
function loadImg(src){return new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=src;});}
Promise.all([...L.base,L.iris0,L.iris1,L.mask0,L.mask1].map(loadImg)).then(([b0,b1,b2,iris0,iris1,mask0,mask1])=>{
 const W=L.W,H=L.H,ctx=mCanvas.getContext("2d");
 const base=document.createElement("canvas");base.width=W;base.height=H;const bc=base.getContext("2d"),k0=W/L.bw;[b0,b1,b2].forEach((b,i)=>bc.drawImage(b,0,L.cuts[i]*k0,W,(L.cuts[i+1]-L.cuts[i])*k0));
 /* head layer: upper body with a soft fade at the neck so it can tilt independently */
 const NECK={x:612,y:660},head=document.createElement("canvas");head.width=W;head.height=H;
 const hx=head.getContext("2d");hx.drawImage(base,0,0);hx.globalCompositeOperation="destination-in";
 const gr=hx.createLinearGradient(0,690,0,560);gr.addColorStop(0,"rgba(0,0,0,0)");gr.addColorStop(1,"#000");hx.fillStyle=gr;hx.fillRect(0,0,W,H);
 /* body layer: everything above the neck fade is removed so the tilted head never shows a second set of ears */
 const body=document.createElement("canvas");body.width=W;body.height=H;
 const bx=body.getContext("2d");bx.drawImage(base,0,0);bx.clearRect(0,0,W,566);
 const eyes=[{iris:iris0,mask:mask0,ib:L.ibox0,mb:L.mbox0},{iris:iris1,mask:mask1,ib:L.ibox1,mb:L.mbox1}].map(e=>{const c=document.createElement("canvas");c.width=e.mb[2]-e.mb[0];c.height=e.mb[3]-e.mb[1];return Object.assign(e,{c,x:c.getContext("2d")});});
 const EYE_C={x:570,y:390};/* midpoint between the eyes, image px */
 function fit(){const r=mCanvas.getBoundingClientRect();const k=Math.min(1,(r.width*(devicePixelRatio||1))/W);mCanvas.width=Math.round(W*k);mCanvas.height=Math.round(H*k);}
 fit();addEventListener("resize",fit);
 document.getElementById("mLoading").remove();
 /* state */
 const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
 let ptr=null,lastMove=0,gaze={x:0,y:0},tg={x:0,y:0},near=0,nearT=0,blinkAt=1.5,blinkT=-1,hop=0,wave=0;
 addEventListener("pointermove",e=>{ptr={x:e.clientX,y:e.clientY};lastMove=performance.now();},{passive:true});
 document.addEventListener("pointerleave",()=>{ptr=null;});
 mCanvas.addEventListener("click",()=>openChat());
 mCanvas.style.cursor="pointer";
 leo.wave=()=>{hop=1;};
 const t0=performance.now();
 function frame(now){
  const t=(now-t0)/1000,r=mCanvas.getBoundingClientRect(),s=r.width/W;
  /* where the eyes are on screen */
  const ex=r.left+EYE_C.x*s,ey=r.top+EYE_C.y*s;
  const idle=!ptr||now-lastMove>3500;
  if(!idle){
   const dx=ptr.x-ex,dy=ptr.y-ey,d=Math.hypot(dx,dy)||1,reach=Math.min(1,d/(r.width*.9));
   tg.x=dx/d*reach;tg.y=dy/d*reach;
   nearT=Math.max(0,1-Math.max(0,d-r.width*.25)/(r.width*1.2));
  }else{/* wander when nobody is pointing */
   tg.x=Math.sin(t*.7)*.55+Math.sin(t*1.9)*.15;tg.y=Math.sin(t*.45)*.25;nearT=0;
  }
  const ease=still?1:.12;gaze.x+=(tg.x-gaze.x)*ease;gaze.y+=(tg.y-gaze.y)*ease;near+=(nearT-near)*.06;
  /* blink */
  if(!still&&t>blinkAt&&blinkT<0){blinkT=t;}
  let lid=0;if(blinkT>=0){const p=(t-blinkT)/.16;lid=p<.5?p*2:Math.max(0,2-p*2);if(p>=1){blinkT=-1;blinkAt=t+2.5+Math.random()*3.5;if(Math.random()<.2)blinkAt=t+.25;}}
  /* body: perspective lean toward the cursor, stronger when close */
  const lean=gaze.x*(.35+near*.65),tilt=gaze.y*(.35+near*.65);
  hop=Math.max(0,hop-.02);const hopY=still?0:-Math.sin(hop*Math.PI)*18*(hop>0?1:0);
  const breathe=still?0:Math.sin(t*2.1)*.006;
  mWrap.style.setProperty("--ry",(lean*9).toFixed(2)+"deg");
  mWrap.style.setProperty("--rx",(-tilt*5).toFixed(2)+"deg");
  mWrap.style.setProperty("--tx",(lean*10).toFixed(1)+"px");
  mWrap.style.setProperty("--ty",hopY.toFixed(1)+"px");
  /* draw */
  const k=mCanvas.width/W;ctx.setTransform(k,0,0,k,0,0);ctx.clearRect(0,0,W,H);
  ctx.save();ctx.translate(W/2,H);ctx.scale(1,1+breathe);ctx.translate(-W/2,-H);
  ctx.drawImage(body,0,0);
  /* head tilts and turns a little more than the body */
  ctx.save();ctx.translate(NECK.x,NECK.y);ctx.rotate((gaze.x*4.5+(still?0:Math.sin(t*1.1)*.8))*Math.PI/180);ctx.translate(gaze.x*7,gaze.y*5-near*4);ctx.translate(-NECK.x,-NECK.y);
  ctx.drawImage(head,0,0);
  eyes.forEach(e=>{
   const ox=gaze.x*10,oy=gaze.y*5.5,ec=e.x,w=e.c.width,h=e.c.height;
   ec.globalCompositeOperation="source-over";ec.clearRect(0,0,w,h);
   const sc=1+near*.05;/* pupils dilate a touch when you're close */
   const iw=e.iris.width*sc,ih=e.iris.height*sc,icx=(e.ib[0]+e.ib[2])/2-e.mb[0]+ox,icy=(e.ib[1]+e.ib[3])/2-e.mb[1]+oy;
   ec.drawImage(e.iris,icx-iw/2,icy-ih/2,iw,ih);
   if(lid>0){ec.fillStyle="#1f86f2";ec.fillRect(0,0,w,h*lid);ec.fillStyle="#0b1f44";ec.fillRect(0,h*lid-3,w,3);}
   ec.globalCompositeOperation="destination-in";ec.drawImage(e.mask,0,0);
   ctx.drawImage(e.c,e.mb[0],e.mb[1]);
  });
  ctx.restore();ctx.restore();
  /* bubble greets you when you come close */
  const b=document.getElementById("bubbleBtn");
  if(near>.6&&!b.dataset.hi){b.dataset.hi=1;b.querySelector("b").textContent="Oh, hello there!";b.querySelector("span").textContent="Click me and ask anything about the report";}
  else if(near<.2&&b.dataset.hi){delete b.dataset.hi;b.querySelector("b").textContent="Hi, I'm Aria!";b.querySelector("span").textContent="Ask me anything about the 2025/26 report";}
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
}).catch(()=>{const m=document.getElementById("mLoading");if(m)m.textContent="";});

/* ---------- chat ---------- */
const FACTS=`AITKEN SPENCE PLC — INTEGRATED ANNUAL REPORT 2025/26 (year ended 31 March 2026). Theme: "Navigating Complexity with Confidence". 44th annual report since 1983 CSE listing; 15th integrated report. Founded 1868 in Galle as Clark & Spence. Chairperson: Ms. Stasshani Jayawardena. Purpose: Inspire to Create Great Futures for All.
GROUP: 115 companies (87 subsidiaries, 28 strategic partnerships), 4 sectors, 17 segments, 12 countries, 20,300+ employees. Market cap Rs. 56.4 Bn at 31.03.2026; share price Rs. 139.00.
FINANCIALS FY25/26 (vs FY24/25): Revenue Rs. 96,591 Mn (+1.6%, 95,095); revenue incl. associates 122,335 Mn; EBITDA 26,590 Mn (+4.5%); profit from operations 14,814 Mn; PBT 12,812 Mn (+18.3%, 10,826); tax 3,705 Mn; PAT 9,107 Mn (+26.9%); profit attributable to equity holders 6,796 Mn (+27.5%); EPS Rs. 16.74 (13.13); DPS Rs. 4.00 (4.00); payout 23.9%; NAVPS Rs. 218.90 (190.23); ROE 8.18%; ROCE 14.54%; interest cover 3.76x; current ratio 1.40; debt/equity 0.35; P/E 8.30; P/BV 0.63; total assets 227,618 Mn (+12.7%); total equity 104,253 Mn (+16%). Net finance expense down 22.2%. FX gain Rs. 1.0 Bn vs loss 502.7 Mn prior. TSR 11.9%; share price +8.8%.
Geography: overseas = 47.3% of revenue, 61.4% of profit, 45.4% of assets.
SECTORS FY25/26 PBT: Tourism Rs. 7.9 Bn (+31.6%, record; hotels in Sri Lanka, Maldives, India; destination management; airline GSA). Maritime & Freight Logistics Rs. 4.7 Bn (ports grew; DB Schenker agency exit after DSV acquisition, new alliances; Qatar Air Cargo GSA subdued; new warehouse). Strategic Investments loss Rs. 0.94 Bn (apparel losses; printing & packaging exceptional; power lower due to solar curtailment, Cyclone Ditwah, high prior base; plantations commendable). Services Rs. 1.2 Bn (+276.5%; BPO growth, Port City BPO stake diluted 50%→33.5%; elevators better; insurance slightly down; money transfer loss).
Countries with group companies: Sri Lanka, Maldives, India, Oman, UAE, Bangladesh, Myanmar, Cambodia, Singapore, Fiji, Russia.
ECONOMIC: value added Rs. 48.5 Bn (+9.4%; 40.3% to employees, 12.9% government, 16.5% lenders, 3.3% shareholders, 27.0% retained); FX facilitated Rs. 113.8 Bn (163.1 prior; Services 62.1, Tourism 38.9, SI 6.8, Maritime 6.0); taxes paid Rs. 14.8 Bn; employee benefits Rs. 19.6 Bn; dividends paid Rs. 1.6 Bn.
ESG: Scope 1+2 53,103 tCO2e (Scope 1 40,395; Scope 2 12,708; prior 52,402); emissions reduced/offset 188,922 tCO2e; energy 794,758 GJ, renewables 257,375 GJ (32.4%); water withdrawn 1,245,545 m3, 64% treated for reuse/disposal; waste 22,618 t; 180,241 t municipal waste converted to energy at 10 MW Kerawalapitiya waste-to-energy plant (avoided 114,933 tCO2e; 5 years, >1,000,000 t). First Sri Lankan conglomerate with SBTi-validated near-term targets; net zero by 2030 goal; UNGC signatory since 2002; first SL conglomerate in GRI Community; first-time SLFRS S1/S2 adoption. Female representation 37% (42% prior), female managers 22%, training Rs. 87 Mn, 16 hrs avg; community funds Rs. 85.7 Mn. Operational: 1,170,224 hotel guest nights; 2,676 rooms (owned & managed); 413,890 sq ft warehouse space; 542,400 inward remittance transactions; 123,921 MWh power generated; 27,061 youth in capacity building at CINEC campus; 200,074 sq ft commercial office space.
HIGHLIGHTS: Heritance Superbrands 2025; Aitken Spence Travels GSTC certified; Hapag-Lloyd Lanka 20 years in 2026; Ace Cargo 45 years; Ace Bangladesh cold room Dhaka; 100,000 sq ft green warehouse, CILT 2026 Gold for sustainability; automated rigid box machine; Elpitiya Value Vault card; OTIS MoU with Rush Housing. Awards: TAGS 2025 Gold (Diversified Holdings) + overall Top 10; EFC Top 10 Best Employers 2025; LMD Hall of Fame 8th mover; Sri Lanka Best Employer Brand 2025.
STRATEGIC OBJECTIVES: YoY sustainable profit growth; new geographies; five new business segments by 2030; net zero by 2030; employer of choice.
REPORT PAGES: Financial highlights p14; ESG p16; Chairperson's message p40; Strategy p57; Governance p91; Risk p128; Tourism p160; Maritime p182; Strategic Investments p200; Services p225; Financial statements p373; Ten year summary p496; GRI index p502.`;
const RULES=`You are Aria, a friendly blue Sri Lankan leopard and the guide on Aitken Spence's Annual Report 2025/26 microsite. Answer ONLY from the facts below. Keep answers short (2–4 sentences, or a short list), warm and clear, figures in Sri Lankan rupees as written. If the facts don't cover the question, say you don't have that in the report summary and suggest the relevant page of the full PDF. Never invent numbers. No markdown headings; plain text or simple "- " bullets.\n\nFACTS:\n`+FACTS;
const QA=[
 [/revenue|turnover|sales/,"Group revenue was Rs. 96.6 Bn in FY2025/26, up 1.6% from Rs. 95.1 Bn. Including associates it reached Rs. 122.3 Bn. Overseas markets brought in 47.3% of it."],
 [/pbt|profit before|profit|earn/,"Profit before tax rose 18.3% to Rs. 12.8 Bn, and profit after tax rose 26.9% to Rs. 9.1 Bn. Lower interest costs and restructured borrowings cut net finance expenses by 22.2%."],
 [/eps|share|dividend|nav|shareholder/,"EPS rose 27.5% to Rs. 16.74, net asset value per share is Rs. 218.90, and the Board recommended a Rs. 4.00 dividend per share. Total shareholder return was 11.9%."],
 [/tourism|hotel|heritance|maldives|travel/,"Tourism had its best year yet: PBT of Rs. 7.9 Bn, up 31.6%. Hotels in Sri Lanka, the Maldives and India all contributed, along with destination management and airline GSA."],
 [/maritime|port|freight|logistic|cargo|ship/,"Maritime & Freight Logistics earned Rs. 4.7 Bn PBT. Port operations grew, and new freight alliances replaced the DB Schenker agency after its acquisition by DSV."],
 [/strategic|apparel|power|plantation|print|packag/,"Strategic Investments made a Rs. 0.94 Bn loss, mainly from apparel. Printing and packaging had an exceptional year and plantations performed well, while power earnings dipped."],
 [/service|bpo|insurance|elevator|money/,"Services PBT jumped 276.5% to Rs. 1.2 Bn, led by BPO growth and better elevator sales. Insurance dipped slightly and money transfer made a loss."],
 [/esg|sustain|carbon|emission|energy|renewable|net zero|sbti|water|waste/,"Scope 1+2 emissions were 53,103 tCO₂e and renewables supplied 32.4% of energy. Aitken Spence is the first Sri Lankan conglomerate with SBTi-validated near-term targets, aiming for net zero by 2030."],
 [/employ|people|staff|women|female|train/,"The Group employs 20,300 people, up 22.9%. Women make up 37% of the workforce and 22% of managers, and Rs. 87 Mn went into training."],
 [/countr|global|where|overseas|presence/,"Aitken Spence operates in 12 countries, including Sri Lanka, the Maldives, India, Oman, the UAE, Bangladesh, Myanmar, Cambodia, Singapore, Fiji and Russia. Overseas operations delivered 61.4% of profit."],
 [/award|recogni/,"Highlights include Gold at the TAGS Awards 2025 and a Top Ten place overall, Top 10 at the EFC National Best Employer Awards 2025, and 8th among LMD's Top 20 Movers and Shakers."],
 [/histor|found|1868|heritage/,"Aitken Spence began in 1868 in Galle as Clark & Spence. Firsts include Heritance Kandalama, the world's first LEED-certified hotel, and Sri Lanka's first waste-to-energy plant."]];
function localAnswer(q){q=q.toLowerCase();for(const [re,a] of QA)if(re.test(q))return a;return "I can help with revenue, profits, sectors, sustainability, people, countries, awards or history. Try asking about one of those, or open the full PDF for detail.";}
const chat=document.getElementById("chat"),msgs=document.getElementById("msgs"),form=document.getElementById("chatForm"),input=document.getElementById("chatInput"),send=document.getElementById("sendBtn"),launcher=document.getElementById("launcher");
const history=[];let sampleFn,sampleReady=false,busy=false;
(async()=>{try{sampleFn=await window.claude?.use?.("sample");}catch(e){sampleFn=null;}sampleReady=true;})();
function bubble(text,who){const d=document.createElement("div");d.className="msg "+who;d.textContent=text;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;}
const SUG=["How did profits change?","Which sector did best?","What are the ESG highlights?","Where does Aitken Spence operate?"];
document.getElementById("sugg").innerHTML=SUG.map(s=>`<button type="button">${s}</button>`).join("");
document.getElementById("sugg").addEventListener("click",e=>{const b=e.target.closest("button");if(b)ask(b.textContent);});
let greeted=false;
function openChat(){chat.hidden=false;launcher.setAttribute("aria-expanded","true");launcher.querySelector(".ping")?.remove();
 if(!greeted){greeted=true;bubble("Hi, I'm Aria! 🐆 I know the Aitken Spence Annual Report 2025/26 inside out. Ask me about results, sectors, sustainability or anything else in the report.","bot");}
 leo?.wave?.();setTimeout(()=>input.focus(),50);}
function closeChat(){chat.hidden=true;launcher.setAttribute("aria-expanded","false");}
launcher.addEventListener("click",()=>chat.hidden?openChat():closeChat());
document.getElementById("chatClose").addEventListener("click",closeChat);
document.getElementById("bubbleBtn").addEventListener("click",openChat);
addEventListener("keydown",e=>{if(e.key==="Escape"&&!chat.hidden)closeChat();});
async function ask(q){
 q=q.trim();if(!q||busy)return;busy=true;send.disabled=true;input.value="";
 bubble(q,"me");history.push({role:"user",content:q});leo?.wave?.();
 const out=bubble("Aria is thinking…","bot typing");
 let answer="";
 if(!sampleReady)await new Promise(r=>setTimeout(r,600));
 if(sampleFn){
  try{
   const turns=history.slice(-8).map(m=>({role:m.role,content:m.content}));
   while(turns.length&&turns[0].role!=="user")turns.shift();
   turns[0]={role:"user",content:RULES+"\n\nVisitor question: "+turns[0].content};
   const r=await sampleFn(turns,{modelTier:"quick",cache:false,onText:({text})=>{if(text){out.classList.remove("typing");out.textContent=text;msgs.scrollTop=msgs.scrollHeight;}}});
   answer=(r&&r.text)||"";
  }catch(err){
   if(err&&err.code==="not_granted")sampleFn=null;
   answer="";
  }
 }
 if(!answer)answer=localAnswer(q);
 out.classList.remove("typing");out.textContent=answer;msgs.scrollTop=msgs.scrollHeight;
 history.push({role:"assistant",content:answer});
 busy=false;send.disabled=false;input.focus();
}
form.addEventListener("submit",e=>{e.preventDefault();ask(input.value);});

/* ---------- motion system ---------- */
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
function countUp(el){
 if(reduce)return;
 const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;
 while((n=w.nextNode())&&!/\d/.test(n.nodeValue));
 if(!n)return;
 const src=n.nodeValue,m=src.match(/-?\d[\d,]*(?:\.\d+)?/);if(!m)return;
 const raw=m[0],target=parseFloat(raw.replace(/,/g,"")),dec=(raw.split(".")[1]||"").length,comma=raw.includes(",");
 if(Math.abs(target)>=1800&&Math.abs(target)<=2100&&!comma&&!dec)return;/* leave years alone */
 const pre=src.slice(0,m.index),post=src.slice(m.index+raw.length),t0=performance.now(),dur=1300;
 const f=v=>{let s=Math.abs(v).toFixed(dec);if(comma)s=Number(s).toLocaleString("en-US",{minimumFractionDigits:dec,maximumFractionDigits:dec});return (v<0?"-":"")+s;};
 (function tick(t){const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);n.nodeValue=pre+f(target*e)+post;if(p<1)requestAnimationFrame(tick);else n.nodeValue=src;})(t0);
}
window.__countUp=el=>{if(chartSeen)countUp(el);};
let chartSeen=false;
const hooks={
 chart(){chartSeen=true;draw();},
 spark(el){el.classList.add("go");},
 timeline(el){el.classList.add("go");},
 pbt(el){
  el.querySelectorAll(".pbttrack i").forEach((b,i)=>{if(reduce)return;const w=b.style.width,l=b.style.left,zl=el.querySelector(".zero").style.left;
   b.style.transition="none";b.style.width="0%";b.style.left=zl;b.offsetWidth;b.style.transition="";b.style.transitionDelay=(i*.15)+"s";b.style.width=w;b.style.left=l;});
  el.querySelectorAll(".pbtrow b").forEach(countUp);
 },
 value(el){el.querySelectorAll(".vbar i").forEach((b,i)=>{b.style.transitionDelay=(i*.18)+"s";requestAnimationFrame(()=>b.style.width=b.dataset.w+"%");});el.querySelectorAll(".vleg b").forEach(countUp);},
 donut(el){if(reduce)return;const a=el;const t0=performance.now();(function tick(t){const p=Math.min(1,(t-t0)/1400),e=1-Math.pow(1-p,3),v=32.4*e;a.setAttribute("stroke-dasharray",v+" "+(100-v));if(p<1)requestAnimationFrame(tick);})(t0);}
};
/* value split data */
const VS=[["Employees",40.3,"#1d5fe6"],["Retained for growth",27.0,"#0d2440"],["Lenders of capital",16.5,"#2c8a7d"],["Governments",12.9,"#c08a34"],["Shareholders",3.3,"#8fb4ff"]];
document.getElementById("vbar").innerHTML=VS.map(v=>`<i data-w="${v[1]}" style="background:${v[2]}${reduce?";width:"+v[1]+"%":""}" title="${v[0]}: ${v[1]}%"></i>`).join("");
document.getElementById("vleg").innerHTML=VS.map(v=>`<span style="--c:${v[2]}">${v[0]} <b>${v[1].toFixed(1)}%</b></span>`).join("");
/* tag elements */
const revealSel=[".head",".split > div",".kpi",".gen",".sec",".pbtbar",".eg",".card",".aw","fieldset",".pack",".timeline"];
document.querySelectorAll(revealSel.join(",")).forEach(el=>{el.classList.add("rv");const sib=[...el.parentElement.children].filter(c=>c.tagName===el.tagName&&c.classList[0]===el.classList[0]);el.style.setProperty("--i",Math.min(8,sib.indexOf(el)));});
document.querySelectorAll(".timeline .tl").forEach((t,i)=>t.style.setProperty("--i",i));
document.querySelectorAll(".kpi .v,.sec .pbt,.eg .row b,.hero-num b,.chipcard b,.big b,.people b,.kpi .chip").forEach(e=>e.classList.add("cu"));
const hookEls=[[".chartbox","chart"],[".vis","spark"],[".timeline","timeline"],["#pbtBars","pbt"],["#valueSplit","value"],["#dArc","donut"]];
hookEls.forEach(([s,k])=>{const e=document.querySelector(s);if(e)e.dataset.hook=k;});
const vh=innerHeight;
const io2=new IntersectionObserver(es=>es.forEach(en=>{
 if(!en.isIntersecting)return;const el=en.target;io2.unobserve(el);
 if(el.classList.contains("rv")){el.classList.remove("pre");el.classList.add("seen");setTimeout(()=>el.classList.remove("rv"),1400);}
 if(el.classList.contains("cu")&&!el.closest("#chart"))countUp(el);
 if(el.dataset.hook)hooks[el.dataset.hook](el);
}),{threshold:.18,rootMargin:"0px 0px -6% 0px"});
document.querySelectorAll(".rv").forEach(el=>{if(!reduce&&el.getBoundingClientRect().top>vh*.92)el.classList.add("pre");io2.observe(el);});
document.querySelectorAll(".cu,[data-hook]").forEach(el=>{if(!el.closest("#chart"))io2.observe(el);});
/* scroll progress */
const prog=document.getElementById("prog");
function onScroll(){const d=document.documentElement,m=d.scrollHeight-innerHeight;prog.style.transform=`scaleX(${m>0?Math.min(1,scrollY/m):0})`;}
addEventListener("scroll",onScroll,{passive:true});onScroll();


/* ---------- custom summary PDF ---------- */
const PDFURL="https://www.aitkenspence.com/images/ar/2025-2026/aitken-spence-annual-report-2025-2026-high.pdf";
const COL={navy:[13,36,64],blue:[29,95,230],deep:[13,63,158],brass:[192,138,52],teal:[44,138,125],sky:[143,180,255],mist:[242,246,251],line:[219,228,239],muted:[91,111,134],red:[194,69,47],green:[24,131,79],white:[255,255,255]};
function toPng(src){return new Promise(ok=>{const i=new Image();i.onload=()=>{const c=document.createElement("canvas");c.width=i.naturalWidth;c.height=i.naturalHeight;c.getContext("2d").drawImage(i,0,0);ok({url:c.toDataURL("image/png"),w:c.width,h:c.height});};i.onerror=()=>ok(null);i.src=src;});}

/* section content: each takes the page helper P */
const SUM={
"About this report":P=>{
 P.para("This is Aitken Spence PLC's 44th Annual Report since listing on the Colombo Stock Exchange in 1983, and its 15th Integrated Annual Report. It covers the year ended 31 March 2026.");
 P.kpis([["Companies","115"],["Subsidiaries","87"],["Strategic partnerships","28"],["Sectors / segments","4 / 17"],["Countries","12"],["Employees","20,300+"]]);
 P.bullets(["Financial statements assured by KPMG, Chartered Accountants.","Non-financial disclosures (GRI, <IR> Framework, six SASB standards) and SLFRS S1/S2 disclosures assured by Ernst & Young.","First-time adoption of SLFRS S1 and S2 sustainability disclosure standards this year.","Report approved by the Board of Directors on 5 June 2026."]);
},
"Financial highlights":P=>{
 P.kpis([["Revenue","Rs. 96.6 Bn","+1.6%"],["EBITDA","Rs. 26.6 Bn","+4.5%"],["Profit before tax","Rs. 12.8 Bn","+18.3%"],["Profit after tax","Rs. 9.1 Bn","+26.9%"],["Total assets","Rs. 227.6 Bn","+12.7%"],["Total equity","Rs. 104.3 Bn","+16.0%"]]);
 P.table(["Indicator","2025/26","2024/25","Change"],[
  ["Group revenue (Rs. Mn)","96,591","95,095","+2%"],["Revenue incl. associates (Rs. Mn)","122,335","112,802","+8%"],["Profit from operations (Rs. Mn)","14,814","14,779","0%"],
  ["Profit attributable to equity holders (Rs. Mn)","6,796","5,331","+27%"],["Earnings per share (Rs.)","16.74","13.13","+27%"],["Dividend per share (Rs.)","4.00","4.00","0%"],
  ["Net asset value per share (Rs.)","218.90","190.23","+15%"],["Return on equity (%)","8.18","7.06","+16%"],["ROCE (%)","14.54","14.34","+1%"],
  ["Interest cover (times)","3.76","2.82","+34%"],["Debt / equity","0.35","0.38","-7%"],["Price / earnings (times)","8.30","9.73","-15%"]],[0.52,0.16,0.16,0.16]);
 P.vbars("Profit before tax (Rs. Mn)",["FY21/22","FY22/23","FY24/25","FY25/26"],[14244,11201,10826,12812]);
 P.note("FY2023/24 is not shown. See the Ten Year Summary on p.496.");
},
"Non-financial highlights":P=>{
 P.sub("People & social");P.table(["Indicator","2025/26","2024/25"],[["Employees","20,300","16,513"],["Female representation","37%","42%"],["Employee benefits paid","Rs. 19.6 Bn",""],["Training investment","Rs. 87.0 Mn",""],["Average training hours","16","17"]],[.6,.2,.2]);
 P.sub("Environment");P.table(["Indicator","2025/26","2024/25"],[["Scope 1 + 2 emissions (tCO2e)","53,103","52,402"],["Emissions reduced / offset (tCO2e)","188,922","208,891"],["Energy consumed (GJ)","794,758","734,143"],["Renewable energy (GJ)","257,375 (32.4%)","215,375"],["Water withdrawn (m3)","1,245,545","1,303,811"]],[.6,.2,.2]);
 P.sub("Operational");P.kpis([["Hotel guest nights","1,170,224"],["Rooms (owned & managed)","2,676"],["Warehouse space","413,890 sq ft"],["Remittance transactions","542,400"],["Power generated","123,921 MWh"],["Youth trained at CINEC","27,061"]]);
},
"ESG performance":P=>{
 P.hbars("Scope 1 + 2 emissions by sector (tCO2e)",[["Tourism",35290,COL.blue],["Strategic Investments",13805,COL.brass],["Maritime & Freight",3460,COL.navy],["Services",549,COL.teal]]);
 P.hbars("Energy consumed by sector (GJ)",[["Tourism",437525,COL.blue],["Strategic Investments",310319,COL.brass],["Maritime & Freight",42906,COL.navy],["Services",4007,COL.teal]]);
 P.hbars("Water withdrawn by sector (m3)",[["Tourism",912755,COL.blue],["Strategic Investments",281468,COL.brass],["Maritime & Freight",31434,COL.navy],["Services",19888,COL.teal]]);
 P.bullets(["Energy use per unit of revenue rose 5% at Group level, but fell 6% in Tourism, 12% in Maritime & Freight Logistics and 17% in Services.","Water use per unit of revenue fell 7%.","More than 90% of the Group's own solid waste was kept out of landfill.","The waste-to-energy plant converted 180,241 t of municipal waste, avoiding 114,933 tCO2e of net emissions."]);
},
"Awards and accolades":P=>{P.bullets(["TAGS Annual Report Awards 2025: Gold, Diversified Holdings (turnover up to Rs. 100 Bn), plus a place in the overall Top Ten Annual Reports.","EFC National Best Employer Awards 2025: Top 10 Best Employers.","LMD Hall of Fame: ranked 8th among the Top 20 Movers and Shakers.","Sri Lanka Leadership Awards 2025: Sri Lanka Best Employer Brand."]);},
"Our history":P=>{P.timeline([["1868","Clark & Spence founded as merchants and commission agents in Galle."],["1974","Neptune Hotel, designed by Geoffrey Bawa, opens; now Heritance Ayurveda."],["1983","Shares quoted on the Colombo Stock Exchange."],["1994","Heritance Kandalama opens, the world's first LEED-certified hotel."],["1996","The Tea Factory, Sri Lanka's first themed hotel."],["2002","UN Global Compact signatory; first Sri Lankan hospitality company in the Middle East."],["2013","First international port management company in Fiji."],["2020","Sri Lanka's first waste-to-energy power plant begins operating."],["2024","Enters business process outsourcing through Port City BPO."]]);},
"Group structure":P=>{
 P.kpis([["Companies","115"],["Subsidiaries","87"],["JVs / associates","28"]]);
 P.table(["Sector","Companies","Subsidiaries","Main segments"],[["Tourism","39","35","Hotels, destination management, airline GSA"],["Maritime & Freight Logistics","31","21","Ports, shipping, education, freight, containers"],["Strategic Investments","31","20","Power, printing & packaging, apparel, plantations"],["Services","14","11","Property, elevators, insurance, money transfer, BPO"]],[.3,.13,.15,.42]);
 P.para("Seven companies were liquidated during the year as part of portfolio rationalisation, and Aitken Spence Plantations (Fiji) Pte Limited was incorporated.");
},
"Year at a glance":P=>{P.bullets(["Heritance Hotels and Resorts awarded Superbrands Sri Lanka status 2025.","Aitken Spence Travels achieved GSTC certification.","Hapag-Lloyd Lanka celebrates its 20th anniversary in 2026.","Ace Cargo and Aitken Spence Cargo marked 45 years as Sri Lanka's pioneering international freight forwarder.","Ace Bangladesh laid the foundation stone for a cold room and warehouse in Dhaka.","A new 100,000 sq ft green warehouse; Gold Award for Sustainability at the CILT Awards 2026.","A fully automated rigid box-making machine commissioned in printing and packaging.","Western Power Company's 10 MW waste-to-energy plant marked 5 years, having disposed of more than 1,000,000 tonnes of waste.","Elpitiya Plantations introduced the Value Vault smart shopping card for over 400 estate employees.","Aitken Spence Elevators signed an MoU to supply OTIS elevators for five Rush Housing projects."]);},
"Operating environment":P=>{
 P.kpis([["Global growth 2025","3.4%"],["Sri Lanka growth 2025","5.0%"],["SL inflation (Dec 2025)","2.9%"],["Tourist arrivals to SL","2.4 Mn (+15%)"],["Remittances","+23%"],["Rupee vs USD","-5.6%"]]);
 P.bullets(["Sri Lanka's recovery continued, supported by fiscal discipline, easing inflation and the IMF Extended Fund Facility.","Cyclone Ditwah in November 2025 caused a temporary setback during the peak tourist season.","Hostilities in the Middle East late in the year raised energy prices and uncertainty for tourism, shipping and remittances.","Freight traffic through the Port of Colombo rose 6%; textile and garment exports grew 5%."]);
},
"Chairperson's message":P=>{
 P.quote("Our greatest strength lies not in the diversity of our businesses, but in the character, commitment, and ingenuity of our people.","Stasshani Jayawardena, Chairperson");
 P.bullets(["Revenue of Rs. 96.6 Bn, up 1.6%; profit before tax of Rs. 12.8 Bn, up 18.3%.","Lower interest rates and restructured borrowings cut net finance expenses by 22.2%.","Overseas operations contributed 61.4% of total profits.","Profit after tax rose 26.9% to Rs. 9.1 Bn; profit attributable to equity holders rose 27.5% to Rs. 6.8 Bn.","Net asset value per share rose to Rs. 218.90 and return on equity to 8.2%.","Share price up 8.8%, total shareholder return 11.9%; dividend of Rs. 4.00 per share recommended.","The Group Supervisory Board and Management Council were expanded to strengthen oversight."]);
},
"Stakeholder engagement":P=>{P.table(["Stakeholder","What the Group aims to deliver"],[["Shareholders & investors","Sustainable returns and transparent performance"],["Employees","A safe, inclusive and growth-oriented workplace"],["Customers","Quality, innovative and reliable solutions"],["Suppliers & partners","Responsible, mutually beneficial partnerships"],["Communities & society","Inclusive growth and community well-being"],["Regulators & government","Compliance and support for national priorities"]],[.35,.65]);},
"Our strategy":P=>{
 P.para("Purpose: Inspire to Create Great Futures for All. Vision: achieve excellence in all activities, establish high-growth business in Sri Lanka and across new frontiers, and become a globally competitive market leader in the region.");
 P.sub("Five strategic objectives");
 P.bullets(["Achieve year-on-year sustainable profit growth and increase market share across all segments.","Expand the Aitken Spence footprint into new geographies.","Venture into five new business segments by 2030.","Reduce the Group's resource footprint and achieve net-zero emissions by 2030.","Achieve Employer of Choice status."]);
},
"Value creation model":P=>{
 P.stack("Distribution of Rs. 48.5 Bn value added",[["Employees",40.3,COL.blue],["Retained",27.0,COL.navy],["Lenders",16.5,COL.teal],["Governments",12.9,COL.brass],["Shareholders",3.3,COL.sky]]);
 P.table(["Distributed to","2025/26 (Rs. Mn)","2024/25 (Rs. Mn)"],[["Employees","19,561","17,296"],["Retained for the future","13,082","11,607"],["Lenders of capital","8,012","8,858"],["Governments","6,257","4,994"],["Shareholders","1,624","1,624"],["Total value added","48,535","44,379"]],[.5,.25,.25]);
 P.para("The Group draws on six capitals: financial, manufactured, intellectual, human, social and relationship, and natural.");
},
"Board of Directors":P=>{P.para("This chapter profiles the members of the Board of Directors, led by Chairperson Ms. Stasshani Jayawardena, together with the Group Supervisory Board and Management Council. During the year both the Group Supervisory Board and the Management Council were expanded to deepen strategic oversight.");},
"Governance statement":P=>{
 P.para("The Group reports compliance with the Colombo Stock Exchange listing rules (section 9 on corporate governance) and the CA Sri Lanka Code of Best Practice on Corporate Governance (2023).");
 P.table(["Governance indicator, 2025/26","Result"],[["Confirmed incidents of corruption","None"],["Legal actions for anti-competitive behaviour","None"],["Incidents of discrimination","None"],["Customer privacy complaints","None"],["Grievances filed through formal mechanisms","11"],["Shares held by the 20 largest shareholders","91.0%"]],[.7,.3]);
},
"Risk management":P=>{
 P.sub("Exposure to the Middle East conflict");
 P.table(["Sector","Potential impact"],[["Tourism","High"],["Maritime & Freight Logistics","High"],["Strategic Investments","Moderate to high"],["Services","Moderate to low"]],[.6,.4]);
 P.sub("Sensitivity to economic drivers");
 P.table(["Segment","Sensitivity","Key driver"],[["Tourism","High","Global travel demand"],["Maritime & Freight Logistics","High","Global trade flows"],["Power generation","Low","Domestic demand"],["Plantations","High","Commodity pricing"],["Apparel","High","Export markets"],["Money transfer","High","Labour migration"],["Insurance","Medium","Economic activity"],["BPO","Medium","Outsourcing demand"]],[.4,.2,.4]);
},
"Audit & Risk Committee":P=>{P.para("The Audit & Risk Committee report covers oversight of financial reporting, internal controls and external assurance.");P.bullets(["Financial statements audited by KPMG, Chartered Accountants.","Non-financial and SLFRS S1/S2 disclosures assured by Ernst & Young, Chartered Accountants."]);},
"Tourism":P=>{
 P.kpis([["Profit before tax","Rs. 7.9 Bn","+31.6%"],["Forex facilitated","Rs. 38.9 Bn"],["Employees","3,978"]]);
 P.para("The sector delivered its strongest performance to date and was the largest contributor to Group profit. Hotels in Sri Lanka, the Maldives and India all contributed, with strong occupancy in Sri Lanka and the Maldives. Destination management benefited from higher inbound tourism, and airline GSA operations added to results. Teams responded quickly to Cyclone Ditwah to keep guests and staff safe.");
 P.bullets(["Heritance Hotels and Resorts: Superbrands Sri Lanka 2025.","Aitken Spence Travels: GSTC certification."]);
},
"Maritime & Freight Logistics":P=>{
 P.kpis([["Profit before tax","Rs. 4.7 Bn"],["Forex facilitated","Rs. 6.0 Bn"],["Employees","1,966"]]);
 P.para("Port operations grew in revenue and earnings and stayed largely insulated from the disruptions of March 2026. Freight volumes were affected by the exit of the DB Schenker agency after its acquisition by DSV, offset by new alliances with other global networks. The Qatar Air Cargo GSA saw lower freight rates, while the new warehouse complex showed positive early momentum.");
 P.bullets(["100,000 sq ft green warehouse; CILT 2026 Gold Award for Sustainability.","Ace Cargo marked 45 years; Hapag-Lloyd Lanka reaches 20 years in 2026."]);
},
"Strategic Investments":P=>{
 P.kpis([["Loss before tax","Rs. 0.94 Bn"],["Forex facilitated","Rs. 6.8 Bn"],["Employees","7,754"]]);
 P.para("The loss was driven by the apparel segment, which faced lower revenue, higher costs and weak demand amid shifting tariffs. Printing and packaging delivered an exceptional year. Power generation profits fell because of daytime solar curtailment, cyclone disruption to some hydro plants and a one-off write-back in the prior year. Plantations performed well despite cost pressures.");
},
"Services":P=>{
 P.kpis([["Profit before tax","Rs. 1.2 Bn","+276.5%"],["Forex facilitated","Rs. 62.1 Bn"],["Employees","6,602"]]);
 P.para("BPO services grew strongly; the Group diluted its stake in Port City BPO from 50% to 33.5% to bring in a strategic shareholder. The elevator agency improved, and property management stayed stable. Insurance profits dipped slightly and money transfer recorded a loss.");
},
"Financial capital":P=>{
 P.kpis([["Return on equity","8.18%"],["ROCE","14.54%"],["Interest cover","3.76x"],["Debt / equity","0.35"],["Current ratio","1.40x"],["Net finance expense","-22.2%"]]);
 P.bullets(["Other operating income rose to Rs. 1.1 Bn, including a foreign exchange gain of Rs. 1.0 Bn (prior year: a loss of Rs. 502.7 Mn).","Share of profit from equity-accounted investees rose 46% to Rs. 2,300 Mn.","Overseas operations: 47.3% of revenue, 61.4% of profit and 45.4% of assets."]);
},
"Human capital":P=>{
 P.hbars("Employees by sector",[["Strategic Investments",7754,COL.brass],["Services",6602,COL.teal],["Tourism",3978,COL.blue],["Maritime & Freight",1966,COL.navy]]);
 P.table(["Indicator","2025/26","2024/25"],[["Total employees","20,300","16,513"],["Permanent / contract","10,978 / 9,322","11,171 / 5,342"],["Female representation","37%","42%"],["Female managers","22%","21%"],["Workplace injuries","314","348"],["Lost working days","771","1,177"],["Turnover rate","39%","34%"],["Average years of service","7","7"]],[.5,.25,.25]);
},
"Natural capital":P=>{
 P.stack("Energy consumption by source",[["Diesel",51.0,COL.navy],["Renewables",32.4,COL.green],["Grid electricity",13.9,COL.blue],["LPG",2.1,COL.brass],["Petrol",0.6,COL.sky]]);
 P.bullets(["Total energy consumed: 794,758 GJ, of which 257,375 GJ (32.4%) renewable.","Water withdrawn: 1,245,545 m3; 64% treated for reuse or safe disposal.","Waste generated: 22,618 t, down from 26,888 t.","180,241 t of municipal waste converted to grid power at the Kerawalapitiya plant."]);
},
"Climate strategy":P=>{P.bullets(["First conglomerate in Sri Lanka with near-term targets validated by the Science Based Targets initiative.","Goal of net-zero carbon emissions by 2030.","Target to cut transport-related emissions by 20% against the 2024 baseline.","Scope 1: 40,395 tCO2e; Scope 2: 12,708 tCO2e.","Scope 3 reporting realigned to the Greenhouse Gas Protocol categories this year.","A Sustainability Council now steers implementation."]);},
"SLFRS S1 & S2":P=>{P.para("This is the Group's first year applying SLFRS S1 (general sustainability-related financial disclosures) and SLFRS S2 (climate-related disclosures), aligned with the IFRS Sustainability Disclosure Standards. The disclosures use the permitted transition reliefs, with further enhancements planned as data and methods mature. Assurance was provided by Ernst & Young.");},
"Auditor's report":P=>{P.para("The independent auditor's report on the consolidated financial statements is issued by KPMG, Chartered Accountants.");},
"Statements & notes":P=>{
 P.sub("Income statement (Rs. Mn)");P.table(["","2025/26","2024/25"],[["Revenue","96,591","95,095"],["Profit from operations","14,814","14,779"],["Share of equity-accounted investees","2,300","1,577"],["Profit before tax","12,812","10,826"],["Income tax","(3,705)","(3,647)"],["Profit after tax","9,107","7,179"]],[.5,.25,.25]);
 P.sub("Financial position (Rs. Mn)");P.table(["","2025/26","2024/25"],[["Non-current assets","150,366","129,493"],["Current assets","76,395","71,612"],["Total assets","227,618","202,027"],["Total equity","104,253","89,889"],["Non-current liabilities","68,834","53,260"],["Current liabilities","54,531","58,878"]],[.5,.25,.25]);
},
"Ten year summary":P=>{P.vbars("Group revenue (Rs. Mn)",["FY21/22","FY22/23","FY24/25","FY25/26"],[54696,98104,95095,96591]);P.note("This summary shows the years available on the microsite. The full ten-year series is on p.496 of the report.");},
"GRI index":P=>{P.bullets(["GRI Standards 2021, with the GRI 13 Agriculture sector standard.","Six SASB standards: hotels & lodging, road transportation, air freight & logistics, agricultural products, apparel, and electric utilities.","<IR> Framework, UN Global Compact and Women's Empowerment Principles.","Aitken Spence is the first Sri Lankan conglomerate to join the GRI Community."]);}
};

async function buildSummary(picks){
 const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:"mm",format:"a4"});
 const PW=210,PH=297,M=18,CW=PW-2*M;let y=0,page=1;
 const logo=await toPng(document.querySelector(".nav .logo img").src);
 const logoW=await toPng(document.querySelector("footer .logo img").src);
 const face=await toPng(window.LEO.face);
 const fill=c=>doc.setFillColor(...c),ink=c=>doc.setTextColor(...c),stroke=c=>doc.setDrawColor(...c);
 const font=(s,w)=>{doc.setFont("helvetica",w||"normal");doc.setFontSize(s);};
 function chrome(){
  if(logo)doc.addImage(logo.url,"PNG",M,9,22,22*logo.h/logo.w);
  font(8);ink(COL.muted);doc.text("Annual Report 2025/26  |  Custom summary",PW-M,14,{align:"right"});
  stroke(COL.line);doc.setLineWidth(.3);doc.line(M,19,PW-M,19);
  font(7.5);doc.text("Source: Aitken Spence PLC Integrated Annual Report 2025/26. Check figures against the full report.",M,PH-9);
  doc.text(String(page),PW-M,PH-9,{align:"right"});
  y=28;
 }
 function newPage(){doc.addPage();page++;chrome();}
 function need(h){if(y+h>PH-18)newPage();}
 const P={
  para(t){font(10);ink(COL.navy);const ls=doc.splitTextToSize(t,CW);need(ls.length*5+3);doc.text(ls,M,y+4,{lineHeightFactor:1.45});y+=ls.length*5.1+4;},
  note(t){font(8.5,"italic");ink(COL.muted);const ls=doc.splitTextToSize(t,CW);need(ls.length*4+2);doc.text(ls,M,y+3);y+=ls.length*4.2+3;},
  sub(t){need(12);font(10.5,"bold");ink(COL.deep);doc.text(t.toUpperCase(),M,y+5);y+=9;},
  bullets(list){font(10);list.forEach(t=>{const ls=doc.splitTextToSize(t,CW-7);need(ls.length*5+2);fill(COL.blue);doc.circle(M+1.6,y+2.8,.9,"F");ink(COL.navy);doc.text(ls,M+6,y+4,{lineHeightFactor:1.45});y+=ls.length*5.1+2;});y+=2;},
  kpis(items){const cols=3,g=4,w=(CW-g*(cols-1))/cols,h=21;
   for(let r=0;r<items.length;r+=cols){need(h+4);items.slice(r,r+cols).forEach((k,i)=>{const x=M+i*(w+g);fill(COL.mist);doc.roundedRect(x,y,w,h,3,3,"F");
    font(7.5);ink(COL.muted);doc.text(k[0],x+4,y+6);font(13,"bold");ink(COL.navy);doc.text(doc.splitTextToSize(k[1],w-8)[0],x+4,y+13.5);
    if(k[2]){const up=!k[2].startsWith("-");font(7.5,"bold");ink(up?COL.green:COL.red);doc.text(k[2]+" YoY",x+4,y+18.3);}});y+=h+g;}y+=2;},
  table(head,rows,frac){const ws=frac.map(f=>f*CW);
   const isNum=s=>/^[\d(+\-.,%\s/x]+$/.test(String(s).replace(/Rs\.|Mn|Bn/g,""))&&/\d/.test(String(s));
   const numCol=head.map((_,i)=>i>0&&ws.length>2&&rows.every(r=>!r[i]||isNum(r[i])));
   const row=(cells,hd,alt)=>{font(hd?7.8:9,hd?"bold":"normal");const ls=cells.map((c,i)=>doc.splitTextToSize(String(c),ws[i]-4));const h=Math.max(...ls.map(l=>l.length))*4.3+3;
    if(y+h>PH-18){newPage();if(!hd)row(head,true);}
    font(hd?7.8:9,hd?"bold":"normal");
    if(hd){fill(COL.navy);doc.rect(M,y,CW,h,"F");}else if(alt){fill(COL.mist);doc.rect(M,y,CW,h,"F");}
    let x=M;ls.forEach((l,i)=>{ink(hd?COL.white:COL.navy);
     if(numCol[i])doc.text(l,x+ws[i]-2,y+4.8,{align:"right"});else doc.text(l,x+2,y+4.8);x+=ws[i];});y+=h;};
   need(16);row(head,true);rows.forEach((r,i)=>row(r,false,i%2));y+=5;},
  vbars(title,labels,vals){const h=58;need(h+12);P.sub(title);const top=Math.max(...vals)*1.15,ch=h-14,bw=CW/labels.length;
   stroke(COL.line);doc.setLineWidth(.2);for(let i=0;i<=4;i++){const yy=y+ch-ch*i/4;doc.line(M,yy,PW-M,yy);}
   vals.forEach((v,i)=>{const bh=ch*v/top,x=M+bw*i+bw*.25,last=i===vals.length-1;fill(last?COL.deep:COL.sky);doc.roundedRect(x,y+ch-bh,bw*.5,bh,1.5,1.5,"F");
    font(8.5,"bold");ink(COL.navy);doc.text(v.toLocaleString("en-US"),x+bw*.25,y+ch-bh-2,{align:"center"});font(8);ink(COL.muted);doc.text(labels[i],x+bw*.25,y+ch+5,{align:"center"});});
   y+=h;},
  hbars(title,items){const rh=8;need(items.length*rh+14);P.sub(title);const max=Math.max(...items.map(i=>i[1])),lw=46,bwMax=CW-lw-26;
   items.forEach(it=>{font(9);ink(COL.navy);doc.text(it[0],M,y+5);fill(COL.mist);doc.roundedRect(M+lw,y+1.2,bwMax,5,2.5,2.5,"F");fill(it[2]);doc.roundedRect(M+lw,y+1.2,Math.max(2,bwMax*it[1]/max),5,2.5,2.5,"F");
    font(9,"bold");doc.text(it[1].toLocaleString("en-US"),PW-M,y+5,{align:"right"});y+=rh;});y+=4;},
  stack(title,items){need(30);P.sub(title);let x=M;items.forEach(it=>{const w=CW*it[1]/100;fill(it[2]);doc.rect(x,y,w,9,"F");x+=w;});y+=14;
   let lx=M;font(8.5);items.forEach(it=>{const t=`${it[0]} ${it[1].toFixed(1)}%`,w=doc.getTextWidth(t)+10;if(lx+w>PW-M){lx=M;y+=6;}fill(it[2]);doc.rect(lx,y-2.8,3.2,3.2,"F");ink(COL.navy);doc.text(t,lx+5,y);lx+=w;});y+=8;},
  quote(t,by){font(13,"bolditalic");const ls=doc.splitTextToSize("“"+t+"”",CW-10);need(ls.length*6.5+12);fill(COL.brass);doc.rect(M,y,1.6,ls.length*6.5+7,"F");ink(COL.deep);doc.text(ls,M+6,y+5,{lineHeightFactor:1.4});y+=ls.length*6.5+2;font(8.5);ink(COL.muted);doc.text(by,M+6,y+3);y+=10;},
  timeline(items){items.forEach(([yr,t])=>{const ls=doc.splitTextToSize(t,CW-26);need(ls.length*5+5);fill(COL.blue);doc.circle(M+2,y+3,1.6,"F");stroke(COL.line);doc.setLineWidth(.4);doc.line(M+2,y+5,M+2,y+ls.length*5+5);
   font(11,"bold");ink(COL.navy);doc.text(yr,M+7,y+4.5);font(9.5);doc.text(ls,M+24,y+4.3,{lineHeightFactor:1.4});y+=ls.length*5+5;});y+=2;}
 };
 /* cover */
 fill(COL.navy);doc.rect(0,0,PW,PH,"F");
 fill([19,48,78]);doc.circle(PW+10,40,90,"F");fill(COL.deep);doc.circle(-20,PH+5,70,"F");
 if(logoW)doc.addImage(logoW.url,"PNG",M,22,52,52*logoW.h/logoW.w);
 font(9,"bold");ink([192,138,52]);doc.text("INTEGRATED ANNUAL REPORT 2025/26",M,82);
 font(34,"bold");ink(COL.white);doc.text("Your custom",M,98);doc.text("summary",M,112);
 font(12);ink([185,200,212]);doc.text("Navigating complexity with confidence",M,123);
 font(9,"bold");ink([143,180,255]);doc.text(`${picks.length} SECTION${picks.length>1?"S":""} SELECTED`,M,142);
 let cy=150;picks.forEach((p,i)=>{if(cy>PH-58)return;font(10.5);ink(COL.white);doc.text(`${String(i+1).padStart(2,"0")}   ${p.t}`,M,cy);ink([143,166,184]);doc.text("p."+p.p,PW-M,cy,{align:"right"});stroke([46,74,98]);doc.setLineWidth(.2);doc.line(M,cy+2.6,PW-M,cy+2.6);cy+=8;});
 if(picks.length&&cy>PH-58){font(9,"italic");ink([143,166,184]);doc.text("…and more inside",M,cy);}
 if(face){fill(COL.white);doc.circle(M+9,PH-30,10,"F");doc.addImage(face.url,"PNG",M+0.5,PH-38.5,17,17);}
 font(10,"bold");ink(COL.white);doc.text("Prepared with Aria, your report guide",M+24,PH-31.5);
 font(8.5);ink([143,166,184]);doc.text("Generated "+new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})+" from the Aitken Spence PLC Annual Report 2025/26 microsite.",M+24,PH-26);
 /* sections */
 picks.forEach((p,i)=>{
  if(i===0){doc.addPage();page++;chrome();}else{need(60);if(y>40)y+=6;}
  font(8,"bold");ink(COL.brass);doc.text(`SECTION ${i+1}  |  REPORT PAGE ${p.p}`,M,y+3);
  font(19,"bold");ink(COL.navy);doc.text(p.t,M,y+12);fill(COL.blue);doc.rect(M,y+15,16,1.2,"F");y+=22;
  (SUM[p.t]||(P=>P.para("A summary of this chapter is not available on the microsite. Read it in the full report.")))(P);
  need(8);font(9,"bold");ink(COL.blue);doc.textWithLink(`Read the full chapter on p.${p.p} of the report  >`,M,y+3,{url:`${PDFURL}#page=${p.p+1}`});y+=10;
 });
 return doc.output("blob");
}

/* wire the button */
const dlBtn=document.getElementById("dlBtn"),dlMsg=document.getElementById("dlMsg");
const standalone=!window.claude;/* hosted outside Claude: use a normal browser download */
let downloadsApi;const dlReady=(async()=>{if(standalone){downloadsApi={save:async({filename,data})=>{const u=URL.createObjectURL(data),a=document.createElement("a");a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);return{status:"saved"};}};return;}
 try{downloadsApi=await window.claude.use("downloads");}catch(e){downloadsApi=null;}if(!downloadsApi){dlMsg.textContent="Downloads aren't available in this view. Use Open full PDF instead.";dlBtn.hidden=true;}})();
dlBtn.addEventListener("click",async()=>{
 const picks=[...document.querySelectorAll("#chapters input:checked")].map(i=>({t:i.dataset.t,p:+i.dataset.p})).sort((a,b)=>a.p-b.p);
 if(!picks.length){dlMsg.textContent="Tick at least one chapter first.";return;}
 if(!window.jspdf){dlMsg.textContent="The PDF tool didn't load. Reload the page and try again.";return;}
 dlBtn.disabled=true;dlMsg.textContent="Building your summary…";
 try{
  const blob=await buildSummary(picks);
  if(downloadsApi===undefined)await dlReady;
  if(!downloadsApi){dlMsg.textContent="Downloads aren't available in this view.";return;}
  dlMsg.textContent=standalone?"Downloading…":"Confirm the download to save your PDF.";
  await downloadsApi.save({filename:"Aitken-Spence-AR-2025-26-summary.pdf",data:blob});
  dlMsg.textContent=`Saved: ${picks.length} section${picks.length>1?"s":""}.`;
 }catch(err){
  const c=err&&err.code;
  dlMsg.textContent=c==="declined"?"Download cancelled.":c==="rate_limited"?"A download prompt is already open. Finish it, then try again.":c==="too_large"?"That file is too large. Pick fewer chapters and try again.":(c?"Downloads aren't available in this view.":"Something went wrong building the PDF. Try again.");
  if(!c)console.error(err);
 }finally{dlBtn.disabled=false;}
});

})();
