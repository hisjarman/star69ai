(()=> {
 // Respect Chrome desktop-site mode: Android desktop UA commonly reports X11/Linux x86_64 even if UA Client Hints still reports a mobile device.
 const ua=navigator.userAgent||'', uaLooksDesktop=/Windows NT|Macintosh|X11|Linux x86_64|CrOS/i.test(ua), uaLooksMobile=/Android.*Mobile|iPhone|iPad|iPod|Mobile/i.test(ua);
 const desktopSiteMode=uaLooksDesktop||(!!navigator.userAgentData&&!navigator.userAgentData.mobile)||!uaLooksMobile;
 if(desktopSiteMode) document.documentElement.classList.add("cockpit-desktop-mode");
 const API="https://avr-platform-api.hisjarman.workers.dev", OVERAGE_RATES={starter:0.55,growth:0.45,pro:0.36};
 const $=s=>document.querySelector(s);
 let clerk=null,customer=null,loading=false;
 function note(t,e=false){const n=$("#notice");n.textContent=t;n.classList.remove("hidden","error");if(e)n.classList.add("error")}
 async function api(path,opts={}){const token=await clerk.session?.getToken();if(!token)throw Error("Please sign in again.");const r=await fetch(API+path,{...opts,headers:{Accept:"application/json",...(opts.body?{"Content-Type":"application/json"}:{}),Authorization:"Bearer "+token,...(opts.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok){const error=new Error(d.error||"Request failed ("+r.status+")");error.referenceId=d.referenceId||null;error.providerCode=d.providerCode||null;error.providerStatus=d.providerStatus||r.status;throw error}return d}
 function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
 function fmtDate(v){if(!v)return "—";const n=Number(v);const d=new Date(Number.isFinite(n)?(n>1e12?n:n*1000):v);return Number.isNaN(d.getTime())?"—":d.toLocaleString()}
 function safeHttps(v){try{const u=new URL(v);return u.protocol==="https:"?u.href:""}catch{return ""}}
 function money(v){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(v)}
 function showPage(page){
  const labels={overview:["Overview","A clear view of your receptionist and business activity."],receptionist:["Your receptionist","Your assigned AI receptionist, configuration and improvement requests."],billing:["Plan & billing","Manage your subscription, usage and business profile."],addons:["Upgrades & add-ons","Extend your receptionist with additional capabilities."],calls:["Call activity","Review recent calls, summaries, transcripts and recordings."],support:["Support center","Get help, request changes and track your support requests."],knowledge:["Knowledge center","Guides to your receptionist, features, usage, billing and support."]};
  document.querySelectorAll("[data-page-panel]").forEach(p=>p.classList.toggle("active",p.dataset.pagePanel===page));
  document.querySelectorAll(".client-nav-item").forEach(b=>{const active=b.dataset.page===page;b.classList.toggle("active",active);if(active)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
  document.querySelectorAll(".cockpit-top-tab").forEach(b=>{const active=b.dataset.page===page;b.classList.toggle("active",active);if(active)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
  $("#workspace")?.classList.remove("cockpit-drawer-open");$("#cockpit-menu-toggle")?.setAttribute("aria-expanded","false");
  const label=labels[page]||labels.overview;$("#client-page-title").textContent=label[0];$("#client-page-description").textContent=label[1];
  try{history.replaceState(null,"",page==="overview"?"#overview":"#"+page)}catch{}
  if(page==="knowledge")initKnowledgeSearch();
 }
 function initKnowledgeSearch(){
  const input=$("#knowledge-search"),status=$("#knowledge-search-status"),articles=[...document.querySelectorAll(".knowledge-article")],groups=[...document.querySelectorAll(".knowledge-group")];
  if(!input||input.dataset.bound)return;
  input.dataset.bound="1";
  input.addEventListener("input",()=>{
    const q=input.value.trim().toLowerCase();let matches=0;
    articles.forEach(article=>{const hit=!q||article.textContent.toLowerCase().includes(q);article.hidden=!hit;if(q&&hit){article.open=true;matches++}});
    groups.forEach(group=>{group.hidden=!!q&&!group.querySelector(".knowledge-article:not([hidden])")});
    if(status)status.textContent=q?(matches+" matching guide"+(matches===1?"":"s")+" found. Clear the search to browse every topic."):"Browse the guides below or search for a topic.";
  });
}
document.addEventListener("click",e=>{const link=e.target.closest(".knowledge-category-grid a");if(link){const target=document.querySelector(link.getAttribute("href"));if(target){document.querySelectorAll(".knowledge-group").forEach(g=>g.hidden=false);const input=$("#knowledge-search");if(input){input.value="";input.dispatchEvent(new Event("input"))}}}});

 function showSignedOut(){$("#auth").classList.remove("hidden");$("#app").classList.add("hidden");$("#session-pill").textContent="Signed out"}
 function renderOnboarding(onboarding){
  const root=$("#onboarding-panel");if(!root)return;
  const stage=$("#onboarding-stage"),message=$("#onboarding-message"),approve=$("#approve-demo"),subscribe=$("#start-subscription"),setup=$("#pay-setup-fee");
  approve.hidden=true;subscribe.hidden=true;setup.hidden=true;
  if(!onboarding){root.hidden=true;return}root.hidden=false;
  const ready=!!onboarding.agent_id&&onboarding.status==="provisioned",approved=!!onboarding.demoApproved,paid=onboarding.plan_payment_status==="paid",setupPaid=onboarding.setup_status==="paid"||onboarding.setup_status==="not_required";
  if(!ready){stage.textContent="Demo in preparation";message.textContent="We are building your personalized demo receptionist and preparing your client account. Refresh this page shortly.";return}
  if(!approved){stage.textContent="Demo ready for review";message.textContent="Your personalized demo receptionist is ready. Review it in the Receptionist section. When you are satisfied, approve the demo to continue. No setup fee has been charged.";approve.hidden=false;return}
  if(!paid){stage.textContent="Demo approved";message.textContent="Your demo is approved. Start your "+(onboarding.billing_cadence==="monthly"?"monthly Stripe subscription":"prepaid plan payment")+". The setup fee is not due until your plan payment is confirmed.";subscribe.hidden=false;return}
  if(!setupPaid){stage.textContent="Setup payment due";message.textContent="Your plan payment is confirmed. Complete the one-time $"+(Number(onboarding.setupAmountCents||0)/100).toFixed(2)+" setup payment through PayPal to authorize managed live-service activation.";setup.hidden=false;return}
  stage.textContent="Payments verified";message.textContent="Your demo is approved and required payments are verified. Our team can now complete live agent configuration, phone-number assignment and final call testing. Your receptionist will not answer production calls until that work is complete.";
 }
 async function handleOnboardingAction(button,path,successMessage){
  button.disabled=true;const original=button.textContent;button.textContent="Please wait…";
  try{const d=await api(path,{method:"POST",body:"{}"});if(d.approvalUrl)location.assign(d.approvalUrl);else if(d.stripeUrl)location.assign(d.stripeUrl);else if(d.completeUrl)location.assign(d.completeUrl);else{note(successMessage||"Updated.");await load()}}
  catch(e){note(e.message,true);button.disabled=false;button.textContent=original}
 }
 async function captureSetupReturn(){
  const q=new URLSearchParams(location.search);
  if(q.get("setup_payment_cancelled")==="1"){note("The PayPal setup payment was cancelled. You can retry it from your launch checklist.");history.replaceState(null,"",location.pathname+"#overview");return}
  if(q.get("setup_payment")!=="1"||!q.get("token"))return;
  note("PayPal approved the setup payment. Verifying it securely…");
  try{await api("/api/public/checkout/capture",{method:"POST",body:JSON.stringify({onboardingId:q.get("onboarding_id"),statusToken:q.get("status_token"),orderId:q.get("token")})});history.replaceState(null,"",location.pathname+"#overview");note("Setup payment verified. Your account is ready for managed launch.")}
  catch(e){note(e.message==="setup_offer_updated_please_resume_checkout"?"The setup offer has been updated to the current discount limit. Please return to your launch checklist and restart the PayPal setup payment.":"Payment verification did not complete: "+e.message,true)}
 } async function captureWalletTopupReturn(){
  const q=new URLSearchParams(location.search);
  if(q.get("payg_topup_cancelled")==="1"){note("The PayPal top-up was cancelled. No wallet credit was added.");history.replaceState(null,"",location.pathname+"#billing");return}
  if(q.get("payg_topup")!=="1"||!q.get("token")||!q.get("topup_id"))return;
  note("PayPal approved your wallet top-up. Verifying the payment before adding credit…");
  try{const d=await api("/api/client/payg-wallet/topup/capture",{method:"POST",body:JSON.stringify({topupId:q.get("topup_id"),orderId:q.get("token")})});history.replaceState(null,"",location.pathname+"#billing");note("PayPal verified. "+money(Number(d.amountCents||0)/100)+" has been added to your Flex wallet.")}
  catch(e){note("Wallet top-up verification did not complete: "+e.message,true)}
 }
 async function loadFlexWallet(){
  const panel=$("#flex-wallet-panel");if(!panel)return;
  if(customer?.plan!=="flex"){panel.hidden=true;return}
  panel.hidden=false;
  try{
   const d=await api("/api/client/payg-wallet");
   $("#flex-wallet-balance").textContent=money(Number(d.balanceCents||0)/100);
   $("#flex-wallet-status").textContent=d.walletStatus||"not funded";
   $("#flex-wallet-eligibility").textContent=d.canReceiveCalls?"Ready":"Paused";$("#flex-wallet-note").textContent=d.activationNote||"Star69AI must assign your receptionist and phone number before live calls can connect.";
   const rows=d.transactions||[];
   $("#flex-wallet-history").innerHTML=rows.length?'<table><thead><tr><th>DATE</th><th>ACTIVITY</th><th>AMOUNT</th><th>DETAIL</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+safe(fmtDate(x.created_at))+'</td><td>'+safe(x.entry_type||"wallet")+'</td><td>'+money(Number(x.amount_cents||0)/100)+'</td><td>'+safe(x.note||x.source_ref||"—")+'</td></tr>').join("")+'</tbody></table>':'<div class="empty">No wallet activity yet. Add credit to enable Flex calls.</div>';
  }catch(e){$("#flex-wallet-history").innerHTML='<div class="empty">'+safe(e.message)+'</div>'}
 }

 function renderUsage(usage,included,plan){
  const used=Math.max(0,Number(usage.minutes||0)),allowance=Math.max(0,Number(included||0)),over=Math.max(0,Number(usage.billableOverageMinutes??(used-allowance))),vault=Math.max(0,Number(usage.vaultMinutes||0)),vaultUsed=Math.max(0,Number(usage.vaultUsedThisMonth||0)),pct=allowance?Math.min(100,used/allowance*100):0;
  const overageLimit=Math.max(0,Number(usage.overageLimitMinutes||0)),overageStopAt=Math.max(0,Number(usage.overageStopAtMinutes||0));
  $("#usage-percent").textContent=Math.round(pct)+"%";
  $("#usage-fill").style.width=pct+"%";
  $("#usage-fill").classList.toggle("over-limit",over>0);
  $("#usage-left").textContent=allowance?Math.max(0,allowance-used)+" minutes remaining": "No included minutes on this account";
  $("#usage-total").textContent=used+" of "+allowance+" included minutes";
  const overageRate=OVERAGE_RATES[String(plan||"").toLowerCase()];
  $("#overage-rate").textContent=String(plan||"").toLowerCase()==="flex"?money(0.65)+" / minute":overageRate===undefined?"See your plan":money(overageRate)+" / minute";
  $("#overage-estimate").textContent=String(plan||"").toLowerCase()==="flex"?"Prepaid wallet balance controls call access":"Estimated overage after vault: "+(overageRate===undefined?"—":money(over*overageRate));
  if($("#vault-balance"))$("#vault-balance").textContent=vault.toLocaleString();
  if($("#vault-used"))$("#vault-used").textContent=vaultUsed.toLocaleString()+" min";
  if($("#vault-overage"))$("#vault-overage").textContent=over.toLocaleString()+" min";
  const cardStatus=$("#overage-payment-status");if(cardStatus)cardStatus.textContent=customer?.hasOveragePaymentMethod?"A card is saved for automatic overage collection.":"Add a card to enable overage billing; calls will stop at included and vaulted minutes until one is saved.";
  const billingState=$("#overage-billing-state"),billingSummary=$("#overage-billed-summary");if(billingState&&customer){billingState.textContent=customer.hasOveragePaymentMethod?(customer.billingCadence==="monthly"?"Automatic overage billing is authorized. New overage is added to your next monthly Stripe invoice.":"Automatic overage billing is authorized. Prepaid overage is invoiced separately through Stripe."):"Save a card to authorize automatic overage collection. Calls stop at included and vaulted minutes until a card is saved.";}if(billingSummary){const pending=Number(usage.overagePendingCents||0),paid=Number(usage.overagePaidCents||0),billed=Number(usage.overageBilledMinutes||0);billingSummary.textContent=billed?("Overage minutes submitted: "+billed.toLocaleString()+" · Paid: "+money(paid/100)+" · Pending or failed: "+money(pending/100)):"No overage billing recorded this month.";}
  const protection=$("#overage-protection-note");if(protection){if(String(plan||"").toLowerCase()==="flex"){protection.textContent="Pay-as-you-go calls are controlled by your prepaid wallet balance; new calls pause when the balance is exhausted."}else if(overageLimit>0){protection.textContent="Fixed plan overage ceiling: "+overageLimit.toLocaleString()+" minutes (75% of included plan minutes). New calls reserve capacity and are automatically limited to the remaining available duration."}else{protection.textContent=over>0?"New inbound calls are paused because no additional overage has been authorized.":"No overage beyond the fixed plan ceiling is permitted. New calls stop automatically when included minutes, vault minutes and the 75% plan overage cap are exhausted."}}
  $("#minutes-used").textContent=used.toLocaleString();
  $("#minutes-included").textContent=allowance.toLocaleString()+" included minutes";
 }
 function renderCalls(calls,defaultEmail=""){
  const root=$("#calls-table");
  if(!calls.length){root.innerHTML='<div class="empty">No calls have been recorded for your account yet.</div>';return}
  root.innerHTML='<table><thead><tr><th>DATE</th><th>CALLER</th><th>STATUS</th><th>DURATION</th><th>SUMMARY</th><th></th></tr></thead><tbody>'+calls.map((c,i)=>{
   const summary=c.call_summary||"No summary available",transcript=c.transcript||"",recording=safeHttps(c.recording_url);
   const callId=String(c.call_id||"");
   const detail='<div class="call-detail-grid"><div><b>Call summary</b><p>'+safe(summary)+'</p><p class="small">Direction: '+safe(c.direction||"—")+' · Sentiment: '+safe(c.user_sentiment||"—")+' · Disconnection: '+safe(c.disconnection_reason||"—")+'</p><form class="call-email-form" data-call-id="'+safe(callId)+'"><label class="small" for="call-email-'+i+'">Send call details to email</label><div class="row"><input id="call-email-'+i+'" name="email" type="email" value="'+safe(defaultEmail)+'" placeholder="name@business.com" required><button class="btn secondary" type="submit">Email details</button></div><label class="small"><input type="checkbox" name="authorized" required> I confirm this recipient is authorized to receive this call information.</label><span class="small email-status" role="status"></span></form></div><div><b>Transcript</b><pre class="transcript">'+safe(transcript||"No transcript available for this call.")+'</pre>'+(recording?'<audio class="call-audio" controls preload="none" src="'+safe(recording)+'">Your browser does not support audio playback.</audio><a class="small recording-link" href="'+safe(recording)+'" target="_blank" rel="noopener noreferrer">Open recording in new tab ↗</a>':'<span class="small">No recording available</span>')+'</div></div>';
   return '<tr><td>'+safe(fmtDate(c.start_timestamp))+'</td><td>'+safe(c.from_number||"Unknown")+'</td><td><span class="status">'+safe(c.call_status||"—")+'</span></td><td>'+Math.ceil((c.duration_ms||0)/60000)+' min</td><td><div class="call-summary">'+safe(summary)+'</div></td><td><button class="btn secondary call-toggle" type="button" data-call-index="'+i+'" aria-expanded="false">Details</button></td></tr><tr class="call-detail-row hidden" data-detail-index="'+i+'"><td colspan="6">'+detail+'</td></tr>';
  }).join("")+'</tbody></table>';
  root.querySelectorAll(".call-toggle").forEach(b=>b.addEventListener("click",()=>{const row=root.querySelector('[data-detail-index="'+b.dataset.callIndex+'"]');const open=row.classList.toggle("hidden")===false;b.setAttribute("aria-expanded",String(open));b.textContent=open?"Hide":"Details"}));
  root.querySelectorAll(".call-email-form").forEach(form=>form.addEventListener("submit",async e=>{
   e.preventDefault();const button=form.querySelector('button[type="submit"]'),status=form.querySelector(".email-status"),email=form.elements.email.value.trim();
   if(!form.elements.authorized.checked){status.textContent="Please confirm the recipient is authorized.";return}
   button.disabled=true;status.textContent="Sending…";
   try{await api("/api/client/calls/"+encodeURIComponent(form.dataset.callId)+"/email",{method:"POST",body:JSON.stringify({email})});status.textContent="Call details emailed successfully."}
   catch(err){
    const emailErrors={
     email_sender_not_configured_check_resend:"Email sending is not configured correctly. Please contact support.",
     email_provider_rate_limited_try_again:"The email service is temporarily rate-limiting requests. Please wait a moment and try again.",
     email_provider_temporarily_unavailable_try_again:"The email service could not confirm delivery. Please wait a moment and try again.",
     email_provider_rejected_request_contact_support:"The email service rejected this request. Please contact support so we can investigate."
    };
    status.textContent=(emailErrors[err.message]||err.message)+(err.referenceId?" Reference: "+err.referenceId:"")+(err.providerCode?" (provider code: "+err.providerCode+")":"");button.disabled=false
   }
  }));
 }


 async function loadCallEmailSettings(){
  const enabled=$("#call-email-enabled"),recipients=$("#call-email-recipients"),status=$("#call-email-settings-status");
  if(!enabled||!recipients)return;
  try{const d=await api("/api/client/call-email-settings");enabled.checked=!!d.enabled;recipients.value=(d.recipients||[]).join("\n");if(status)status.textContent=""}
  catch(e){if(status)status.textContent=e.message}
 }
 async function saveCallEmailSettings(e){
  e.preventDefault();const button=$("#save-call-email-settings"),status=$("#call-email-settings-status");
  button.disabled=true;status.textContent="Saving…";
  try{const recipients=$("#call-email-recipients").value.split(/[\n,;]+/).map(x=>x.trim()).filter(Boolean);await api("/api/client/call-email-settings",{method:"PUT",body:JSON.stringify({enabled:$("#call-email-enabled").checked,recipients})});status.textContent="Email preferences saved."}
  catch(err){status.textContent=err.message}
  finally{button.disabled=false}
 }

 const ticketCategory={change_request:"Change request",technical_support:"Technical support",concern:"Concern or complaint",billing:"Billing question",general:"General question"};
 const ticketStatus={open:"Open",in_progress:"In progress",waiting_on_customer:"Waiting on you",resolved:"Resolved",closed:"Closed"};
 function renderTickets(items){const root=$("#support-ticket-list");if(!root)return;if(!items.length){root.innerHTML='<div class="support-empty"><span>✳</span><b>No support requests yet</b><p>When you submit a request, you can track its status and our replies here.</p></div>';return}root.innerHTML=items.map(t=>'<article class="support-ticket"><div class="support-ticket-top"><div><span class="support-ticket-category">'+safe(ticketCategory[t.category]||t.category)+'</span><h4>'+safe(t.subject)+'</h4></div><span class="ticket-status '+safe(t.status)+'">'+safe(ticketStatus[t.status]||t.status)+'</span></div><p class="support-ticket-description">'+safe(t.description)+'</p><div class="support-ticket-meta"><span>Ticket #'+safe(String(t.id).slice(0,8).toUpperCase())+'</span><span>'+safe(fmtDate(t.created_at))+'</span><span class="ticket-priority '+safe(t.priority)+'">'+safe(t.priority)+' priority</span></div>'+(t.admin_reply?'<div class="support-reply"><b>Reply from support</b><p>'+safe(t.admin_reply)+'</p><span>'+safe(fmtDate(t.updated_at))+'</span></div>':'')+'</article>').join("")}
 async function loadTickets(){const root=$("#support-ticket-list");if(!root)return;root.innerHTML='<div class="empty">Loading support requests…</div>';try{const d=await api("/api/client/support-tickets");renderTickets(d.tickets||[])}catch(e){root.innerHTML='<div class="empty">'+safe(e.message)+'</div>'}}
 async function submitTicket(e){e.preventDefault();const form=e.currentTarget,button=$("#support-submit"),status=$("#support-form-status");button.disabled=true;status.textContent="Submitting securely…";try{const p=Object.fromEntries(new FormData(form).entries());await api("/api/client/support-tickets",{method:"POST",body:JSON.stringify(p)});form.reset();status.textContent="Your request has been submitted. You can track it below.";await loadTickets()}catch(err){status.textContent=err.message}finally{button.disabled=false}}

 const addonNames={voice_cloning:"Custom Voice Cloning",sms_messaging:"SMS Messaging",extra_numbers:"Additional Phone Numbers",advanced_analytics:"Advanced Analytics",calendar_booking:"Calendar & Appointment Booking",crm_integration:"CRM Integration",extra_languages:"Additional Language Configuration",priority_support:"Priority Support"};
 function addonStatus(v){return ({requested:"Request received",approved:"Approved",in_progress:"In progress",active:"Active",declined:"Not approved",cancelled:"Cancelled"})[v]||v}
 async function loadAddons(){
  const root=$("#addon-orders");if(!root)return;
  try{const d=await api("/api/client/addons");root.innerHTML=d.orders.length?d.orders.map(o=>'<div class="resource addon-order"><div><b>'+safe(o.addon_name||addonNames[o.addon_key]||o.addon_key)+'</b><span class="small">Requested '+safe(fmtDate(o.created_at))+'</span>'+(o.customer_note?'<p class="small">'+safe(o.customer_note)+'</p>':'')+'</div><span class="status '+safe(o.status)+'">'+safe(addonStatus(o.status))+'</span></div>').join(""):'<div class="empty">You have not requested any upgrades yet.</div>'}
  catch(e){root.innerHTML='<div class="empty">'+safe(e.message)+'</div>'}
 }
 async function requestAddon(key,button){
  if(button.disabled)return;
  const original=button.textContent;button.disabled=true;button.textContent="Submitting…";
  try{await api("/api/client/addons",{method:"POST",body:JSON.stringify({addonKey:key,note:$("#addon-note")?.value||""})});note("Upgrade request submitted. Our team will confirm pricing and availability before any charge.");if($("#addon-note"))$("#addon-note").value="";await loadAddons();button.textContent="Request received"}
  catch(e){note(e.message,true);button.disabled=false;button.textContent=original}
 }

 const agentOptionCatalog=[{"key":"voice","title":"A different voice","description":"Choose a voice style that better represents your business.","type":"voice"},{"key":"knowledge_base","title":"More business knowledge","description":"Add approved FAQs, service areas, services and business documents.","type":"knowledge_base"},{"key":"denoising","title":"Clearer calls in noisy places","description":"Improve how your receptionist handles background noise.","type":"denoising"},{"key":"safety","title":"Additional response safeguards","description":"Add extra rules for supported situations and sensitive call flows.","type":"safety"},{"key":"privacy","title":"Personal-information protection","description":"Explore additional redaction of personal information in supported call processing.","type":"privacy"},{"key":"sms","title":"Text message follow-ups","description":"Request appointment confirmations, follow-up messages or other approved business texts.","type":"sms"},{"key":"phone","title":"Additional phone number","description":"Add another business number or route calls differently.","type":"phone"},{"key":"other","title":"More simultaneous calls","description":"Increase simultaneous call capacity if your business regularly receives overlapping calls.","type":"other"},{"key":"other","title":"Different AI response engine","description":"Review a different balance of response quality, speed and operating cost.","type":"other"},{"key":"workflow","title":"Calendar, CRM or business workflow","description":"Connect supported scheduling, customer-management or business systems.","type":"workflow"}];
 function renderAgentOptions(){
  const root=$("#agent-improvement-options");if(!root)return;
  root.innerHTML=agentOptionCatalog.map(o=>'<article class="agent-option-card"><h4>'+safe(o.title)+'</h4><p>'+safe(o.description)+'</p><p class="small">Pricing and any third-party pass-through costs are confirmed in a written quote before work begins.</p><button type="button" class="btn secondary agent-option-request" data-request-type="'+safe(o.type)+'">Request this improvement</button></article>').join("");
  root.querySelectorAll(".agent-option-request").forEach(b=>b.addEventListener("click",()=>{$("#agent-change-type").value=b.dataset.requestType;toggleSmsFields();$("#agent-change-details").focus();$("#agent-change-details").scrollIntoView({behavior:"smooth",block:"center"})}));
 }
 function toggleSmsFields(){
  const box=$("#sms-business-details"),sms=$("#agent-change-type")?.value==="sms";
  if(box)box.hidden=!sms;
  if(box)box.querySelectorAll("[data-sms-required]").forEach(x=>x.required=sms);
 }
 function renderAgentConfiguration(configurations){
  const root=$("#agent-configuration");if(!root)return;
  if(!Array.isArray(configurations)||!configurations.length){root.innerHTML='<div class="empty">Your configuration details will appear here after your receptionist is assigned and synced.</div>';return}
  root.innerHTML=configurations.map(config=>{
   const fields=[["Language",config.language],["Voice",config.voiceLabel],["AI model",config.modelLabel],["Voice speed",config.voiceSpeed],["Voice temperature",config.voiceTemperature],["Response responsiveness",config.responsiveness],["Backchannel audio",config.backchannel],["Ambient sound",config.ambientSound],["Opening greeting",config.greeting],["Knowledge sources",config.knowledgeBaseCount===null?"Not reported":String(config.knowledgeBaseCount)],["Configured capabilities",config.toolNames?.length?config.toolNames.join(", "):"No tools reported"]];
   const prompt=config.clientVisiblePromptAvailable&&config.clientVisiblePrompt?'<section class="agent-prompt-preview"><div class="agent-prompt-head"><div><small>YOUR BUSINESS-SPECIFIC AI INSTRUCTIONS</small><h3>Complete published receptionist instructions</h3></div><span class="read-only-tag">Read only</span></div><pre>'+safe(config.clientVisiblePrompt)+'</pre><p class="small">This is the complete business-specific instruction set Star69AI has published for your receptionist. It is read-only; request a change below and our team will review, test and publish approved updates.</p></section>':'<section class="agent-prompt-preview"><div class="agent-prompt-head"><div><small>YOUR BUSINESS-SPECIFIC AI INSTRUCTIONS</small><h3>Instructions not yet published</h3></div><span class="read-only-tag">Read only</span></div><p class="small">Your receptionist is managed by Star69AI. Our team must review and publish the complete business-specific instructions before they appear here.</p></section>';
   return '<section class="agent-config-unit"><div class="agent-config-heading"><b>'+safe(config.agentName||"Assigned receptionist")+'</b><span class="small">'+safe(config.status||"Active")+' · synced '+safe(fmtDate(config.syncedAt))+'</span></div><div class="agent-config-cards">'+fields.filter(x=>x[1]).map(x=>'<article><small>'+safe(x[0])+'</small><b>'+safe(x[1])+'</b></article>').join("")+'</div>'+prompt+'</section>';
  }).join("")+'<p class="small agent-config-privacy">Your configuration is view-only. Request changes below; our team reviews, tests and applies approved updates. Credentials, webhook URLs and internal operating instructions remain private.</p>';
 }
function renderAgentRequests(items){
  const root=$("#agent-change-requests");if(!root)return;
  const labels={submitted:"Submitted",reviewing:"Being reviewed",quoted:"Quote ready",approved:"Approved",in_progress:"In progress",completed:"Completed",declined:"Not proceeding"};
  if(!items?.length){root.innerHTML='<div class="empty">You have not submitted any configuration requests yet.</div>';return}
  root.innerHTML=items.map(r=>'<article class="resource agent-request-item"><div><b>'+safe(r.title||r.request_type)+'</b><p class="small">'+safe(r.details)+'</p><span class="small">Submitted '+safe(fmtDate(r.created_at))+'</span>'+(r.admin_note?'<p class="small">Team update: '+safe(r.admin_note)+'</p>':'')+(r.quote_summary?'<p class="small agent-quote">'+safe(r.quote_summary)+'</p>':'')+(r.status==="quoted"&&r.quote_summary?'<button type="button" class="btn agent-approve-quote" data-approve-request="'+safe(r.id)+'">Approve this quote</button>':'')+'</div><span class="status">'+safe(labels[r.status]||r.status)+'</span></article>').join("");root.querySelectorAll("[data-approve-request]").forEach(b=>b.addEventListener("click",async()=>{if(!confirm("Approve this written quote? This authorizes our team to proceed with the quoted configuration work and any charges explicitly listed in that quote."))return;b.disabled=true;try{await api("/api/client/agent-change-requests/"+encodeURIComponent(b.dataset.approveRequest)+"/approve",{method:"POST",body:"{}"});await loadAgentConfiguration();note("Quote approved. Our team can now proceed with the agreed change.")}catch(e){note(e.message,true);b.disabled=false}}));
 }
 async function loadAgentConfiguration(){
  try{const [c,r]=await Promise.all([api("/api/client/agent-configuration"),api("/api/client/agent-change-requests")]);renderAgentConfiguration(c.configuration);renderAgentRequests(r.requests||[])}
  catch(e){const root=$("#agent-configuration");if(root)root.innerHTML='<div class="empty">'+safe(e.message)+'</div>';const req=$("#agent-change-requests");if(req)req.innerHTML='<div class="empty">'+safe(e.message)+'</div>'}
 }
 async function submitAgentChange(e){
  e.preventDefault();const button=$("#agent-change-submit"),status=$("#agent-change-status");button.disabled=true;status.textContent="Submitting securely…";
  try{const requestType=$("#agent-change-type").value,priority=$("#agent-change-priority").value,details=$("#agent-change-details").value.trim();if(details.length<10)throw Error("Please provide at least 10 characters of detail.");const keys=["legalName","businessType","businessAddress","website","contactName","contactTitle","contactEmail","contactPhone","industry","taxIdStatus","smsUseCase","optInMethod","optInDisclosure","optOutMethod","helpMethod","sampleMessage1","sampleMessage2","messageIncludesLinks","messageIncludesPhone","targetCountries","monthlyVolume","phoneNumberType"];const businessInfo=requestType==="sms"?Object.fromEntries(keys.map(k=>[k,$("#sms-"+k)?.value?.trim()||""])):null;if(requestType==="sms"&&Object.values(businessInfo).some(v=>!v))throw Error("Complete all required SMS business and messaging fields before submitting.");await api("/api/client/agent-change-requests",{method:"POST",body:JSON.stringify({requestType,priority,details,businessInfo})});$("#agent-change-form").reset();toggleSmsFields();status.textContent="Request sent. We’ll review it and provide a quote if additional costs apply.";await loadAgentConfiguration()}
  catch(err){status.textContent=err.message}
  finally{button.disabled=false}
 }
 async function load(){
  if(loading)return;loading=true;$("#refresh-dashboard").disabled=true;
  try{
   await captureSetupReturn();await captureWalletTopupReturn();const d=await api("/api/client/dashboard");customer=d.customer;
   $("#auth").classList.add("hidden");$("#app").classList.remove("hidden");$("#session-pill").textContent="Signed in";
   if(!customer){$("#no-account").classList.remove("hidden");$("#workspace").classList.add("hidden");return}
   $("#no-account").classList.add("hidden");$("#workspace").classList.remove("hidden");
   $("#business-title").textContent=customer.businessName||"Your dashboard";
   renderOnboarding(d.onboarding);
   $("#account-status").textContent=customer.status||"Pending";$("#account-status").className="status "+(customer.status||"pending");
   const plans={starter:["Starter","$149 / month"],growth:["Growth","$249 / month"],pro:["Pro","$399 / month"],flex:["Flex","$0.65 per AI minute"]};
   $("#plan-name").textContent=plans[customer.plan]?.[0]||"Not selected";
    const offerNote=$("#billing-offer-note");if(offerNote){const prepaid=["six_month","annual"].includes(d.onboarding?.billing_cadence);if(prepaid){offerNote.textContent="Your prepaid plan uses its separate 25% six-month or 35% twelve-month savings and waives the setup fee. Partner and AI Challenge discounts do not apply to prepaid purchases.";}else if(customer.hasPartnerReferral&&customer.partnerOfferMode==="discount"){offerNote.textContent="Your verified partner referral provides 15% off eligible monthly subscription payments for the first 12 months. The one-time setup fee remains $99 and is never discounted. This offer cannot be combined with AI Challenge rewards or prepaid savings.";}else if(customer.hasPartnerReferral){offerNote.textContent="Your partner referral is recorded for attribution and commission eligibility, but this standard link does not apply a customer discount. Challenge and prepaid offers are separate and cannot be combined.";}else{offerNote.textContent="AI Challenge rewards are 5%, 10% or 15% off monthly subscription payments for the first 12 months, depending on the level mastered. They never discount setup and cannot be combined with partner or prepaid offers. Secure reward redemption is not yet enabled.";}}
   $("#plan-price").textContent=plans[customer.plan]?.[1]||"Select a monthly plan";
   renderUsage(d.usage||{},customer.includedMinutes||0,customer.plan);
   $("#calls-count").textContent=Number(d.usage?.calls||0).toLocaleString();
   $("#subscription-status").textContent=customer.subscriptionStatus||"Not active";
   const cardButton=$("#overage-card-setup");if(cardButton){cardButton.textContent=customer.hasOveragePaymentMethod?"Update card for overage":"Add card for automatic overage";cardButton.disabled=false;}
   $("#billing-portal").disabled=!customer.hasBillingAccount;
   $("#billing-portal").textContent=customer.hasBillingAccount?"Manage subscription":"Billing not started";
   const onboardingLocked=!!d.onboarding&&(!d.onboarding.demoApproved||d.onboarding.plan_payment_status!=="paid"||d.onboarding.setup_status==="pending");document.querySelectorAll(".plan-btn").forEach(b=>{b.disabled=customer.plan==="flex"||onboardingLocked||["active","trialing","past_due"].includes(customer.subscriptionStatus)});const planActions=document.querySelector(".plan-actions");if(planActions)planActions.hidden=customer.plan==="flex"||onboardingLocked;
   $("#renewal-date").textContent=customer.periodEnd?"Period ends "+fmtDate(customer.periodEnd):"Manage billing below";
   $("#business-name").value=customer.businessName||"";
   $("#contact-name").value=customer.contactName||"";
   $("#contact-phone").value=customer.phone||"";
   $("#contact-email").value=customer.email||"";
   $("#agent-list").innerHTML=d.agents.length?d.agents.map(a=>{const isDemo=String(a.status||"").toLowerCase()==="demo";return '<div class="resource"><b>'+safe(a.agent_name||a.agent_id)+'</b><span class="small">'+(isDemo?'DEMO RECEPTIONIST · Not connected to a live phone number':'Live receptionist · '+safe(a.status||"Configured"))+'</span></div>'}).join(""):'<div class="empty">Your demo receptionist is being prepared. It will appear here when setup is complete.</div>';
   const hasDemo=d.agents.some(a=>String(a.status||"").toLowerCase()==="demo");
   const hasLive=d.agents.some(a=>String(a.status||"").toLowerCase()!=="demo");
   $("#receptionist-status").innerHTML=hasLive?'<b>Live receptionist configured</b><p class="small">Your managed receptionist is configured. Check the phone-number section below for the assigned business line.</p>':hasDemo?'<b>Demo receptionist ready</b><p class="small">Your personalized demo agent has been created from your business details. You can review its setup here. It is not connected to your live business number and cannot answer production calls yet.</p><p class="small">Next: our team completes configuration, assigns your phone number and tests the live call route.</p>':'<b>Demo receptionist in preparation</b><p class="small">Your account is ready. Your personalized demo agent will appear here as soon as provisioning is complete.</p>';
   $("#number-list").innerHTML=d.numbers.length?d.numbers.map(n=>'<div class="resource"><b>'+safe(n.phone_number)+'</b><span class="small">'+safe(n.nickname||"Business line")+'</span></div>').join(""):'<div class="empty"><b>Phone number not assigned yet</b><p class="small">That is expected at this stage. Your demo can be reviewed before a business number is assigned. We will complete number assignment and live-call testing during managed launch.</p></div>';
   renderCalls(d.calls||[],customer.email||"");
   await Promise.all([loadAddons(),loadTickets(),loadCallEmailSettings(),loadAgentConfiguration(),loadFlexWallet()]);
   renderAgentOptions();
  }catch(e){note(e.message,true)}
  finally{loading=false;$("#refresh-dashboard").disabled=false}
 }
 async function init(){
  try{
   if(!window.Clerk)throw Error("Clerk failed to load.");
   await window.Clerk.load({ui:{ClerkUI:window.__internal_ClerkUICtor},appearance:{variables:{colorPrimary:"#70e1cb",colorPrimaryForeground:"#10252b",colorBackground:"#182831",colorForeground:"#eaf1f2",colorInput:"#203943",colorInputForeground:"#eaf1f2",colorBorder:"#38535c",colorMuted:"#203943",colorMutedForeground:"#b6c3c7",colorRing:"#70e1cb",borderRadius:"12px",fontFamily:'"DM Sans",sans-serif'}}});
   clerk=window.Clerk;
   if(clerk.isSignedIn){$("#auth").classList.add("hidden");clerk.mountUserButton($("#user-button"));await load()}else showSignedOut();
   clerk.addListener(()=>{if(clerk.isSignedIn)load();else showSignedOut()});
  }catch(e){note(e.message,true)}
 }
 document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
 const cockpitMenu=$("#cockpit-menu-toggle"),cockpitBackdrop=$("#cockpit-drawer-backdrop");
 cockpitMenu?.addEventListener("click",()=>{const open=$("#workspace").classList.toggle("cockpit-drawer-open");cockpitMenu.setAttribute("aria-expanded",String(open))});
 cockpitBackdrop?.addEventListener("click",()=>{ $("#workspace").classList.remove("cockpit-drawer-open");cockpitMenu?.setAttribute("aria-expanded","false") });
 const initialPage=location.hash.slice(1);showPage(["overview","receptionist","billing","addons","calls","support","knowledge"].includes(initialPage)?initialPage:"overview");
 $("#sign-in").onclick=()=>clerk?.openSignIn();
 $("#sign-up").onclick=()=>clerk?.openSignUp();
 $("#refresh-dashboard").onclick=()=>load();
 $("#overage-card-setup")?.addEventListener("click",async()=>{const b=$("#overage-card-setup");if(!$("#overage-card-consent")?.checked){note("Please confirm the automatic overage billing authorization before continuing.",true);return}b.disabled=true;try{const d=await api("/api/client/overage-payment-method/setup",{method:"POST",body:"{}"});if(!d.url)throw Error("Stripe did not return a setup link.");location.assign(d.url)}catch(e){note(e.message,true);b.disabled=false}});
 $("#flex-topup-form")?.addEventListener("submit",async e=>{e.preventDefault();const button=$("#flex-topup-submit");button.disabled=true;try{const amount=Number($("#flex-topup-amount").value);if(!Number.isInteger(amount)||amount<5||amount%5!==0)throw Error("Enter an amount from $5 to $500 in $5 increments.");const d=await api("/api/client/payg-wallet/topup",{method:"POST",body:JSON.stringify({amount})});location.assign(d.approvalUrl)}catch(err){note(err.message,true);button.disabled=false}});

 $("#approve-demo")?.addEventListener("click",()=>handleOnboardingAction($("#approve-demo"),"/api/client/demo/approve","Demo approved."));
 $("#start-subscription")?.addEventListener("click",()=>handleOnboardingAction($("#start-subscription"),"/api/client/subscription/start","Preparing your plan payment."));
 $("#pay-setup-fee")?.addEventListener("click",()=>handleOnboardingAction($("#pay-setup-fee"),"/api/client/setup-payment/start","Preparing your PayPal setup payment."));

 $("#support-ticket-form")?.addEventListener("submit",submitTicket);
 $("#call-email-settings-form")?.addEventListener("submit",saveCallEmailSettings);
 $("#refresh-tickets")?.addEventListener("click",loadTickets);
 $("#profile-form").onsubmit=async e=>{e.preventDefault();try{await api("/api/client/profile",{method:"PATCH",body:JSON.stringify({businessName:$("#business-name").value,contactName:$("#contact-name").value,phone:$("#contact-phone").value})});note("Account details saved.");await load()}catch(e){note(e.message,true)}};
 const voiceModal=$("#voice-clone-modal");
 function closeVoiceModal(){voiceModal?.classList.remove("open");voiceModal?.setAttribute("aria-hidden","true");document.body.classList.remove("voice-modal-open")}
 $("#open-voice-clone")?.addEventListener("click",()=>{voiceModal?.classList.add("open");voiceModal?.setAttribute("aria-hidden","false");document.body.classList.add("voice-modal-open");voiceModal.querySelector(".voice-modal-panel")?.focus()});
 voiceModal?.querySelectorAll("[data-close-voice-modal]").forEach(b=>b.addEventListener("click",closeVoiceModal));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(voiceModal?.classList.contains("open"))closeVoiceModal();if($("#workspace")?.classList.contains("cockpit-drawer-open")){$("#workspace").classList.remove("cockpit-drawer-open");cockpitMenu?.setAttribute("aria-expanded","false");cockpitMenu?.focus()}}});
 document.querySelectorAll(".addon-request").forEach(b=>b.onclick=()=>{closeVoiceModal();requestAddon(b.dataset.addon,b)});
 $("#refresh-addons")?.addEventListener("click",loadAddons);
 $("#agent-change-form")?.addEventListener("submit",submitAgentChange);$("#agent-change-type")?.addEventListener("change",toggleSmsFields);toggleSmsFields();
 $("#refresh-agent-requests")?.addEventListener("click",loadAgentConfiguration);
 $("#billing-portal").onclick=async()=>{try{const d=await api("/api/billing/portal",{method:"POST",body:"{}"});location.href=d.url}catch(e){note(e.message,true)}};
 document.querySelectorAll(".plan-btn").forEach(b=>b.onclick=async()=>{try{b.disabled=true;const d=await api("/api/billing/checkout",{method:"POST",body:JSON.stringify({plan:b.dataset.plan,cadence:$("#billing-cadence")?.value||"monthly",promoCode:$("#billing-promo-code")?.value||""})});location.href=d.url}catch(e){const messages={invalid_promo_code:"That offer code is not valid. Check the code and try again.",challenge_offer_not_configured:"The challenge discount is not active in checkout yet. Please contact Star69AI before paying.",partner_offer_not_configured:"The partner discount is not active in checkout yet. Please contact Star69AI before paying.",prepaid_price_not_configured:"That prepaid billing option is not configured yet. Please contact Star69AI before paying.",prepaid_offer_cannot_be_combined_with_promo:"Prepaid savings cannot be combined with a first-month offer. Clear the code or choose monthly billing."};note(messages[e.message]||e.message,true);b.disabled=false}});
 const params=new URLSearchParams(location.search);
 if(params.has("billing"))note(params.get("billing")==="success"?"Checkout completed. Your subscription will appear after Stripe confirms the webhook.":"Checkout was cancelled.");
 if(params.has("overage_card"))note(params.get("overage_card")==="success"?"Card setup completed. Stripe is confirming your saved payment method. Refresh shortly.":"Card setup was cancelled.");
 init();
})();