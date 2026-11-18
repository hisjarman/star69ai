(() => {
  if (window.matchMedia && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (document.querySelector(".star69-cursor-follower")) return;
  const style = document.createElement("style");
  style.textContent = "@media (hover:hover) and (pointer:fine) { html.star69-custom-cursor-active,html.star69-custom-cursor-active body,html.star69-custom-cursor-active a,html.star69-custom-cursor-active button,html.star69-custom-cursor-active [role=button]{cursor:none!important} html.star69-custom-cursor-active input,html.star69-custom-cursor-active textarea,html.star69-custom-cursor-active [contenteditable=true]{cursor:text!important} .star69-cursor-follower{position:fixed;left:0;top:0;z-index:2147483647;width:58px;height:auto;max-height:42px;object-fit:contain;pointer-events:none;opacity:0;transform:translate(-9px,-8px);filter:drop-shadow(0 2px 5px rgba(0,0,0,.65));transition:opacity .12s ease,filter .12s ease;will-change:transform}.star69-cursor-follower.is-visible{opacity:1}.star69-cursor-follower.is-clicking{filter:drop-shadow(0 0 8px #43b4fe) brightness(1.12)} }";
  document.head.appendChild(style);
  const ship=document.createElement("img");ship.className="star69-cursor-follower";ship.src="/assets/cursor.webp";ship.alt="";ship.setAttribute("aria-hidden","true");ship.decoding="async";document.body.appendChild(ship);
  document.documentElement.classList.add("star69-custom-cursor-active");
  let active=false;
  window.addEventListener("pointermove",event=>{if(event.pointerType!=="mouse"&&event.pointerType!=="pen")return;ship.style.transform="translate("+(event.clientX-9)+"px,"+(event.clientY-8)+"px)";if(!active){active=true;ship.classList.add("is-visible");}},{passive:true});
  window.addEventListener("pointerdown",()=>ship.classList.add("is-clicking"),{passive:true});window.addEventListener("pointerup",()=>ship.classList.remove("is-clicking"),{passive:true});
  window.addEventListener("blur",()=>ship.classList.remove("is-visible"));document.addEventListener("visibilitychange",()=>{if(document.hidden)ship.classList.remove("is-visible");});
  window.addEventListener("pointerover",event=>{if(event.target&&event.target.closest&&event.target.closest("input,textarea,[contenteditable=true]"))ship.style.opacity="0";else ship.style.opacity="";},{passive:true});
})();