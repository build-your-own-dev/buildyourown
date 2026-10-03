(() => {
  function addLink(nav) {
    if (!nav || nav.querySelector('a[href$="konfigurator.html"]')) return;
    const template = nav.querySelector('a');
    const link = document.createElement('a');
    link.href = './konfigurator.html';
    link.textContent = 'Konfigurator';
    if (template) link.className = template.className;
    nav.append(link);
  }

  function attach() {
    addLink(document.querySelector('nav[aria-label="Hauptnavigation"]'));
    addLink(document.querySelector('nav[aria-label="Mobile Navigation"]'));
  }

  new MutationObserver(attach).observe(document.documentElement, {childList: true, subtree: true});
  attach();
})();
