(() => {
  "use strict";
  const wrap = document.querySelector(".s69-visitor-greeting-wrap");
  if (!wrap || !/^\/$|^\/index\.html$/.test(location.pathname)) return;
  const bubble = wrap.querySelector(".site-global-welcome-bubble");
  const flag = wrap.querySelector(".site-global-arrival-flag");
  if (!bubble) return;

  const endpoints = [
    "https://concierge.star69ai.com/api/welcome",
    "https://star69ai-concierge.hisjarman.workers.dev/api/welcome"
  ];
  const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  const countryName = code => {
    try { return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code; }
    catch (_) { return code; }
  };
  const countryFlag = code => {
    if (!/^[A-Z]{2}$/.test(code)) return "";
    return String.fromCodePoint(...Array.from(code, char => 127397 + char.charCodeAt(0)));
  };
  async function requestWelcome(url) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4500);
    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!response.ok) throw new Error("welcome_http_" + response.status);
      const data = await response.json();
      const city = String(data?.city || "").trim().slice(0, 80);
      const countryCode = String(data?.countryCode || "").toUpperCase();
      if (!city && !/^[A-Z]{2}$/.test(countryCode)) throw new Error("visitor_location_unavailable");

      let greeting = String(data?.greeting || "").replace(/[\r\n]+/g, " ").trim().slice(0, 180);
      const generic = !greeting || /^(welcome aboard!?|welcome aboard! your next great connection starts here\.?)$/i.test(greeting);
      if (normalize(city) === "cancun" && generic) {
        greeting = "¡Qué onda, Cancún! From the Caribbean coast, welcome—let’s make every business connection count.";
      } else if (city && generic) {
        greeting = "Hey " + city + "! Welcome aboard Star69AI—let’s make every connection count.";
      } else if (!city && generic) {
        greeting = "Welcome from " + countryName(countryCode) + "—your next great connection starts here.";
      }
      if (!greeting) throw new Error("welcome_message_unavailable");
      return { greeting, countryCode };
    } finally {
      window.clearTimeout(timeout);
    }
  }

  (async () => {
    let result = null;
    for (const endpoint of endpoints) {
      try { result = await requestWelcome(endpoint); break; }
      catch (_) { /* Try the second configured Worker hostname. */ }
    }
    if (!result) return; // No generic greeting: only show a location-aware welcome.
    bubble.textContent = result.greeting;
    bubble.hidden = false;
    if (flag) {
      const emoji = countryFlag(result.countryCode);
      if (emoji) {
        flag.textContent = emoji;
        flag.setAttribute("aria-label", countryName(result.countryCode));
        flag.hidden = false;
        const landingFlag = document.querySelector(".s69-home-banner .s69-landing-flag");
        if (landingFlag) landingFlag.textContent = emoji;
      }
    }
    wrap.classList.add("is-visible");
  })();
})();