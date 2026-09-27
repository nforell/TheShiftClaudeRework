/* The Shift — UI. Renders from game state; every control routes through act(). */
(function (S) {
  const E = S.engine, A_ = S.art, R = S.rig, FX = S.fx;
  const CASES = ['medsurg-4w-1', 'medsurg-4w-2'];
  let caseId = CASES[0];
  const esc = (x) => String(x == null ? '' : x).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel) => document.querySelector(sel);
  const ICON = {
    msg: '<svg class="ico" viewBox="0 0 24 24"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 18.5h4"/></svg>',
    menu: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chart: '<svg class="ico" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M8.5 10h7M8.5 14h7M8.5 18h4"/></svg>',
    back: '<svg class="ico" viewBox="0 0 24 24"><path d="M14 6l-6 6 6 6"/></svg>',
    up: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
    tick: '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5"/><path d="M7 12.5l3.2 3.2L17.2 8.6"/></svg>',
  };

  let s = null;                 // game state
  let prof = E.store.profile(); // persistent profile + settings
  const ui = { view: 'home', ov: null, chart: null, dock: 'assess', caption: null, toasts: [], rank: null, rankDone: false, dlg: null, med: null, sbar: null, delegMsg: null, nova: null, hIdx: 0, newLog: 0, filter: 'all', confirm: null, adv: null, stamp: null, justKey: null, busy: false };

  const C = () => E.getCase(caseId);
  const A = () => E.api(s);
  const def = (id) => C().patients.find((p) => p.id === id);
  const staff = (k) => C().staff[k] || { name: k, role: '', look: null };
  /* Rig inputs for a patient: what their body is doing right now, not what was last charted. */
  function rigV(id) {
    const d = def(id), P = s.p[id], Ax = A(), vt = d.vitals(s, P, Ax);
    return Object.assign({ rr: vt.RR, spo2: vt.SpO2, hr: vt.HR, sbp: vt.SBP, temp: vt.T, pain: vt.pain }, d.rig ? d.rig(s, P, Ax) : {});
  }
  const face = (k) => R.icon(k);
  const pface = (id) => R.icon(id, s ? rigV(id) : null);
  const faceOf = (k) => (def(k) ? pface(k) : face(k));
  const who = (k) => (def(k) ? { name: def(k).name, role: 'Room ' + k } : staff(k));
  const here = (d) => !d.arrives || (s && s.p[d.id].arrived);          // admitted patients appear mid-shift
  const pts = () => C().patients.filter(here);
  const gone = (P) => P.icu || P.gone;                                   // off the unit (ICU, OR)
  const goneText = (P) => P.goneText || 'Transferred to ICU';
  const prov = () => staff(C().provider || 'chen');
  const cna = () => staff(C().cna || 'luis');
  const hhmm = (c, t) => { const m = (c.start || 420) + Math.round(t); return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };

  function applySettings() {
    const r = document.documentElement, st = prof.settings;
    if (st.theme === 'system') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', st.theme);
    r.setAttribute('data-text', st.text); r.setAttribute('data-motion', st.motion);
    FX.setOn(st.sound !== 'off');
  }

  /* ------------ game flow ------------ */
  function save() { if (s && !s.ended) E.store.save(s); }
  function startNew() { s = E.newGame(caseId); ui.view = 'handoff'; ui.hIdx = 0; ui.rank = null; ui.rankDone = false; ui.ov = null; ui.toasts = []; ui.caption = null; save(); render(true); }
  function resume() { const g = E.store.load(); if (!g) return startNew(); s = g; caseId = g.caseId; E.useCase(caseId); ui.view = s.view || 'station'; ui.ov = null; render(true); }
  function goView(v) { ui.view = v; s.view = v; ui.caption = null; save(); render(true); }

  /* Spend time; collect new messages into toasts; end shift if the clock runs out. */
  function spend(mins, fn) {
    E.perform(s, mins, fn);
    if (mins > 0) ui.adv = mins;
    const fresh = s.fresh.splice(0);
    if (fresh.length) { const urgent = fresh.some((id) => (s.inbox.find((x) => x.id === id) || {}).urgent); setTimeout(() => FX.play(urgent ? 'urgent' : 'msg'), 420); }
    fresh.forEach((id) => {
      const m = s.inbox.find((x) => x.id === id); if (!m) return;
      ui.toasts.push(m.id);
      // Routine messages step aside after a few seconds (they stay in the phone); urgent ones wait for the player.
      if (!m.urgent) setTimeout(() => { if (ui.toasts.includes(m.id)) { ui.toasts = ui.toasts.filter((x) => x !== m.id); if (s && ui.view !== 'home' && ui.view !== 'debrief') render(); } }, 8000);
    });
    ui.toasts = ui.toasts.slice(-1);
    if (s.ended) return endShift();
    save();
  }
  function logHere(pid, text, kind) { A().log(pid, text, kind); ui.newLog = s.seq; }

  function endShift() {
    E.finish(s); const d = E.debrief(s);
    prof.runs.unshift({ at: Date.now(), score: d.overall, rating: d.rating, caseId: s.caseId });
    prof.runs = prof.runs.slice(0, 20); E.store.saveProfile(prof); E.store.clear();
    ui.view = 'debrief'; s.view = 'debrief'; ui.ov = null; ui.chart = null; ui.toasts = []; render(true);
  }

  /* ------------ header ------------ */
  function header() {
    const unread = s.inbox.filter((m) => !m.read).length;
    const loc = ui.view === 'room' ? `4 West <span aria-hidden="true">/</span> <b>Room ${s.loc} · ${esc(def(s.loc).short)}</b>` : ui.view === 'handoff' ? '4 West <span aria-hidden="true">/</span> <b>Shift report</b>' : '4 West <span aria-hidden="true">/</span> <b>Nurses\' station</b>';
    return `<header class="top">
      <button class="mark" data-act="menu" aria-label="The Shift menu">The Shift</button>
      <div class="where">${loc}</div>
      ${ui.view !== 'handoff' ? `<button class="icon-btn" data-act="nova" aria-label="Ask the charge nurse, ${s.nova} credits left"><span class="dots" aria-hidden="true">${Array.from({ length: C().novaCredits || 3 }, (_, i) => i).map((i) => `<i class="${i < s.nova ? 'on' : ''}"></i>`).join('')}</span><span class="nova-l" aria-hidden="true">Nova</span></button>
      <button class="icon-btn" data-act="inbox" aria-label="Messages, ${unread} unread">${ICON.msg}${unread ? `<span class="badge">${unread}</span>` : ''}</button>` : ''}
      <div class="clock ${ui.adv ? 'bump' : ''}" role="timer" aria-live="off" aria-label="Shift time ${E.clock(s.t)}">${E.clock(s.t)}<small>ends ${E.clock(C().length)}</small>${ui.adv ? `<span class="adv" aria-hidden="true">+${ui.adv} min</span>` : ''}</div>
      <button class="icon-btn" data-act="menu" aria-label="Menu">${ICON.menu}</button>
    </header>`;
  }

  /* ------------ home ------------ */
  function vHome() {
    E.useCase(caseId);
    const g = E.store.load(), c = C(), done = (id) => prof.runs.filter((r) => r.caseId === id);
    const start = hhmm(c, 0), initial = c.patients.filter((d) => !d.arrives), adm = c.patients.filter((d) => d.arrives);
    const cols = Math.ceil(initial.length / 2) + (adm.length ? 1 : 0) - (initial.length % 2 && adm.length ? 1 : 0);
    const rung = (id, i) => {
      const k = E.getCase(id), runs = done(id), best = runs.length ? Math.max(...runs.map((r) => r.score)) : null;
      const prev = i ? done(CASES[i - 1]).length : 1;
      return `<button class="rung" data-act="pick-case" data-id="${id}" aria-pressed="${id === caseId}"><b>${esc(k.level)}</b><span>${esc(k.title)}. ${esc(k.card)}</span><small>${best !== null ? `Best score ${best}` : prev ? 'Ready' : 'Recommended after ' + esc(E.getCase(CASES[i - 1]).level)}</small></button>`;
    };
    const saved = g && !g.ended ? E.getCase(g.caseId) : null;
    return `<div class="home">
      <div style="display:flex;justify-content:space-between;align-items:center"><span class="mark" style="cursor:default">The Shift</span>
      <span style="display:flex;gap:.3rem"><button class="btn btn-quiet" data-act="help">How it plays</button><button class="btn btn-quiet" data-act="settings">Settings</button></span></div>
      <section class="home-hero">
        <div>
          <p class="big-clock" aria-label="${start}">${start.slice(0, 2)}<span>:</span>${start.slice(3)}</p>
          <h1>${esc(c.hero.head)}</h1>
          <p class="lede">${esc(c.hero.lede)}</p>
          <div class="cta">
            ${saved ? `<button class="btn btn-primary" data-act="resume">Resume ${esc(saved.title)} at ${hhmm(saved, g.t)}</button><button class="btn" data-act="new">Start this shift instead</button>` : `<button class="btn btn-primary" data-act="new">Start shift</button>`}
          </div>
        </div>
        <div class="home-cast" style="grid-template-columns:1.25fr repeat(${Math.max(2, cols)},1fr)" aria-label="Your charge nurse and your patients">
          <figure class="lead">${R.bust('nova', null, 'bust', '-104 -150 208 330')}<figcaption><b>Nova Reyes</b>Charge nurse. ${c.novaCredits || 3} hints per shift.</figcaption></figure>
          ${initial.map((d) => `<figure>${R.bust(d.id, null, 'bust')}<figcaption><b>${d.room} ${esc(d.short)}</b>${esc(d.dx)}</figcaption></figure>`).join('')}
          ${adm.map((d) => `<figure class="adm">${R.bust(d.id, null, 'bust', '-232 -112 464 232')}<figcaption><b>${d.room} ${esc(d.short)}, arriving ${hhmm(c, d.arrives)}</b>Admission from the ED: ${esc(d.reason.toLowerCase())}</figcaption></figure>`).join('')}
        </div>
      </section>
      <div>
        <div class="ladder" role="group" aria-label="Choose a shift">
          ${CASES.map(rung).join('')}
          <div class="rung locked"><b>Intermediate</b><span>Night shift, fewer hands.</span><small>Coming later</small></div>
          <div class="rung locked"><b>Specialty units</b><span>Psych, ED, ICU, peds.</span><small>Coming later</small></div>
        </div>
        <div class="homefoot"><span>${prof.runs.length ? `Shifts completed: ${prof.runs.length}.` : 'No shifts completed yet.'}</span><span>Original clinical content for education. Not a substitute for clinical instruction.</span></div>
      </div>
    </div>`;
  }

  /* ------------ handoff ------------ */
  function vHandoff() {
    const pts = C().patients.filter((x) => !x.arrives), d = pts[ui.hIdx], P = s.p[d.id], rb = staff(C().reportBy);
    const nv = P.vit[0];
    const brain = s.brain.map((k) => { const [pid, i] = k.split(':'); return { pid, text: def(pid).report[+i].text }; });
    return `<main><div class="handoff">
      <section class="report" aria-labelledby="rh">
        <div class="dana">${face(C().reportBy)}<span>${esc(rb.name)}, ${esc(C().reportRole)}, is giving you report. Tap the lines worth remembering.</span></div>
        <div class="report-head">${pface(d.id)}<div class="who"><h2 id="rh">${esc(d.name)} <small class="muted" style="font-weight:500">${d.age}${d.sex}, room ${d.room}</small></h2>
          <div class="muted">${esc(d.dx)}</div>
          <div class="meta"><span class="chip">${esc(d.code)}</span><span class="chip ${/No known/.test(d.allergies) ? '' : 'alert'}">Allergy: ${esc(d.allergies.split(',')[0].split('(')[0])}</span><span class="chip">${E.clock(nv.t)}: T ${nv.T}, HR ${nv.HR}, BP ${nv.SBP}/${nv.DBP}, SpO₂ ${nv.SpO2}%</span></div></div></div>
        <ul class="lines">${d.report.map((r, i) => { const k = d.id + ':' + i; return `<li><button class="line" data-act="flag" data-k="${k}" aria-pressed="${s.brain.includes(k)}"><span>${esc(r.text)}</span></button></li>`; }).join('')}</ul>
        <div class="tabsrow" role="tablist" aria-label="Patients in report">
          ${pts.map((p, i) => `<button class="pt-tab" role="tab" data-act="h-go" data-i="${i}" aria-current="${i === ui.hIdx}">${p.room}</button>`).join('')}
          <span class="sp"></span>
          ${ui.hIdx < pts.length - 1 ? `<button class="btn btn-primary" data-act="h-go" data-i="${ui.hIdx + 1}">Next: ${pts[ui.hIdx + 1].room}</button>` : `<button class="btn btn-primary" data-act="h-done">Finish report</button>`}
        </div>
      </section>
      <aside class="brain" aria-label="Your brain sheet">
        <h2>Your brain sheet</h2><p class="hint">What you flag here stays on your board all shift.</p>
        ${brain.length ? `<ul>${brain.map((b) => `<li><b>${b.pid}</b>${esc(b.text)}</li>`).join('')}</ul>` : '<p class="empty" style="padding:0">Nothing flagged yet.</p>'}
        ${ui.hIdx < pts.length - 1 ? `<p style="margin-top:1rem"><button class="btn" data-act="h-done">Skip the rest of report</button></p>` : ''}
      </aside></div></main>`;
  }

  /* ------------ station ------------ */
  function dueList() {
    const out = [];
    pts().forEach((d) => {
      const P = s.p[d.id]; if (gone(P)) return;
      (d.meds || []).forEach((m) => {
        const st = s.meds[m.id];
        if (m.due !== undefined && (st.status === 'due' || st.status === 'verify') && m.due <= s.t + 75) out.push({ t: m.due, late: s.t > m.due + 60, text: `${d.room} ${m.name} ${m.dose}${st.status === 'verify' ? ', awaiting pharmacy' : ''}` });
      });
    });
    if (C().dueExtras) C().dueExtras(s, A()).forEach((x) => out.push(x));
    s.deleg.filter((x) => !x.done).forEach((x) => out.push({ t: x.due, late: false, text: `${cna().name}: ${C().delegation.tasks.find((t) => t.id === x.id).label.toLowerCase()}, ${x.pid}` }));
    return out.sort((a, b) => a.t - b.t);
  }
  function lastSeen(P) { return P.seenAt === null ? 'Not seen yet' : `Seen ${E.clock(P.seenAt)}`; }
  function vStation() {
    const doors = C().patients.map((d) => { const P = s.p[d.id]; if (!here(d)) return { pid: d.id, room: d.room, pending: true, eta: E.clock(d.arrives) }; const light = (P.callLight) || s.inbox.some((m) => m.pid === d.id && m.urgent && !m.read); return { pid: d.id, room: d.room, name: d.name, light, gone: gone(P), alert: light ? 'needs attention' : '' }; });
    const pending = C().patients.filter((d) => !here(d));
    const due = dueList();
    return `<main>
      <div class="hall-wrap">${A_.hallway(s, doors)}</div>
      <div class="station">
        <section class="board" aria-labelledby="bh">
          <div class="board-h"><h2 id="bh">Assignment</h2></div>
          ${pts().map((d) => { const P = s.p[d.id]; const v = A().lastVitals(d.id); const flags = s.brain.filter((k) => k.startsWith(d.id + ':')).length; return `<div class="pt-row ${gone(P) ? 'gone' : ''}">
            ${pface(d.id)}
            <div><div class="nm">${d.room} ${esc(d.name)}<small>${d.age}${d.sex}</small></div><div class="dx">${esc(d.dx)}</div>
            <div class="facts">${/^Full code/.test(d.code) ? '' : `<span class="chip alert">${esc(d.code.split(',')[0])}</span>`}${/No known/.test(d.allergies) ? '' : `<span class="chip alert">Allergy</span>`}<span class="chip ${P.seenAt === null ? 'warn' : ''}">${gone(P) ? esc(goneText(P)) : lastSeen(P)}</span>${v ? `<span class="chip">Last vitals ${E.clock(v.t)}</span>` : ''}${flags ? `<span class="chip">${flags} flagged</span>` : ''}</div></div>
            <div class="go">${gone(P) ? '' : `<button class="btn btn-primary" data-act="goto" data-pid="${d.id}">Go to ${d.room}</button>`}<button class="btn" data-act="chart" data-pid="${d.id}">${ICON.chart}Chart</button></div>
          </div>`; }).join('')}
          ${pending.map((d) => `<div class="pt-row pending"><div class="pend-dot" aria-hidden="true"></div><div><div class="nm">${d.room} Admission</div><div class="dx">From the ED, expected about ${E.clock(d.arrives)}. ${esc(d.reason)}.</div></div></div>`).join('')}
          <div class="board-h" style="border-top:1px solid var(--line)"><h2>Due and upcoming</h2></div>
          ${due.length ? `<ul class="due">${due.map((x) => `<li class="${x.late ? 'late' : ''}"><span class="tm">${E.clock(x.t)}</span><span>${esc(x.text)}</span></li>`).join('')}</ul>` : '<p class="empty">Nothing due in the next hour.</p>'}
        </section>
        <aside class="side">
          ${phone(8)}
          <div class="tools">
            <button class="btn" data-act="delegate"><b>Ask ${esc(cna().name)}</b><small>Delegate to the ${esc(cna().role)}</small></button>
            <button class="btn" data-act="callpick"><b>Call ${esc(prov().name)}</b><small>SBAR, 6 min</small></button>
            <button class="btn" data-act="catchup" style="grid-column:1/-1"><b>Chart and catch up</b><small>Pass 10 minutes</small></button>
            ${s.t >= C().length - 30 ? `<button class="btn btn-primary" data-act="endask" style="grid-column:1/-1"><b>Give report and end shift</b><small>Handoff at ${E.clock(C().length)}</small></button>` : ''}
          </div>
        </aside>
      </div></main>`;
  }

  function msgHTML(m) {
    const w = who(m.from);
    return `<div class="msg ${m.read ? '' : 'unread'} ${m.urgent ? 'urgent' : ''}">${faceOf(m.from)}
      <div><div class="from"><b>${esc(w.name)}</b> ${esc(w.role)} <span aria-hidden="true">at</span> ${E.clock(m.t)}${m.urgent ? ' <b style="color:var(--red)">Urgent</b>' : ''}</div>
      <p class="tx">${esc(m.text)}</p>
      ${m.replies && !m.done ? `<div class="rep">${m.replies.map((r, i) => `<button class="btn" data-act="reply" data-m="${m.id}" data-i="${i}">${esc(r.label)}</button>`).join('')}</div>` : ''}</div></div>`;
  }
  function phone(n) {
    const list = s.inbox.slice(0, n);
    return `<section class="phone" aria-labelledby="ph"><div class="phone-h"><b id="ph">Unit phone</b><span style="font-size:.8rem">${s.inbox.filter((m) => !m.read).length} unread</span></div>
      <div class="msgs">${list.length ? list.map(msgHTML).join('') : '<p class="empty">Quiet so far.</p>'}</div>
      ${s.inbox.length > n ? `<div style="padding:.4rem;border-top:1px solid var(--line)"><button class="btn btn-quiet" data-act="inbox" style="width:100%">All ${s.inbox.length} messages</button></div>` : ''}</section>`;
  }

  /* ------------ room ------------ */
  const SYS = [['vitals', 'Vital signs', 4], ['general', 'General look', 1], ['resp', 'Lung sounds and breathing', 3], ['cardiac', 'Heart and circulation', 3], ['neuro', 'Neuro and mental status', 3], ['pain', 'Pain and sedation', 2], ['skin', 'Skin and wound', 3], ['gi', 'GI, GU and intake/output', 3], ['full', 'Full head-to-toe', 12]];
  function medStatus(m) {
    const st = s.meds[m.id];
    if (m.later) return { cls: '', text: 'At ' + m.later };
    if (st.status === 'given' && !m.prn) return { cls: 'done', text: 'Given ' + E.clock(st.at) };
    if (st.status === 'held') return { cls: 'done', text: 'Held ' + E.clock(st.at) };
    if (st.status === 'verify') return { cls: '', text: 'Pharmacy hold' };
    if (m.prn) return { cls: '', text: st.given.length ? 'Last ' + E.clock(st.given[st.given.length - 1]) : 'As needed' };
    if (m.initStatus === 'given') return { cls: 'done', text: m.givenNote || 'Given' };
    const late = s.t > m.due + 60; return { cls: late ? 'late' : s.t >= m.due - 30 ? 'due' : '', text: (late ? 'Late, due ' : 'Due ') + E.clock(m.due) };
  }
  function roomActions(d, P) {
    const Ax = A();
    if (ui.dock === 'assess') return SYS.map(([id, label, c]) => `<button class="act" data-act="assess" data-sys="${id}"><span>${label}</span><span class="c">${c} min</span></button>`).join('');
    if (ui.dock === 'care') {
      const list = (d.interventions || []).filter((x) => !x.avail || x.avail(s, P, Ax));
      return list.length ? list.map((x) => `<button class="act ${x.urgent || /juice|d50|brady/.test(x.id) ? 'urgent' : ''}" data-act="int" data-id="${x.id}"><span>${esc(x.label)}</span><span class="c">${x.cost} min</span></button>`).join('') : '<p class="empty">No bedside interventions available right now.</p>';
    }
    if (ui.dock === 'meds') {
      return (d.meds || []).filter((m) => !m.available || m.available(s, P)).map((m) => { const st = medStatus(m); return `<button class="act med" data-act="med" data-id="${m.id}" ${m.later || m.initStatus === 'given' ? 'disabled' : ''}><span><b>${esc(m.name)}</b> ${esc(m.dose)} ${m.route}<br><small class="muted">${esc(m.freq)}</small></span><span class="st ${st.cls}">${st.text}</span></button>`; }).join('');
    }
    if (ui.dock === 'talk') {
      const Ax2 = Ax;
      let h = `<button class="act" data-act="talk"><span>Talk with ${esc(d.short)}</span><span class="c">3 min</span></button>`;
      if (d.family) h += `<button class="act" data-act="family"><span>${d.family.mode === 'phone' ? 'Call' : 'Talk with'} ${esc(d.family.name)} (${esc(d.family.rel.toLowerCase())})</span><span class="c">${d.family.cost} min</span></button>`;
      h += `<button class="act" data-act="sbar" data-pid="${d.id}"><span>Call ${esc(prov().name)} with an SBAR</span><span class="c">6 min</span></button>`;
      (d.comms || []).filter((x) => !x.avail || x.avail(s, P, Ax2)).forEach((x) => { h += `<button class="act ${x.id === 'rrt' ? 'urgent' : ''}" data-act="comm" data-id="${x.id}"><span>${esc(x.label)}</span><span class="c">${x.cost} min</span></button>`; });
      h += `<button class="act" data-act="delegate"><span>Ask ${esc(cna().name)} (${esc(cna().role)})</span><span class="c">1 min</span></button>`;
      if (!(d.comms || []).some((x) => x.id === 'rrt')) h += `<button class="act" data-act="rrt-generic"><span>Call a rapid response</span><span class="c">3 min</span></button>`;
      return h;
    }
    return '';
  }
  function vRoom() {
    const d = def(s.loc), P = s.p[d.id], Ax = A();
    const v = Ax.lastVitals(d.id), fl = d.scene(s, P, Ax), st = d.status(s, P, Ax);
    const tense = st === 'urgent';
    if (ui.dock === 'call') ui.dock = 'talk';
    const tabs = [['assess', 'Assess'], ['care', 'Care'], ['meds', 'Meds'], ['talk', 'Talk &amp; call']];
    const logs = s.log.filter((l) => l.pid === d.id).slice().reverse();
    const ab = { T: v.T >= 38 || v.T < 36, HR: v.HR > 100 || v.HR < 55, BP: v.SBP < 100 || v.SBP > 160, RR: v.RR > 22 || v.RR < 12, SpO2: v.SpO2 < 92 };
    const bg = P.bgs && P.bgs.length ? P.bgs[P.bgs.length - 1] : null;
    return `<main>
      <div class="room-top ${ui.enter ? 'enter' : ''}">
        ${A_.room(d, s, P, fl, rigV(d.id), P.callLight, tense)}
        <div class="nameplate"><div class="plate"><h2>${esc(d.name)} <small>${d.age}${d.sex}, ${d.room}</small></h2><div class="muted" style="font-size:.88rem">${esc(d.dx)}</div>
          <div class="facts"><span class="chip">${esc(d.code)}</span><span class="chip ${/No known/.test(d.allergies) ? '' : 'alert'}">${esc(d.allergies.split('.')[0])}</span></div></div>
          <div class="plate-btns"><button class="btn" data-act="chart" data-pid="${d.id}">${ICON.chart}Chart</button><button class="btn" data-act="back">${ICON.back}Hallway</button></div></div>
        ${ui.caption ? `<div class="caption ${ui.captionQuiet ? 'quiet' : ''}" role="status">${esc(ui.caption)}</div>` : ''}
      </div>
      <div class="room-grid">
        <section class="dock" aria-label="Actions">
          <div class="dock-tabs" role="tablist">${tabs.map(([id, l]) => `<button role="tab" data-act="dock" data-id="${id}" aria-selected="${ui.dock === id}">${l}</button>`).join('')}</div>
          <div class="acts" role="tabpanel">${roomActions(d, P)}</div>
        </section>
        <section class="feedbox" aria-label="At the bedside">
          <div class="vstrip" aria-label="Last recorded vitals">
            <div class="${ab.T ? 'ab' : ''}"><span>Temp</span><b>${v.T}</b></div><div class="${ab.HR ? 'ab' : ''}"><span>HR</span><b>${v.HR}</b></div><div class="${ab.BP ? 'ab' : ''}"><span>BP</span><b>${v.SBP}/${v.DBP}</b></div><div class="${ab.RR ? 'ab' : ''}"><span>RR</span><b>${v.RR}</b></div><div class="${ab.SpO2 ? 'ab' : ''}"><span>SpO₂</span><b>${v.SpO2}%</b></div>${bg ? `<div class="${bg.val < 70 || bg.val > 250 ? 'ab' : ''}"><span>Glucose</span><b>${bg.val}</b></div>` : ''}
          </div>
          <div class="vcap">Recorded ${E.clock(v.t)} by ${esc(v.by)}${s.t - v.t > 60 ? ', <b>over an hour ago</b>' : ''}</div>
          <ul class="feed" aria-live="polite">${logs.length ? logs.map((l) => `<li class="k-${l.kind} ${l.id > ui.newLogSeen ? 'new' : ''}"><span class="tm">${E.clock(l.t)}</span><span class="tx">${l.kind === 'find' ? `<b>${esc(l.label || '')}</b>` : ''}${esc(l.text)}</span></li>`).join('') : `<li><span class="tm"></span><span class="tx muted">You're at the bedside. Start with what you see.</span></li>`}</ul>
        </section>
      </div></main>`;
  }

  /* ------------ debrief ------------ */
  function vDebrief() {
    const d = E.debrief(s);
    const items = d.judg.filter((j) => ui.filter === 'all' || (ui.filter === 'good' ? j.delta > 0 : j.delta < 0));
    return `<main><div class="deb">
      <section class="deb-hero"><div><p class="muted" style="margin:0">${esc(C().title)} debrief, ${E.clock(0)} to ${E.clock(s.t)}</p><h1>${esc(d.rating)}</h1><p class="muted" style="max-width:52ch">Here is what happened to your patients, and the decisions that shaped it.</p></div>
      <div class="deb-score">${d.overall}<small>Overall, out of 100</small></div></section>
      <section class="outs" aria-label="Patient outcomes">${d.outcomes.map((o) => `<div class="out">${pface(o.id)}<div><span class="tone ${o.tone}">${{ good: 'Good outcome', mixed: 'Mixed outcome', bad: 'Poor outcome' }[o.tone]}</span><h3>${def(o.id).room} ${esc(def(o.id).short)}: ${esc(o.title)}</h3><p>${esc(o.text)}</p></div></div>`).join('')}</section>
      <div class="deb-grid">
        <section aria-labelledby="dh"><h2 id="dh" style="margin-bottom:.8rem">By skill</h2>
          ${d.dom.map((x) => `<div class="meter"><div class="l"><span>${x.label}</span><b>${x.score === null ? 'Not tested' : x.score}</b></div><div class="bar" aria-hidden="true"><i style="width:${x.score || 0}%"></i></div><small class="muted">${x.good} strong, ${x.bad} missed</small></div>`).join('')}
          <p class="muted" style="font-size:.85rem">Nova hints used: ${3 - s.nova} of 3.</p>
          <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:1rem"><button class="btn btn-primary" data-act="new">Play the shift again</button><button class="btn" data-act="home">Home</button></div>
        </section>
        <section aria-labelledby="mh"><h2 id="mh">Moments that mattered</h2>
          <div class="filter" role="group" aria-label="Filter moments">${[['all', 'All'], ['good', 'What went well'], ['bad', 'What to rethink']].map(([k, l]) => `<button class="btn ${ui.filter === k ? 'btn-primary' : ''}" data-act="filter" data-k="${k}" aria-pressed="${ui.filter === k}">${l}</button>`).join('')}</div>
          <ul class="moments">${items.map((j) => `<li class="${j.delta > 0 ? 'good' : j.delta < 0 ? 'bad' : 'neutral'}"><span class="tm">${E.clock(j.t)}${j.pid ? '<br>' + j.pid : ''}</span><div><span class="mk">${j.delta > 0 ? 'Strong' : j.delta < 0 ? 'Rethink' : 'Note'}</span><b>${esc(j.text)}</b><p>${esc(j.why)}</p></div></li>`).join('') || '<li><span></span><span class="muted">Nothing here.</span></li>'}</ul>
        </section>
      </div></div></main>`;
  }

  /* ------------ overlays ------------ */
  function sheet(title, body, foot, opts) {
    opts = opts || {};
    return `<div class="scrim" data-act="${opts.noScrimClose ? '' : 'close'}" data-scrim="1"><div class="sheet ${opts.wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(opts.label || title)}">
      <div class="sheet-h">${opts.face || ''}<h2>${title}</h2>${opts.noClose ? '' : `<button class="icon-btn" data-act="close" aria-label="Close">${ICON.close}</button>`}</div>
      <div class="sheet-b">${body}</div>${foot ? `<div class="sheet-f">${foot}</div>` : ''}</div></div>`;
  }

  function ovChart() {
    const pid = ui.chart.pid, tab = ui.chart.tab, d = def(pid), P = s.p[pid];
    const tabs = [['overview', 'Overview'], ['vitals', 'Vitals'], ['labs', 'Labs'], ['orders', 'Orders'], ['mar', 'MAR'], ['notes', 'Notes'], ['io', 'Intake/output']];
    let b = '';
    if (tab === 'overview') b = `<dl class="kv"><dt>Patient</dt><dd>${esc(d.name)}, ${d.age}${d.sex}. ${esc(d.bio)}</dd><dt>Admitted for</dt><dd>${esc(d.reason)}</dd><dt>Problem</dt><dd>${esc(d.dx)}</dd><dt>History</dt><dd>${d.hx.map(esc).join('<br>')}</dd><dt>Allergies</dt><dd><b style="color:var(--red)">${esc(d.allergies)}</b></dd><dt>Code status</dt><dd>${esc(d.code)}</dd><dt>Weight</dt><dd>${esc(d.weight)}</dd><dt>Lines and devices</dt><dd>${d.lines.map(esc).join('<br>')}</dd><dt>Mobility</dt><dd>${esc(d.mobility)}</dd><dt>Diet</dt><dd>${esc(d.diet)}</dd></dl>`;
    if (tab === 'vitals') {
      const ab = (k, v) => ({ T: v >= 38 || v < 36, HR: v > 100 || v < 55, SBP: v < 100 || v > 160, RR: v > 22 || v < 12, SpO2: v < 92 }[k]);
      b = `<div class="tbl-wrap"><table><caption class="sr">Vital sign flowsheet</caption><thead><tr><th>Time</th><th>Temp °C</th><th>HR</th><th>BP</th><th>RR</th><th>SpO₂</th><th>O₂</th><th>Pain</th><th>By</th></tr></thead><tbody>
        ${P.vit.slice().reverse().map((v) => `<tr><td>${E.clock(v.t)}</td><td class="${ab('T', v.T) ? 'ab' : ''}">${v.T}${ab('T', v.T) ? ' ▲' : ''}</td><td class="${ab('HR', v.HR) ? 'ab' : ''}">${v.HR}${ab('HR', v.HR) ? (v.HR < 55 ? ' ▼' : ' ▲') : ''}</td><td class="${ab('SBP', v.SBP) ? 'ab' : ''}">${v.SBP}/${v.DBP}${ab('SBP', v.SBP) ? ' ▼' : ''}</td><td class="${ab('RR', v.RR) ? 'ab' : ''}">${v.RR}</td><td class="${ab('SpO2', v.SpO2) ? 'ab' : ''}">${v.SpO2}%</td><td>${esc(v.O2)}</td><td>${v.pain}</td><td>${esc(v.by)}</td></tr>`).join('')}</tbody></table></div>
        ${P.bgs ? `<h3 style="margin:1.2rem 0 .5rem">Point-of-care glucose</h3>${P.bgs.length ? `<div class="tbl-wrap"><table><thead><tr><th>Time</th><th>mg/dL</th><th>By</th></tr></thead><tbody>${P.bgs.slice().reverse().map((g) => `<tr><td>${E.clock(g.t)}</td><td class="${g.val < 70 ? 'ab' : ''}">${g.val}${g.val < 70 ? ' ▼' : ''}</td><td>${esc(g.by)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No glucose checked this shift.</p>'}` : ''}
        <p class="muted" style="font-size:.85rem">▲ ▼ mark values outside the normal range. Trends only exist if someone keeps measuring.</p>`;
    }
    if (tab === 'labs') {
      P.k.labsSeen = s.t; if (pid === '418') P.kSeen = true;
      b = `<div class="tbl-wrap"><table><thead><tr><th>Resulted</th><th>Test</th><th>Result</th><th>Flag</th><th>Reference</th></tr></thead><tbody>${P.labs.slice().sort((a, b2) => b2.t - a.t).map((l) => `<tr><td>${l.t < -1000 ? 'Prior' : E.clock(l.t)}</td><td>${esc(l.name)}</td><td class="${l.flag ? 'ab' : ''} wrap">${esc(l.val)} ${esc(l.unit)}</td><td class="flag">${l.flag === 'H' ? 'High' : l.flag === 'L' ? 'Low' : l.flag === 'A' ? 'Abnormal' : ''}</td><td class="wrap">${esc(l.ref)}</td></tr>`).join('')}</tbody></table></div>`;
    }
    if (tab === 'orders') b = `<ul class="list">${P.orders.slice().reverse().map((o) => `<li>${esc(o.text)}${o.isNew ? '<span class="new-tag">New ' + E.clock(o.t) + '</span>' : ''}</li>`).join('')}</ul>`;
    if (tab === 'mar') b = `<p class="muted" style="margin-top:0">${s.loc === pid && ui.view === 'room' ? 'You are at the bedside. Select a medication to review it.' : 'Medications are given at the bedside. Go to the room to give or hold.'}</p><div class="tbl-wrap"><table><thead><tr><th>Medication</th><th>Route</th><th>Frequency</th><th>Status</th><th></th></tr></thead><tbody>${d.meds.filter((m) => !m.available || m.available(s, P)).map((m) => { const st = medStatus(m); const inRoom = s.loc === pid && ui.view === 'room' && !m.later && m.initStatus !== 'given'; return `<tr><td class="wrap"><b>${esc(m.name)}</b> ${esc(m.dose)}${m.hold ? `<br><small class="muted">${esc(m.hold)}</small>` : ''}${m.indication ? `<br><small class="muted">${esc(m.indication)}</small>` : ''}</td><td>${m.route}</td><td class="wrap">${esc(m.freq)}</td><td><b class="${st.cls === 'late' ? 'ab' : ''}">${st.text}</b></td><td>${inRoom ? `<button class="btn" data-act="med" data-id="${m.id}">Review</button>` : ''}</td></tr>`; }).join('')}</tbody></table></div>`;
    if (tab === 'notes') b = `<ul class="list">${P.notes.slice().reverse().map((n) => `<li><div class="src">${esc(n.author)}, ${n.t < -600 ? 'yesterday' : E.clock(n.t)}</div><div class="voice">${esc(n.text)}</div></li>`).join('')}</ul>`;
    if (tab === 'io') b = `<dl class="kv"><dt>Intake</dt><dd>${esc(d.io.intake)}</dd><dt>Output</dt><dd>${esc(d.io.output)}</dd><dt>Diet</dt><dd>${esc(d.diet)}</dd></dl><p class="muted" style="font-size:.85rem">Last 24 hours, charted by night shift. Assess GI/GU at the bedside for current status.</p>`;
    return `<div class="scrim" data-act="close" data-scrim="1" style="padding:0;justify-content:flex-end"></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="Chart for ${esc(d.name)}">
      <div class="chart-h"><div class="who"><b>${esc(d.name)}</b> <span class="muted">${d.age}${d.sex}, room ${d.room}, ${esc(d.code)}</span></div>
      <div class="seg" role="group" aria-label="Switch patient">${pts().map((p) => `<button data-act="chart" data-pid="${p.id}" data-tab="${tab}" aria-pressed="${p.id === pid}">${p.room}</button>`).join('')}</div>
      <button class="btn" data-act="close">${ICON.close}Close chart</button></div>
      <div class="chart-tabs" role="tablist">${tabs.map(([id, l]) => `<button role="tab" data-act="chart" data-pid="${pid}" data-tab="${id}" aria-selected="${tab === id}">${l}</button>`).join('')}</div>
      <div class="chart-b">${b}</div></aside>`;
  }

  const PREP = { vitals: ['Take vital signs', 4], apical: ['Count apical pulse and BP', 2], pain: ['Assess pain and sedation', 2], bg: ['Check glucose', 3], intake: ['Check breakfast tray', 1], ciwa: ['Score CIWA-Ar', 4], strip: ['Look at the monitor strip', 1] };
  function ovMed() {
    const d = def(s.loc), P = s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = s.meds[m.id], Ax = A();
    const checks = m.checks ? m.checks(s, P, Ax) : [];
    const block = m.block ? m.block(s, P, Ax) : null;
    const done = !m.prn && (st.status === 'given' || st.status === 'held');
    const verify = st.status === 'verify';
    let body = `<div class="order"><b>${esc(m.name)} ${esc(m.dose)} ${m.route}</b>, ${esc(m.freq)}${m.indication ? `<br><span class="muted">${esc(m.indication)}</span>` : ''}${m.hold ? `<br><b>${esc(m.hold)}</b>` : ''}</div>
      <p class="muted" style="margin:.2rem 0">Allergies: ${esc(d.allergies)}</p>
      <ul class="checks">${checks.map((c) => `<li><span class="g ${c.ok === true ? 'ok' : c.ok === false ? 'bad' : 'na'}" aria-hidden="true">${c.ok === true ? '✓' : c.ok === false ? '!' : '•'}</span><span>${esc(c.label)}<small>${esc(c.value)}</small></span></li>`).join('')}</ul>`;
    if (m.prep && m.prep.length && !done) body += `<p class="muted" style="margin:.6rem 0 0;font-size:.88rem">Get what you need before deciding:</p><div class="prep">${m.prep.map((p) => `<button class="btn" data-act="prep" data-p="${p}">${PREP[p][0]} <span class="muted">${PREP[p][1]} min</span></button>`).join('')}</div>`;
    if (ui.med.note) body += `<div class="warnbox" role="status">${esc(ui.med.note)}</div>`;
    if (block) body += `<div class="warnbox">${esc(block)}</div>`;
    if (verify) body += `<div class="warnbox">Pharmacy has not verified this order. It can't be dispensed yet.</div>`;
    if (done) body += `<div class="warnbox">${st.status === 'given' ? 'Given' : 'Held'} at ${E.clock(st.at)}.${st.note ? ' ' + esc(st.note) : ''}</div>`;
    if (m.doses && !block && !verify) body += `<fieldset style="border:0;padding:0;margin:.6rem 0"><legend style="font-weight:600;margin-bottom:.2rem">Dose</legend>${m.doses.map((x) => `<label class="opt"><input type="radio" name="dose" value="${x.id}" ${ui.med.dose == x.id ? 'checked' : ''} data-act="dose" data-v="${x.id}"><span>${esc(x.label)}</span></label>`).join('')}</fieldset>`;
    if (ui.med.holding) body += `<fieldset style="border:0;padding:0;margin:.6rem 0"><legend style="font-weight:600;margin-bottom:.2rem">Reason for holding</legend>${['Outside the hold parameter', 'Condition changed, clarify with provider', 'Not enough intake', 'Patient declined'].map((r, i) => `<label class="opt"><input type="radio" name="hr" data-act="hreason" data-v="${i}" ${ui.med.reason == i ? 'checked' : ''}><span>${r}</span></label>`).join('')}</fieldset>`;
    let foot = '';
    if (!done && !block && !verify) {
      if (ui.med.holding) foot += `<button class="btn btn-primary" data-act="med-hold" ${ui.med.reason == null ? 'disabled' : ''}>Hold this dose</button>`;
      else {
        if (!m.prn) foot += `<button class="btn" data-act="med-holdask">Hold</button>`;
        foot += `<button class="btn btn-primary" data-act="med-give" ${m.doses && ui.med.dose == null ? 'disabled' : ''}>Give${m.doses && ui.med.dose ? ' ' + ui.med.dose + ' mg' : ''} <span style="font-weight:400;opacity:.8">5 min</span></button>`;
      }
    }
    return sheet(esc(m.name), body, foot, { label: 'Medication ' + m.name });
  }

  function ovSbar() {
    const pid = ui.sbar.pid;
    if (!pid) {
      const body = `<p>Which patient are you calling about?</p>${pts().filter((p) => !gone(s.p[p.id])).map((p) => `<button class="choice" data-act="sbar" data-pid="${p.id}"><b>${p.room} ${esc(p.name)}</b><br><span class="muted">${esc(p.dx)}</span></button>`).join('')}`;
      return sheet(`Call ${esc(prov().name)}`, body, '', { face: face(C().provider) });
    }
    const d = def(pid), P = s.p[pid], Ax = A();
    if (ui.sbar.reply) return sheet(esc(prov().name), `<div class="reply">${face(C().provider)}<p class="voice" style="margin:0">"${esc(ui.sbar.reply)}"</p></div>`, `<button class="btn btn-primary" data-act="close">Done</button>`, { face: '' });
    const items = d.sbar.items(s, P, Ax);
    const reqs = d.sbar.requests || [{ id: 'orders', label: 'Here\'s what I\'m seeing. What would you like me to do?' }, { id: 'fyi', label: 'Just keeping you updated.' }];
    const body = `<div class="sbar-sec"><h3><i>S</i>Situation</h3><p class="muted" style="margin:.3rem 0">This is your nurse on 4 West, calling about ${esc(d.name)}, ${d.age}, in room ${d.room}.</p></div>
      <div class="sbar-sec"><h3><i>B</i>Background</h3><p class="muted" style="margin:.3rem 0">${esc(d.dx)}. ${esc(d.hx[0])}. ${esc(d.code)}.</p></div>
      <fieldset class="sbar-sec" style="border:0;padding:0"><legend><h3><i>A</i>Assessment: what will you report?</h3></legend>
        ${items.map((it) => `<label class="opt ${it.need ? '' : 'locked'}"><input type="checkbox" data-act="sbar-pick" data-id="${it.id}" ${ui.sbar.picked.includes(it.id) ? 'checked' : ''} ${it.need ? '' : 'disabled'}><span>${esc(it.label)}${it.need ? '' : `<small>${esc(it.lock || 'Not known yet')}</small>`}</span></label>`).join('')}</fieldset>
      <fieldset class="sbar-sec" style="border:0;padding:0"><legend><h3><i>R</i>Recommendation</h3></legend>
        ${reqs.map((r) => `<label class="opt"><input type="radio" name="req" data-act="sbar-req" data-id="${r.id}" ${ui.sbar.req === r.id ? 'checked' : ''}><span>${esc(r.label)}</span></label>`).join('')}</fieldset>`;
    return sheet(`SBAR: ${esc(d.short)}`, body, `<button class="btn btn-primary" data-act="sbar-send" ${ui.sbar.req && ui.sbar.picked.length ? '' : 'disabled'}>Call ${esc(prov().name)} <span style="font-weight:400;opacity:.8">6 min</span></button>`, { face: face(C().provider), wide: true });
  }

  function ovDeleg() {
    const tasks = C().delegation.tasks.filter((t) => !t.avail || t.avail(s));
    const active = s.deleg.filter((x) => !x.done);
    const body = `${ui.delegMsg ? `<div class="reply" style="margin-bottom:1rem">${face(C().cna)}<p class="voice" style="margin:0">${esc(ui.delegMsg)}</p></div>` : ''}
      ${active.length ? `<p class="muted" style="margin-top:0">${esc(cna().name)} is working on: ${active.map((x) => `${C().delegation.tasks.find((t) => t.id === x.id).label.toLowerCase()} (${x.pid}), done about ${E.clock(x.due)}`).join('; ')}.</p>` : ''}
      ${tasks.map((t) => `<div style="padding:.6rem 0;border-bottom:1px solid var(--line)"><div style="font-weight:600;margin-bottom:.35rem">${esc(t.label)}</div><div class="prep">${t.rooms.filter((r) => here(def(r)) && !gone(s.p[r])).map((r) => `<button class="btn" data-act="deleg" data-t="${t.id}" data-pid="${r}">${r} ${esc(def(r).short)}</button>`).join('')}</div></div>`).join('')}`;
    return sheet(`Ask ${esc(cna().name)}`, body, `<button class="btn btn-primary" data-act="close">Done</button>`, { face: face(C().cna), label: `Delegate to ${cna().name}, ${cna().role}` });
  }

  function ovNova() {
    const body = `<div class="nova-card">${face('nova')}<div>
      ${ui.nova ? `<p class="dlg-text">"${esc(ui.nova)}"</p>` : `<p class="dlg-text">"You've got ${s.nova} question${s.nova === 1 ? '' : 's'} left on me today. I won't hand you answers, but I'll point you somewhere useful."</p>`}
      ${s.novaLog.length ? `<details><summary class="muted">Earlier from Nova</summary>${s.novaLog.map((n) => `<p class="voice muted">${E.clock(n.t)}: ${esc(n.text)}</p>`).join('')}</details>` : ''}
    </div></div>`;
    const foot = `<button class="btn" data-act="close">Close</button>${!ui.nova && s.nova > 0 ? `<button class="btn btn-primary" data-act="nova-ask">Ask for a nudge (1 of ${s.nova})</button>` : ''}`;
    return sheet('Nova Reyes, charge nurse', body, foot, { label: 'Ask Nova' });
  }

  function ovDialog() {
    const node = C().dialogs[ui.dlg.id];
    const w = who(node.who);
    const text = typeof node.text === 'function' ? node.text(s) : node.text;
    const body = `<p class="dlg-text">${esc(text)}</p>${node.choices ? node.choices.map((c, i) => `<button class="choice" data-act="dlg" data-i="${i}">${esc(c.label)}</button>`).join('') : ''}`;
    return sheet(esc(w.name), body, node.choices ? '' : `<button class="btn btn-primary" data-act="close">Continue</button>`, { face: faceOf(node.who), noScrimClose: !!node.choices });
  }

  function ovInbox() { return sheet('Unit phone', s.inbox.length ? s.inbox.map(msgHTML).join('') : '<p class="empty">No messages yet.</p>', `<button class="btn" data-act="readall">Mark all read</button><button class="btn btn-primary" data-act="close">Close</button>`); }

  function ovRank() {
    const r = ui.rank, pr = C().priority;
    const done = ui.rankDone;
    const body = `<div class="nova-card">${face('nova')}<p class="dlg-text" style="margin:0">${done ? '"Here\'s how I\'d have walked it, and why."' : '"Before you move: who are you seeing first? Put them in order. Don\'t overthink it. Think about who could get hurt fastest."'}</p></div>
      <ol class="rank">${r.map((pid, i) => { const d = def(pid); const right = pr.correct[i] === pid; return `<li class="${done ? (right ? 'right' : 'wrong') : ''}"><span class="n">${i + 1}</span>${pface(pid)}<span><b>${d.room} ${esc(d.short)}</b><br><small class="muted">${esc(d.dx)}</small></span>${done ? `<span class="chip ${right ? 'ok' : 'warn'}">${right ? 'Matches' : 'Nova: ' + (pr.correct.indexOf(pid) + 1)}</span><span class="why">${esc(pr.why[pid])}</span>` : `<span class="mv"><button class="btn" data-act="rk" data-i="${i}" data-d="-1" aria-label="Move ${d.short} up" ${i === 0 ? 'disabled' : ''}>${ICON.up}</button><button class="btn" data-act="rk" data-i="${i}" data-d="1" aria-label="Move ${d.short} down" ${i === r.length - 1 ? 'disabled' : ''}>${ICON.down}</button></span>`}</li>`; }).join('')}</ol>`;
    return sheet('Who first?', body, done ? `<button class="btn btn-primary" data-act="rank-go">Start the shift</button>` : `<button class="btn btn-primary" data-act="rank-submit">Lock in my order</button>`, { noClose: true, noScrimClose: true, wide: true });
  }

  function ovMenu() {
    const inShift = s && !s.ended && ui.view !== 'home' && ui.view !== 'debrief';
    return sheet('Menu', `<div class="menu-list">
      <button class="btn" data-act="help">How it plays</button><button class="btn" data-act="settings">Settings</button>
      ${inShift && s.t >= 15 ? '<button class="btn" data-act="endask">End the shift early and see debrief</button>' : ''}
      ${inShift ? '<button class="btn btn-danger" data-act="restart">Restart this shift</button>' : ''}
      <button class="btn" data-act="home">Home${inShift ? ' (your shift is saved)' : ''}</button></div>`, '');
  }
  function ovSettings() {
    const st = prof.settings;
    const seg = (key, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button data-act="set" data-k="${key}" data-v="${v}" aria-pressed="${(st[key] || opts[0][0]) === v}">${l}</button>`).join('')}</div>`;
    return sheet('Settings', `<div class="setrow"><span>Theme</span>${seg('theme', [['system', 'System'], ['light', 'Day'], ['dark', 'Night']])}</div>
      <div class="setrow"><span>Text size</span>${seg('text', [['normal', 'Standard'], ['large', 'Large']])}</div>
      <div class="setrow"><span>Motion</span>${seg('motion', [['full', 'Full'], ['reduced', 'Reduced']])}</div>
      <div class="setrow"><span>Sound and haptics</span>${seg('sound', [['on', 'On'], ['off', 'Off']])}</div>`, `<button class="btn btn-primary" data-act="close">Done</button>`);
  }
  function ovHelp() {
    return sheet('How it plays', `<div class="help">
      <p><b>You are the nurse.</b> This shift runs ${hhmm(C(), 0)} to ${hhmm(C(), C().length)}. The clock moves only when you act: assessing, giving meds, calling, walking between rooms. Each action shows its cost.</p>
      <p><b>Report.</b> The outgoing nurse gives you report. Tap the lines that matter to put them on your brain sheet.</p>
      <p><b>The hallway.</b> Doors with an amber light need attention. Go into a room to assess, intervene, give or hold medications, and talk with patients and families. Tap objects in the room to inspect them.</p>
      <p><b>The phone.</b> ${esc(cna().name)} (your ${esc(cna().role)}), pharmacy, the lab, telemetry and ${esc(prov().name)} will reach you here. Some messages ask for a reply.</p>
      <p><b>Charts.</b> Vitals, labs, orders, MAR, notes. Open them from the station or any room. They don't cost time.</p>
      <p><b>Nova.</b> Your charge nurse gives ${C().novaCredits || 3} nudges per shift. She points; she doesn't answer for you.</p>
      <p><b>Consequences.</b> Patients get better or worse based on what you do, and what you don't. The debrief at the end explains why.</p></div>`, `<button class="btn btn-primary" data-act="close">Got it</button>`);
  }
  function ovConfirm() {
    const c = ui.confirm;
    return sheet(c.title, `<p>${esc(c.text)}</p>`, `<button class="btn" data-act="close">Cancel</button><button class="btn ${c.danger ? 'btn-danger' : 'btn-primary'}" data-act="${c.act}">${esc(c.ok)}</button>`);
  }

  function toasts() {
    if (!ui.toasts.length || !s || ui.view === 'station') return '';
    return `<div class="toasts" aria-live="assertive">${ui.toasts.map((id) => { const m = s.inbox.find((x) => x.id === id); if (!m || (ui.ov && !m.urgent)) return ''; const w = who(m.from); const go = m.replies && !m.done ? m.replies[0] : null; return `<div class="toast ${m.urgent ? 'urgent' : ''}" role="alert">${faceOf(m.from)}<p><b>${esc(w.name)}, ${E.clock(m.t)}</b>${esc(m.text)}</p><span class="tb">${go ? `<button class="btn" data-act="reply" data-m="${m.id}" data-i="0">${esc(go.label.length > 22 ? 'Respond' : go.label)}</button>` : ''}<button class="btn" data-act="toast-x" data-m="${m.id}" aria-label="Dismiss">${ICON.close}</button></span></div>`; }).join('')}</div>`;
  }

  /* ------------ render ------------ */
  const keyOf = (el) => JSON.stringify([el.dataset.act, el.dataset.id, el.dataset.pid, el.dataset.i, el.dataset.k, el.dataset.tab, el.dataset.p, el.dataset.t, el.dataset.m, el.dataset.v]);
  function render(scrollTop) {
    applySettings();
    const root = $('#app');
    const focusKey = document.activeElement && document.activeElement.dataset ? keyOf(document.activeElement) : null;
    const y = window.scrollY;
    let h = '';
    if (ui.view === 'home' || !s) h = vHome();
    else {
      h = (ui.view === 'debrief' ? '' : header());
      if (ui.view === 'debrief') h += `<header class="top"><button class="mark" data-act="home">The Shift</button><div class="where">Debrief</div></header>`;
      h += ui.view === 'handoff' ? vHandoff() : ui.view === 'station' ? vStation() : ui.view === 'room' ? vRoom() : vDebrief();
      h += toasts();
      if (ui.stamp) h += `<div class="stamp" role="status" aria-live="polite">${ICON.tick}<span><b>${esc(ui.stamp.text)}</b>${ui.stamp.sub ? `<small>${esc(ui.stamp.sub)}</small>` : ''}</span></div>`;
    }
    const ov = ui.ov;
    if (ov === 'chart' && s) h += ovChart();
    else if (ov === 'med') h += ovMed();
    else if (ov === 'sbar') h += ovSbar();
    else if (ov === 'deleg') h += ovDeleg();
    else if (ov === 'nova') h += ovNova();
    else if (ov === 'dialog') h += ovDialog();
    else if (ov === 'inbox') h += ovInbox();
    else if (ov === 'rank') h += ovRank();
    else if (ov === 'menu') h += ovMenu();
    else if (ov === 'settings') h += ovSettings();
    else if (ov === 'help') h += ovHelp();
    else if (ov === 'confirm') h += ovConfirm();
    root.innerHTML = h;
    R.setReduced(prof.settings.motion === 'reduced');
    R.hydrate(root);
    document.body.classList.toggle('tense', !!(s && !s.ended && ui.view !== 'home' && ui.view !== 'debrief' && isTense()));
    if (ui.view === 'room' && s) ui.newLogSeen = s.seq;
    ui.enter = false; ui.adv = null;
    if (ui.stamp && !ui.stamp.shown) { ui.stamp.shown = true; const st = ui.stamp; setTimeout(() => { if (ui.stamp === st) { ui.stamp = null; const n = root.querySelector('.stamp'); if (n) { n.classList.add('out'); setTimeout(() => n.remove(), 250); } } }, 1500); }
    if (ui.justKey) { const jk = ui.justKey; ui.justKey = null; const el = [...root.querySelectorAll('[data-act]')].find((x) => keyOf(x) === jk && !x.dataset.scrim); if (el) { const tgt = el.tagName === 'INPUT' ? el.closest('.opt') || el : el; tgt.classList.add('just'); } }
    if (scrollTop) window.scrollTo(0, 0); else window.scrollTo(0, y);
    // restore focus
    let target = null;
    if (focusKey) {
      const k = JSON.parse(focusKey);
      target = [...root.querySelectorAll('[data-act]')].find((el) => keyOf(el) === focusKey && !el.dataset.scrim);
    }
    const dlg = root.querySelector('[role="dialog"]');
    if (dlg && (!target || !dlg.contains(target))) { const f = dlg.querySelector('button:not([disabled]),input:not([disabled])'); if (f) f.focus({ preventScroll: true }); }
    else if (target) target.focus({ preventScroll: true });
  }
  function isTense() {
    const Ax = A();
    const urgentMsg = s.inbox.some((m) => m.urgent && s.t - m.t <= 20);
    const here = ui.view === 'room' && def(s.loc).status(s, s.p[s.loc], Ax) === 'urgent';
    return urgentMsg || here;
  }

  /* ------------ actions ------------ */
  function enterRoom(pid) {
    if (gone(s.p[pid]) || !here(def(pid))) { ui.ov = null; render(); return; }
    const move = ui.view === 'room' && s.loc === pid ? 0 : 1;
    spend(move, () => {});
    if (s.ended) return;
    s.loc = pid; s.lastRoom = pid; s.p[pid].seenAt = s.t; s.p[pid].callLight = false;
    ui.view = 'room'; s.view = 'room'; ui.ov = null; ui.enter = true; ui.caption = null; ui.chart = null;
    s.inbox.forEach((m) => { if (m.pid === pid) m.read = true; });
    save(); render(true);
  }

  function doAssess(sys) {
    const d = def(s.loc), P = s.p[d.id];
    const run = (k) => {
      if (k === 'vitals') {
        const v = A().recordVitals(d.id, 'You'); P.k.hrAt = s.t; P.k.hr = v.HR;
        logHere(d.id, `T ${v.T} °C, HR ${v.HR}${v.rhythm ? ' (' + v.rhythm + ')' : ''}, BP ${v.SBP}/${v.DBP}, RR ${v.RR}, SpO₂ ${v.SpO2}% on ${v.O2}${v.poss ? ', sedation ' + v.poss.split(',')[0] : ''}. Pain ${v.pain}/10.`, 'find');
        s.log[s.log.length - 1].label = 'Vital signs';
      } else {
        const txt = d.assess[k](s, P, A());
        P.assessAt[k] = s.t; if (k === 'pain') P.k.painAt = s.t;
        logHere(d.id, txt, 'find'); s.log[s.log.length - 1].label = SYS.find((x) => x[0] === k)[1];
      }
    };
    const cost = SYS.find((x) => x[0] === sys)[2];
    spend(cost, () => { if (sys === 'full') ['vitals', 'general', 'resp', 'cardiac', 'neuro', 'pain', 'skin', 'gi'].forEach(run); else run(sys); });
  }

  function onReply(m, r) {
    const Ax = A();
    if (r.act === 'goto') return enterRoom(r.pid);
    if (r.act === 'delegate') { ui.ov = 'deleg'; ui.delegMsg = null; }
    if (r.act === 'sbar') { ui.ov = 'sbar'; ui.sbar = { pid: r.pid, picked: [], req: null, reply: null }; }
    if (r.act === 'chart') { ui.ov = 'chart'; ui.chart = { pid: r.pid, tab: r.tab || 'overview' }; }
    const rx = C().replies && C().replies[r.act];
    if (rx) { m.done = true; spend(1, (Ax2) => rx(s, Ax2, m, r)); if (s.ended) return; }
    m.read = true;
    render();
  }

  const stamp = (text, mins) => { ui.stamp = { text, sub: mins ? `${E.clock(s.t - mins)} · ${mins} min` : E.clock(s.t) }; };
  const handlers = {
    'pick-case'(el) { caseId = el.dataset.id; E.useCase(caseId); render(); },
    new() { if (E.store.load() && ui.view === 'home') { ui.confirm = { title: 'Start over?', text: 'Your saved shift will be replaced.', ok: 'Start a new shift', act: 'new-yes', danger: true }; ui.ov = 'confirm'; return render(); } startNew(); },
    'new-yes'() { E.store.clear(); startNew(); },
    resume, home() { if (s && !s.ended) save(); if (s) caseId = s.caseId; ui.view = 'home'; ui.ov = null; render(true); },
    restart() { ui.confirm = { title: 'Restart this shift?', text: `You'll go back to ${E.clock(0)} report. Progress in this shift is lost.`, ok: 'Restart', act: 'new-yes', danger: true }; ui.ov = 'confirm'; render(); },
    menu() { ui.ov = 'menu'; render(); }, help() { ui.ov = 'help'; render(); }, settings() { ui.ov = 'settings'; render(); },
    set(el) { prof.settings[el.dataset.k] = el.dataset.v; E.store.saveProfile(prof); render(); },
    close() { if (ui.ov === 'dialog') { ui.dlg = null; } if (ui.ov === 'rank') return; ui.ov = null; ui.chart = null; ui.med = null; ui.sbar = null; ui.nova = null; render(); },
    flag(el) { const k = el.dataset.k; const i = s.brain.indexOf(k); if (i >= 0) s.brain.splice(i, 1); else s.brain.push(k); save(); render(); },
    'h-go'(el) { ui.hIdx = +el.dataset.i; render(true); },
    'h-done'() { ui.rank = C().patients.filter((p) => !p.arrives).map((p) => p.id); ui.rankDone = false; ui.ov = 'rank'; render(); },
    rk(el) { const i = +el.dataset.i, j = i + +el.dataset.d; const r = ui.rank; [r[i], r[j]] = [r[j], r[i]]; render(); },
    'rank-submit'() {
      const pr = C().priority, r = ui.rank, Ax = A(); s.answers.rank = r.slice();
      const hits = r.filter((p, i) => pr.correct[i] === p).length;
      if (pr.judge) pr.judge(r, Ax);
      if (hits === r.length) Ax.judge('rank-all', 'priority', 1, 'Your first-round priorities matched an experienced charge nurse\'s.', 'Unstable or unknown first, time-critical second, stable and predictable last.');
      ui.rankDone = true; render();
    },
    'rank-go'() { ui.ov = null; spend(15, () => {}); ui.view = 'station'; s.view = 'station'; save(); render(true); },
    goto(el) { enterRoom(el.dataset.pid); },
    back() { ui.ov = null; spend(1, () => {}); if (s.ended) return; ui.view = 'station'; s.view = 'station'; s.loc = 'station'; ui.caption = null; save(); render(true); },
    dock(el) { ui.dock = el.dataset.id; render(); },
    assess(el) { doAssess(el.dataset.sys); ui.caption = null; render(); },
    int(el) { const d = def(s.loc), P = s.p[d.id], x = d.interventions.find((i) => i.id === el.dataset.id); spend(x.cost, (Ax) => { const t = x.run(s, P, Ax); logHere(d.id, t || x.label, 'find'); s.log[s.log.length - 1].label = x.label; }); ui.caption = null; stamp(x.label, x.cost); render(); },
    poke() { const d = def(s.loc), line = R.say(d.id, rigV(d.id)); R.poke('room:' + d.id); if (line) { ui.caption = line.quiet ? line.text : '"' + line.text + '"'; ui.captionQuiet = !!line.quiet; } render(); },
    clue(el) { const d = def(s.loc), cl = d.clues(s, s.p[d.id], A()); const t = cl[el.dataset.id]; if (t) { ui.caption = t; ui.captionQuiet = false; if (!s.log.some((l) => l.pid === d.id && l.text === t)) { logHere(d.id, t, 'clue'); } save(); } render(); },
    med(el) { ui.med = { id: el.dataset.id, dose: null, holding: false, reason: null, note: null }; ui.ov = 'med'; ui.chart = null; render(); },
    dose(el) { ui.med.dose = +el.dataset.v; render(); },
    hreason(el) { ui.med.reason = +el.dataset.v; render(); },
    'med-holdask'() { ui.med.holding = true; render(); },
    prep(el) {
      const d = def(s.loc), P = s.p[d.id], p = el.dataset.p;
      if (p === 'vitals') doAssess('vitals');
      else if (p === 'pain') doAssess('pain');
      else { const x = d.interventions.find((i) => i.id === p); spend(x.cost, (Ax) => { const t = x.run(s, P, Ax); logHere(d.id, t, 'find'); s.log[s.log.length - 1].label = x.label; ui.med.note = t; }); }
      if (p === 'vitals' || p === 'pain') ui.med.note = s.log[s.log.length - 1].text;
      if (!s.ended) render();
    },
    'med-give'() {
      const d = def(s.loc), P = s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = s.meds[m.id];
      spend(5, (Ax) => { const t = m.give(s, P, Ax, ui.med.dose); if (m.prn) st.given.push(s.t); else { st.status = 'given'; st.at = s.t; } logHere(d.id, `${m.name}: ${t}`, 'act'); });
      ui.ov = null; ui.med = null; stamp(`${m.name} given`, 5); if (!s.ended) render();
    },
    'med-hold'() {
      const d = def(s.loc), P = s.p[d.id], m = d.meds.find((x) => x.id === ui.med.id), st = s.meds[m.id];
      const reasons = ['Outside the hold parameter', 'Condition changed, clarify with provider', 'Not enough intake', 'Patient declined'];
      spend(2, (Ax) => { let t; if (m.hold) t = m.hold(s, P, Ax); else { Ax.judge(m.id + '-hold', 'meds', -1, `You held ${d.short}'s ${m.name} without a clear clinical reason.`, 'Holding a scheduled dose is a decision with consequences. It needs a parameter or a change in condition behind it, and a notification.', d.id); t = 'Held.'; } st.status = 'held'; st.at = s.t; st.note = reasons[ui.med.reason]; logHere(d.id, `${m.name} held (${reasons[ui.med.reason].toLowerCase()}). ${t}`, 'act'); });
      ui.ov = null; ui.med = null; stamp(`${m.name} held`, 2); if (!s.ended) render();
    },
    talk() { const d = def(s.loc), id = d.talk(s, s.p[d.id], A()); if (!id) return; spend(3, () => {}); if (s.ended) return; ui.dlg = { id }; ui.ov = 'dialog'; render(); },
    family() { const d = def(s.loc); spend(d.family.cost, () => {}); if (s.ended) return; ui.dlg = { id: d.family.dialog(s, s.p[d.id], A()) }; ui.ov = 'dialog'; render(); },
    dlg(el) {
      const node = C().dialogs[ui.dlg.id], c = node.choices[+el.dataset.i];
      const Ax = A(); if (c.fx) c.fx(s, Ax);
      const text = typeof node.text === 'function' ? node.text(s) : node.text;
      const pid = node.pid || (/^\d+$/.test(node.who) ? node.who : s.loc);
      logHere(pid, `You: "${c.label}"`, 'act');
      if (c.next) { const nx = C().dialogs[c.next]; logHere(pid, typeof nx.text === 'function' ? nx.text(s) : nx.text, 'info'); ui.dlg = { id: c.next }; }
      else { ui.dlg = null; ui.ov = null; }
      save(); render();
    },
    comm(el) { const d = def(s.loc), x = d.comms.find((c) => c.id === el.dataset.id); spend(x.cost, (Ax) => { logHere(d.id, x.run(s, s.p[d.id], Ax), 'info'); }); render(); },
    'rrt-generic'() { const d = def(s.loc); spend(3, (Ax) => { Ax.judge(d.id + '-rrt', 'judgment', 0, `You called a rapid response for ${d.short}.`, 'Calling for help when worried is always allowed. The team found a patient who didn\'t yet meet criteria. Next time, pair the call with an SBAR to the provider.', d.id); logHere(d.id, `The rapid response nurse checks in, reviews vitals, and suggests calling ${prov().name} with an update. "Always call if you're worried."`, 'info'); }); render(); },
    sbar(el) { ui.sbar = { pid: el.dataset.pid || null, picked: [], req: null, reply: null }; ui.ov = 'sbar'; render(); },
    callpick() { ui.sbar = { pid: null, picked: [], req: null, reply: null }; ui.ov = 'sbar'; render(); },
    'sbar-pick'(el) { const id = el.dataset.id, p = ui.sbar.picked; const i = p.indexOf(id); if (i >= 0) p.splice(i, 1); else p.push(id); render(); },
    'sbar-req'(el) { ui.sbar.req = el.dataset.id; render(); },
    'sbar-send'() {
      const pid = ui.sbar.pid, d = def(pid), P = s.p[pid]; let reply = '';
      spend(6, (Ax) => {
        const items = d.sbar.items(s, P, Ax); const keys = ui.sbar.picked.filter((id) => (items.find((i) => i.id === id) || {}).key);
        const noise = ui.sbar.picked.filter((id) => { const it = items.find((i) => i.id === id); return it && !it.key; });
        reply = d.sbar.respond.call(d.sbar, s, P, Ax, ui.sbar.picked, ui.sbar.req);
        if (!keys.length) Ax.judge(pid + '-sbar-empty-' + s.t, 'comm', -1, `Your call about ${d.short} had no clinically significant data in it.`, 'Providers act on findings. Lead with what changed and what you measured.', pid);
        if (noise.length >= 2) Ax.judge(pid + '-sbar-noise', 'comm', 0, `Your SBAR on ${d.short} included details that didn't change the picture.`, 'Concise beats complete. Every item in an SBAR should earn its place.', pid);
        P.k.calledAt = s.t; Ax.log(pid, `Called ${prov().name}. "${reply}"`, 'info');
      });
      if (s.ended) return; ui.sbar.reply = reply; stamp(`Called ${prov().name}`, 6); render();
    },
    delegate() { ui.ov = 'deleg'; ui.delegMsg = null; render(); },
    deleg(el) { const t = C().delegation.tasks.find((x) => x.id === el.dataset.t); let msg = ''; spend(1, (Ax) => { msg = C().delegation.start(t, el.dataset.pid, s, Ax); }); if (s.ended) return; ui.delegMsg = msg; ui.ov = 'deleg'; stamp(`${cna().name} is on it`, 1); render(); },
    nova() { ui.nova = null; ui.ov = 'nova'; render(); },
    'nova-ask'() { if (s.nova <= 0) return; s.nova -= 1; ui.nova = C().novaHint(s, A()); s.novaLog.push({ t: s.t, text: ui.nova }); save(); render(); },
    inbox() { ui.ov = 'inbox'; render(); s.inbox.forEach((m) => { m.read = true; }); save(); },
    readall() { s.inbox.forEach((m) => { m.read = true; }); save(); render(); },
    reply(el) { const m = s.inbox.find((x) => x.id === +el.dataset.m); if (!m || !m.replies) return; ui.toasts = ui.toasts.filter((x) => x !== m.id); ui.ov = null; onReply(m, m.replies[+el.dataset.i]); },
    'toast-x'(el) { const id = +el.dataset.m; ui.toasts = ui.toasts.filter((x) => x !== id); const m = s.inbox.find((x) => x.id === id); if (m) m.read = true; render(); },
    chart(el) { ui.chart = { pid: el.dataset.pid, tab: el.dataset.tab || (ui.chart && ui.chart.pid !== el.dataset.pid ? ui.chart.tab : 'overview') }; if (!el.dataset.tab && !(ui.ov === 'chart')) ui.chart.tab = 'overview'; ui.ov = 'chart'; render(); },
    catchup() { spend(10, (Ax) => Ax.log(null, 'Charted and caught up.', 'act')); if (!s.ended) render(); },
    endask() { ui.confirm = { title: s.t >= 270 ? 'Give report and end the shift?' : 'End the shift early?', text: s.t >= 270 ? 'You\'ll hand off to the next nurse and see your debrief.' : 'Unfinished work will count as missed in your debrief.', ok: 'End shift', act: 'end-yes' }; ui.ov = 'confirm'; render(); },
    'end-yes'() { ui.ov = null; endShift(); },
    filter(el) { ui.filter = el.dataset.k; render(); },
  };

  /* Feedback. Answers get a pop and a moment to register; commitments get a chime and a stamp.
     None of it says whether the choice was right: that stays in the debrief. */
  const SELECT = new Set(['sbar-req', 'dose', 'hreason', 'pick-case', 'rk', 'filter', 'set', 'assess', 'prep', 'h-go', 'dock', 'poke', 'clue']);
  const TOGGLE = new Set(['sbar-pick', 'flag']);
  const COMMIT = new Set(['med-give', 'med-hold', 'sbar-send', 'int', 'comm', 'rrt-generic', 'nova-ask', 'rank-go', 'end-yes', 'new-yes', 'catchup']);
  const CHOOSE = { dlg: 'select', reply: 'select', deleg: 'commit' };           // answers that advance the scene
  const JUST = new Set(['sbar-req', 'dose', 'hreason', 'pick-case', 'sbar-pick', 'flag', 'set', 'filter']);
  const reduced = () => prof.settings.motion === 'reduced' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  function onClick(e) {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    if (el.dataset.scrim && e.target !== el) return; // clicks inside sheet don't close
    const a = el.dataset.act; if (!a) return;
    const h = handlers[a]; if (!h) return;
    e.preventDefault();
    if (el.disabled || ui.busy) return;
    const choose = CHOOSE[a] || (a === 'sbar' && el.classList.contains('choice') ? 'select' : null);
    if (choose) {
      // Let the pick land: mark it, sound it, then move on.
      ui.busy = true; el.classList.add('chosen'); const box = el.closest('.sheet, .toast, .msg'); if (box) box.classList.add('choosing');
      FX.play(choose);
      setTimeout(() => { ui.busy = false; h(el); }, reduced() ? 60 : 280);
      return;
    }
    if (a === 'set' && el.dataset.k === 'sound') FX.setOn(el.dataset.v !== 'off');
    if (JUST.has(a)) ui.justKey = keyOf(el);
    h(el);
    if (a === 'rank-submit') { const pr = C().priority; FX.play(ui.rank.every((p, i) => pr.correct[i] === p) ? 'right' : 'commit'); }
    else if (TOGGLE.has(a)) FX.play((a === 'flag' ? s.brain.includes(el.dataset.k) : ui.sbar && ui.sbar.picked.includes(el.dataset.id)) ? 'select' : 'deselect');
    else FX.play(COMMIT.has(a) ? 'commit' : SELECT.has(a) ? 'select' : 'tap');
  }
  function onKey(e) {
    if (e.key === 'Escape' && ui.ov && ui.ov !== 'rank') { handlers.close(); return; }
    const el = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && el && el.getAttribute && el.getAttribute('role') === 'button' && el.tagName !== 'BUTTON') { e.preventDefault(); onClick({ target: el, preventDefault() {} }); }
  }

  function boot() {
    applySettings();
    CASES.forEach((id) => { const k = E.getCase(id); if (!k) return; k.patients.forEach((p) => R.define(p.id, p.look)); Object.entries(k.staff).forEach(([key, v]) => { if (v.look) R.define(key, v.look); }); });
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    const g = E.store.load(); if (g && !g.ended && E.getCase(g.caseId)) { s = g; caseId = g.caseId; E.useCase(caseId); }
    ui.view = 'home'; render(true);
  }
  S.ui = { boot, _handlers: handlers, _ui: ui, _state: () => s };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window.Shift);
