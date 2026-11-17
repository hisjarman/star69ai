(() => {
  const markup = `
    <header class="site-global-header" data-site-global-header>
      <a class="site-global-brand" href="/" aria-label="Star69AI home">
        <img src="/assets/star69ai-logo-transparent.webp" alt="Star69AI — Smarter Calls. Bigger Opportunity." decoding="async" fetchpriority="high">
      </a>
      <button class="site-global-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="site-global-navigation">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-global-nav" id="site-global-navigation" aria-label="Main navigation">
        <a data-nav-path="/" href="/">Home</a>
        <a data-nav-path="/how-it-works.html" href="/how-it-works.html">How it works</a>
        <a data-nav-path="/hub/" href="/hub/">Industry Hub</a>
        <a data-nav-path="/pricing.html" href="/pricing.html">Pricing</a>
        <details class="site-global-more">
          <summary>Explore <span aria-hidden="true">⌄</span></summary>
          <div class="site-global-more-panel">
            <a data-nav-path="/demos.html" href="/demos.html">Demos</a>
            <a data-nav-path="/learning-center/" href="/learning-center/">Learning Center</a>
            <a data-nav-path="/blog/" href="/blog/">Stories</a>
            <a data-nav-path="/about.html" href="/about.html">About Star69AI</a>
            <a data-nav-path="/managed-service.html" href="/managed-service.html">Managed service</a>
            <a data-nav-path="/directory/" href="/directory/">Provider directory</a>
            <a data-nav-path="/research/" href="/research/managed-ai-receptionists.html">Managed AI research</a>
            <a data-nav-path="/industries.html" href="/industries.html">Industry overview</a>
            <a data-nav-path="/faq.html" href="/faq.html">FAQ</a>
            <a data-nav-path="/challenge/" href="/challenge/">AI Challenge</a>
            <a data-nav-path="/trust-lab.html" href="/trust-lab.html">AI Trust Lab</a>
            <a data-nav-path="/partners/" href="/partners/">Partner program</a>
            <a data-nav-path="/privacy.html" href="/privacy.html">Privacy</a>
            <a data-nav-path="/terms.html" href="/terms.html">Terms</a>
          </div>
        </details>
        <a class="site-global-partner-mobile" href="/partner-portal/">Partner Login ↗</a>
        <a class="site-global-mobile-start" href="/get-started.html">Get Started ↗</a>
      </nav>
      <div class="site-global-actions">
        <a class="site-global-partner" href="/partner-portal/" aria-label="Partner Login — open the private Partner Center">Partner Login ↗</a>
        <a class="site-global-login" href="/client/">Client Login</a>
        <a class="site-global-start" href="/get-started.html">Get Started ↗</a>
      </div>
    </header>`;
  const install = () => {
    if (!document.body || document.querySelector('[data-site-global-header]')) return;
    const legacyHeader = document.querySelector('body > header.topbar, body > header.reference-topbar, body > header.site-header') || document.querySelector('body > header');
    if (legacyHeader) legacyHeader.remove();
    document.body.insertAdjacentHTML('afterbegin', markup);

    const header = document.querySelector('[data-site-global-header]');
    const toggle = header.querySelector('.site-global-toggle');
    const nav = header.querySelector('.site-global-nav');
    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMenu();
        header.querySelector('.site-global-toggle').focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMenu();
    });

    const currentPath = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    header.querySelectorAll('[data-nav-path]').forEach(link => {
      const targetPath = link.getAttribute('data-nav-path').replace(/\/$/, '') || '/';
      if (currentPath === targetPath || (targetPath !== '/' && currentPath.startsWith(targetPath + '/'))) {
        link.setAttribute('aria-current', 'page');
        const parentMenu = link.closest('.site-global-more');
        if (parentMenu) parentMenu.open = true;
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();