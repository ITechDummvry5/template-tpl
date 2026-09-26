/* CARD DATA */
/* baseX/baseY are scatter offsets in px, phase spaces cards evenly through the loop */
const cards = [
  { src: "", baseX:   0, baseY:   0 },
  { src: "", baseX: -90, baseY: -60 },
  { src: "", baseX:  110, baseY: -30 },
  { src: "", baseX: -60, baseY:  110 },
  { src: "", baseX:  130, baseY:  90 },
  { src: "", baseX:   20, baseY: -140 },
  { src: "", baseX: -150, baseY:  30 },
  { src: "", baseX:  180, baseY: -110 },
];
/* EXPLANATION: swap each empty src with your own image path to replace the placeholder pattern */

/* BUILD CARD ELEMENTS */
const layer = document.getElementById("cardLayer");
const cardEls = cards.map(buildCard);

function buildCard(data){
  const el = document.createElement("div");
  el.className = "card";
  el.dataset.baseX = data.baseX;
  el.dataset.baseY = data.baseY;
  if (data.src) {
    const img = document.createElement("img");
    img.src = data.src;
    el.appendChild(img);
  }
  layer.appendChild(el);
  return el;
}
/* EXPLANATION: each card is created once from the cards array */

/* AUTOPLAY BACKWARD LOOP */
const CYCLE_MS   = 5000;  // time for one card to travel front-to-back
const MAX_Z      = 520;   // how far back a card travels, in px
const SCALE_NEAR = 1.15;  // size when a card is up front
const SCALE_FAR  = 0.45;  // size when a card has receded
const SPREAD_NEAR= 0.4;   // scatter offset multiplier up front (tight)
const SPREAD_FAR = 1.5;   // scatter offset multiplier receded (wide)
const FADE_IN    = 0.15;  // fraction of cycle spent fading in
const FADE_OUT   = 0.15;  // fraction of cycle spent fading out

function lerp(a, b, t){ return a + (b - a) * t; }

function opacityEnvelope(p){
  if (p < FADE_IN) return p / FADE_IN;
  if (p > 1 - FADE_OUT) return (1 - p) / FADE_OUT;
  return 1;
}

function renderFrame(timeMs){
  const n = cardEls.length;
  cardEls.forEach(function(el, i){
    const phase = i / n;
    const p = ((timeMs / CYCLE_MS) + phase) % 1; // 0 = just spawned (front), 1 = fully receded
    applyDepthTransform(el, p);
  });
  requestAnimationFrame(renderFrame);
}

function applyDepthTransform(el, p){
  const baseX = Number(el.dataset.baseX);
  const baseY = Number(el.dataset.baseY);

  const spread = lerp(SPREAD_NEAR, SPREAD_FAR, p);
  const x = baseX * spread;
  const y = baseY * spread;
  const z = -p * MAX_Z;
  const scale = lerp(SCALE_NEAR, SCALE_FAR, p);
  const opacity = opacityEnvelope(p);

  el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
  el.style.opacity = opacity;
  el.style.zIndex = Math.round((1 - p) * 1000);
}
/* EXPLANATION: each card loops p 0→1 forever, offset by its phase so they overlap —
   fades + scales up at spawn (p near 0), travels backward shrinking (p rising),
   fades out as it fully recedes (p near 1), then instantly restarts at 0 */

requestAnimationFrame(renderFrame);
