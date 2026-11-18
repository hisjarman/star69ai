(() => {
  "use strict";
  const finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer || !finePointer.matches || (reducedMotion && reducedMotion.matches)) return;
  if (document.querySelector(".star69-cursor-follower")) return;

  const style = document.createElement("style");
  style.textContent = `
    @media (hover: hover) and (pointer: fine) {
      html.star69-custom-cursor-active,
      html.star69-custom-cursor-active body,
      html.star69-custom-cursor-active a,
      html.star69-custom-cursor-active button,
      html.star69-custom-cursor-active [role="button"],
      html.star69-custom-cursor-active summary,
      html.star69-custom-cursor-active label[for] { cursor: none !important; }
      html.star69-custom-cursor-active input,
      html.star69-custom-cursor-active textarea,
      html.star69-custom-cursor-active select,
      html.star69-custom-cursor-active [contenteditable="true"],
      html.star69-custom-cursor-active [role="textbox"] { cursor: text !important; }
      .star69-cursor-follower {
        position: fixed; left: 0; top: 0; z-index: 2147483647;
        width: 58px; height: auto; max-height: 42px; object-fit: contain;
        pointer-events: none; opacity: 0; visibility: hidden;
        transform: translate3d(-9px,-8px,0);
        filter: drop-shadow(0 2px 5px rgba(0,0,0,.65));
        transition: opacity .12s ease, filter .12s ease; will-change: transform;
      }
      .star69-cursor-follower.is-visible { opacity: 1; visibility: visible; }
      .star69-cursor-follower.is-text-target { opacity: 0 !important; visibility: hidden !important; }
      .star69-cursor-follower.is-clicking { filter: drop-shadow(0 0 8px #43b4fe) brightness(1.12); }
    }`;
  document.head.appendChild(style);

  const ship = document.createElement("img");
  ship.className = "star69-cursor-follower";
  ship.alt = "";
  ship.setAttribute("aria-hidden", "true");
  ship.decoding = "async";
  ship.draggable = false;
  let imageReady = false;
  let pointerActive = false;

  function deactivate() {
    pointerActive = false;
    document.documentElement.classList.remove("star69-custom-cursor-active");
    ship.classList.remove("is-visible", "is-clicking", "is-text-target");
  }
  function syncOverlayHost() {
    const layers = document.querySelectorAll('dialog[open], [popover]:popover-open');
    const host = layers.length ? layers[layers.length - 1] : document.body;
    if (host && ship.parentNode !== host) host.appendChild(ship);
  }

  ship.addEventListener("load", () => { imageReady = true; });
  ship.addEventListener("error", () => { imageReady = false; deactivate(); ship.remove(); });
  ship.src = "/assets/cursor.webp";
  document.body.appendChild(ship);

  const overlayObserver = new MutationObserver(syncOverlayHost);
  overlayObserver.observe(document.documentElement, {
    childList: true, subtree: true, attributes: true, attributeFilter: ["open", "popover"]
  });

  window.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (!imageReady) return;
    syncOverlayHost();
    ship.style.transform = "translate3d(" + (event.clientX - 9) + "px," + (event.clientY - 8) + "px,0)";
    const target = event.target;
    const textEntry = target && target.closest && target.closest('input,textarea,select,[contenteditable="true"],[role="textbox"]');
    ship.classList.toggle("is-text-target", !!textEntry);
    if (!pointerActive) {
      pointerActive = true;
      document.documentElement.classList.add("star69-custom-cursor-active");
    }
    ship.classList.add("is-visible");
  }, { passive: true });

  window.addEventListener("pointerdown", () => ship.classList.add("is-clicking"), { passive: true });
  window.addEventListener("pointerup", () => ship.classList.remove("is-clicking"), { passive: true });
  window.addEventListener("pointercancel", () => ship.classList.remove("is-clicking"), { passive: true });
  window.addEventListener("pointerout", event => { if (!event.relatedTarget) deactivate(); }, { passive: true });
  window.addEventListener("blur", deactivate);
  document.addEventListener("visibilitychange", () => { if (document.hidden) deactivate(); });

  const stopWhenUnsupported = () => {
    if (!finePointer.matches || (reducedMotion && reducedMotion.matches)) {
      deactivate(); overlayObserver.disconnect(); ship.remove(); style.remove();
    }
  };
  if (finePointer.addEventListener) finePointer.addEventListener("change", stopWhenUnsupported);
  if (reducedMotion && reducedMotion.addEventListener) reducedMotion.addEventListener("change", stopWhenUnsupported);
})();