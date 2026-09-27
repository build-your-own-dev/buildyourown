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

// Apple-inspired sticky device showcase on the homepage.
(() => {
  let showcase;
  let frame;

  function updateShowcase() {
    frame = 0;
    if (!showcase) return;
    const rect = showcase.getBoundingClientRect();
    const distance = Math.max(1, showcase.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / distance));
    showcase.style.setProperty('--showcase-progress', progress.toFixed(4));
  }

  function scheduleShowcase() {
    if (!frame) frame = requestAnimationFrame(updateShowcase);
  }

  function attachShowcase() {
    const followingHeading = [...document.querySelectorAll('h2')].find((heading) =>
      heading.textContent?.includes('Warum Schweizer Betriebe')
    );
    followingHeading?.closest('section')?.classList.add('byo-after-device');

    const image = document.querySelector('img[alt="Website-Darstellung auf Laptop und Smartphone"]');
    if (!image || image.closest('.byo-device-showcase')) return;

    const original = image.parentElement;
    if (!original?.parentElement) return;

    showcase = document.createElement('section');
    showcase.className = 'byo-device-showcase';
    showcase.setAttribute('aria-label', 'Responsive Webdesign');

    const sticky = document.createElement('div');
    sticky.className = 'byo-device-sticky';
    const visual = document.createElement('div');
    visual.className = 'byo-device-visual';
    const copy = document.createElement('div');
    copy.className = 'byo-device-copy';
    copy.innerHTML = `
      <p class="byo-device-kicker">Webdesign, das sich anpasst.</p>
      <p class="byo-device-line byo-device-line-one">Für jedes Gerät gestaltet.</p>
      <p class="byo-device-line byo-device-line-two">Klar. Schnell. Unverwechselbar.</p>
    `;

    const host = original.parentElement;
    host.classList.add('byo-device-host');
    host.insertBefore(showcase, original);
    visual.appendChild(original);
    sticky.append(visual, copy);
    showcase.appendChild(sticky);
    image.classList.add('byo-device-image');
    scheduleShowcase();
  }

  new MutationObserver(attachShowcase).observe(document.documentElement, {childList: true, subtree: true});
  window.addEventListener('scroll', scheduleShowcase, {passive: true});
  window.addEventListener('resize', scheduleShowcase, {passive: true});
  attachShowcase();
})();
