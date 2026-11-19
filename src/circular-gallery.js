import { projects } from './projects.js';

export function initCircularGallery() {
  const stage = document.querySelector('#works-gallery');
  if (!stage) return;
  const cards = [...stage.querySelectorAll('.gallery-card')];
  const counter = document.querySelector('.gallery-counter');
  const modal = document.querySelector('[data-gallery-modal]');
  if (!cards.length || !modal) return;

  const modalPages = modal.querySelector('[data-case-pages]');
  const modalPosition = modal.querySelector('[data-case-position]');
  const caseIndexButtons = [...modal.querySelectorAll('[data-case-index]')];
  const closeButton = modal.querySelector('[data-gallery-close]');
  const count = cards.length;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let position = -0.85;
  let target = 0;
  let raf = 0;
  let pointer = null;
  let dragged = false;
  let ignoreClick = false;
  let wheelTimer = 0;
  let lastOpener = null;
  let previousOverflow = '';
  let activeCase = 0;

  const wrap = value => ((value % count) + count) % count;
  const relative = value => ((value + count / 2) % count + count) % count - count / 2;
  const activeIndex = () => wrap(Math.round(position));

  function render() {
    raf = 0;
    const cardWidth = cards[0].getBoundingClientRect().width || 320;
    cards.forEach((card, index) => {
      const offset = relative(index - position);
      const distance = Math.abs(offset);
      const x = offset * cardWidth * 0.82;
      const y = Math.pow(distance, 1.7) * 13;
      const z = 105 - distance * 65;
      const scale = Math.max(0.68, 1 - distance * 0.12);
      const opacity = Math.max(0.24, 1 - distance * 0.31);
      card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${-offset * 25}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(20 - Math.round(distance * 4));
      card.setAttribute('aria-current', distance < 0.5 ? 'true' : 'false');
    });
    if (counter) counter.innerHTML = `${String(activeIndex() + 1).padStart(2, '0')} <i>/</i> ${String(count).padStart(2, '0')}`;

    const ease = reduceMotion.matches ? 1 : 0.085;
    position += (target - position) * ease;
    if (Math.abs(target - position) < 0.002) position = target;
    if (position !== target) raf = requestAnimationFrame(render);
  }

  function wake() {
    if (!raf) raf = requestAnimationFrame(render);
  }

  function goTo(index) {
    target = position + relative(index - position);
    wake();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = previousOverflow;
    lastOpener?.focus({ preventScroll: true });
  }

  function showCase(index) {
    activeCase = wrap(index);
    const project = projects[activeCase];
    modalPosition.textContent = `${String(activeCase + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
    modalPages.innerHTML = project.detailPages.map((page, index) => `
      <figure class="case-page" id="case-page-${page}">
        <figcaption><span>${project.title}</span><button type="button" data-page-zoom aria-expanded="false">放大查看 ↗</button><span>PAGE ${String(index + 1).padStart(2, '0')} / 04</span></figcaption>
        <img src="/images/case-pages/portfolio-page-${String(page).padStart(2, '0')}.jpg" alt="${project.title}作品集横版详情，第 ${index + 1} 页" ${index > 0 ? 'loading="lazy"' : 'fetchpriority="high"'}>
      </figure>`).join('');
    caseIndexButtons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === activeCase);
      button.setAttribute('aria-current', buttonIndex === activeCase ? 'page' : 'false');
    });
    const content = modal.querySelector('.case-content');
    if (content) content.scrollTop = 0;
  }

  function openModal(index, opener) {
    showCase(index);
    lastOpener = opener || cards[index].querySelector('.gallery-card-button');
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.hidden = false;
    closeButton.focus({ preventScroll: true });
  }

  cards.forEach((card, index) => {
    const button = card.querySelector('.gallery-card-button');
    button.addEventListener('click', () => {
      if (ignoreClick) return;
      const offset = relative(index - position);
      if (Math.abs(offset) > 0.16) goTo(index);
      else openModal(index, button);
    });
  });

  document.querySelector('[data-gallery-prev]')?.addEventListener('click', () => { target -= 1; wake(); });
  document.querySelector('[data-gallery-next]')?.addEventListener('click', () => { target += 1; wake(); });
  closeButton.addEventListener('click', closeModal);
  modalPages.addEventListener('click', event => {
    const button = event.target.closest('[data-page-zoom]');
    if (!button) return;
    const page = button.closest('.case-page');
    const zoomed = page.classList.toggle('is-zoomed');
    button.setAttribute('aria-expanded', String(zoomed));
    button.textContent = zoomed ? '缩小返回' : '放大查看 ↗';
  });
  modal.querySelector('[data-case-home]')?.addEventListener('click', event => { event.preventDefault(); closeModal(); });
  caseIndexButtons.forEach(button => button.addEventListener('click', () => showCase(Number(button.dataset.caseIndex))));
  modal.querySelector('[data-case-prev]')?.addEventListener('click', () => showCase(activeCase - 1));
  modal.querySelector('[data-case-next]')?.addEventListener('click', () => showCase(activeCase + 1));
  document.addEventListener('keydown', event => {
    if (!modal.hidden) {
      if (event.key === 'Escape') {
        const zoomedPage = modal.querySelector('.case-page.is-zoomed');
        if (zoomedPage) {
          const zoomButton = zoomedPage.querySelector('[data-page-zoom]');
          zoomedPage.classList.remove('is-zoomed');
          zoomButton?.setAttribute('aria-expanded', 'false');
          if (zoomButton) zoomButton.textContent = '放大查看 ↗';
        } else closeModal();
      }
      if (event.key === 'ArrowRight') showCase(activeCase + 1);
      if (event.key === 'ArrowLeft') showCase(activeCase - 1);
      return;
    }
    if (!stage.contains(document.activeElement)) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); target += 1; wake(); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); target -= 1; wake(); }
  });

  stage.addEventListener('wheel', event => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 2) return;
    event.preventDefault();
    target += Math.sign(delta) * Math.min(0.7, Math.abs(delta) * 0.0035);
    wake();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { target = Math.round(target); wake(); }, 160);
  }, { passive: false });

  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const captureTarget = event.target.closest('.gallery-card-button') || stage;
    pointer = { id: event.pointerId, x: event.clientX, start: position };
    dragged = false;
    captureTarget.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.x;
    if (Math.abs(dx) > 5) dragged = true;
    if (!dragged) return;
    const cardWidth = cards[0].getBoundingClientRect().width || 320;
    position = target = pointer.start - dx / (cardWidth * 0.82);
    wake();
  });
  const finishDrag = event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    if (dragged) {
      ignoreClick = true;
      setTimeout(() => { ignoreClick = false; }, 80);
      target = Math.round(position);
      wake();
    }
    pointer = null;
  };
  stage.addEventListener('pointerup', finishDrag);
  stage.addEventListener('pointercancel', finishDrag);

  new ResizeObserver(wake).observe(stage);
  wake();
}
