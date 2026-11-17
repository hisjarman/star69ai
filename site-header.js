(() => {
  const links = [
    ["Home","/","home","cyan"],["How it works","/how-it-works.html","workflow","blue"],
    ["Industry Hub","/hub/","layers","green"],["Pricing","/pricing.html","credit-card","gold"],
    ["Demos","/demos.html","play-circle","purple"],["Learning Center","/learning-center/","graduation-cap","blue"],
    ["Stories","/blog/","book-open","gold"],["About Star69AI","/about.html","orbit","cyan"],
    ["Managed service","/managed-service.html","sliders","green"],["Provider directory","/directory/","globe","purple"],
    ["Managed AI research","/research/managed-ai-receptionists.html","microscope","blue"],["Industry overview","/industries.html","briefcase","green"],
    ["FAQ","/faq.html","circle-help","gold"],["AI Challenge","/challenge/","gamepad-2","purple"],
    ["AI Trust Lab","/trust-lab.html","shield-check","cyan"],["Partner program","/partners/","users","green"],
    ["Privacy","/privacy.html","lock","blue"],["Terms","/terms.html","file-text","gold"]
  ];
  const markup = `
    <header class="site-global-header" data-site-global-header>
      <div class="site-global-cover">
        <img class="site-global-cover-image" src="/assets/image_hero.webp" alt="Star69AI communications evolved — cinematic space banner" fetchpriority="high" decoding="async">
        <div class="site-global-cover-shade" aria-hidden="true"></div>
        <div class="site-global-cover-topline"><span class="site-global-status"><i></i> SYSTEM ONLINE</span><span class="site-global-tagline">COMMUNICATIONS, EVOLVED.</span></div>
        <button class="site-global-toggle" type="button" aria-label="Open Star69AI navigation" aria-expanded="false" aria-controls="site-global-navigation">
          <span class="site-global-toggle-label">MENU</span><span class="site-global-toggle-icon"><i></i><i></i><i></i></span>
        </button>
        <nav class="site-global-nav" id="site-global-navigation" aria-label="Star69AI main navigation" inert>
          <div class="site-global-nav-head"><span class="site-global-nav-identity"><svg class="site-global-yinyang-mark" viewBox="0 0 64 64" role="img" aria-label="Star69AI yin-yang symbol" focusable="false"><circle cx="32" cy="32" r="30" fill="#f5fbff"/><path d="M32 2a30 30 0 0 1 0 60 15 15 0 0 1 0-30 15 15 0 0 0 0-30Z" fill="#061326"/><circle cx="32" cy="17" r="4.2" fill="#061326"/><circle cx="32" cy="47" r="4.2" fill="#f5fbff"/></svg><span>MISSION CONTROL <small>// SELECT DESTINATION</small></span></span><span class="site-global-nav-live"><i></i> ALL SYSTEMS READY</span></div>
          <div class="site-global-nav-grid">
            ${links.map(([label,url,icon,color]) => `<a class="site-global-nav-button tone-${color}" data-nav-path="${url}" href="${url}"><span class="site-global-nav-symbol" aria-hidden="true">${({home:"⌂",workflow:"⌘",layers:"▦","credit-card":"＄","play-circle":"▷","graduation-cap":"✧","book-open":"▤",orbit:"✳",sliders:"☷",globe:"◎",microscope:"⌕",briefcase:"▣","circle-help":"?","gamepad-2":"⌗","shield-check":"⬡",users:"◉",lock:"▧","file-text":"▤"})[icon] || "✦"}</span><span>${label}</span><b aria-hidden="true">↗</b></a>`).join("")}
          </div>
          <div class="site-global-nav-footer"><span>STAR69AI // NAVIGATION ARRAY</span><span>SECURE CONNECTION <i></i></span></div>
        </nav>
      </div>
      <div class="site-global-utility">
        <a class="site-global-brand" href="/" aria-label="Star69AI home"><img src="/assets/main_logo.webp" alt="Star69AI — Communications. Evolved."></a>
        <a class="site-global-partner" href="/partner-portal/">PARTNER LOGIN <span>↗</span></a>
        <a class="site-global-login" href="/client/">CLIENT CONSOLE <span>↗</span></a>
        <a class="site-global-start" href="/get-started.html">INITIATE CONTACT <span>↗</span></a>
      </div>
    </header>`;
  const install = () => {
    if (!document.body || document.querySelector('[data-site-global-header]')) return;
    const legacyHeader = document.querySelector('body > header.topbar, body > header.reference-topbar, body > header.site-header') || document.querySelector('body > header');
    if (legacyHeader) legacyHeader.remove();
    document.body.insertAdjacentHTML('afterbegin', markup);
    document.querySelectorAll('img[src*="star69ai-logo-transparent"], img[src*="Logo%20Star69AI"]').forEach(img => {
      img.src = '/assets/main_logo.webp';
      img.alt = 'Star69AI — Communications. Evolved.';
    });
    const pageFooter = document.querySelector('body > footer, main + footer, footer');
    if (pageFooter) {
      const existingFooterLogo = pageFooter.querySelector('img[alt*="Star69AI"], img[src*="logo"]');
      if (existingFooterLogo) {
        existingFooterLogo.src = '/assets/main_logo.webp';
        existingFooterLogo.alt = 'Star69AI — Communications. Evolved.';
      } else if (!pageFooter.querySelector('[data-star69ai-footer-brand]')) {
        const footerBrand = document.createElement('a');
        footerBrand.className = 'site-global-footer-brand';
        footerBrand.dataset.star69aiFooterBrand = 'true';
        footerBrand.href = '/';
        footerBrand.setAttribute('aria-label', 'Star69AI home');
        footerBrand.innerHTML = '<img src="/assets/main_logo.webp" alt="Star69AI — Communications. Evolved.">';
        pageFooter.insertBefore(footerBrand, pageFooter.firstChild);
      }
    }
    const header = document.querySelector('[data-site-global-header]');
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
    const currentPath = location.pathname.replace(/index\\.html$/, '').replace(/\\/$/, '') || '/';
    header.querySelectorAll('[data-nav-path]').forEach(link => {
      const target = link.getAttribute('data-nav-path').replace(/\\/$/, '') || '/';
      if (currentPath === target || (target !== '/' && currentPath.startsWith(target + '/'))) {
        link.setAttribute('aria-current','page');
        link.classList.add('is-current');
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();