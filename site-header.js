(() => {
  const headerMarkup = `
    <header class="site-global-header" data-site-global-header>
      <div class="site-global-cover" aria-label="Star69AI">
        <img class="site-global-cover-image" src="/assets/image_hero.webp" alt="Star69AI — communications evolved" fetchpriority="high" decoding="async">
        <div class="site-global-cover-shade" aria-hidden="true"></div>
        <div class="site-global-cover-topline"><span class="site-global-status"><i></i> SYSTEM ONLINE</span><span class="site-global-tagline">COMMUNICATIONS, EVOLVED.</span></div>
      </div>
      <nav class="site-global-utility" aria-label="Client, partner and contact">
        <a class="site-global-login" href="/client/">CLIENT <span aria-hidden="true">↗</span></a>
        <a class="site-global-partner" href="/partner-portal/">PARTNER <span aria-hidden="true">↗</span></a>
        <a class="site-global-start" href="/get-started.html">INITIATE CONTACT <span aria-hidden="true">↗</span></a>
      </nav>
    </header>`;

  const isBrandLogo = img => {
    const src = (img.getAttribute('src') || '').toLowerCase();
    const alt = (img.getAttribute('alt') || '').toLowerCase();
    return /main_logo\.(?:webp|png|svg)|icon_main\.(?:webp|png|svg)|star69ai-logo|logo(?:%20|[ _-])*star69ai|star69ai(?:%20|[ _-])*logo|logo-transparent/.test(src) ||
      ((alt.includes('star69ai') || alt.includes('star 69 ai')) && /logo|brand|wordmark|mark/.test(alt));
  };

  const install = () => {
    if (!document.body) return;
    // Remove retired public-site headers wherever a page nested or duplicated them.
    document.querySelectorAll('.reference-topbar,.s69-header,header.topbar,header.site-header,[data-legacy-site-header]').forEach(node => node.remove());
    document.querySelectorAll('body > header:not([data-site-global-header])').forEach(node => node.remove());

    let header = document.querySelector('[data-site-global-header]');
    if (!header) {
      document.body.insertAdjacentHTML('afterbegin', headerMarkup);
      header = document.querySelector('[data-site-global-header]');
    }
    // Keep exactly one shared header if a page contains a stale duplicate.
    document.querySelectorAll('[data-site-global-header]').forEach((node,index) => { if(index>0) node.remove(); });

    document.querySelectorAll('img').forEach(img => {
      const src = (img.getAttribute('src') || '').toLowerCase();
      const alt = (img.getAttribute('alt') || '').toLowerCase();
      const legacyBrand = /star69ai-logo-transparent|logo(?:%20|[ _-])*star69ai|star69ai(?:%20|[ _-])*logo|logo-transparent/.test(src) ||
        ((alt.includes('star69ai') || alt.includes('star 69 ai')) && /logo|brand|wordmark/.test(alt));
      if (legacyBrand && !src.includes('icon_main.webp')) {
        img.src = '/assets/main_logo.webp';
        img.alt = 'Star69AI — Communications. Evolved.';
      }
    });

    document.querySelectorAll('footer').forEach(pageFooter => {
      const brandImages = Array.from(pageFooter.querySelectorAll('img')).filter(isBrandLogo);
      const keeper = brandImages.find(img => !/icon_main\./i.test(img.getAttribute('src') || '')) || brandImages[0];
      if (keeper) {
        keeper.src = '/assets/main_logo.webp';
        keeper.alt = 'Star69AI — Communications. Evolved.';
        brandImages.filter(img => img !== keeper).forEach(img => {
          const link = img.parentElement;
          if (link && link.tagName === 'A' && link.children.length === 1) link.remove();
          else img.remove();
        });
      } else if (!pageFooter.querySelector('[data-star69ai-footer-brand]')) {
        const footerBrand = document.createElement('a');
        footerBrand.className = 'site-global-footer-brand';
        footerBrand.dataset.star69aiFooterBrand = 'true';
        footerBrand.href = '/';
        footerBrand.setAttribute('aria-label', 'Star69AI home');
        footerBrand.innerHTML = '<img src="/assets/main_logo.webp" alt="Star69AI — Communications. Evolved.">';
        pageFooter.insertBefore(footerBrand, pageFooter.firstChild);
      }
    });

    // Inject a final, high-specificity footer guard after page styles have loaded.
    if (!document.getElementById('star69ai-footer-theme-guard')) {
      const style = document.createElement('style');
      style.id = 'star69ai-footer-theme-guard';
      style.textContent = `
        html body footer,html body footer.footer,html body footer.site-footer,html body footer.footer.site-footer{
          background-color:#030918!important;background-image:linear-gradient(135deg,#030918 0%,#061326 55%,#030918 100%)!important;
          color:#eaf3ff!important;border-color:rgba(67,180,254,.24)!important;color-scheme:dark!important;
        }
        html body footer :where(.footer-main,.footer-bottom,.footer-disclaimer,.footer-brand-column,.footer-column,.footer-contact){
          background:transparent!important;color:#eaf3ff!important;
        }
        html body footer :where(h1,h2,h3,h4,strong,b){color:#f4f8ff!important}
        html body footer :where(p,span,small,li,label){color:#c4d5e8!important}
        html body footer a{color:#9edcff!important}
        html body footer img{background:transparent!important}
      `;
      document.head.appendChild(style);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();