(() => {
  "use strict";

  const finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer || !finePointer.matches || (reducedMotion && reducedMotion.matches)) return;
  if (document.querySelector(".star69-cursor-follower")) return;

  const preferenceKey = "star69ai-cursor-effects-v1";
  const readPreference = () => {
    try { return localStorage.getItem(preferenceKey) !== "off"; }
    catch { return true; }
  };
  let enabled = readPreference();

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
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2147483647;
        display: block;
        width: clamp(34px, 3vw, 42px);
        height: auto;
        max-width: none;
        max-height: none;
        object-fit: contain;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transform: translate3d(-21px,-14px,0);
        filter: drop-shadow(0 2px 3px rgba(0,0,0,.72)) drop-shadow(0 0 4px rgba(67,180,254,.38));
        transition: opacity .14s ease;
        will-change: transform;
      }
      .star69-cursor-follower.is-visible { opacity: .94; visibility: visible; }
      .star69-cursor-follower.is-text-target { opacity: 0 !important; visibility: hidden !important; }
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
  let frame = 0;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  function deactivate() {
    pointerActive = false;
    ship.classList.remove("is-visible", "is-text-target");
    document.documentElement.classList.remove("star69-custom-cursor-active");
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function render() {
    frame = 0;
    // A restrained ease keeps the small decorative ship from snapping around.
    currentX += (targetX - currentX) * 0.34;
    currentY += (targetY - currentY) * 0.34;
    ship.style.transform = "translate3d(" + (currentX - 21) + "px," + (currentY - 14) + "px,0)";
    if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.6) {
      frame = requestAnimationFrame(render);
    }
  }

  function scheduleRender() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function setEnabled(next) {
    enabled = !!next;
    if (!enabled) deactivate();
  }

  ship.addEventListener("load", () => { imageReady = true; });
  ship.addEventListener("error", () => {
    imageReady = false;
    deactivate();
    ship.remove();
    style.remove();
  }, { once: true });
  ship.src = "/assets/cursor.png";
  document.body.appendChild(ship);

  window.addEventListener("star69ai:cursor-toggle", event => {
    setEnabled(!!(event.detail && event.detail.enabled));
  });

  window.addEventListener("pointermove", event => {
    if (!enabled || !imageReady) return;
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;

    targetX = event.clientX;
    targetY = event.clientY;
    const target = event.target;
    const textEntry = target && target.closest &&
      target.closest('input,textarea,select,[contenteditable="true"],[role="textbox"]');
    ship.classList.toggle("is-text-target", !!textEntry);

    if (!pointerActive) {
      pointerActive = true;
      currentX = targetX;
      currentY = targetY;
      document.documentElement.classList.add("star69-custom-cursor-active");
    }
    ship.classList.add("is-visible");
    scheduleRender();
  }, { passive: true });

  window.addEventListener("pointerout", event => {
    if (!event.relatedTarget) deactivate();
  }, { passive: true });
  window.addEventListener("blur", deactivate);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) deactivate();
  });

  const stopWhenUnsupported = () => {
    if (!finePointer.matches || (reducedMotion && reducedMotion.matches)) {
      deactivate();
      ship.remove();
      style.remove();
    }
  };
  if (finePointer.addEventListener) finePointer.addEventListener("change", stopWhenUnsupported);
  if (reducedMotion && reducedMotion.addEventListener) reducedMotion.addEventListener("change", stopWhenUnsupported);
})();