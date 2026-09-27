// Keep one indicator mounted so it glides between the active navigation links.
(() => {
  let nav;
  let activeObserver;
  let resizeObserver;
  let frame;
  function update() {
    if (!nav) return;
    const active = nav.querySelector('a[data-status="active"], a[aria-current="page"], a.bg-secondary');
    if (!active || !nav.getClientRects().length) {
      nav.style.setProperty('--slider-opacity', '0');
      return;
    }
    nav.style.setProperty('--slider-x', `${active.offsetLeft + 16}px`);
    nav.style.setProperty('--slider-width', `${Math.max(0, active.offsetWidth - 32)}px`);
    nav.style.setProperty('--slider-opacity', '1');
  }
  function schedule() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }
  function attach() {
    const next = document.querySelector('nav[aria-label="Hauptnavigation"]');
    if (next === nav) return;
    activeObserver?.disconnect();
    resizeObserver?.disconnect();
    nav = next;
    if (!nav) return;
    nav.classList.add('byo-sliding-nav');
    activeObserver = new MutationObserver(schedule);
    activeObserver.observe(nav, {subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'data-status', 'aria-current']});
    resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(nav);
    nav.querySelectorAll('a').forEach(link => resizeObserver.observe(link));
    schedule();
  }
  new MutationObserver(attach).observe(document.documentElement, {childList: true, subtree: true});
  window.addEventListener('resize', schedule, {passive: true});
  document.fonts?.ready.then(schedule);
  attach();
})();
