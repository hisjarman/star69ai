(() => {
  "use strict";
  // The homepage embeds this page in a compact live-demo dialog. Do not inject
  // the site-wide Secret Mission marker or its fixed map launcher into that
  // embedded experience; they otherwise float over the call controls/transcript.
  if (new URLSearchParams(window.location.search).get("embed") === "hero") return;
  const STORAGE_KEY = "star69ai.secretMission.v1";
  const steps = [
    { path: "/", selector: ".s69-hero-copy", name: "The First Signal", short: "THE SIGNAL", clue: "A missed call becomes a captured opportunity only when the process is designed. Find the page that explains the journey from discovery to launch.", next: "/how-it-works.html", nextName: "How It Works" },
    { path: "/how-it-works.html", selector: ".steps-grid", name: "The Blueprint", short: "THE BLUEPRINT", clue: "Every trade speaks a different language. Find where Star69AI maps call handling to the businesses it serves.", next: "/industries.html", nextName: "Industry Hub" },
    { path: "/industries.html", selector: ".industry-grid", name: "The Field Guide", short: "THE FIELD GUIDE", clue: "Every mission needs fuel. Find the page where the service plans and included voice minutes are laid out.", next: "/pricing.html", nextName: "Pricing" },
    { path: "/pricing.html", selector: ".pricing-grid", name: "The Fuel Vault", short: "THE FUEL VAULT", clue: "A map can describe a system, but a recording lets you hear it. Find the page with sample calls and the interactive dashboard.", next: "/demos.html", nextName: "Demos" },
    { path: "/demos.html", selector: "#demo-center", name: "The Final Transmission", short: "FINAL TRANSMISSION", clue: "You followed the signals, explored the operation and reached the final transmission. Collect this last fragment to become a Star Navigator.", next: "/", nextName: "Home" }
  ];
  const path = (() => { const p = window.location.pathname.replace(/\/+$/, ""); return p || "/"; })();
  const stepIndex = steps.findIndex(step => step.path === path);
  if (stepIndex < 0 || document.querySelector("[data-secret-mission-marker]")) return;
  const readState = () => {
    try {
      const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      return { stage: Math.max(0, Math.min(steps.length, Number(raw.stage) || 0)), started: !!raw.started };
    } catch (_) { return { stage: 0, started: false }; }
  };
  const saveState = state => { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} };
  let state = readState();
  const icon = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 27 37 7l-8 19 12 8-31 8 7-12Z" fill="#07162c" stroke="#91dcff" stroke-width="1.8" stroke-linejoin="round"/><path d="m17 30 12-4 12 8-25 6Z" fill="#34fd78"/><path d="m7 27 11 3-7 10Z" fill="#f461fe"/><path d="m5 38-4 4m8-2-4 6" stroke="#43b4fe" stroke-width="2" stroke-linecap="round"/></svg>';
  const marker = document.createElement("button");
  marker.type = "button"; marker.className = "sm-signal"; marker.dataset.secretMissionMarker = "true";
  marker.setAttribute("aria-label", "Discover a hidden Star69AI mission signal");
  marker.title = "A faint signal is hiding here";
  marker.innerHTML = '<span class="sm-signal-glow"></span>' + icon + '<span class="sm-signal-spark">✦</span>';
  const anchor = document.querySelector(steps[stepIndex].selector);
  if (!anchor) return;
  if (window.getComputedStyle(anchor).position === "static") anchor.style.position = "relative";
  anchor.appendChild(marker);
  const mapButton = document.createElement("button");
  mapButton.type = "button"; mapButton.className = "sm-map-launch";
  mapButton.innerHTML = '<span aria-hidden="true">✧</span><span>MISSION MAP <b>' + state.stage + '/' + steps.length + '</b></span>';
  mapButton.setAttribute("aria-label", "Open Star69AI Secret Mission map");
  mapButton.hidden = !state.started;
  document.body.appendChild(mapButton);
  const dialog = document.createElement("dialog");
  dialog.className = "sm-dialog"; dialog.setAttribute("aria-labelledby", "sm-title");
  document.body.appendChild(dialog);
  const mapPoints = [[48,112],[178,55],[304,83],[438,93],[570,48]];
  function mapGraphic() {
    let nodes = "";
    mapPoints.forEach((pt,i) => {
      const done = i < state.stage;
      nodes += '<circle cx="' + pt[0] + '" cy="' + pt[1] + '" r="18" fill="#0b1c34" stroke="' + (done ? "#34fd78" : "#47708e") + '" stroke-width="2"/>';
      nodes += '<circle cx="' + pt[0] + '" cy="' + pt[1] + '" r="5" fill="' + (done ? "#34fd78" : "#91dcff") + '" opacity="' + (done ? "1" : ".6") + '"/>';
      nodes += '<text x="' + pt[0] + '" y="' + (pt[1]+4) + '" text-anchor="middle" fill="#f4f8fc" font-size="10" font-family="monospace">' + (done ? "✓" : i+1) + '</text>';
    });
    return '<svg class="sm-map-art" viewBox="0 0 620 180" role="img" aria-label="Five connected signal points across a star map"><defs><linearGradient id="sm-route" x1="0" x2="1"><stop stop-color="#f461fe"/><stop offset=".5" stop-color="#43b4fe"/><stop offset="1" stop-color="#34fd78"/></linearGradient></defs><path d="M48 112 C110 10 175 158 238 83 S360 20 414 93 S520 142 570 48" fill="none" stroke="url(#sm-route)" stroke-width="2.5" stroke-dasharray="5 8" opacity=".85"/>' + nodes + '<path d="M570 18v-9m-4 4h8" stroke="#f461fe" stroke-width="2" stroke-linecap="round"/></svg>';
  }
  function renderDialog(mode) {
    state = readState();
    const complete = state.stage >= steps.length;
    const current = steps[Math.min(state.stage, steps.length - 1)];
    let panel = "";
    if (complete) {
      panel = '<div class="sm-complete"><div class="sm-badge">✦</div><p class="sm-kicker">MISSION COMPLETE</p><h2 id="sm-title">Star Navigator unlocked.</h2><p>You recovered all five signal fragments. A quiet thank-you is now unlocked for completing the Star69AI exploration.</p><div class="sm-achievement"><span>✧</span><div><b>STAR NAVIGATOR</b><small>Five signals recovered · third monthly subscription free unlocked</small></div></div><p class="sm-reward-terms">After two successful monthly subscription payments, your third monthly subscription invoice is free. New monthly subscriptions only; the $99 setup fee still applies. Not combinable with partner discounts or other promotions. Available through November 30, 2026.</p><a class="sm-primary" href="/checkout.html?promo=3FORFREE">Unlock your mission reward <span>↗</span></a></div>';
    } else if (mode === "map") {
      panel = '<p class="sm-kicker">STAR69AI // EXPLORATION LOG</p><h2 id="sm-title">Your mission map</h2><p class="sm-copy">Five hidden signals are scattered across the site. Find each one to complete the route.</p>' + mapGraphic() + '<div class="sm-progress"><span>RECOVERED SIGNALS</span><b>' + state.stage + ' OF ' + steps.length + '</b></div><div class="sm-track"><i style="width:' + (state.stage/steps.length*100) + '%"></i></div><div class="sm-next"><span class="sm-status-dot"></span><div><b>Next coordinates: ' + (state.stage === 0 ? "The First Signal" : current.name) + '</b><small>' + (state.stage === 0 ? "Start on the homepage and look for the faint spacecraft signal." : "Continue exploring the page named in your latest clue.") + '</small></div></div><button class="sm-primary" type="button" data-sm-resume>Resume mission <span>↗</span></button>';
    } else if (stepIndex < state.stage) {
      panel = '<p class="sm-kicker">SIGNAL ' + (stepIndex+1) + ' // ARCHIVED</p><h2 id="sm-title">' + steps[stepIndex].name + '</h2><p class="sm-copy">You already recovered this fragment. The next signal is waiting at <strong>' + current.name + '</strong>.</p>' + mapGraphic() + '<a class="sm-primary" href="' + current.path + '">Follow next coordinates <span>↗</span></a>';
    } else if (stepIndex > state.stage) {
      panel = '<p class="sm-kicker">SIGNAL LOCKED</p><h2 id="sm-title">Not this sector. Yet.</h2><p class="sm-copy">Your map points to <strong>' + current.name + '</strong>. Follow the previous clue before searching this location.</p>' + mapGraphic() + '<a class="sm-primary" href="' + current.path + '">Go to ' + current.name + ' <span>↗</span></a>';
    } else {
      panel = '<p class="sm-kicker">SIGNAL ' + (stepIndex+1) + ' OF ' + steps.length + ' // ' + steps[stepIndex].short + '</p><h2 id="sm-title">' + steps[stepIndex].name + '</h2><p class="sm-copy">' + steps[stepIndex].clue + '</p>' + mapGraphic() + '<div class="sm-progress"><span>RECOVERED SIGNALS</span><b>' + state.stage + ' OF ' + steps.length + '</b></div><div class="sm-track"><i style="width:' + (state.stage/steps.length*100) + '%"></i></div><button class="sm-primary" type="button" data-sm-collect>Collect signal fragment <span>✦</span></button>';
    }
    dialog.innerHTML = '<div class="sm-dialog-shell"><div class="sm-dialog-top"><span><i></i> SECRET MISSION // OPTIONAL SITE EXPLORATION</span><button class="sm-close" type="button" aria-label="Close mission window">×</button></div><div class="sm-dialog-content">' + panel + '</div><p class="sm-privacy">Progress is saved only in this browser. No account, email or personal information is required.</p></div>';
    dialog.querySelector(".sm-close").addEventListener("click", () => dialog.close());
    const collect = dialog.querySelector("[data-sm-collect]");
    if (collect) collect.addEventListener("click", () => {
      state = { stage: Math.min(steps.length, state.stage + 1), started: true };
      saveState(state); mapButton.hidden = false;
      mapButton.querySelector("b").textContent = state.stage + '/' + steps.length;
      renderDialog("map");
    });
    const resume = dialog.querySelector("[data-sm-resume]");
    if (resume) resume.addEventListener("click", () => {
      dialog.close();
      const destination = state.stage === 0 ? "/" : current.path;
      if (path !== destination) window.location.href = destination;
      else { const nextMarker = document.querySelector("[data-secret-mission-marker]"); if (nextMarker) nextMarker.focus(); }
    });
  }
  function openDialog(mode) { renderDialog(mode); if (!dialog.open) dialog.showModal(); }
  marker.addEventListener("click", () => {
    state = readState();
    if (!state.started) { state.started = true; saveState(state); mapButton.hidden = false; }
    openDialog("signal");
  });
  mapButton.addEventListener("click", () => openDialog("map"));
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
})();