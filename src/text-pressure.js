export function initTextPressure() {
  const container = document.querySelector('.hero-watermark-wrap');
  const title = container?.querySelector('[data-text-pressure]');
  if (!container || !title) return;

  const chars = Array.from((title.dataset.textPressure || title.textContent).trim());
  const spans = chars.map(char => {
    const span = document.createElement('span');
    span.textContent = char;
    span.setAttribute('aria-hidden', 'true');
    return span;
  });
  spans.forEach(span => title.append(span));

  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const cursor = { x: innerWidth / 2, y: innerHeight / 2, seen: false };
  const mouse = { ...cursor };
  const ripples = [];
  const options = {
    radius: 0.5,
    smoothing: 0.5,
    idleSpeed: 1,
    idle: 'wave',
    textColor: '#a9d4ff',
    pressureColor: '#e0f1ff'
  };
  let fontSize = 100;
  let frame = 0;
  let last = 0;
  let clock = 0;
  let engage = 0;
  let visible = true;

  const clamp = value => Math.min(1, Math.max(0, value));
  const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
  const measure = () => {
    const box = container.getBoundingClientRect();
    fontSize = Math.max(chars.length ? box.width / (chars.length / 2) : 36, 36);
    title.style.fontSize = `${fontSize}px`;
    wake();
  };
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(container);
  document.fonts?.ready?.then(measure);

  function pressureFromRipple(point, now, span) {
    let pressure = 0;
    for (const ripple of ripples) {
      const age = (now - ripple.start) / 1000;
      if (age <= 0 || age >= 1.3) continue;
      const offset = (distance(ripple, point) - age * span * 1.25) / Math.max(span * .14, 32);
      if (offset <= -1 || offset >= 1) continue;
      const fade = 1 - age / 1.3;
      const swell = (1 - offset * offset) ** 2 * fade * fade * Math.min(1, age / .06);
      pressure = 1 - (1 - pressure) * (1 - swell);
    }
    return pressure;
  }

  function tick(now) {
    frame = 0;
    const elapsed = last ? Math.min(now - last, 64) : 1000 / 60;
    last = now;
    const idleMode = prefersReducedMotion.matches ? 'none' : options.idle;
    const lag = 1000 * options.smoothing ** 2;
    const follow = lag > 1 ? 1 - Math.exp(-elapsed / lag) : 1;
    mouse.x += (cursor.x - mouse.x) * follow;
    mouse.y += (cursor.y - mouse.y) * follow;

    let present = 1;
    if (idleMode !== 'none') {
      const box = container.getBoundingClientRect();
      present = cursor.seen && cursor.x >= box.left && cursor.x <= box.right && cursor.y >= box.top && cursor.y <= box.bottom ? 1 : 0;
    }
    engage += (present - engage) * (1 - Math.exp(-elapsed / 320));
    if (Math.abs(present - engage) < .002) engage = present;
    const idling = idleMode !== 'none' && engage < 1;
    if (idling) clock += elapsed / 1000 * options.idleSpeed;
    while (ripples.length && now - ripples[0].start > 1300) ripples.shift();

    const titleRect = title.getBoundingClientRect();
    const maxDistance = Math.max(titleRect.width * options.radius, 1);
    const spread = Math.max(options.radius * 2, .2);
    spans.forEach(span => {
      const rect = span.getBoundingClientRect();
      const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      let pressure = clamp(1 - distance(mouse, center) / maxDistance);
      if (idling) {
        const position = (center.x - titleRect.left) / Math.max(titleRect.width, 1);
        const crest = .5 + .5 * Math.cos(Math.PI * 2 * (position / spread - clock / 3.2));
        const resting = crest * crest;
        pressure = resting + (pressure - resting) * engage;
      }
      if (ripples.length) pressure = 1 - (1 - pressure) * (1 - pressureFromRipple(center, now, titleRect.width));
      const width = Math.floor(5 + 200 * pressure);
      const weight = Math.floor(100 + 900 * pressure);
      const italic = pressure.toFixed(2);
      const tint = Math.round((1 - (1 - pressure) ** 2) * 100);
      span.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${width}, 'ital' ${italic}`;
      span.style.color = `color-mix(in oklab, ${options.pressureColor} ${tint}%, ${options.textColor})`;
      span.style.opacity = '1';
    });

    const moving = Math.abs(cursor.x - mouse.x) > .1 || Math.abs(cursor.y - mouse.y) > .1;
    if (visible && (moving || idling || engage !== present || ripples.length)) frame = requestAnimationFrame(tick);
    else last = 0;
  }

  function wake() {
    if (!frame && visible) frame = requestAnimationFrame(tick);
  }
  const onPointerMove = event => { cursor.x = event.clientX; cursor.y = event.clientY; cursor.seen = true; wake(); };
  const onPointerDown = event => { ripples.push({ x: event.clientX, y: event.clientY, start: performance.now() }); if (ripples.length > 6) ripples.shift(); wake(); };
  const onPointerUp = event => { if (event.pointerType !== 'mouse') { cursor.seen = false; wake(); } };
  const onLeave = () => { cursor.seen = false; wake(); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; } });
  observer.observe(container);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  container.addEventListener('pointerdown', onPointerDown);
  prefersReducedMotion.addEventListener?.('change', wake);
  measure();
}
