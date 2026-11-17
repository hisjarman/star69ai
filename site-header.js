(() => {
  const headerMarkup = \`
    <header class="site-global-header" data-site-global-header>
      <a class="site-global-brand" href="/" aria-label="Star69AI home">
        <img src="/assets/main_logo.webp" alt="Star69AI — Communications, Evolved.">
      </a>
      <button class="site-global-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="site-global-navigation">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-global-nav" id="site-global-navigation" aria-label="Main navigation">
        <a data-nav-path="/" href="/">Home</a>
        <a href="/#features">Features</a>
        <a data-nav-path="/pricing.html" href="/pricing.html">Pricing</a>
        <a data-nav-path="/how-it-works.html" href="/how-it-works.html">How it works</a>
        <a data-nav-path="/industries.html" href="/industries.html">Industries</a>
        <details class="site-global-more">
          <summary>Explore <span aria-hidden="true">⌄</span></summary>
          <div class="site-global-more-panel">
            <a href="/managed-service.html">Managed service</a>
            <a href="/demos.html">Listen to demos</a>
            <a href="/insights/">Insights &amp; guides</a>
            <a href="/blog/">Saved by the AI Receptionist!</a>
            <a href="/challenge/">Receptionist Architect</a>
            <a href="/trust-lab.html">AI Trust Lab</a>
            <a href="/about.html">About Star69AI</a>
            <a href="/faq.html">Frequently asked questions</a>
            <a href="/partners/">Partner program</a>
          </div>
        </details>
        <details class="site-global-language">
          <summary><span aria-hidden="true">◎</span> 55+ Languages <b aria-hidden="true">⌄</b></summary>
          <div class="site-global-language-panel">
            <strong>AI receptionist language support</strong>
            <span>🇺🇸 English</span><span>🇪🇸 Español</span><span>🇫🇷 Français</span>
            <span>🇩🇪 Deutsch</span><span>🇨🇳 中文</span>
            <small>And 50+ more supported languages</small>
          </div>
        </details>
        <a class="site-global-mobile-partner" href="/partner-portal/">Partner Login ↗</a>
        <a class="site-global-mobile-start" href="/get-started.html">Initiate Contact ↗</a>
      </nav>
      <div class="site-global-actions">
        <a class="site-global-partner" href="/partner-portal/">Partner</a>
        <a class="site-global-login" href="/client/">Client Login</a>
        <a class="site-global-start" href="/get-started.html">Get Started <span aria-hidden="true">↗</span></a>
      </div>
    </header>\`;

  const isBrandLogo = img => {
    const src = (img.getAttribute('src') || '').toLowerCase();
    const alt = (img.getAttribute('alt') || '').toLowerCase();
    return /main_logo\\.(?:webp|png|svg)|icon_main\\.(?:webp|png|svg)|star69ai-logo|logo(?:%20|[ _-])*star69ai|star69ai(?:%20|[ _-])*logo|logo-transparent/.test(src) ||
      ((alt.includes('star69ai') || alt.includes('star 69 ai')) && /logo|brand|wordmark|mark/.test(alt));
  };

  const install = () => {
    if (!document.body) return;
    document.querySelectorAll('.reference-topbar,.s69-header,header.topbar,header.site-header,[data-legacy-site-header]').forEach(node => node.remove());
    let header = document.querySelector('[data-site-global-header]');
    if (!header) {
      document.body.insertAdjacentHTML('afterbegin', headerMarkup);
      header = document.querySelector('[data-site-global-header]');
    }
    document.querySelectorAll('[data-site-global-header]').forEach((node,index) => { if(index>0) node.remove(); });
    if (!header || header.dataset.navigationReady === 'true') return;
    header.dataset.navigationReady = 'true';

    const toggle = header.querySelector('.site-global-toggle');
    const nav = header.querySelector('.site-global-nav');
    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open navigation menu');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open ? 'Close navigation menu' : 'Open navigation menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
    document.addEventListener('click',event => { if(!header.contains(event.target)) closeMenu(); });
    document.addEventListener('keydown',event => { if(event.key === 'Escape') { closeMenu(); nav.querySelectorAll('details[open]').forEach(item=>item.removeAttribute('open')); } });
    window.addEventListener('resize',()=>{ if(window.innerWidth > 1040) closeMenu(); });

    const path = location.pathname.replace(/index\\.html$/,'').replace(/\\/$/,'') || '/';
    header.querySelectorAll('[data-nav-path]').forEach(link => {
      const target = link.getAttribute('data-nav-path').replace(/\\/$/,'') || '/';
      if(path === target || (target !== '/' && path.startsWith(target + '/'))) link.setAttribute('aria-current','page');
    });

    document.querySelectorAll('img').forEach(img => {
      const src = (img.getAttribute('src') || '').toLowerCase();
      const alt = (img.getAttribute('alt') || '').toLowerCase();
      const legacyBrand = /star69ai-logo-transparent|logo(?:%20|[ _-])*star69ai|star69ai(?:%20|[ _-])*logo|logo-transparent/.test(src) ||
        ((alt.includes('star69ai') || alt.includes('star 69 ai')) && /logo|brand|wordmark/.test(alt));
      if (legacyBrand && !src.includes('icon_main.webp')) {
        img.src = '/assets/main_logo.webp';
        img.alt = 'Star69AI — Communications, Evolved.';
      }
    });

    document.querySelectorAll('footer').forEach(pageFooter => {
      const brandImages = Array.from(pageFooter.querySelectorAll('img')).filter(isBrandLogo);
      const keeper = brandImages.find(img => !/icon_main\\./i.test(img.getAttribute('src') || '')) || brandImages[0];
      if (keeper) {
        keeper.src = '/assets/main_logo.webp';
        keeper.alt = 'Star69AI — Communications, Evolved.';
        brandImages.filter(img => img !== keeper).forEach(img => {
          const link = img.parentElement;
          if(link && link.tagName === 'A' && link.children.length === 1) link.remove();
          else img.remove();
        });
      } else if(!pageFooter.querySelector('[data-star69ai-footer-brand]')) {
        const footerBrand = document.createElement('a');
        footerBrand.className = 'site-global-footer-brand';
        footerBrand.dataset.star69aiFooterBrand = 'true';
        footerBrand.href = '/';
        footerBrand.setAttribute('aria-label','Star69AI home');
        footerBrand.innerHTML = '<img src="/assets/main_logo.webp" alt="Star69AI — Communications, Evolved.">';
        pageFooter.insertBefore(footerBrand,pageFooter.firstChild);
      }
    });
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();