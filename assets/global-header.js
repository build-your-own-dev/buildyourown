(() => {
  const header = document.querySelector('.byo-global-header');
  if (!header) return;
  const button = header.querySelector('.byo-menu-button');
  const menu = header.querySelector('.byo-mobile-nav');
  const close = () => {
    header.classList.remove('menu-open');
    button?.setAttribute('aria-expanded', 'false');
    button?.setAttribute('aria-label', 'Menü öffnen');
    if (button) button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  };
  button?.addEventListener('click', () => {
    const open = !header.classList.contains('menu-open');
    if (!open) return close();
    header.classList.add('menu-open');
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Menü schliessen');
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', update, {passive:true});
  update();
})();
