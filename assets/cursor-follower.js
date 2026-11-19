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
        width: clamp(82px, 7vw, 112px);
        height: auto;
        max-width: none;
        max-height: none;
        object-fit: contain;
        object-position: center;
        overflow: visible;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transform-origin: 46% 52%;
        transform: translate3d(-10px,-9px,0);
        filter:
          drop-shadow(0 3px 5px rgba(0,0,0,.72))
          drop-shadow(0 0 4px rgba(67,180,254,.62))
          drop-shadow(0 0 8px rgba(255,111,25,.24));
        transition: opacity .16s ease, filter .18s ease;
        will-change: transform;
        backface-visibility: visible;
      }
      .star69-cursor-follower.is-visible { opacity: 1; visibility: visible; }
      .star69-cursor-follower.is-text-target { opacity: 0 !important; visibility: hidden !important; }
      .star69-cursor-follower.is-clicking {
        filter:
          drop-shadow(0 3px 5px rgba(0,0,0,.72))
          drop-shadow(0 0 7px rgba(67,180,254,.82))
          drop-shadow(0 0 9px rgba(255,132,32,.38))
          brightness(1.04);
      }
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
    ship.classList.remove("is-visible", "is-clicking", "is-text-target");
    document.documentElement.classList.remove("star69-custom-cursor-active");
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function syncOverlayHost() {
    const layers = document.querySelectorAll('dialog[open], [popover]:popover-open');
    const host = layers.length ? layers[layers.length - 1] : document.body;
    if (host && ship.parentNode !== host) host.appendChild(ship);
  }

  function render() {
    frame = 0;
    // A slower, capped spring makes the detailed ship feel deliberate rather than twitchy.
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    const distance = Math.hypot(dx, dy);
    if (distance > 0.8) {
      const step = Math.min(distance * 0.18, 24);
      currentX += (dx / distance) * step;
      currentY += (dy / distance) * step;
    } else {
      currentX = targetX;
      currentY = targetY;
    }

    // Keep the ship on a fixed, level horizon: position eases, artwork never rotates or banks.
    ship.style.transform = "translate3d(" + (currentX - 10) + "px," + (currentY - 9) + "px,0)";
    if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.8) {
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
    overlayObserver.disconnect();
    ship.remove();
    style.remove();
  }, { once: true });
  ship.src = "/assets/cursor.png";
  document.body.appendChild(ship);

  const overlayObserver = new MutationObserver(syncOverlayHost);
  overlayObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["open", "popover"]
  });

  window.addEventListener("star69ai:cursor-toggle", event => {
    setEnabled(!!(event.detail && event.detail.enabled));
  });

  window.addEventListener("pointermove", event => {
    if (!enabled || !imageReady) return;
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;

    syncOverlayHost();
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

  window.addEventListener("pointerdown", () => ship.classList.add("is-clicking"), { passive: true });
  window.addEventListener("pointerup", () => ship.classList.remove("is-clicking"), { passive: true });
  window.addEventListener("pointercancel", () => ship.classList.remove("is-clicking"), { passive: true });

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
      overlayObserver.disconnect();
      ship.remove();
      style.remove();
    }
  };
  if (finePointer.addEventListener) finePointer.addEventListener("change", stopWhenUnsupported);
  if (reducedMotion && reducedMotion.addEventListener) reducedMotion.addEventListener("change", stopWhenUnsupported);
})();