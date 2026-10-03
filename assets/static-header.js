(() => {
  const header = document.querySelector('[data-static-site-header]');
  const button = header?.querySelector('button[aria-label="Menü öffnen"], button[aria-label="Menü schliessen"]');
  const panel = header?.querySelector('[data-static-mobile-panel]');
  if (!header || !button || !panel) return;

  const menuIcon = '<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const closeIcon = '<svg viewBox="0 0 24 24" class="size-4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  button.addEventListener('click', () => {
    const opening = panel.hidden;
    panel.hidden = !opening;
    button.setAttribute('aria-expanded', String(opening));
    button.setAttribute('aria-label', opening ? 'Menü schliessen' : 'Menü öffnen');
    button.innerHTML = opening ? closeIcon : menuIcon;
  });

  panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Menü öffnen');
    button.innerHTML = menuIcon;
  }));
})();
