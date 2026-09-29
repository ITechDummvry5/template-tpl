(() => {
  const DEFAULTS = { deep:'#0f0024', mid:'#6b0d9e', glow:'#f21a99', speed:1, density:1, height:.85, scale:.6 };

  const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  const FS = `
  precision highp float;
  uniform vec2 r; uniform float t;
  uniform vec3 cD, cM, cG; uniform float dens, hgt;

  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){
    vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y);
  }
  float fbm(vec2 p){
    float v=0., a=.5; mat2 R=mat2(.8,-.6,.6,.8);
    for(int i=0;i<6;i++){ v+=a*n(p); p=R*p*2.02+vec2(1.7,9.2); a*=.5; }
    return v;
  }
  void main(){
    vec2 uv = gl_FragCoord.xy / r;
    vec2 p  = uv * vec2(r.x/r.y, 1.) * 2.4;
    float T = t * .06;

    vec2 q = vec2(fbm(p + vec2(0., -T*2.)), fbm(p + vec2(5.2, 1.3) + T));
    vec2 w = vec2(fbm(p + 3.*q + vec2(1.7, 9.2) + T*1.5),
                  fbm(p + 3.*q + vec2(8.3, 2.8) - T));
    float d = fbm(p + 3.*w - vec2(0., T*3.));

    float mask = smoothstep(hgt, 0., uv.y);
    float s = smoothstep(.22, .9, d) * (.55 + .9*w.x) * mask * dens * 1.5;
    s = clamp(s, 0., 1.);

    vec3 col = mix(cD*.25, cD, smoothstep(0.,.35,s));
    col = mix(col, cM, smoothstep(.2,.8,s));
    col += cG * pow(s,3.) * .55 * (1.-uv.y*.8);
    col *= 1. - .55*length(uv-.5);

    gl_FragColor = vec4(col, 1.);
  }`;

  const rgb = hex => {
    const v = parseInt(hex.replace('#','').padEnd(6,'0'), 16);
    return [(v>>16&255)/255, (v>>8&255)/255, (v&255)/255];
  };

  function mount(el) {
    if (el.__smoke) return;
    el.__smoke = true;

    const d = el.dataset;
    const o = {
      deep: d.smokeDeep || DEFAULTS.deep, mid: d.smokeMid || DEFAULTS.mid, glow: d.smokeGlow || DEFAULTS.glow,
      speed: +(d.smokeSpeed ?? DEFAULTS.speed), density: +(d.smokeDensity ?? DEFAULTS.density),
      height: +(d.smokeHeight ?? DEFAULTS.height), scale: +(d.smokeScale ?? DEFAULTS.scale)
    };

    const isRoot = el === document.body || el === document.documentElement;
    const cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = `position:${isRoot ? 'fixed' : 'absolute'};inset:0;width:100%;height:100%;` +
      'z-index:-1;display:block;pointer-events:none;border-radius:inherit';

    const cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    el.style.isolation = 'isolate';                       // keeps z-index:-1 inside this element
    if (!isRoot) el.style.overflow = el.style.overflow || 'hidden';
    if (cs.backgroundColor === 'rgba(0, 0, 0, 0)' && cs.backgroundImage === 'none') el.style.backgroundColor = '#05000a';
    el.prepend(cv);

    const gl = cv.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;                                      // no WebGL: element keeps its dark background

    const sh = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr); gl.useProgram(pr);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = n => gl.getUniformLocation(pr, n);
    const uR = U('r'), uT = U('t');
    gl.uniform3fv(U('cD'), rgb(o.deep));
    gl.uniform3fv(U('cM'), rgb(o.mid));
    gl.uniform3fv(U('cG'), rgb(o.glow));
    gl.uniform1f(U('dens'), o.density);
    gl.uniform1f(U('hgt'), o.height);

    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t0 = performance.now(), offset = 20, raf = 0, running = false;

    function resize() {
      const w = isRoot ? innerWidth : el.clientWidth, h = isRoot ? innerHeight : el.clientHeight;
      cv.width = Math.max(1, Math.round(w * o.scale));
      cv.height = Math.max(1, Math.round(h * o.scale));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uR, cv.width, cv.height);
      if (still) draw(performance.now());
    }
    function draw(now) {
      gl.uniform1f(uT, offset + (now - t0) / 1000 * o.speed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (running && !still) raf = requestAnimationFrame(draw);
    }
    function play()  { if (running) return; running = true; t0 = performance.now(); raf = requestAnimationFrame(draw); }
    function pause() { if (!running) return; running = false; cancelAnimationFrame(raf); offset += (performance.now() - t0) / 1000 * o.speed; }

    resize();
    if (isRoot) addEventListener('resize', resize); else new ResizeObserver(resize).observe(el);
    if (still) return draw(t0);

    // Only animate while visible (offscreen cards and hidden tabs cost nothing)
    let inView = true;
    const sync = () => (inView && !document.hidden) ? play() : pause();
    new IntersectionObserver(e => { inView = e[0].isIntersecting; sync(); }).observe(el);
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  const init = () => document.querySelectorAll('[data-smoke]').forEach(mount);
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
