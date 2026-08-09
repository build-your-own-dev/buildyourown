(() => {
  const NAV_SELECTOR = 'header nav[aria-label="Hauptnavigation"]';

  function setupNavSlider() {
    const nav = document.querySelector(NAV_SELECTOR);
    if (!nav || nav.dataset.sliderReady === "true") return;

    nav.dataset.sliderReady = "true";
    const links = [...nav.querySelectorAll("a")];
    const activeLink = () =>
      links.find(
        (link) =>
          link.getAttribute("aria-current") === "page" ||
          link.dataset.status === "active",
      ) || links[0];

    function moveTo(link, immediate = false) {
      if (!link) return;
      if (immediate) nav.dataset.sliderPositioning = "true";
      nav.style.setProperty("--nav-pill-width", `${link.offsetWidth}px`);
      nav.style.setProperty("--nav-pill-x", `${link.offsetLeft}px`);
      if (immediate) {
        requestAnimationFrame(() => {
          delete nav.dataset.sliderPositioning;
        });
      }
    }

    links.forEach((link) => {
      link.addEventListener("pointerenter", () => moveTo(link));
      link.addEventListener("focus", () => moveTo(link));
    });

    nav.addEventListener("pointerleave", () => moveTo(activeLink()));
    nav.addEventListener("focusout", (event) => {
      if (!nav.contains(event.relatedTarget)) moveTo(activeLink());
    });

    const routeObserver = new MutationObserver(() => moveTo(activeLink()));
    links.forEach((link) =>
      routeObserver.observe(link, {
        attributes: true,
        attributeFilter: ["aria-current", "data-status", "class"],
      }),
    );

    window.addEventListener("resize", () => moveTo(activeLink(), true), {
      passive: true,
    });
    requestAnimationFrame(() => moveTo(activeLink(), true));
  }

  function boot() {
    setupNavSlider();
    if (document.querySelector(NAV_SELECTOR)) return;
    const mountObserver = new MutationObserver(() => {
      if (!document.querySelector(NAV_SELECTOR)) return;
      setupNavSlider();
      mountObserver.disconnect();
    });
    mountObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
