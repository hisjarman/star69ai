(() => {
  const markup = `
    <header class="site-global-header" data-site-global-header>
      <a class="site-global-brand" href="/" aria-label="Star69AI home">
        <img src="/assets/star69ai-logo.png" alt="Star69AI — Smarter Calls. Bigger Opportunity.">
      </a>
      <button class="site-global-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="site-global-navigation">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-global-nav" id="site-global-navigation" aria-label="Main navigation">
        <a data-nav-path="/" href="/">Home</a>
        <a data-nav-path="/how-it-works.html" href="/how-it-works.html">How it works</a>
        <a data-nav-path="/hub/" href="/hub/">Industry Hub</a>
        <a data-nav-path="/pricing.html" href="/pricing.html">Pricing</a>
        <a data-nav-path="/demos.html" href="/demos.html">Demos</a>
        <a data-nav-path="/learning-center/" href="/learning-center/">Learning Center</a>
        <a data-nav-path="/blog/" href="/blog/">Stories</a>
        <details class="site-global-more">
          <summary>More <span aria-hidden="true">⌄</span></summary>
          <div class="site-global-more-panel">
            <a href="/about.html">About Star69AI</a>
            <a href="/managed-service.html">Managed service</a>
            <a href="/directory/">Provider directory</a>
            <a href="/research/managed-ai-receptionists.html">Managed AI research</a>
            <a href="/industries.html">Industry overview</a>
            <a href="/faq.html">FAQ</a>
            <a href="/challenge/">AI Challenge</a>
            <a href="/trust-lab.html">AI Trust Lab</a>
            <a href="/partners/">Partner program</a>
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
          </div>
        </details>
        <a class="site-global-partner-mobile" href="/partner-portal/">Partner Login ↗</a>
        <a class="site-global-mobile-start" href="/get-started.html">Get started ↗</a>
      </nav>
      <div class="site-global-actions">
        <a class="site-global-partner" href="/partner-portal/" aria-label="Partner Login — open the private Partner Center">Partner Login <span aria-hidden="true">↗</span></a>
        <a class="site-global-login" href="/client/">Client Login</a>
        <a class="site-global-start" href="/get-started.html">Get Started <span aria-hidden="true">↗</span></a>
      </div>
    </header>`;
  const install = () => {
    if (!document.body || document.querySelector('[data-site-global-header]')) return;
    const existingSiteHeader = document.querySelector('body > header.topbar, body > header.reference-topbar, body > header.site-header') || document.querySelector('body > header');
    if (existingSiteHeader) existingSiteHeader.remove();
    document.body.insertAdjacentHTML('afterbegin', markup);
    const header = document.querySelector('[data-site-global-header]');
    const toggle = header.querySelector('.site-global-toggle');
    const nav = header.querySelector('.site-global-nav');
    const close = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('click', event => { if (!header.contains(event.target)) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    header.querySelectorAll('[data-nav-path]').forEach(link => {
      const target = link.getAttribute('data-nav-path').replace(/\/$/, '') || '/';
      if (path === target || (target !== '/' && path.startsWith(target + '/'))) {
        link.setAttribute('aria-current', 'page');
      }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 980) close(); });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();