(()=>{
"use strict";
const D=window.LIFE, N=D.length, HUMAN=1.7, CMP=window.CMP;
const $=id=>document.getElementById(id);
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const T={
 he:{dir:"rtl",title:"גודל אמיתי",list:"רשימת כל היצורים",tour:"סיור אוטומטי",stop:"עצירת הסיור",rand:"יצור אקראי",info:"הצגה או הסתרה של פרטים",
  lang:"Switch to English",first:"לקטן ביותר, חזרה להתחלה",last:"לגדול ביותר, קפיצה לסוף",prev:"הקודם",next:"הבא",close:"סגירה",
  listT:"כולם לפי גודל",pickT:"בחירת יצור להשוואה",src:"מקור הנתון",
  cmp:"תצוגת השוואה בקנה מידה אמיתי",cmpexit:"חזרה לתצוגה רגילה",swap:"החלפה בין השניים",partner:"בחירת יצור להשוואה",
  bld:"מבנה",
  kind:{length:"אורך",height:"גובה",shoulder:"גובה כתפיים",diameter:"קוטר"},
  credit:"נוצר על ידי יעקב המאירי בעזרת נועה. האיורים נוצרו בבינה מלאכותית; בתצוגה הרגילה הם אינם בקנה מידה זה לזה.",
  cnote:"האיורים משוערים; היחס מחושב לפי הגדלים בנתונים.",
  skip:"דילוג לפרטי היצור",of:"מתוך",
  u:{um:"מיקרומטר",mm:"מ״מ",cm:"ס״מ",m:"מ׳"},
  bigger:x=>`פי ${x} גדול מאדם`,smaller:x=>`פי ${x} קטן מאדם`,me:"נקודת ההשוואה: אדם",
  prevc:x=>`פי ${x} מהקודם`,
  ratio:(a,b,x)=>`${a} : ${b} = 1 : ${x}`,
  mag:"הדמות הקטנה מוצגת בנקודה, בגודל האמיתי שלה, ובהגדלה בעיגול",
  pos:(i,n)=>`${i} מתוך ${n}`},
 en:{dir:"ltr",title:"Real Size",list:"List of everything",tour:"Auto tour",stop:"Stop the tour",rand:"Random pick",info:"Show or hide details",
  lang:"מעבר לעברית",first:"To the smallest, back to the start",last:"To the largest, jump to the end",prev:"Previous",next:"Next",close:"Close",
  listT:"Everything by size",pickT:"Pick something to compare",src:"Source for this size",
  cmp:"True-scale comparison view",cmpexit:"Back to normal view",swap:"Swap the two",partner:"Choose what to compare with",
  bld:"Structure",
  kind:{length:"Length",height:"Height",shoulder:"Shoulder height",diameter:"Diameter"},
  credit:"Created by Yaakov Hameiri with Noa. Illustrations are AI-generated; in the normal view they are not to scale with each other.",
  cnote:"Illustrations are approximate; the ratio is computed from the listed sizes.",
  skip:"Skip to the details",of:"of",
  u:{um:"µm",mm:"mm",cm:"cm",m:"m"},
  bigger:x=>`${x}× bigger than a human`,smaller:x=>`${x}× smaller than a human`,me:"Reference point: a human",
  prevc:x=>`${x}× the previous one`,
  ratio:(a,b,x)=>`${a} : ${b} = 1 : ${x}`,
  mag:"The smaller one is drawn as a true-size dot, magnified in the circle",
  pos:(i,n)=>`${i} of ${n}`}
};
const ICON={
 first:'<path d="M6 5v14M18 6l-6 6 6 6M12 6l-6 6 6 6" transform="translate(2 0)"/>',
 last:'<path d="M18 5v14M6 6l6 6-6 6M12 6l6 6-6 6" transform="translate(-2 0)"/>',
 next:'<path d="M9 5l7 7-7 7"/>', prev:'<path d="M15 5l-7 7 7 7"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
 play:'<path d="M7 5l12 7-12 7z"/>', pause:'<path d="M8 5v14M16 5v14"/>',
 rand:'<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',
 cmp:'<path d="M6.5 20V10M12 20V4M17.5 20v-6"/><path d="M3.5 20h17"/>',
 swap:'<path d="M8 7h12m0 0l-3.5-3.5M20 7l-3.5 3.5M16 17H4m0 0l3.5-3.5M4 17l3.5 3.5"/>',
 partner:'<circle cx="9" cy="7.5" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M18.5 8v6M15.5 11h6"/>'
};
const svg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON[k]}</svg>`;
let lang=localStorage.getItem("rs-lang")||"he", i=0, tour=null, busy=false;
let cmpOn=false, partner="human", pickMode=false;
const hashId=()=>decodeURIComponent(location.hash.slice(1));
{const k=D.findIndex(d=>d.id===hashId()); if(k>=0)i=k;}
const nf=(x,max=1)=>new Intl.NumberFormat(lang==="he"?"he-IL":"en-US",{maximumFractionDigits:max}).format(x);
function sizeText(m){const u=T[lang].u;
 if(m<1e-3)return nf(m*1e6,0)+" "+u.um; if(m<0.02)return nf(m*1e3,1)+" "+u.mm;
 if(m<1)return nf(m*100,1)+" "+u.cm; return nf(m,1)+" "+u.m;}
function ratioText(r){if(r>=100){const p=Math.pow(10,Math.floor(Math.log10(r))-1);return nf(Math.round(r/p)*p,0)}return r>=10?nf(Math.round(r),0):nf(Math.round(r*10)/10,1)}
function icons(){
 const set=(id,k)=>$(id).insertAdjacentHTML("afterbegin",svg(k));
 set("bList","list");set("bRand","rand");set("bInfo","info");set("bLang","globe");set("bClose","close");
 set("bFirst","first");set("bLast","last");set("bPrev","prev");set("bNext","next");set("bCmp","cmp");
 set("bSwap","swap");set("bPartner","partner");
 $("bTour").innerHTML=svg("play");
 $("bFirst").classList.add("dirsvg");$("bLast").classList.add("dirsvg");
}
const LMIN=Math.log10(D[0].size), LMAX=Math.log10(D[N-1].size);
function buildRuler(){const r=$("ruler");D.forEach((d,k)=>{const e=document.createElement("i");
 if(d.b)e.className="b";
 e.style.insetInlineStart=((Math.log10(d.size)-LMIN)/(LMAX-LMIN)*100)+"%";e.dataset.k=k;r.appendChild(e);});}
function labels(){
 const t=T[lang];const h=document.documentElement;h.lang=lang;h.dir=t.dir;document.title=t.title;
 $("title").textContent=t.title;$("skip").textContent=t.skip;
 const L=(id,txt)=>{const b=$(id);b.setAttribute("aria-label",txt);b.title=txt;};
 L("bList",t.list);L("bRand",t.rand);L("bInfo",t.info);L("bLang",t.lang);L("bClose",t.close);
 L("bFirst",t.first);L("bLast",t.last);L("bPrev",t.prev);L("bNext",t.next);L("bTour",tour?t.stop:t.tour);
 L("bCmp",cmpOn?t.cmpexit:t.cmp);L("bSwap",t.swap);L("bPartner",t.partner);
 $("bCmp").setAttribute("aria-pressed",String(cmpOn));
 $("bLang").querySelector(".code").textContent=lang==="he"?"EN":"עב";
 $("credit").textContent=t.credit;$("src").textContent=t.src;$("dlgT").textContent=pickMode?t.pickT:t.listT;
 $("stage").setAttribute("aria-label",t.title);$("cmpNote").textContent=t.cnote;
 const ol=$("list");ol.innerHTML="";
 D.forEach((d,k)=>{const li=document.createElement("li"),b=document.createElement("button");b.type="button";
  b.innerHTML=`<img alt="" src="img/${IMGFILE[d.id]}"><span><b></b><small></small></span>`;
  if(d.b)b.classList.add("bld");
  b.querySelector("b").textContent=d[lang].n;b.querySelector("small").textContent=sizeText(d.size)+(d.b?" · "+t.bld:"");
  if(k===i&&!pickMode)b.setAttribute("aria-current","true");
  b.onclick=()=>{if(pickMode){partner=d.id;pickMode=false;$("dlg").close();labels();renderCmp();}
   else{$("dlg").close();go(k,true)}};li.appendChild(b);ol.appendChild(li);});
}
function fill(){
 const d=D[i],t=T[lang],x=d[lang];
 $("kind").textContent=t.kind[d.m];$("name").textContent=x.n;$("size").textContent=sizeText(d.size);
 $("fact").textContent=x.f;$("src").href=d.src;
 const ch=$("chips");ch.innerHTML="";const add=(s,c)=>{const e=document.createElement("span");e.className="chip"+(c?" "+c:"");e.textContent=s;ch.appendChild(e)};
 if(d.b)add(t.bld,"bld");
 add(x.r);
 if(d.id==="human")add(t.me);else{const r=d.size/HUMAN;add(r>1?t.bigger(ratioText(r)):t.smaller(ratioText(1/r)));}
 if(i>0)add(t.prevc(ratioText(d.size/D[i-1].size)));
 $("count").innerHTML="<bdi dir=\"ltr\"></bdi>";$("count").firstChild.textContent=`${nf(i+1,0)} / ${nf(N,0)}`;
 $("bFirst").disabled=i===0;$("bPrev").disabled=i===0;$("bNext").disabled=i===N-1;$("bLast").disabled=i===N-1;
 document.querySelectorAll("#ruler i").forEach(e=>e.classList.toggle("on",+e.dataset.k===i));
 document.querySelectorAll("#list button").forEach((b,k)=>k===i?b.setAttribute("aria-current","true"):b.removeAttribute("aria-current"));
 const img=$("img");img.src="img/"+IMGFILE[d.id];img.alt=x.n+", "+sizeText(d.size);
 $("live").textContent=`${x.n}. ${t.kind[d.m]} ${sizeText(d.size)}. ${t.pos(i+1,N)}`;
 history.replaceState(null,"","#"+d.id);
 if(cmpOn)renderCmp();
}
function go(k,user){
 k=Math.max(0,Math.min(N-1,k));if(k===i||busy)return;if(user&&tour)toggleTour(false);
 if(cmpOn){i=k;fill();return;}
 const old=i,art=$("art");const up=k>old;
 const ratio=Math.max(.12,Math.min(8,D[old].size/D[k].size));
 i=k;
 if(reduce){fill();return;}
 busy=true;
 const out=art.animate([{transform:"scale(1)",opacity:1,filter:"blur(0)"},{transform:`scale(${Math.max(.2,Math.min(1,ratio))*(up?1:1.6)})`,opacity:0,filter:"blur(6px)"}],{duration:260,easing:"cubic-bezier(.5,0,.8,.4)",fill:"forwards"});
 out.onfinish=()=>{fill();const inc=Math.max(.3,Math.min(3,1/ratio));
  const a=art.animate([{transform:`scale(${up?Math.min(2.6,inc):.4})`,opacity:0,filter:"blur(8px)"},{transform:"scale(1)",opacity:1,filter:"blur(0)"}],{duration:480,easing:"cubic-bezier(.22,.8,.24,1)",fill:"both"});
  out.cancel();a.onfinish=()=>{a.cancel();busy=false};};
 const c=$("card");c.animate([{opacity:1},{opacity:0,offset:.35},{opacity:0,offset:.5},{opacity:1}],{duration:740,easing:"ease"});
}
function toggleTour(on){
 if(on===undefined)on=!tour;
 if(on){tour=setInterval(()=>{if(i>=N-1)go(0);else go(i+1)},4200);if(i>=N-1)go(0);}
 else{clearInterval(tour);tour=null;}
 $("bTour").innerHTML=svg(tour?"pause":"play");$("bTour").setAttribute("aria-pressed",String(!!tour));
 $("bTour").setAttribute("aria-label",T[lang][tour?"stop":"tour"]);$("bTour").title=T[lang][tour?"stop":"tour"];
}
function toggleCmp(on){
 if(on===undefined)on=!cmpOn;
 cmpOn=on;if(on&&tour)toggleTour(false);
 if(on&&partner===D[i].id)partner=D[i].id==="human"?"blue":"human";
 $("cmp").hidden=!on;$("stage").classList.toggle("cmpon",on);
 labels();
 if(on)renderCmp();
}
function figGeom(d,S,halfW,maxH){
 const c=CMP[d.id],cont=c.f*(c.k||1),cpx=d.size*S;
 let iw,ih;if(c.d==="y"){ih=cpx/cont;iw=ih}else{iw=cpx/cont;ih=iw}
 return{c,cont,cpx,iw,ih,tiny:cpx<34};
}
function renderCmp(){
 const t=T[lang],A=D[i];
 let B=D.find(d=>d.id===partner);if(!B||B===A){B=D.find(d=>d.id==="human");partner=B.id===A.id?"blue":B.id;}
 if(B===A){B=D.find(d=>d.id==="blue");partner="blue";}
 const box=$("stage"),W=box.clientWidth,H=box.clientHeight;
 const groundY=Math.round(H*0.76),maxH=H*0.62,halfW=W/2;
 let S=Math.min(...[A,B].map(d=>CMP[d.id].d==="y"?maxH/d.size:(halfW*0.84)/d.size));
 const gA=figGeom(A,S,halfW,maxH),gB=figGeom(B,S,halfW,maxH);
 const rtl=t.dir==="rtl";
 const xA=rtl?W*0.72:W*0.28, xB=rtl?W*0.28:W*0.72;
 $("cmpGround").style.top=groundY+"px";
 const place=(fig,d,g,x)=>{
  const el=$(fig),im=el.querySelector("img"),dot=el.querySelector(".dot");
  el.style.top="";el.style.width="";
  if(g.tiny){
   im.style.display="none";dot.style.display="block";
   const dp=Math.max(2.5,g.cpx);
   dot.style.width=dp+"px";dot.style.height=dp+"px";
   dot.style.left=(x-dp/2)+"px";dot.style.top=(groundY-dp)+"px";
  }else{
   im.style.display="block";dot.style.display="none";
   im.style.width=g.iw+"px";im.style.height=g.ih+"px";
   im.style.left=(x-g.iw/2)+"px";im.style.top=(groundY-(1-g.c.bo)*g.ih)+"px";
  }
  im.src="img/"+IMGFILE[d.id];im.alt=d[lang].n;
  const cap=el.querySelector(".cap");
  cap.style.left=(x-80)+"px";cap.style.top=(groundY+8)+"px";
  cap.querySelector("b").textContent=d[lang].n;
  cap.querySelector("small").textContent=sizeText(d.size);
 };
 place("figA",A,gA,xA);place("figB",B,gB,xB);
 // magnifier bubble for a tiny figure
 const mag=$("mag"),tinyG=gA.tiny?{d:A,g:gA,x:xA}:gB.tiny?{d:B,g:gB,x:xB}:null;
 if(tinyG){
  mag.hidden=false;
  const R=Math.min(120,W*0.3),sc=(R*0.72)/tinyG.g.cpx;
  const mw=tinyG.g.iw*sc,mh=tinyG.g.ih*sc;
  const mx=Math.min(Math.max(tinyG.x,R/2+6),W-R/2-6);
  const my=Math.max(groundY-24-R,R/2+8);
  mag.style.width=R+"px";mag.style.height=R+"px";
  mag.style.left=(mx-R/2)+"px";mag.style.top=(my-R/2)+"px";
  const mi=mag.querySelector("img");
  mi.src="img/"+IMGFILE[tinyG.d.id];mi.alt="";
  mi.style.width=mw+"px";mi.style.height=mh+"px";
  mi.style.left=(R/2-mw/2)+"px";mi.style.top=(R/2-mh/2)+"px";
  const ln=$("magLine");
  ln.style.left=(tinyG.x-1)+"px";ln.style.width="2px";
  ln.style.top=(my+R/2)+"px";ln.style.height=Math.max(4,groundY-(my+R/2))+"px";
  ln.style.transform="";
 }else{mag.hidden=true;$("magLine").style.height="0";}
 // ratio line: smaller : larger = 1 : N
 const small=A.size<=B.size?A:B, big=A.size<=B.size?B:A;
 $("cmpRatio").textContent=t.ratio(small[lang].n,big[lang].n,ratioText(big.size/small.size));
 // scale bar: largest nice length that fits 26% of width
 const barMax=W*0.26;let len=0;
 for(let e=-6;e<=3;e++)for(const m of[1,2,5]){const v=m*Math.pow(10,e);if(v*S<=barMax&&v>len)len=v;}
 const bar=$("cmpBar");
 if(len>0){bar.hidden=false;bar.querySelector("i").style.width=(len*S)+"px";
  bar.querySelector("b").textContent=sizeText(len);}else bar.hidden=true;
 $("cmp").setAttribute("aria-label",`${t.ratio(small[lang].n,big[lang].n,ratioText(big.size/small.size))}. ${tinyG?t.mag:""}`);
 $("live").textContent=`${A[lang].n} ${sizeText(A.size)}, ${B[lang].n} ${sizeText(B.size)}. ${$("cmpRatio").textContent}`;
}
const step=(dx)=>go(i+dx,true);
$("bNext").onclick=()=>step(1);$("bPrev").onclick=()=>step(-1);
$("bFirst").onclick=()=>go(0,true);$("bLast").onclick=()=>go(N-1,true);
$("bRand").onclick=()=>{let k;do{k=Math.floor(Math.random()*N)}while(k===i);go(k,true)};
$("bTour").onclick=()=>toggleTour();
$("bCmp").onclick=()=>toggleCmp();
$("bSwap").onclick=()=>{const pi=D.findIndex(d=>d.id===partner);if(pi<0)return;partner=D[i].id;i=pi;fill();};
$("bPartner").onclick=()=>{pickMode=true;labels();$("dlg").showModal();
 const c=$("list").querySelector('[aria-current="true"]');c&&c.scrollIntoView({block:"center"})};
$("bList").onclick=()=>{pickMode=false;labels();$("dlg").showModal();const c=$("list").querySelector('[aria-current="true"]');c&&c.scrollIntoView({block:"center"})};
$("bClose").onclick=()=>{pickMode=false;$("dlg").close()};
$("dlg").addEventListener("click",e=>{if(e.target===$("dlg")){pickMode=false;$("dlg").close()}});
$("bInfo").onclick=()=>{const on=document.body.classList.toggle("min");$("bInfo").setAttribute("aria-pressed",String(!on));};
$("bLang").onclick=()=>{lang=lang==="he"?"en":"he";localStorage.setItem("rs-lang",lang);labels();fill();};
addEventListener("keydown",e=>{if($("dlg").open||e.altKey||e.ctrlKey||e.metaKey)return;
 const rtl=T[lang].dir==="rtl",k=e.key;
 if(k==="ArrowRight")step(rtl?-1:1);else if(k==="ArrowLeft")step(rtl?1:-1);
 else if(k==="ArrowDown")step(1);else if(k==="ArrowUp")step(-1);
 else if(k==="Home"){e.preventDefault();go(0,true)}else if(k==="End"){e.preventDefault();go(N-1,true)}});
{const s=$("stage");let x0=null,y0=0;
 s.addEventListener("pointerdown",e=>{x0=e.clientX;y0=e.clientY});
 s.addEventListener("pointerup",e=>{if(x0===null)return;const dx=e.clientX-x0,dy=e.clientY-y0;x0=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3){const rtl=T[lang].dir==="rtl";step((dx<0)!==rtl?1:-1);}});
 s.addEventListener("pointercancel",()=>x0=null);}
addEventListener("resize",()=>{if(cmpOn)renderCmp()});
D.forEach(d=>{const p=new Image();p.src="img/"+IMGFILE[d.id]});icons();buildRuler();labels();fill();
})();
