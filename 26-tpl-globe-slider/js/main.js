(() => {
  const stage = document.getElementById('stage');
  const ring = document.getElementById('ring');
  const cards = [...ring.querySelectorAll('.card')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- settings ---------- */
  const AUTO_SPIN  = 0.0022;  // idle yaw speed (rad/frame). 0 = no auto spin
  const DRAG_SPEED = 0.0065;  // radians per pixel dragged
  const FRICTION   = 0.95;    // inertia after release (closer to 1 = longer glide)
  const MAX_PITCH  = 1.25;    // how far the globe can tilt up/down (rad)

  /* ---------- state ---------- */
  let spread = 0;             // 0 -> 1 : globe grows out on load
  let yaw = 0.4, pitch = -0.25;
  let vYaw = 0, vPitch = 0;
  let dragging = false, dragMoved = 0, lastX = 0, lastY = 0;
  let hovered = null;

  const N = cards.length;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- place cards evenly on a sphere (Fibonacci lattice) ---------- */
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pts = cards.map((_, i) => {
    const y = 1 - (i + 0.5) / N * 2;
    const lat = Math.asin(y);
    const lon = i * golden;
    return { lat, lon, dir: [Math.sin(lon) * Math.cos(lat), -Math.sin(lat), Math.cos(lon) * Math.cos(lat)] };
  });

  /* ---------- spin: drag / flick ---------- */
  stage.addEventListener('pointerdown', e => {
    dragging = true;
    dragMoved = 0;
    lastX = e.clientX; lastY = e.clientY;
    vYaw = vPitch = 0;
    stage.classList.add('is-dragging');
  });

  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    dragMoved += Math.abs(dx) + Math.abs(dy);
    vYaw = -dx * DRAG_SPEED;
    vPitch = dy * DRAG_SPEED;
    yaw += vYaw;
    pitch = clamp(pitch + vPitch, -MAX_PITCH, MAX_PITCH);
  }, { passive: true });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Don't follow a card link if the user was spinning the globe.
  stage.addEventListener('click', e => {
    if (dragMoved > 6) { e.preventDefault(); e.stopPropagation(); dragMoved = 0; }
  }, true);

  /* ---------- spin: wheel + keyboard ---------- */
  window.addEventListener('wheel', e => {
    vYaw += (e.deltaX + e.deltaY) * 0.0006;
  }, { passive: true });

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') vYaw += 0.03;
    if (e.key === 'ArrowLeft')  vYaw -= 0.03;
    if (e.key === 'ArrowDown')  vPitch += 0.02;
    if (e.key === 'ArrowUp')    vPitch -= 0.02;
  });

  cards.forEach(card => {
    card.addEventListener('pointerenter', () => { if (!dragging) hovered = card; });
    card.addEventListener('pointerleave', () => { if (hovered === card) hovered = null; });
  });

  /* ---------- render loop ---------- */
  function frame() {
    spread += (1 - spread) * 0.06;

    if (!dragging) {
      yaw += vYaw;
      pitch = clamp(pitch + vPitch, -MAX_PITCH, MAX_PITCH);
      vYaw *= FRICTION;
      vPitch *= FRICTION;
      if (!reduceMotion && !hovered) yaw += AUTO_SPIN;
    }

    const w = window.innerWidth, h = window.innerHeight;
    const R = Math.min(w * 0.3, h * 0.34) * spread;   // globe radius

    ring.style.transform = `rotateX(${pitch}rad) rotateY(${yaw}rad)`;

    const cY = Math.cos(yaw), sY = Math.sin(yaw);
    const cP = Math.cos(pitch), sP = Math.sin(pitch);

    for (let i = 0; i < N; i++) {
      const p = pts[i], card = cards[i];
      card.style.transform = `rotateY(${p.lon}rad) rotateX(${p.lat}rad) translateZ(${R.toFixed(1)}px)`;

      const [dx, dy, dz] = p.dir;
      const z1 = -dx * sY + dz * cY;
      const z2 = dy * sP + z1 * cP;          // -1 back .. +1 front
      const depth = (z2 + 1) / 2;

      card.style.opacity = ((0.12 + depth * 0.88) * Math.min(1, spread * 1.4)).toFixed(3);
      card.style.filter = hovered === card
        ? 'none'
        : (depth > 0.5 ? 'grayscale(1)' : 'grayscale(1) opacity(.45)');
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
