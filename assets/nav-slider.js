// Keep one indicator mounted so it glides between the active navigation links.
(() => {
  let nav;
  let activeObserver;
  let resizeObserver;
  let frame;
  function attachBrand() {
    const brand = document.querySelector('a[aria-label$="— Startseite"]');
    if (!brand) return;
    const parts = brand.querySelectorAll(':scope > span');
    const mark = parts[0];
    const name = parts[1];
    if (mark && !mark.querySelector('.byo-brand-symbol')) {
      mark.className = 'byo-brand-mark';
      mark.textContent = '';
      const logo = document.createElement('img');
      logo.className = 'byo-brand-symbol';
      logo.src = './assets/byo-symbol.png';
      logo.alt = '';
      logo.width = 32;
      logo.height = 32;
      mark.appendChild(logo);
    }
    if (name && !name.querySelector('.byo-brand-wordmark')) {
      name.className = 'byo-brand-name';
      name.textContent = '';
      const wordmark = document.createElement('img');
      wordmark.className = 'byo-brand-wordmark';
      wordmark.src = './assets/build-your-own-wordmark.png';
      wordmark.alt = 'Build Your Own';
      name.appendChild(wordmark);
    }
  }
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
    attachBrand();
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


// Animate the mobile navigation without changing its React behaviour.
(() => {
  const CLOSE_MS = 240;
  let replayingClose = false;

  function enhanceMobileMenu() {
    const toggle = document.querySelector(
      'button[aria-label="Menü öffnen"], button[aria-label="Menü schliessen"]'
    );
    toggle?.classList.add('byo-mobile-menu-toggle');

    const nav = document.querySelector('nav[aria-label="Mobile Navigation"]');
    const panel = nav?.parentElement;
    if (panel && !panel.classList.contains('byo-mobile-menu-panel')) {
      panel.classList.add('byo-mobile-menu-panel');
      requestAnimationFrame(() => panel.classList.add('byo-mobile-menu-visible'));
    }
  }

  document.addEventListener('click', (event) => {
    if (replayingClose) return;
    const toggle = event.target.closest?.('button[aria-label="Menü schliessen"]');
    if (!toggle) return;

    const panel = document.querySelector('nav[aria-label="Mobile Navigation"]')?.parentElement;
    if (!panel) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    panel.classList.add('byo-mobile-menu-closing');
    toggle.classList.add('byo-mobile-menu-toggle-closing');

    window.setTimeout(() => {
      replayingClose = true;
      toggle.click();
      replayingClose = false;
    }, CLOSE_MS);
  }, true);

  new MutationObserver(enhanceMobileMenu).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-expanded', 'aria-label']
  });
  enhanceMobileMenu();
})();
