(() => {
  function addLink(nav) {
    if (!nav) return;
    let link = nav.querySelector('a[href$="konfigurator.html"]');
    if (!link) {
      const template = nav.querySelector('a');
      link = document.createElement('a');
      link.href = './konfigurator.html';
      link.textContent = 'Konfigurator';
      if (template) link.className = template.className;
      nav.append(link);
    }

    const isConfigurator = /\/(konfigurator|projekt|anfrage-erhalten)\.html$/.test(location.pathname);
    if (isConfigurator) {
      nav.querySelectorAll('a').forEach(item => {
        item.removeAttribute('aria-current');
        item.classList.remove('bg-secondary', 'text-foreground');
      });
      link.setAttribute('aria-current', 'page');
      link.classList.add('bg-secondary', 'text-foreground');
    }
  }

  function attach() {
    addLink(document.querySelector('nav[aria-label="Hauptnavigation"]'));
    addLink(document.querySelector('nav[aria-label="Mobile Navigation"]'));
  }

  new MutationObserver(attach).observe(document.documentElement, {childList: true, subtree: true});
  attach();
})();
