(() => {
  const root = document.querySelector('[data-phone-history]');
  if (!root) return;
  const chapters = [
    {year:'1876',era:'THE BEGINNING',heading:'The telephone connects voices.',description:'Alexander Graham Bell’s telephone patent helped turn voice transmission over wires into a practical new form of communication. For the first time, a conversation could travel beyond the reach of a human voice.',impact:'Distance was no longer the end of a conversation.'},
    {year:'1878',era:'THE SWITCHBOARD AGE',heading:'Human operators connect the world.',description:'Telephone exchanges brought callers together through manually operated switchboards. An operator listened, found the requested line and physically connected the call. The human being was the routing system.',impact:'People made the connection possible—and every call depended on their availability.'},
    {year:'1891',era:'AUTOMATIC SWITCHING',heading:'Machines begin routing calls.',description:'Almon Brown Strowger’s automatic telephone-exchange patent introduced a way for callers to select connections without asking a switchboard operator to complete each one. Automatic switching spread gradually and changed the scale of telephone networks.',impact:'Call routing moved from a person’s hands into the network.'},
    {year:'1963',era:'DIRECT DIALING',heading:'Touch-tone makes interaction faster.',description:'The Bell System introduced the Touch-Tone telephone in 1963. Push buttons replaced the rotary dial on new models, making dialing faster and laying groundwork for menu-driven interactions with telephone systems.',impact:'The phone became a control surface, not just a speaking device.'},
    {year:'1973',era:'MOBILE VOICE',heading:'The telephone breaks free of the wall.',description:'On April 3, 1973, Motorola engineer Martin Cooper placed a public call using a handheld cellular-phone prototype. Commercial cellular service followed later, turning the telephone into something people could carry.',impact:'Communication became personal, portable and increasingly immediate.'},
    {year:'1995+',era:'INTERNET & CLOUD',heading:'Voice becomes software.',description:'Internet telephony, Voice over IP and later cloud phone platforms moved business communications onto data networks. Companies gained flexible numbers, virtual extensions, call queues, analytics and software-managed routing.',impact:'A business phone system became configurable software that could scale beyond one office.'},
    {year:'TODAY',era:'THE AI ERA',heading:'The system begins to understand the conversation.',description:'Conversational AI can listen to callers, interpret requests, respond using approved business information, capture details and help route or progress a call. A managed AI receptionist brings those capabilities into a business-specific front-desk workflow—with clear escalation to people when needed.',impact:'The next step is not simply connecting a call. It is helping the conversation accomplish something.'}
  ];
  const steps = Array.from(root.querySelectorAll('[data-history-step]'));
  const fields = {
    chapter:root.querySelector('[data-history-chapter]'),
    era:root.querySelector('[data-history-era]'),
    year:root.querySelector('[data-history-year]'),
    heading:root.querySelector('[data-history-heading]'),
    description:root.querySelector('[data-history-description]'),
    significance:root.querySelector('.phone-history-significance'),
    progress:root.querySelector('[data-history-progress]'),
    prev:root.querySelector('[data-history-prev]'),
    next:root.querySelector('[data-history-next]')
  };
  let current = 0;
  const lesson = root.querySelector('.phone-history-lesson');
  const openChapter = (index, focusStep) => {
    if (lesson) lesson.hidden = false;
    root.classList.add('is-expanded');
    render(index, focusStep);
    window.setTimeout(() => lesson?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'}), 0);
  };
  const render = (index, focusStep) => {
    current = Math.max(0, Math.min(chapters.length - 1, index));
    const chapter = chapters[current];
    fields.chapter.textContent = 'CHAPTER ' + String(current + 1).padStart(2, '0') + ' / 07';
    fields.era.textContent = chapter.era;
    fields.year.textContent = chapter.year;
    fields.heading.textContent = chapter.heading;
    fields.description.textContent = chapter.description;
    fields.significance.innerHTML = '<strong>What changed:</strong> ' + chapter.impact;
    fields.progress.textContent = String(current + 1).padStart(2, '0') + ' of 07';
    fields.prev.disabled = current === 0;
    fields.next.disabled = current === chapters.length - 1;
    steps.forEach((step, i) => {
      const active = i === current;
      step.classList.toggle('is-active', active);
      step.setAttribute('aria-pressed', String(active));
      if (active) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    if (focusStep) steps[current].focus();
  };
  steps.forEach((step, i) => step.addEventListener('click', () => openChapter(i, false)));
  fields.prev.addEventListener('click', () => openChapter(current - 1, false));
  fields.next.addEventListener('click', () => openChapter(current + 1, false));
  root.addEventListener('keydown', event => {
    if (event.target.matches('[data-history-step]') && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault();
      openChapter(current + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  if (lesson) lesson.hidden = true;
  render(0, false);
})();