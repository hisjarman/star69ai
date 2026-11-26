import { RetellClient } from "https://esm.sh/retell-client-js-sdk@3";

(() => {
  const root=document.querySelector("#demo-center");
  if(!root)return;
  const API="https://api.star69ai.com";
  const cards=[...root.querySelectorAll(".demo-industry-card")];
  const title=root.querySelector("#demo-scenario-title");
  const subtitle=root.querySelector("#demo-scenario-subtitle");
  const label=root.querySelector("#demo-industry-label");
  const business=root.querySelector("#demo-phone-business");
  const transcript=root.querySelector("#demo-transcript");
  const state=root.querySelector("#demo-transcript-state");
  const start=root.querySelector("#demo-start");
  const reset=root.querySelector("#demo-reset");
  const timer=root.querySelector("#demo-timer");
  const studio=root.querySelector(".demo-call-studio");
  const status=root.querySelector(".demo-call-status");
  const foot=root.querySelector(".demo-studio-foot");
  const controls=root.querySelector(".demo-simulation-controls");
  const disclosure=root.querySelector("#demo-live-disclosure");
  if(!start||!transcript||!controls)return;

  const profiles={
    roofing:{label:"ROOFING",title:"Storm damage & roof inspection",subtitle:"A live AI receptionist handles a storm-damage inquiry.",business:"NORTHLINE ROOFING",greeting:"Try saying: “A storm damaged my roof. Can you help?”"},
    plumbing:{label:"PLUMBING",title:"Urgent leak & service request",subtitle:"A live AI receptionist identifies urgency and captures a service request.",business:"CLEARFLOW PLUMBING",greeting:"Try saying: “There’s a leak under my kitchen sink.”"},
    hvac:{label:"HVAC",title:"Air conditioning not cooling",subtitle:"A live AI receptionist qualifies an HVAC service inquiry.",business:"BREEZEPOINT HVAC",greeting:"Try saying: “My air conditioner stopped cooling.”"},
    dental:{label:"DENTAL",title:"New patient appointment inquiry",subtitle:"A live AI receptionist handles a new-patient scheduling inquiry.",business:"BRIGHTSMILE DENTAL",greeting:"Try saying: “I’m a new patient looking for a cleaning.”"},
    realestate:{label:"REAL ESTATE",title:"Home buyer property inquiry",subtitle:"A live AI receptionist qualifies a buyer inquiry without inventing listing details.",business:"HORIZON REALTY",greeting:"Try saying: “I’m looking for a three-bedroom home.”"},
    hotel:{label:"HOTELS",title:"Room availability inquiry",subtitle:"A live AI receptionist handles a guest’s reservation inquiry without claiming live availability.",business:"SEABREEZE HOTEL",greeting:"Try saying: “I need a room for two adults next weekend.”"}
  };
  let current="roofing",agents={},publicKey="",session=null,muted=false,elapsed=0,timerId=null,ready=false;

  const mute=document.createElement("button");
  mute.type="button";mute.className="demo-reset-button";mute.id="demo-mute";mute.textContent="Mute microphone";mute.disabled=true;
  const end=document.createElement("button");
  end.type="button";end.className="demo-reset-button demo-end-button";end.id="demo-end";end.textContent="End call";end.disabled=true;
  controls.insertBefore(mute,reset);
  controls.insertBefore(end,reset);
  reset.hidden=true;
  if(disclosure)disclosure.hidden=false;

  // Retell emits complete transcript snapshots. Keep a DOM node per Retell
  // transcript ID so a reordered or expanded snapshot never reuses another
  // speaker's element and causes visible text/speaker swapping.
  const transcriptNodes=new Map();
  function message(text){
    transcriptNodes.clear();
    transcript.replaceChildren();
    const box=document.createElement("div");box.className="transcript-empty";
    const icon=document.createElement("span");icon.textContent="✳";
    const strong=document.createElement("b");strong.textContent="Live demo studio";
    const small=document.createElement("small");small.textContent=text;
    box.append(icon,strong,small);transcript.append(box);
  }
  function addTranscript(lines){
    const rows=Array.isArray(lines)?lines:[];
    const visible=rows.filter(x=>["agent","user"].includes(String(x.role||"").toLowerCase())&&String(x.content||"").trim());
    if(!visible.length){
      if(!transcriptNodes.size)message(publicKey?"Your live conversation will appear here.":"Voice is ready. Live transcript requires a Retell public key configured for this website.");
      return;
    }

    // Remove the flex-centered empty state before adding live rows. Its auto margins otherwise keep participating in layout and can shift the transcript as it grows.
    const emptyState=transcript.querySelector(".transcript-empty");
    if(emptyState)emptyState.remove();

    const wasNearBottom=transcript.scrollHeight-transcript.scrollTop-transcript.clientHeight<48;
    transcript.classList.add("live-transcript-stream");
    const activeKeys=new Set();
    let addedMessage=false;

    visible.forEach((x,index)=>{
      const role=String(x.role||"").toLowerCase();
      const who=role==="user"?"CALLER":"AI RECEPTIONIST";
      const roleClass=role==="user"?"caller":"receptionist";
      const key=x.id==null?role+":"+index:String(x.id);
      activeKeys.add(key);

      let item=transcriptNodes.get(key);
      if(!item){
        addedMessage=true;
        item=document.createElement("div");
        item.className="transcript-message "+roleClass;
        item.dataset.transcriptId=key;
        const tag=document.createElement("span");
        tag.className="transcript-speaker";
        tag.textContent=who;
        const body=document.createElement("p");
        item.append(tag,body);
        transcriptNodes.set(key,item);
      }else if(!item.classList.contains(roleClass)){
        item.classList.remove("caller","receptionist");
        item.classList.add(roleClass);
        const tag=item.querySelector(".transcript-speaker");
        if(tag)tag.textContent=who;
      }

      const body=item.querySelector("p");
      const nextText=String(x.content||"");
      if(body&&body.textContent!==nextText)body.textContent=nextText;

      // Move a node only when its position actually changed. Calling append()
      // on every snapshot would detach/reinsert every message and visibly flash.
      const expected=transcript.children[index]||null;
      if(expected!==item)transcript.insertBefore(item,expected);
    });

    for(const [key,item] of transcriptNodes){
      if(!activeKeys.has(key)){
        item.remove();
        transcriptNodes.delete(key);
      }
    }

    // Follow only genuinely new turns; partial text changes do not move the viewport.
    if(wasNearBottom&&addedMessage)transcript.scrollTop=transcript.scrollHeight;
  }
  function setStatus(value){
    state.textContent=value;
    status.textContent=value==="LIVE"?"LIVE AI CALL":value==="CONNECTING"?"CONNECTING":"READY";
    status.classList.toggle("is-live",value==="LIVE");
  }
  function stopClock(){if(timerId){clearInterval(timerId);timerId=null;}}
  function resetControls(){
    stopClock();session=null;muted=false;elapsed=0;timer.textContent="00";
    studio.classList.remove("is-playing");start.disabled=!ready;start.innerHTML="<span>▶</span> Start live call";
    mute.disabled=true;mute.textContent="Mute microphone";end.disabled=true;
    setStatus("READY");
  }
  async function endCall(){
    const active=session;
    if(!active){resetControls();return;}
    end.disabled=true;state.textContent="ENDING CALL…";
    try{await active.end();}catch(e){console.warn("Demo call end:",e);}
    resetControls();message("Call ended. Choose another industry or start again.");
  }
  function setIndustry(key){
    if(session)void endCall();
    current=key;const d=profiles[key];
    cards.forEach(card=>{const selected=card.dataset.industry===key;card.classList.toggle("selected",selected);card.setAttribute("aria-pressed",String(selected));});
    title.textContent=d.title;subtitle.textContent=d.subtitle;label.textContent=d.label;business.textContent=d.business;
    if(disclosure)disclosure.textContent="You are about to speak with a live AI agent. Your voice and conversation are processed by Retell AI. Do not share payment details, passwords, or sensitive personal information. No real appointment, reservation, purchase, or service order will be created.";
    message(ready?(agents[key]?d.greeting:"This industry demo is not provisioned yet. Please choose another demo."):"Connecting to the live demo service…");
    start.disabled=!ready||!agents[key];start.innerHTML="<span>▶</span> Start live call";
    resetControls();
    start.disabled=!ready||!agents[key];
    if(foot)foot.textContent="LIVE AI DEMONSTRATION · No real business systems, phone numbers, calendars, reservations, or payment services are connected.";
  }
  async function startCall(){
    if(session||!ready||!agents[current])return;
    start.disabled=true;setStatus("CONNECTING");state.textContent="REQUESTING MICROPHONE";message("Connecting securely. Your browser may ask for microphone permission.");
    try{
      const agent=agents[current];
      const client=new RetellClient({
        key:publicKey||"star69ai-server-proxy",
        fetch:async(url,init={})=>{
          const path=new URL(String(url)).pathname;
          if(path==="/v3/create-web-call"){
            return fetch(API+"/api/public/demo-agents/"+encodeURIComponent(current)+"/call",{
              method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},
              body:init.body||JSON.stringify({agent_id:agent.agent_id})
            });
          }
          return fetch(API+path,init);
        }
      });
      const call=client.createWebCall({
        agent_id:agent.agent_id,
        transcript:Boolean(publicKey),
        hooks:{
          onStatus:value=>{
            const v=String(value||"").toLowerCase();
            if(v==="live"){setStatus("LIVE");state.textContent="LIVE CONVERSATION";studio.classList.add("is-playing");mute.disabled=false;end.disabled=false;start.textContent="Call in progress";start.disabled=true;elapsed=0;stopClock();timerId=setInterval(()=>{elapsed++;timer.textContent=String(elapsed).padStart(2,"0");},1000);}
            else if(v==="connecting"){setStatus("CONNECTING");state.textContent="CONNECTING TO RECEPTIONIST";}
            else if(v==="ended"){resetControls();}
          },
          onTranscript:rows=>addTranscript(rows),
          onEnd:()=>{resetControls();state.textContent="CALL ENDED";message("Thanks for trying the live "+profiles[current].label.toLowerCase()+" receptionist.");},
          onError:error=>{const msg=String(error?.message||"The live call could not connect.");state.textContent="CONNECTION ERROR";message(msg);resetControls();start.disabled=false;}
        }
      });
      session=call;
      await call.ready;
      setStatus("LIVE");mute.disabled=false;end.disabled=false;
    }catch(e){
      console.error("Star69AI live demo error:",e);
      resetControls();state.textContent="CALL UNAVAILABLE";
      message(String(e?.message||"The live demo could not start. Please check microphone permission and try again."));
    }
  }

  cards.forEach(card=>card.addEventListener("click",()=>setIndustry(card.dataset.industry)));
  start.addEventListener("click",startCall);
  mute.addEventListener("click",()=>{if(!session)return;muted=!muted;if(muted)session.mute();else session.unmute();mute.textContent=muted?"Unmute microphone":"Mute microphone";});
  end.addEventListener("click",endCall);
  window.addEventListener("pagehide",()=>{if(session)void session.end().catch(()=>{});});

  async function initialize(){
    try{
      const response=await fetch(API+"/api/public/demo-agents",{headers:{Accept:"application/json"},cache:"no-store"});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw Error(data.error||"Live demo service is not available.");
      publicKey=String(data.publicKey||"");
      agents=Object.fromEntries((data.demos||[]).filter(x=>x.active&&x.agent_id).map(x=>[x.slug,x]));
      ready=true;
      if(!publicKey&&Object.keys(agents).length)console.warn("Retell public key is not configured; live transcript streaming is disabled.");
      cards.forEach(card=>{const available=Boolean(agents[card.dataset.industry]);card.classList.toggle("demo-unavailable",!available);card.setAttribute("aria-disabled",String(!available));});
      setIndustry(current);
      if(!Object.keys(agents).length)message("The live demo agents have not been provisioned yet. The administrator can create all six from Command Center → Retell resources.");
    }catch(e){
      ready=false;start.disabled=true;setStatus("OFFLINE");state.textContent="DEMO SERVICE UNAVAILABLE";
      message(String(e?.message||"The live demo service is temporarily unavailable."));
    }
  }
  setIndustry(current);
  void initialize();
})();
