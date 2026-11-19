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
        transform: translate3d(-10px,-9px,0) perspective(700px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
        filter:
          drop-shadow(0 3px 5px rgba(0,0,0,.72))
          drop-shadow(0 0 4px rgba(67,180,254,.7))
          drop-shadow(0 0 10px rgba(255,111,25,.38));
        transition: opacity .12s ease, filter .18s ease;
        will-change: transform;
        backface-visibility: visible;
      }
      .star69-cursor-follower.is-visible { opacity: 1; visibility: visible; }
      .star69-cursor-follower.is-text-target { opacity: 0 !important; visibility: hidden !important; }
      .star69-cursor-follower.is-clicking {
        filter:
          drop-shadow(0 0 8px #43b4fe)
          drop-shadow(0 0 8px rgba(255,132,32,.9))
          brightness(1.12);
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
  let lastX = null;
  let lastY = null;
  let lastTime = 0;
  let tiltX = 0;
  let tiltY = 0;
  let bank = 0;
  // The artwork's nose points right at neutral; rotate it to follow pointer travel.
  let heading = 0;
  let frame = 0;
  let targetX = 0;
  let targetY = 0;

  function deactivate() {
    pointerActive = false;
    lastX = lastY = null;
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

  function renderFlight() {
    frame = 0;
    const currentX = tiltX;
    const currentY = tiltY;
    const currentBank = bank;
    ship.style.transform =
      "translate3d(" + (targetX - 10) + "px," + (targetY - 9) + "px,0) " +
      "perspective(700px) rotateZ(" + heading.toFixed(2) + "deg) " +
      "rotateX(" + currentX.toFixed(2) + "deg) rotateY(" + currentY.toFixed(2) + "deg) " +
      "rotateZ(" + currentBank.toFixed(2) + "deg) scale(1.08)";
  }

  function scheduleRender() {
    if (!frame) frame = requestAnimationFrame(renderFlight);
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

  const overlayObserver = new MutationObserver(syncOverlayHost);
  overlayObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["open", "popover"]
  });

  window.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (!imageReady) return;

    syncOverlayHost();
    targetX = event.clientX;
    targetY = event.clientY;

    const now = performance.now();
    if (lastX !== null && lastY !== null && lastTime) {
      const elapsed = Math.max(8, now - lastTime);
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      const velocityX = deltaX / elapsed;
      const velocityY = deltaY / elapsed;

      // Point the ship's nose in its actual direction of travel:
      // right = 0°, down = 90°, left = 180°, up = -90°.
      if (Math.hypot(deltaX, deltaY) > 1.5) {
        heading = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      }

      // Keep the existing 3D pitch and banking layered over the heading.
      tiltY = Math.max(-24, Math.min(24, velocityX * 115));
      tiltX = Math.max(-18, Math.min(18, -velocityY * 95));
      bank = Math.max(-17, Math.min(17, velocityX * 78));
    }

    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;

    const target = event.target;
    const textEntry = target && target.closest &&
      target.closest('input,textarea,select,[contenteditable="true"],[role="textbox"]');
    ship.classList.toggle("is-text-target", !!textEntry);

    if (!pointerActive) {
      pointerActive = true;
      document.documentElement.classList.add("star69-custom-cursor-active");
    }
    ship.classList.add("is-visible");
    scheduleRender();
  }, { passive: true });

  // Smoothly settle the ship when the pointer stops, without a CSS transform fighting JS.
  let settleFrame = 0;
  function settleFlight() {
    if (!pointerActive) return;
    tiltX *= 0.78;
    tiltY *= 0.78;
    bank *= 0.76;
    scheduleRender();
    if (Math.abs(tiltX) + Math.abs(tiltY) + Math.abs(bank) > 0.35) {
      settleFrame = requestAnimationFrame(settleFlight);
    } else {
      tiltX = tiltY = bank = 0;
      scheduleRender();
      settleFrame = 0;
    }
  }
  window.addEventListener("pointermove", () => {
    if (settleFrame) cancelAnimationFrame(settleFrame);
    settleFrame = requestAnimationFrame(settleFlight);
  }, { passive: true });

  window.addEventListener("pointerdown", () => ship.classList.add("is-clicking"), { passive: true });
  window.addEventListener("pointerup", () => ship.classList.remove("is-clicking"), { passive: true });
  window.addEventListener("pointercancel", () => ship.classList.remove("is-clicking"), { passive: true });
  window.addEventListener("pointerout", event => { if (!event.relatedTarget) deactivate(); }, { passive: true });
  window.addEventListener("blur", deactivate);
  document.addEventListener("visibilitychange", () => { if (document.hidden) deactivate(); });

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