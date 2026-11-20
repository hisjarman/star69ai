(() => {
  "use strict";
  const homePath = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  if (homePath !== "/") return;
  const banner = document.querySelector(".s69-home-banner");
  if (!banner || banner.querySelector(".s69-visitor-ship")) return;

  const routes = [
    { startX:"calc(100vw + 180px)", startY:"-38px", midX:"calc(72vw - 50%)", midY:"-52px", flip:"1", duration:"4.1s" },
    { startX:"-190px", startY:"34px", midX:"calc(27vw - 50%)", midY:"-46px", flip:"-1", duration:"4.4s" },
    { startX:"calc(100vw + 180px)", startY:"38px", midX:"calc(76vw - 50%)", midY:"-26px", flip:"1", duration:"3.8s" },
    { startX:"-190px", startY:"-48px", midX:"calc(23vw - 50%)", midY:"32px", flip:"-1", duration:"4.3s" }
  ];
  const route = routes[Math.floor(Math.random() * routes.length)];
  const ship = document.createElement("img");
  ship.className = "s69-visitor-ship";
  ship.src = "/assets/visitorspaceship.png";
  ship.alt = "";
  ship.setAttribute("aria-hidden", "true");
  ship.decoding = "async";
  ship.draggable = false;
  ship.style.setProperty("--s69-start-x", route.startX);
  ship.style.setProperty("--s69-start-y", route.startY);
  ship.style.setProperty("--s69-mid-x", route.midX);
  ship.style.setProperty("--s69-mid-y", route.midY);
  ship.style.setProperty("--s69-flip", route.flip);
  ship.style.setProperty("--s69-duration", route.duration);
  ship.addEventListener("load", () => {
    ship.classList.add("is-flying");
  }, { once:true });
  ship.addEventListener("error", () => ship.remove(), { once:true });
  banner.appendChild(ship);
  if (ship.complete && ship.naturalWidth > 0) ship.classList.add("is-flying");
})();