(() => {
 const links=Array.from(document.querySelectorAll('[data-history-jump]')),cards=Array.from(document.querySelectorAll('.technology-history-card'));
 if(!links.length||!cards.length)return;
 const sync=year=>{links.forEach(link=>{const active=link.dataset.historyJump===year;link.classList.toggle('is-active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});};
 const openChapter=(year,updateHash=true)=>{const target=document.getElementById('technology-history-year-'+year);if(!target)return;cards.forEach(card=>card.open=card===target);sync(year);if(updateHash)history.replaceState(null,'','#'+target.id);target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});target.querySelector('summary')?.focus({preventScroll:true});};
 links.forEach(link=>link.addEventListener('click',event=>{event.preventDefault();openChapter(link.dataset.historyJump);}));
 cards.forEach(card=>card.addEventListener('toggle',()=>{if(!card.open)return;cards.forEach(other=>{if(other!==card)other.open=false;});sync(card.id.replace('technology-history-year-',''));}));
 const initial=location.hash.match(/^#technology-history-year-(1876|1878|1891|1963|1973|1995|today)$/);if(initial){const target=document.getElementById('technology-history-year-'+initial[1]);if(target)target.open=true;sync(initial[1]);}
})();