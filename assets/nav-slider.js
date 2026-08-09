(() => {
  const NAV_SELECTOR = 'header nav[aria-label="Hauptnavigation"]';

  function setupNavSlider() {
    const nav = document.querySelector(NAV_SELECTOR);
    if (!nav || nav.dataset.sliderReady === "true") return;

    nav.dataset.sliderReady = "true";
    nav.classList.add("nav-slider");

    const pill = document.createElement("span");
    pill.className = "nav-slider-pill";
    pill.setAttribute("aria-hidden", "true");
    nav.prepend(pill);

    const links = [...nav.querySelectorAll("a")];
    const activeLink = () =>
      links.find(
        (link) =>
          link.getAttribute("aria-current") === "page" ||
          link.dataset.status === "active",
      ) || links[0];

    function moveTo(link, immediate = false) {
      if (!link) return;
      if (immediate) pill.classList.add("is-positioning");
      pill.style.width = `${link.offsetWidth}px`;
      pill.style.transform = `translate3d(${link.offsetLeft}px, 0, 0)`;
      if (immediate) {
        requestAnimationFrame(() => pill.classList.remove("is-positioning"));
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
