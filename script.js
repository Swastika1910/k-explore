// Events are generated relative to today so countdowns always stay in the future.
const day = 864e5, now = Date.now();
const mk = (d, h) => { const t = new Date(now + d * day); t.setHours(h, 0, 0, 0); return t.toISOString(); };
const EVENTS = [
  {id:1,name:'CodeSprint Hackathon',cat:'Tech',date:mk(6,9),venue:'Innovation Lab, Block C',icon:'💻',color:'#bfe3e8',desc:'24 hours to build something useful with your team.',long:'Form a team of up to four and build a working prototype in 24 hours. Mentors from industry review every project and the top three teams win prizes and internship interviews.'},
  {id:2,name:'Monsoon Melodies Night',cat:'Music',date:mk(10,18),venue:'Open Air Theatre',icon:'🎸',color:'#f6d6c8',desc:'Live bands and solo acts under the open sky.',long:'Eight student bands and two guest artists perform. Bring a friend, bring a blanket. Food stalls open from 5 PM.'},
  {id:3,name:'UI/UX Design Workshop',cat:'Workshop',date:mk(4,11),venue:'Seminar Hall 2',icon:'🎨',color:'#e3dcf5',desc:'Learn wireframing and prototyping hands-on.',long:'A practical three-hour session on user research, wireframes and a clickable Figma prototype. Bring a laptop with Figma installed.'},
  {id:4,name:'Startup Pitch Day',cat:'Business',date:mk(15,10),venue:'Main Auditorium',icon:'🚀',color:'#f4efb8',desc:'Ten student startups pitch to real investors.',long:'Each team gets five minutes to pitch and five for questions. Attendees vote for the audience favourite.'},
  {id:5,name:'Inter-College Football Cup',cat:'Sports',date:mk(8,16),venue:'Main Ground',icon:'⚽',color:'#cfe9cf',desc:'Sixteen teams, one trophy.',long:'Knockout format with matches throughout the day. Free entry for all students with a valid ID card.'},
  {id:6,name:'AI in Practice Talk',cat:'Tech',date:mk(20,15),venue:'Conference Room A',icon:'🤖',color:'#bfe3e8',desc:'Engineers show how AI is used in real products.',long:'Three speakers share how they ship machine-learning features, what goes wrong, and what they would do differently. Q&A at the end.'},
  {id:7,name:'Classical Dance Evening',cat:'Culture',date:mk(13,19),venue:'Cultural Centre',icon:'💃',color:'#f6d6c8',desc:'Odissi, Bharatanatyam and Kathak performances.',long:'A showcase of classical dance by students and visiting artists, followed by a short audience interaction.'},
  {id:8,name:'Photography Walk',cat:'Workshop',date:mk(3,6),venue:'Meet at Main Gate',icon:'📷',color:'#e3dcf5',desc:'Sunrise shoot around the old city.',long:'Guided walk covering composition and light. Any camera works, including your phone. Ends with a group critique over tea.'}
];
const $ = s => document.querySelector(s);
const fmt = iso => new Date(iso).toLocaleString('en-IN', {weekday:'short', day:'numeric', month:'short', hour:'numeric', minute:'2-digit'});
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
let category = 'All', current = null;

// Theme
const root = document.documentElement;
root.dataset.theme = store.get('theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
$('#themeBtn').onclick = () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; store.set('theme', root.dataset.theme); };
$('#menuBtn').onclick = () => { const o = $('#menu').classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', o); };
$('#menu').addEventListener('click', e => { if (e.target.tagName === 'A') $('#menu').classList.remove('open'); });

// Filters
const cats = ['All', ...new Set(EVENTS.map(e => e.cat))];
$('#chips').innerHTML = cats.map(c => `<button class="chip" aria-pressed="${c === 'All'}">${c}</button>`).join('');
$('#chips').onclick = e => {
  if (!e.target.classList.contains('chip')) return;
  category = e.target.textContent;
  document.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', b === e.target));
  render();
};
$('#search').oninput = render;

function render() {
  const q = $('#search').value.trim().toLowerCase();
  const list = EVENTS.filter(e => (category === 'All' || e.cat === category) &&
    (e.name + e.venue + e.desc + e.cat).toLowerCase().includes(q))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  $('#grid').innerHTML = list.map(e => `
    <article class="card">
      <div class="img" style="background:${e.color}" aria-hidden="true">${e.icon}</div>
      <div class="body">
        <span class="tag">${e.cat}</span>
        <h3>${e.name}</h3>
        <p class="meta">${fmt(e.date)} · ${e.venue}</p>
        <p class="desc">${e.desc}</p>
        <button class="btn" data-id="${e.id}">View and register</button>
      </div>
    </article>`).join('');
  $('#empty').hidden = list.length > 0;
}
$('#grid').onclick = e => { const b = e.target.closest('[data-id]'); if (b) openEvent(+b.dataset.id); };

// Modal
function openEvent(id) {
  current = EVENTS.find(e => e.id === id);
  $('#detail').innerHTML = `
    <div class="img" style="background:${current.color}" aria-hidden="true">${current.icon}</div>
    <div class="info"><span class="tag">${current.cat}</span>
    <h2 id="mTitle">${current.name}</h2><p>${current.long}</p>
    <dl><dt>When</dt><dd>${fmt(current.date)}</dd><dt>Where</dt><dd>${current.venue}</dd></dl></div>`;
  $('#evField').value = current.name;
  $('#form').reset(); $('#evField').value = current.name;
  clearErrors();
  $('#form').hidden = false; $('#done').hidden = true;
  $('#modal').showModal();
}
$('#closeBtn').onclick = $('#doneBtn').onclick = () => $('#modal').close();
$('#modal').addEventListener('click', e => { if (e.target === $('#modal')) $('#modal').close(); });
$('#nextBtn').onclick = () => openEvent(nextEvent().id);

// Validation
const rules = {
  name: v => /^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v) ? '' : 'Enter your full name using letters only.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email like name@example.com.',
  phone: v => /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Enter a valid 10-digit mobile number.'
};
function clearErrors() { document.querySelectorAll('#form input').forEach(i => { i.classList.remove('bad'); if (i.nextElementSibling) i.nextElementSibling.textContent = ''; }); }
function check(id) {
  const i = $('#' + id), msg = rules[id](i.value.trim());
  i.classList.toggle('bad', !!msg); i.nextElementSibling.textContent = msg;
  return !msg;
}
Object.keys(rules).forEach(id => $('#' + id).addEventListener('blur', () => check(id)));
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const ok = Object.keys(rules).map(check).every(Boolean);
  if (!ok) return;
  const regs = store.get('regs', []);
  const email = $('#email').value.trim().toLowerCase();
  const dup = regs.some(r => r.eventId === current.id && r.email === email);
  if (!dup) regs.push({eventId: current.id, name: $('#name').value.trim(), email, phone: $('#phone').value.trim(), at: Date.now()});
  store.set('regs', regs);
  $('#doneTitle').textContent = dup ? 'Already registered' : "You're registered";
  $('#doneMsg').textContent = `${$('#name').value.trim()}, your spot for ${current.name} on ${fmt(current.date)} is ${dup ? 'already confirmed' : 'confirmed'}. We sent details to ${email}.`;
  $('#form').hidden = true; $('#done').hidden = false;
  renderRegs();
});

// Registrations
function renderRegs() {
  const regs = store.get('regs', []);
  $('#regList').innerHTML = regs.length ? regs.map((r, i) => {
    const ev = EVENTS.find(e => e.id === r.eventId);
    return `<li><span><strong>${ev.name}</strong><br><span class="meta">${fmt(ev.date)} · ${r.name}</span></span><button data-i="${i}">Cancel</button></li>`;
  }).join('') : '<li>You have not registered for any events yet. Pick one above to get started.</li>';
}
$('#regList').onclick = e => {
  const b = e.target.closest('[data-i]'); if (!b) return;
  const regs = store.get('regs', []); regs.splice(+b.dataset.i, 1); store.set('regs', regs); renderRegs();
};

// Countdown
const nextEvent = () => EVENTS.filter(e => new Date(e.date) > Date.now()).sort((a, b) => new Date(a.date) - new Date(b.date))[0] || EVENTS[0];
function tick() {
  const ev = nextEvent(), ms = Math.max(0, new Date(ev.date) - Date.now());
  const p = n => String(n).padStart(2, '0');
  const parts = [['Days', Math.floor(ms / day)], ['Hrs', Math.floor(ms % day / 36e5)], ['Min', Math.floor(ms % 36e5 / 6e4)], ['Sec', Math.floor(ms % 6e4 / 1e3)]];
  $('#nextTitle').textContent = ev.name;
  $('#nextClock').innerHTML = parts.map(([l, v]) => `<div>${p(v)}<small>${l}</small></div>`).join('');
}
render(); renderRegs(); tick(); setInterval(tick, 1000);
