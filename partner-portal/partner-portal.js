(() => {
 const API="https://avr-trust-lab-api.hisjarman.workers.dev", $=s=>document.querySelector(s);
 const auth=$("#pp-auth"),dashboard=$("#pp-dashboard"),notApproved=$("#pp-not-approved"),actions=$("#pp-auth-actions"),userButton=$("#pp-user-button");
 let clerk=null,mounted=false;
 async function api(path,options={}){const token=await clerk.session?.getToken();if(!token)throw new Error("Your session expired. Please sign in again.");const r=await fetch(API+path,{...options,headers:{"Accept":"application/json",...(options.body?{"Content-Type":"application/json"}:{}),"Authorization":"Bearer "+token,...(options.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Request failed ("+r.status+")");return d;}
 function money(cents,currency="usd"){return new Intl.NumberFormat("en-US",{style:"currency",currency:String(currency||"usd").toUpperCase()}).format(Number(cents||0)/100);}
 function cell(text){const td=document.createElement("td");td.textContent=text||"—";return td;}
 function emptyRow(body,cols,message){const tr=document.createElement("tr"),td=cell(message);td.colSpan=cols;td.className="pp-empty";tr.append(td);body.replaceChildren(tr);}
 function render(data){
  $("#pp-status").textContent="PARTNER ACCOUNT · PRIVATE CONSOLE";
  $("#pp-code").textContent=data.partner.partnerCode;
  const currentRate=Number(data.partner.currentRate||0.10);
  const activeCount=Number(data.stats.customers||0);
  $("#pp-tier").textContent=Math.round(currentRate*100)+"% · "+(activeCount>=15?"PREMIER TIER":activeCount>=5?"GROWTH TIER":"PARTNER TIER")+" · "+activeCount+" ACTIVE PAYING";
  $("#pp-payout-method").value=data.partner.payoutMethod||"paypal";
  $("#pp-paypal-email").value=data.partner.paypalEmail||"";
  $("#pp-payout-status").textContent=data.partner.paypalEmail?"PAYPAL DETAILS SAVED":"PAYPAL SETUP NEEDED";
  $("#pp-payout-message").textContent=data.partner.payoutUpdatedAt?"Last updated "+new Date(data.partner.payoutUpdatedAt).toLocaleDateString():"Add your PayPal email to receive payouts.";

  $("#pp-referral-discounted").value=data.partner.referralUrlDiscounted;
  $("#pp-referral-standard").value=data.partner.referralUrlStandard;
  $("#pp-clicks").textContent=Number(data.stats.clicks||0).toLocaleString();
  $("#pp-leads").textContent=Number(data.stats.leads||0).toLocaleString();
  $("#pp-customers").textContent=Number(data.stats.customers||0).toLocaleString();
  $("#pp-pending").textContent=money(data.stats.pendingCents);
  $("#pp-paid").textContent=money(data.stats.paidCents);
  $("#pp-referral-count").textContent=String(data.referrals.length);
  const referrals=$("#pp-referrals");referrals.replaceChildren();
  if(!data.referrals.length)emptyRow(referrals,3,"No referrals recorded yet.");
  data.referrals.forEach(item=>{const tr=document.createElement("tr");tr.append(cell(item.businessName||"New business lead"),cell(item.status),cell(item.createdAt?new Date(item.createdAt).toLocaleDateString():"—"));referrals.append(tr);});
  const commissions=$("#pp-commissions");commissions.replaceChildren();
  if(!data.commissions.length)emptyRow(commissions,3,"No commissions recorded yet.");
  data.commissions.forEach(item=>{const tr=document.createElement("tr");tr.append(cell(item.businessName||"Customer"),cell(money(item.commissionAmountCents,item.currency)),cell(item.status+(item.status==="pending"&&item.validationUntil?" · clears "+new Date(item.validationUntil).toLocaleDateString():"")));commissions.append(tr);});
 }
 async function load(){
  const status=$("#pp-status");
  status.classList.remove("pp-error");
  status.textContent="LOADING PARTNER DATA";
  // A Clerk-authenticated visitor must never be shown the signed-out prompt
  // while the partner API is loading or returning an operational error.
  auth.hidden=true;notApproved.hidden=true;dashboard.hidden=true;
  try{
   const data=await api("/api/partners/dashboard");
   render(data);auth.hidden=true;notApproved.hidden=true;dashboard.hidden=false;
  }catch(e){
   dashboard.hidden=true;
   if(e.message==="partner_approval_required"||e.message==="partner_account_not_found"){
    auth.hidden=true;notApproved.hidden=false;status.textContent="APPLICATION NOT APPROVED";
    return;
   }
   status.classList.add("pp-error");
   const messages={
    sign_in_required:"Your Clerk session is not available to the partner service. Refresh the page; if needed, sign out and back in.",
    session_expired:"Your sign-in session expired. Refresh the page and sign in again.",
    invalid_session:"Your sign-in session could not be verified. Refresh the page and sign in again.",
    invalid_session_issuer:"The partner service rejected this sign-in session. Contact support if it continues.",
    email_verification_required:"Verify your email address in your Star69AI account, then retry.",
    partner_dashboard_unavailable:"The partner service is temporarily unavailable. Your sign-in is still active; retry in a moment."
   };
   status.replaceChildren(document.createTextNode(messages[e.message]||("We couldn't load your partner data: "+(e.message||"Unknown error"))+" "));
   const retry=document.createElement("button");retry.type="button";retry.className="pp-secondary";retry.textContent="Retry";retry.addEventListener("click",load);status.append(" ",retry);
  }
 }
 function signedOut(){auth.hidden=false;dashboard.hidden=true;notApproved.hidden=true;actions.hidden=false;userButton.hidden=true;$("#pp-session").textContent="SIGNED OUT";if(mounted){clerk.unmountUserButton(userButton);mounted=false;}}
 function signedIn(){
  auth.hidden=true;notApproved.hidden=true;dashboard.hidden=true;
  actions.hidden=true;userButton.hidden=false;$("#pp-session").textContent="SIGNED IN";
  if(!mounted){clerk.mountUserButton(userButton);mounted=true;}
  load();
 }
 $("#pp-sign-in").addEventListener("click",()=>clerk?.openSignIn());$("#pp-sign-up").addEventListener("click",()=>clerk?.openSignUp());
 $("#pp-payout-form").addEventListener("submit",async event=>{
  event.preventDefault();
  const button=$("#pp-save-payout"),message=$("#pp-payout-message"),email=$("#pp-paypal-email").value.trim();
  button.disabled=true;button.textContent="Saving…";message.textContent="";
  try{
   const result=await api("/api/partners/payout-preferences",{method:"PATCH",body:JSON.stringify({payoutMethod:"paypal",paypalEmail:email})});
   $("#pp-paypal-email").value=result.paypalEmail;
   $("#pp-payout-status").textContent="PAYPAL DETAILS SAVED";
   message.textContent="Payout details saved. Updated "+new Date(result.payoutUpdatedAt).toLocaleDateString()+".";
  }catch(e){message.textContent=e.message==="valid_paypal_email_required"?"Enter a valid PayPal email address.":e.message||"Could not save payout details.";}
  finally{button.disabled=false;button.textContent="Save payout details";}
 });
 async function copyReferral(inputId,label){const input=$(inputId),value=input.value;try{await navigator.clipboard.writeText(value);$("#pp-copy-status").textContent=label+" copied.";}catch{input.select();$("#pp-copy-status").textContent="Select and copy the "+label.toLowerCase()+".";}}
 $("#pp-copy-discounted").addEventListener("click",()=>copyReferral("#pp-referral-discounted","Discounted referral link"));
 $("#pp-copy-standard").addEventListener("click",()=>copyReferral("#pp-referral-standard","Standard referral link"));
 async function init(){try{if(!window.Clerk)throw new Error("Clerk did not load. Refresh and try again.");await window.Clerk.load({ui:{ClerkUI:window.__internal_ClerkUICtor}});clerk=window.Clerk;if(clerk.isSignedIn)signedIn();else signedOut();clerk.addListener(()=>clerk.isSignedIn?signedIn():signedOut());}catch(e){$("#pp-auth-title").textContent="Sign-in could not initialize";$("#pp-auth-copy").textContent=e.message||"Refresh and try again.";actions.hidden=true;}}
 init();
})();