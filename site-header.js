(() => {
  const groups = [
    { title: "EXPLORE", subtitle: "Discover the service", links: [
      ["Home","/","home","cyan"],["How it works","/how-it-works.html","workflow","blue"],
      ["What it can do","/capabilities.html","sparkles","purple"],["Industry Hub","/hub/","layers","green"],
      ["Industry overview","/industries.html","briefcase","green"],["Provider directory","/directory/","globe","purple"]
    ]},
    { title: "SEE IT IN ACTION", subtitle: "Experience the technology", links: [
      ["Demos","/demos.html","play-circle","purple"],["AI Challenge","/challenge/","gamepad-2","purple"],
      ["AI Trust Lab","/trust-lab.html","shield-check","cyan"]
    ]},
    { title: "LEARN & SUPPORT", subtitle: "Answers and insights", links: [
      ["Learning Center","/learning-center/","graduation-cap","blue"],["Stories","/blog/","book-open","gold"],
      ["FAQ","/faq.html","circle-help","gold"],["Managed AI research","/research/managed-ai-receptionists.html","microscope","blue"]
    ]},
    { title: "COMPANY & PLANS", subtitle: "Work with Star69AI", links: [
      ["About Star69AI","/about.html","orbit","cyan"],["Managed service","/managed-service.html","sliders","green"],
      ["Pricing","/pricing.html","credit-card","gold"],["Partner program","/partners/","users","green"]
    ]},
    { title: "POLICIES", subtitle: "Your information and terms", links: [
      ["Privacy","/privacy.html","lock","blue"],["Terms","/terms.html","file-text","gold"]
    ]}
  ];
  const navIcons = {home:"⌂",workflow:"⌘",layers:"▦","credit-card":"＄","play-circle":"▷","graduation-cap":"✧","book-open":"▤",orbit:"✳",sliders:"☷",globe:"◎",microscope:"⌕",briefcase:"▣","circle-help":"?","gamepad-2":"⌗","shield-check":"⬡",users:"◉",lock:"▧","file-text":"▤",sparkles:"✧"};
  const markup = `
    <header class="site-global-header" data-site-global-header>
      <div class="site-global-cover">
        <img class="site-global-cover-image" src="/assets/image_hero.webp" alt="Star69AI over a cinematic space horizon" fetchpriority="high" decoding="async">
        <div class="site-global-cover-shade" aria-hidden="true"></div>
        <a class="site-global-home-brand" href="/" aria-label="Star69AI home"><img src="/assets/main_logo.webp" alt="Star69AI"></a>
        <div class="site-global-cover-topline"><span class="site-global-status"><i></i> SYSTEM ONLINE</span></div>
      </div>
      <div class="site-global-utility">
        <button class="site-global-toggle" type="button" aria-label="Open Star69AI navigation" aria-expanded="false" aria-controls="site-global-navigation">
          <span class="site-global-toggle-label">MENU</span><span class="site-global-toggle-icon"><i></i><i></i><i></i></span>
        </button>
        <nav class="site-global-nav" id="site-global-navigation" aria-label="Star69AI main navigation" inert>
          <div class="site-global-nav-head"><span>MISSION CONTROL <small>// SELECT DESTINATION</small></span><span class="site-global-nav-live"><i></i> ALL SYSTEMS READY</span></div>
          <div class="site-global-nav-grid">
            ${groups.map(group => `<section class="site-global-nav-group" aria-label="${group.title}">
              <div class="site-global-nav-group-head"><h2>${group.title}</h2><p>${group.subtitle}</p></div>
              <div class="site-global-nav-group-links">${group.links.map(([label,url,icon,color]) => `<a class="site-global-nav-button tone-${color}" data-nav-path="${url}" href="${url}"><span class="site-global-nav-symbol" aria-hidden="true">${navIcons[icon] || "✦"}</span><span>${label}</span><b aria-hidden="true">↗</b></a>`).join("")}</div>
            </section>`).join("")}
          </div>
          <div class="site-global-nav-footer"><span>STAR69AI // NAVIGATION ARRAY</span><span>SECURE CONNECTION <i></i></span></div>
        </nav>

        <a class="site-global-partner" href="/partner-portal/">PARTNER LOGIN <span>↗</span></a>
        <a class="site-global-login" href="/client/">CLIENT CONSOLE <span>↗</span></a>
        <a class="site-global-start" href="/get-started.html">INITIATE CONTACT <span>↗</span></a>

      </div>
    </header>`;
  const installCookieConsent = () => {
    if (document.querySelector("[data-star69-cookie-banner]")) return;
    const key = "star69ai-cookie-consent-v1";
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(key) || "null"); } catch {}
    if (typeof window.gtag === "function") window.gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
    if (saved && saved.version === 1 && ["all","essential"].includes(saved.choice)) { if (typeof window.gtag === "function") window.gtag("consent","update",{analytics_storage:saved.analytics?"granted":"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"}); return; }
    const banner = document.createElement("section");
    banner.className = "star69-cookie-banner";
    banner.dataset.star69CookieBanner = "true";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-labelledby", "star69-cookie-title");
    banner.innerHTML = '<div class="star69-cookie-copy"><strong id="star69-cookie-title">Your privacy choices</strong><p>Essential storage supports site security and checkout. Choose whether to allow optional analytics. You can allow optional analytics, reject optional cookies, or customize your choice. <a href="/privacy.html">Read the Privacy Notice</a>.</p><div class="star69-cookie-custom" hidden><label><input type="checkbox" checked disabled> Essential storage (always on)</label><label><input type="checkbox" data-cookie-analytics> Optional analytics</label></div></div><div class="star69-cookie-actions"><button type="button" data-cookie-customize>Customize</button><button type="button" data-cookie-reject>Reject optional</button><button type="button" data-cookie-accept>Allow analytics</button></div>';
    document.body.appendChild(banner);
    const save = choice => {
      const detail = {version:1,choice,analytics:choice === "all",timestamp:new Date().toISOString()};
      try { localStorage.setItem(key, JSON.stringify(detail)); } catch {}
      banner.remove();
      window.dispatchEvent(new CustomEvent("star69ai:cookie-consent",{detail}));
      if (typeof window.gtag === "function") window.gtag("consent","update",{analytics_storage:detail.analytics?"granted":"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
    };
    banner.querySelector("[data-cookie-accept]").addEventListener("click",()=>save("all"));
    banner.querySelector("[data-cookie-reject]").addEventListener("click",()=>save("essential"));
    banner.querySelector("[data-cookie-customize]").addEventListener("click",event=>{
      const panel=banner.querySelector(".star69-cookie-custom");
      panel.hidden=!panel.hidden;
      event.currentTarget.textContent=panel.hidden?"Customize":"Hide options";
      if(!panel.hidden)banner.querySelector("[data-cookie-analytics]").focus();
    });
    banner.querySelector(".star69-cookie-custom").addEventListener("change",event=>{
      if(event.target.matches("[data-cookie-analytics]"))save(event.target.checked?"all":"essential");
    });
  };
  const install = () => {
    if (!document.body) return;
    installCookieConsent();
    const homePath = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
    document.body.classList.toggle("site-home-page", homePath === "/");
    document.body.classList.toggle("site-interior-page", homePath !== "/");
    document.querySelectorAll(".reference-topbar,.s69-header,header.topbar,header.site-header,[data-legacy-site-header]").forEach(node => node.remove());
    if (!document.querySelector("[data-site-global-header]")) document.body.insertAdjacentHTML("afterbegin", markup);
    // Replay a decorative visitor flight on every homepage load, choosing a different route.
    if (homePath === "/" && !document.querySelector(".site-global-arrival")) {
      const cover = document.querySelector(".site-global-cover");
      if (cover) {
        const route = 1 + Math.floor(Math.random() * 4);
        const arrival = document.createElement("div");
        arrival.className = "site-global-arrival route-" + route;
        arrival.setAttribute("aria-hidden", "true");
        const visitorShip = document.createElement("img");
        visitorShip.className = "site-global-visitor-ship";
        visitorShip.src = "/assets/visitorspaceship.png";
        visitorShip.alt = "";
        visitorShip.decoding = "async";
        visitorShip.draggable = false;
        const flag = document.createElement("span");
        flag.className = "site-global-arrival-flag";
        visitorShip.addEventListener("load", () => arrival.classList.add("is-ready"), { once: true });
        visitorShip.addEventListener("error", () => arrival.remove(), { once: true });
        arrival.append(visitorShip, flag);
        cover.appendChild(arrival);
      }
      if (!document.querySelector("[data-star69-visitor-welcome-loader]")) {
        const welcomeScript = document.createElement("script");
        welcomeScript.src = "/assets/visitor-welcome.js";
        welcomeScript.defer = true;
        welcomeScript.dataset.star69VisitorWelcomeLoader = "true";
        document.head.appendChild(welcomeScript);
      }
    }
    document.querySelectorAll("[data-site-global-header]").forEach((node,index) => { if (index > 0) node.remove(); });
    const header = document.querySelector("[data-site-global-header]");
    if (!header || header.dataset.navigationReady === "true") return;
    header.dataset.navigationReady = "true";
    const toggle = header.querySelector('.site-global-toggle');
    const nav = header.querySelector('.site-global-nav');
    const setMenu = open => {
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close Star69AI navigation' : 'Open Star69AI navigation');
      toggle.querySelector('.site-global-toggle-label').textContent = open ? 'CLOSE' : 'MENU';
      nav.inert = !open;
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', event => { if (!header.contains(event.target)) setMenu(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
    const currentPath = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    header.querySelectorAll('[data-nav-path]').forEach(link => {
      const target = link.getAttribute('data-nav-path').replace(/\/$/, '') || '/';
      if (currentPath === target || (target !== '/' && currentPath.startsWith(target + '/'))) {
        link.setAttribute('aria-current','page');
        link.classList.add('is-current');
      }
    });

    const isBrandLogo = img => {
      const src = (img.getAttribute("src") || "").toLowerCase();
      const alt = (img.getAttribute("alt") || "").toLowerCase();
      return /main_logo\\.(?:webp|png|svg)|icon_main\\.(?:webp|png|svg)|star69ai-logo|logo(?:%20|[ _-])*star69ai|star69ai(?:%20|[ _-])*logo|logo-transparent/.test(src) ||
        ((alt.includes("star69ai") || alt.includes("star 69 ai")) && /logo|brand|wordmark|mark/.test(alt));
    };
    document.querySelectorAll("img").forEach(img => {
      const src = (img.getAttribute("src") || "").toLowerCase();
      const alt = (img.getAttribute("alt") || "").toLowerCase();
      const legacyBrand = /star69ai-logo-transparent|logo(?:%20|[ _-])*star69ai|star69ai(?:%20|[ _-])*logo|logo-transparent/.test(src) ||
        ((alt.includes("star69ai") || alt.includes("star 69 ai")) && /logo|brand|wordmark/.test(alt));
      if (legacyBrand && !src.includes("icon_main.webp")) {
        img.src = "/assets/main_logo.webp";
        img.alt = "Star69AI — Communications, Evolved.";
      }
    });
    document.querySelectorAll("footer").forEach(pageFooter => {
      const brandImages = Array.from(pageFooter.querySelectorAll("img")).filter(isBrandLogo);
      const keeper = brandImages.find(img => !/icon_main\\./i.test(img.getAttribute("src") || "")) || brandImages[0];
      if (keeper) {
        keeper.src = "/assets/main_logo.webp";
        keeper.alt = "Star69AI — Communications, Evolved.";
        brandImages.filter(img => img !== keeper).forEach(img => {
          const link = img.parentElement;
          if (link && link.tagName === "A" && link.children.length === 1) link.remove();
          else img.remove();
        });
      } else if (!pageFooter.querySelector("[data-star69ai-footer-brand]")) {
        const footerBrand = document.createElement("a");
        footerBrand.className = "site-global-footer-brand";
        footerBrand.dataset.star69aiFooterBrand = "true";
        footerBrand.href = "/";
        footerBrand.setAttribute("aria-label", "Star69AI home");
        footerBrand.innerHTML = '<img src="/assets/main_logo.webp" alt="Star69AI — Communications, Evolved.">';
        pageFooter.insertBefore(footerBrand, pageFooter.firstChild);
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
  // Use the supplied ship artwork as a scaled desktop pointer follower.
  if (!document.querySelector("[data-star69-cursor-loader]")) {
    const cursorScript = document.createElement("script");
    cursorScript.src = "/assets/cursor-follower.js";
    cursorScript.defer = true;
    cursorScript.dataset.star69CursorLoader = "true";
    document.head.appendChild(cursorScript);
  }
})();