
const ring = document.getElementById('ring');
const stage = document.getElementById('stage');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const N = 8;

const cards = [];
for(let i=0;i<N;i++){
  const c = document.createElement('div');
  c.className = 'card empty';
  c.textContent = 'Click or drop image';
  c.addEventListener('click', ()=>{ fileInput.dataset.target = i; fileInput.click(); });
  ring.appendChild(c);
  cards.push(c);
}

function setImage(index, src){
  const c = cards[index];
  c.className = 'card';
  c.innerHTML = `<img src="${src}" alt="">`;
}

function nextEmptySlot(){
  const i = cards.findIndex(c => c.classList.contains('empty'));
  return i === -1 ? 0 : i;
}

function loadFiles(files){
  [...files].forEach(file=>{
    if(!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => setImage(nextEmptySlot(), e.target.result);
    reader.readAsDataURL(file);
  });
}

fileInput.addEventListener('change', e=>{
  const target = fileInput.dataset.target;
  if(target !== undefined && e.target.files[0]){
    const reader = new FileReader();
    reader.onload = ev => setImage(+target, ev.target.result);
    reader.readAsDataURL(e.target.files[0]);
  }
  fileInput.value = '';
});

document.getElementById('addBtn').addEventListener('click', ()=>{
  fileInput.removeAttribute('data-target');
  fileInput.click();
});

['dragenter','dragover'].forEach(ev=>{
  stage.addEventListener(ev, e=>{ e.preventDefault(); dropzone.classList.add('active'); });
});
['dragleave','drop'].forEach(ev=>{
  stage.addEventListener(ev, e=>{ e.preventDefault(); if(ev==='drop'||e.target===stage) dropzone.classList.remove('active'); });
});
stage.addEventListener('drop', e=>{
  e.preventDefault();
  dropzone.classList.remove('active');
  loadFiles(e.dataTransfer.files);
});

let angle = 0;
let playing = true;
let last = performance.now();
const radiusX = 200;
const radiusZ = 140;

function layout(){
  const step = 360/N;
  cards.forEach((c,i)=>{
    const a = (angle + i*step) % 360;
    const rad = a*Math.PI/180;
    const x = Math.sin(rad)*radiusX;
    const z = Math.cos(rad)*radiusZ;
    const depth = (z+radiusZ)/(radiusZ*2);
    const scale = 0.65 + depth*0.5;
    c.style.transform = `translate3d(${x}px,0,${z}px) scale(${scale})`;
    c.style.opacity = (0.5 + depth*0.5).toFixed(2);
    c.style.zIndex = Math.round(depth*100);
  });
}

function tick(now){
  const dt = (now-last)/1000; last = now;
  if(playing) angle += 18*dt;
  layout();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

document.getElementById('playBtn').addEventListener('click', e=>{
  playing = !playing;
  e.target.textContent = playing ? '⏸ Pause' : '▶ Play';
});
