/* GLOBAL JS — font manage + basic effects */
/* Put font files in assets/fonts/ and edit only the paths below. */
const FONTS = {
  title:{ name:"font-title", family:"FontTitle", file:"assets/fonts/font-title.ttf", weight:"400 800", fallback:"Helvetica Neue, Arial, sans-serif" },
  sub:  { name:"font-sub",   family:"FontSub",   file:"assets/fonts/font-sub.ttf",   weight:"400 500", fallback:"Helvetica Neue, Arial, sans-serif" }
};
const FontManage = { init(){ Object.values(FONTS).forEach(f=>{
  document.documentElement.style.setProperty("--"+f.name, `"${f.family}", ${f.fallback}`);
  new FontFace(f.family, `url(${f.file}) format("truetype")`, {weight:f.weight, display:"swap"}).load()
    .then(ff=>document.fonts.add(ff)).catch(()=>console.warn("Font not found:",f.file)); }); } };
const Effects = {
  reveal(){ const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
    document.querySelectorAll(".reveal").forEach(el=>io.observe(el)); },
  clock(){ const t=document.querySelector("[data-time]"); if(!t) return;
    const tick=()=>t.textContent=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false}); tick(); setInterval(tick,30000); },
  filters(){ const btns=document.querySelectorAll("[data-filter]"); btns.forEach(b=>b.onclick=()=>{
    btns.forEach(x=>x.classList.toggle("on",x===b));
    document.querySelectorAll(".card[data-cat]").forEach(c=>c.hidden=!(b.dataset.filter==="all"||c.dataset.cat===b.dataset.filter)); }); },
  accordion(){ document.querySelectorAll(".step").forEach(s=>s.onclick=()=>{ const o=s.classList.toggle("open"); s.querySelector("i").textContent=o?"–":"+"; }); },
  copyEmail(){ document.querySelectorAll("[data-copy]").forEach(a=>a.onclick=e=>{ e.preventDefault(); navigator.clipboard?.writeText(a.dataset.copy);
    const h=document.querySelector("[data-copy-hint]"); if(h){h.textContent="Copied!"; setTimeout(()=>h.textContent="Click the address to copy it.",1500);} }); },
  pixels(){ const p=document.querySelector(".pixels"); if(!p) return; for(let i=0;i<64;i++) p.appendChild(document.createElement("b"));
    setInterval(()=>p.querySelectorAll("b").forEach(b=>b.style.opacity=Math.random()>.6?1:0),700); },
  loadMore(){ const b=document.querySelector("[data-more]"); if(b) b.onclick=()=>{document.querySelectorAll(".row.extra").forEach(r=>r.hidden=false); b.remove();}; }
};
document.addEventListener("DOMContentLoaded",()=>{ FontManage.init(); Object.values(Effects).forEach(f=>f()); });
