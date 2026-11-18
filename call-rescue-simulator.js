/* Star69AI Call Rescue Simulator. Local-only interaction; no call is placed and no visitor data is collected. */
(() => {
  "use strict";
  const root = document.querySelector("[data-call-rescue]");
  if (!root) return;
  const result = root.querySelector("[data-cr-result]");
  const title = root.querySelector("[data-cr-result-title]");
  const copy = root.querySelector("[data-cr-result-copy]");
  const details = root.querySelector("[data-cr-result-details]");
  const choices = [...root.querySelectorAll("[data-cr-choice]")];
  const reset = root.querySelector("[data-cr-reset]");
  const outcomes = {
    missed: {
      title: "The caller reaches voicemail.",
      copy: "The caller may leave a message, try another business or call back later. The opportunity is not automatically lost—but your team still has to recover it.",
      items: ["No live conversation is captured in this simulation.", "Someone on your team must review and return the call.", "A delayed response can make the next step harder."]
    },
    personal: {
      title: "You answer—but the job has to wait.",
      copy: "You make the connection yourself. That can be the right choice, but it also means pausing the work in front of you to gather the caller's details.",
      items: ["You hear the request directly.", "You may need to stop and restart your current task.", "Follow-up details still need to be recorded and acted on."]
    },
    ai: {
      title: "The AI receptionist captures the request.",
      copy: "In this example, the configured receptionist greets the caller, asks the approved intake questions and prepares a clear handoff for your team.",
      items: ["Caller: Jordan (fictional example)", "Need: active leak beneath a kitchen sink", "Captured: callback details, service need and urgency", "Next step: your team reviews the request and follows your business rules."]
    }
  };
  function showOutcome(key) {
    const outcome = outcomes[key];
    if (!outcome) return;
    title.textContent = outcome.title;
    copy.textContent = outcome.copy;
    details.replaceChildren(...outcome.items.map(item => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }));
    result.dataset.outcome = key;
    result.hidden = false;
    choices.forEach(button => { button.disabled = true; });
    reset.hidden = false;
    result.focus({ preventScroll: true });
  }
  function restart() {
    result.hidden = true;
    delete result.dataset.outcome;
    choices.forEach(button => { button.disabled = false; });
    reset.hidden = true;
  }
  choices.forEach(button => button.addEventListener("click", () => showOutcome(button.dataset.crChoice)));
  reset.addEventListener("click", restart);
})();
