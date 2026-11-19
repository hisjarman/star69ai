(() => {
  const cover = document.querySelector(".site-global-cover");
  if (!cover || cover.dataset.welcomeRequested === "true") return;
  cover.dataset.welcomeRequested = "true";
  const flag = document.querySelector(".site-global-arrival-flag");
  const bubble = document.createElement("div");
  bubble.className = "site-global-welcome-bubble";
  bubble.setAttribute("role", "status");
  bubble.setAttribute("aria-live", "polite");
  bubble.hidden = true;
  cover.appendChild(bubble);
  const countryFlag = code => {
    if (!/^[A-Z]{2}$/.test(String(code || ""))) return "";
    return String.fromCodePoint(...Array.from(code.toUpperCase(), char => 127397 + char.charCodeAt(0)));
  };
  const show = data => {
    const greeting = String(data?.greeting || "Welcome aboard! Your next great connection starts here.").replace(/[\r\n]+/g, " ").trim().slice(0, 180);
    bubble.textContent = greeting;
    bubble.hidden = false;
    requestAnimationFrame(() => bubble.classList.add("is-visible"));
    const city = String(data?.city || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const countryCode = city === "cancun" ? "MX" : String(data?.countryCode || "").toUpperCase();
    const emoji = countryFlag(countryCode);
    if (flag && emoji) {
      flag.dataset.flag = emoji;
      flag.setAttribute("aria-label", countryCode === "MX" ? "Mexico" : countryCode);
    }
  };
  fetch("https://star69ai-concierge.hisjarman.workers.dev/api/welcome", {
    method: "GET", mode: "cors", credentials: "omit", cache: "no-store", headers: { Accept: "application/json" }
  }).then(response => {
    if (!response.ok) throw new Error("welcome_unavailable");
    return response.json();
  }).then(show).catch(() => show({ greeting: "Welcome aboard! Your next great connection starts here." }));
})();
