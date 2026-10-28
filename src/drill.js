/* The Shift — drills. One patient, one moment, one decision.
   Short rounds (about two minutes) built from src/drills-content.js: Med Pass, Who's First, SBAR, De-escalation,
   and a daily round that mixes them. Every answer gets the patient's reaction, one line of why, and a pearl.
   The UI module (ui.js) owns render(); this file owns ui.dr, its own handlers (all prefixed dr-) and its markup.
   Progress lives in the profile under prof.drills: { cards: { id: [times seen, last right 0/1, last seen ms] },
   days: ['YYYY-MM-DD', ...], rounds: { kind: n }, best: { kind: percent } }. */
(function (S) {
  const D = () => S.drillData || { med: [], first: [], sbar: [], calm: [] };
  let X = null;   // context from ui.js: { ui, esc, render, prof, saveProf, R, FX, TEL, ICON }

  const KINDS = {
    med: { name: 'Med Pass', verb: 'Give, hold, or call?', blurb: 'Check what matters, then decide.', n: 4, color: 'mp' },
    first: { name: 'Who\'s First', verb: 'Four patients. One nurse.', blurb: 'Pick who you see first.', n: 5, color: 'wf' },
    sbar: { name: 'SBAR', verb: 'Make the call.', blurb: 'Build the call to the provider, line by line.', n: 2, color: 'sb' },
    calm: { name: 'De-escalation', verb: 'Talk them down.', blurb: 'Every word moves the room.', n: 2, color: 'de' },
    mix: { name: 'Daily round', verb: 'One of everything.', blurb: 'A med, two priorities, a call, and a hard conversation.', n: 5, color: 'mix' },
  };
  const ORDER = ['med', 'first', 'sbar', 'calm'];
  const RIGHT = ['Good catch.', 'That\'s the one.', 'Nice call.', 'Exactly right.', 'Spot on.', 'Sharp.'];
  const WRONG = ['Not this time.', 'Here\'s the catch.', 'Look again.', 'Close, but no.'];
  const LEVEL = ['Calm', 'Calm', 'Settling', 'Uneasy', 'Uneasy', 'Agitated', 'Agitated', 'Escalating', 'Escalating', 'Crisis', 'Crisis'];

  /* ---------- small helpers ---------- */
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const order = (n) => shuffle([...Array(n).keys()]);
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dayNum = (s) => Math.round(new Date(s + 'T12:00:00').getTime() / 864e5);
  const pick1 = (a) => a[Math.floor(Math.random() * a.length)];
  const card = (kind, id) => D()[kind].find((c) => c.id === id);
  const E = (x) => X.esc(x);
  // One decision per step: med = check + decide, first = 1, sbar = its lines, calm = its turns.
  const steps = (kind, c) => kind === 'med' ? 2 : kind === 'first' ? 1 : kind === 'sbar' ? c.steps.length : c.turns.length;

  /* ---------- faces ---------- */
  const SKIN = [
    ['#F4D9C6', '#DBB9A2', '#B97A72', '#EBA79A'], ['#F0CDB2', '#D6AB8E', '#B56A5E', '#EE9A86'], ['#EBC9A6', '#CFA783', '#A8675A', '#E09C85'],
    ['#D8A77F', '#BC8A63', '#B0655A', '#E59A86'], ['#C99A72', '#A97C56', '#93574A', '#C98A70'], ['#B47A51', '#8F5E3B', '#7A3F2C', '#C4674D'],
    ['#8C5637', '#6A3E25', '#5C2E22', '#B9563F'], ['#6F4430', '#553222', '#56281E', '#9A5040'], ['#5B3827', '#42281B', '#3D2118', '#9A4838'],
  ];
  const dark = (h, k) => { const n = parseInt(h.slice(1), 16), f = (x) => Math.max(0, Math.min(255, Math.round(x * k))); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map((x) => f(x).toString(16).padStart(2, '0')).join(''); };
  function lookOf(p) {
    const sk = SKIN[Math.max(0, Math.min(8, p.sk || 0))], f = p.x === 'F', kid = p.k, hc = (p.h || [])[1] || '#2A2220';
    const grey = parseInt(hc.slice(1, 3), 16) > 170, seed = (p.n || '').length;
    return {
      skin: sk[0], shade: sk[1], lip: sk[2], blush: sk[3], iris: (p.sk || 0) <= 1 && seed % 2 ? '#4E6E8E' : (p.sk || 0) <= 2 && seed % 3 === 0 ? '#3F5E3C' : '#2A1C12',
      head: kid ? { w: 58, h: 58, jaw: .08 } : f ? { w: 53, h: 60, jaw: .25 } : { w: 58, h: 62, jaw: .55 }, eye: kid ? 11.4 : f ? 10.2 : 9.8,
      hair: { style: (p.h || ['short'])[0], color: hc }, brow: { w: f ? 3.4 : 4.6, color: grey ? dark(hc, .8) : dark(hc, .85) },
      body: { w: kid ? 62 : f ? 76 : 90, cloth: p.c || 'gown' }, extras: p.e || [], smile: p.sm == null ? .3 : p.sm, small: kid || undefined,
    };
  }
  const defined = {};
  function face(key, p) { if (!defined[key]) { X.R.define(key, lookOf(p)); defined[key] = 1; } return key; }

  /* ---------- profile ---------- */
  function P() { const pr = X.prof(); if (!pr.drills || typeof pr.drills !== 'object') pr.drills = {}; const d = pr.drills; d.cards = d.cards && typeof d.cards === 'object' ? d.cards : {}; d.days = Array.isArray(d.days) ? d.days : []; d.rounds = d.rounds && typeof d.rounds === 'object' ? d.rounds : {}; d.best = d.best && typeof d.best === 'object' ? d.best : {}; return d; }
  function streak() {
    const d = P().days; if (!d.length) return 0; const t = dayNum(today()), last = dayNum(d[d.length - 1]);
    if (t - last > 1) return 0; let n = 1; for (let i = d.length - 1; i > 0; i--) { if (dayNum(d[i]) - dayNum(d[i - 1]) === 1) n += 1; else break; } return n;
  }
  const playedToday = () => { const d = P().days; return d.length && d[d.length - 1] === today(); };
  function mastery(kind) { const all = D()[kind], c = P().cards; const got = all.filter((x) => c[x.id] && c[x.id][1]).length; return { got, all: all.length, seen: all.filter((x) => c[x.id]).length }; }
  // Never seen first, then missed last time, then the longest ago.
  function draw(kind, n, not) {
    const c = P().cards, pool = D()[kind].filter((x) => !(not || []).includes(x.id));
    const rank = (x) => { const r = c[x.id]; return !r ? 0 : !r[1] ? 1 : 2; };
    return shuffle(pool).sort((a, b) => rank(a) - rank(b) || ((c[a.id] || [0, 0, 0])[2] - (c[b.id] || [0, 0, 0])[2])).slice(0, n).map((x) => ({ kind, id: x.id }));
  }
  function deck(kind) {
    if (kind !== 'mix') return draw(kind, KINDS[kind].n);
    const f = draw('first', 2);
    return [f[0], ...draw('med', 1), ...draw('sbar', 1), f[1], ...draw('calm', 1)].filter(Boolean);
  }

  /* ---------- round state ---------- */
  function fresh(c) {
    const x = c.kind, k = card(x, c.id);
    if (x === 'med') return { stage: 'check', co: order(k.check.length), po: order(k.pick.length), check: null, pick: null };
    if (x === 'first') return { po: order(k.pts.length), pick: null };
    if (x === 'sbar') return { step: 0, said: [], miss: null, oo: k.steps.map((st) => order(st.o.length)), done: false };
    return { turn: 0, m: k.m, log: [], oo: k.turns.map((t) => order(t.o.length)), done: false, crisis: false };
  }
  function start(kind, only) {
    const d = only && only.length ? only.map((c) => ({ kind: c.kind, id: c.id })) : deck(kind);
    X.ui.dr = { kind, retry: !!(only && only.length), deck: d, i: 0, c: fresh(d[0]), right: 0, total: d.reduce((a, c) => a + steps(c.kind, card(c.kind, c.id)), 0), combo: 0, best: 0, res: [], done: false, t0: Date.now(), vi: 0 };
    X.ui.view = 'drill'; X.ui.ov = null;
    X.TEL.track('drill_start', { kind, streak: streak() });
  }
  function scoreStep(ok) {
    const r = X.ui.dr; r.vi += 1;
    if (ok) { r.right += 1; r.combo += 1; r.best = Math.max(r.best, r.combo); X.FX.play(r.combo >= 3 && r.combo % 3 === 0 ? 'combo' : 'right'); r.pop = r.combo >= 2 ? r.combo : 0; }
    else { r.combo = 0; r.pop = 0; X.FX.play('miss'); }
  }
  function finishCard(ok) {
    const r = X.ui.dr, c = r.deck[r.i], k = card(c.kind, c.id), cd = P().cards, prev = cd[c.id] || [0, 0, 0];
    cd[c.id] = [prev[0] + 1, ok ? 1 : 0, Date.now()];
    r.res.push({ kind: c.kind, id: c.id, ok, name: k.p ? k.p.n : (k.pts.find((x) => x.ok) || {}).p.n, line: outcomeLine(c.kind, k, r.c, ok), pearl: k.pearl });
    X.saveProf();
    X.TEL.track('drill_card', { kind: c.kind, id: c.id, ok: ok ? 1 : 0 });
    const CL = S.cloud; if (CL && CL.on && CL.on() && CL.recordDrill) CL.recordDrill(c.kind, c.id, ok, !!r.retry);   // for a class's instructor
  }
  function outcomeLine(kind, k, st, ok) {
    if (kind === 'med') return ok ? k.goodLine : k.badLine;
    if (kind === 'first') return ok ? 'You went to the right room first.' : `${(k.pts.find((x) => x.ok) || {}).p.n} needed you first.`;
    if (kind === 'sbar') return ok ? k.win : k.lose;
    return st.m <= 3 ? k.win : st.m >= 7 || st.crisis ? k.lose : 'Nobody got hurt, but it\'s still tense.';
  }
  function next() {
    const r = X.ui.dr; r.i += 1; r.pop = 0;
    if (r.i >= r.deck.length) return finishRound();
    r.c = fresh(r.deck[r.i]);
  }
  function finishRound() {
    const r = X.ui.dr, d = P(), t = today(); r.done = true; r.pop = 0;
    if (d.days[d.days.length - 1] !== t) { d.days.push(t); d.days = d.days.slice(-120); }
    if (!r.retry) d.rounds[r.kind] = (d.rounds[r.kind] || 0) + 1;
    const pct = Math.round(100 * r.right / Math.max(1, r.total)); r.pct = pct; r.newBest = !r.retry && pct > (d.best[r.kind] || 0) && (d.rounds[r.kind] || 0) > 1; if (!r.retry) d.best[r.kind] = Math.max(d.best[r.kind] || 0, pct);
    r.streak = streak();
    X.saveProf();
    X.FX.play(pct === 100 ? 'levelup' : pct >= 70 ? 'star' : 'better');
    X.TEL.track('drill_done', { kind: r.kind, right: r.right, total: r.total, pct, sec: Math.round((Date.now() - r.t0) / 1000), streak: r.streak });
  }

  /* ---------- handlers ---------- */
  const H = {
    'dr-start'(el) { start(el.dataset.k || 'mix'); X.render(true); },
    'dr-quit'() { X.TEL.track('drill_quit', { kind: X.ui.dr && X.ui.dr.kind, at: X.ui.dr && X.ui.dr.i }); X.ui.dr = null; X.ui.view = 'home'; X.render(true); },
    'dr-again'() { start(X.ui.dr ? X.ui.dr.kind : 'mix'); X.render(true); },
    'dr-retry'() { const r = X.ui.dr; if (!r) return; const miss = r.res.filter((x) => !x.ok); X.TEL.track('drill_retry', { kind: r.kind, n: miss.length }); start(r.kind, miss); X.render(true); },
    'dr-next'() { next(); X.render(true); },
    'dr-check'(el) {   // Med Pass, step 1: what do you check?
      const st = X.ui.dr.c, k = cur(); if (st.stage !== 'check') return;
      st.check = +el.dataset.i; st.stage = 'decide'; scoreStep(!!k.check[st.check].ok); X.render();
    },
    'dr-pick'(el) {   // Med Pass step 2, or Who's First
      const r = X.ui.dr, st = r.c, c = r.deck[r.i], k = cur();
      if (c.kind === 'med') { if (st.stage !== 'decide') return; st.pick = +el.dataset.i; st.stage = 'done'; const ok = !!k.pick[st.pick].ok; scoreStep(ok); finishCard(ok); }
      else if (c.kind === 'first') { if (st.pick !== null) return; st.pick = +el.dataset.i; const ok = !!k.pts[st.pick].ok; scoreStep(ok); finishCard(ok); }
      X.render();
    },
    'dr-say'(el) {   // SBAR: pick a line
      const r = X.ui.dr, st = r.c, k = cur(); if (st.done || st.miss !== null) return;
      const s = k.steps[st.step], i = +el.dataset.i, ok = !!s.o[i].ok; scoreStep(ok);
      if (ok) sayOk(); else { st.miss = i; st.wrong = (st.wrong || 0) + 1; }
      X.render();
    },
    'dr-fix'() { const st = X.ui.dr.c; if (st.miss === null) return; st.miss = null; sayOk(); X.render(); },
    'dr-calm'(el) {   // De-escalation: say something
      const r = X.ui.dr, st = r.c, k = cur(); if (st.done) return;
      const t = k.turns[st.turn], i = +el.dataset.i, o = t.o[i], best = Math.min(...t.o.map((x) => x.d)), ok = o.d === best;
      scoreStep(ok); const from = st.m; st.m = Math.max(0, Math.min(10, st.m + o.d)); st.log.push({ turn: st.turn, i, ok, from, to: st.m, better: ok ? null : t.o.find((x) => x.d === best).t });
      X.FX.play(o.d < 0 ? 'better' : o.d > 0 ? 'worse' : 'tap');
      st.turn += 1;
      if (st.m >= 10) { st.crisis = true; st.done = true; }
      else if (st.turn >= k.turns.length) st.done = true;
      if (st.done) finishCard(st.m <= 3);
      X.render();
    },
  };
  function sayOk() {
    const st = X.ui.dr.c, k = cur(); st.said.push(st.step); st.step += 1;
    if (st.step >= k.steps.length) { st.done = true; finishCard((st.wrong || 0) <= 1); }
  }
  const cur = () => { const r = X.ui.dr, c = r.deck[r.i]; return card(c.kind, c.id); };

  /* ---------- views ---------- */
  function topBar() {
    const r = X.ui.dr, segs = r.deck.map((c, i) => `<i class="${i < r.i || (i === r.i && r.done) ? 'on' : i === r.i ? 'now' : ''}"></i>`).join('');
    return `<header class="dr-top">
      <button class="icon-btn dr-x" data-act="dr-quit" aria-label="Quit this round">${X.ICON.close}</button>
      <div class="dr-prog" role="progressbar" aria-label="${KINDS[r.kind].name}, card ${Math.min(r.i + 1, r.deck.length)} of ${r.deck.length}" aria-valuemin="0" aria-valuemax="${r.deck.length}" aria-valuenow="${r.i}">${segs}</div>
      <span class="dr-combo ${r.combo >= 2 ? 'hot' : ''} ${r.pop ? 'pop' : ''}" aria-live="polite">${X.ICON.flame}<b>${r.combo}</b><span class="sr"> in a row</span></span>
    </header>`;
  }
  function verdict(ok, why, pearl, extra) {
    const r = X.ui.dr, last = r.i >= r.deck.length - 1;
    return `<footer class="dr-foot ${ok ? 'ok' : 'no'}" role="status">
      <div class="dr-vd"><span class="dr-vi" aria-hidden="true">${ok ? X.ICON.tick : '<svg class="tick" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5"/><path d="M8 8l8 8M16 8l-8 8"/></svg>'}</span><b>${E(ok ? RIGHT[r.vi % RIGHT.length] : WRONG[r.vi % WRONG.length])}</b></div>
      ${extra || ''}
      ${why ? `<p class="dr-why">${E(why)}</p>` : ''}
      ${pearl ? `<p class="dr-pearl"><b>Remember</b>${E(pearl)}</p>` : ''}
      <button class="btn btn-primary btn-go dr-next" data-act="dr-next">${last ? 'See your round' : 'Next'} <span aria-hidden="true">→</span></button>
    </footer>`;
  }
  // Adults read like a chart (58M). Children get their age in words, so "2M" is never mistaken for two months.
  const age = (p) => typeof p.a === 'string' ? p.a : p.k || p.a < 18 ? `${p.a} yr${p.a === 1 ? '' : 's'}` : `${p.a}${p.x || ''}`;
  const who = (p) => `${E(p.n)}<small>${E(age(p))}</small>`;
  const chip = (kind) => `<span class="dr-kind k-${KINDS[kind].color}">${E(KINDS[kind].name)}</span>`;

  function vMed(k, st) {
    const key = face('dr-' + k.id, k.p), v = st.stage !== 'done' ? k.v : k.pick[st.pick].ok ? Object.assign({}, k.v, k.good) : Object.assign({}, k.v, k.bad);
    const checked = st.check !== null ? k.check[st.check] : null, key2 = k.check.find((x) => x.ok);
    const found = checked ? `<div class="dr-found">
        <p class="${checked.ok ? 'hit' : ''}"><span>You checked</span><b>${E(checked.t)}</b>${E(checked.v)}</p>
        ${checked.ok ? '' : `<p class="key"><span>What matters here</span><b>${E(key2.t)}</b>${E(key2.v)}</p>`}
      </div>` : '';
    const opts = (list, ord, act, sel, done) => `<div class="dr-opts">${ord.map((i, n) => { const o = list[i]; const cls = done ? (o.ok ? 'right' : i === sel ? 'wrong' : 'dim') : ''; return `<button class="dr-opt ${cls}" data-act="${act}" data-i="${i}" ${done ? 'aria-disabled="true" tabindex="-1"' : ''}><kbd>${n + 1}</kbd><span>${E(o.t)}</span></button>`; }).join('')}</div>`;
    const done = st.stage === 'done', ok = done && !!k.pick[st.pick].ok;
    return `<main class="dr-main">
      ${chip('med')}
      <section class="dr-scene">
        <div class="dr-bust">${X.R.bust(key, v, 'dr-face')}</div>
        <div class="dr-who"><h2>${who(k.p)}</h2>
          <div class="dr-rx"><span class="dr-pill" aria-hidden="true"></span><span><b>${E(k.med)}</b><small>${E(k.for)}</small></span></div>
          <p class="dr-line">${E(k.line)}</p></div>
        ${done ? `<p class="dr-said ${ok ? 'ok' : 'no'}">${E(ok ? k.goodLine : k.badLine)}</p>` : ''}
      </section>
      ${st.stage === 'check' ? `<h3 class="dr-q">Before you give it, what do you check first?</h3>${opts(k.check, st.co, 'dr-check', null, false)}` : found}
      ${st.stage !== 'check' ? `<h3 class="dr-q">${done ? 'Your call' : 'Give, hold, or call?'}</h3>${opts(k.pick, st.po, 'dr-pick', st.pick, done)}` : ''}
    </main>${done ? verdict(ok, k.why, k.pearl) : ''}`;
  }

  function vFirst(k, st) {
    const done = st.pick !== null, ok = done && !!k.pts[st.pick].ok;
    return `<main class="dr-main">
      ${chip('first')}
      <p class="dr-where">${E(k.where)}</p>
      <h3 class="dr-q big">${E(k.q)}</h3>
      <div class="dr-four">${st.po.map((i, n) => { const x = k.pts[i], key = face(`dr-${k.id}-${i}`, x.p), cls = done ? (x.ok ? 'right' : i === st.pick ? 'wrong' : 'dim') : '';
        return `<button class="dr-pt ${cls}" data-act="dr-pick" data-i="${i}" ${done ? 'aria-disabled="true" tabindex="-1"' : ''}><kbd>${n + 1}</kbd>${X.R.bust(key, done && x.ok && !ok ? { pain: 6, anxious: .6, pale: .4 } : null, 'dr-pface')}<span class="dr-pt-t"><b>${who(x.p)}</b><span>${E(x.line)}</span></span></button>`; }).join('')}</div>
    </main>${done ? verdict(ok, k.why, k.pearl) : ''}`;
  }

  function vSbar(k, st) {
    const key = face('dr-' + k.id, k.p), fin = st.done, ok = fin && (st.wrong || 0) <= 1;
    const v = !fin ? k.v : ok ? Object.assign({}, k.v, k.good) : Object.assign({}, k.v, k.bad);
    // The call so far is always the model call: a wrong line is corrected before it goes in. The provider's order
    // (a step's say) arrives just before the read-back.
    const said = st.said.map((si) => { const s = k.steps[si]; return (s.say ? `<li class="them">${E(s.say)}</li>` : '') + `<li class="me"><span class="dr-sk">${E(s.k === '✓' ? 'Read back' : s.k)}</span>${E(s.o.find((o) => o.ok).t)}</li>`; }).join('');
    const s = !fin ? k.steps[st.step] : null;
    const prompt = s && s.say ? `<li class="them">${E(s.say)}</li>` : '';
    const reply = fin ? `<li class="them end ${ok ? 'ok' : 'no'}">${E(ok ? k.win : k.lose)}</li>` : '';
    const NAMES = { S: 'Situation', B: 'Background', A: 'Assessment', R: 'Recommendation', '✓': 'Close the loop' };
    return `<main class="dr-main dr-chat">
      ${chip('sbar')}
      <section class="dr-stage">
        <div class="dr-bust sm">${X.R.bust(key, v, 'dr-face')}</div>
        <div><h2>${who(k.p)}</h2><p class="dr-line">${E(k.setup)}</p><p class="dr-to">Calling <b>${E(k.to)}</b> · ${E(k.at)}</p></div>
      </section>
      <ol class="dr-sbar-steps" aria-label="SBAR progress">${k.steps.map((x, i) => `<li class="${i < st.step || fin ? 'on' : i === st.step ? 'now' : ''}"><b>${E(x.k)}</b><span>${E(NAMES[x.k] || '')}</span></li>`).join('')}</ol>
      <ul class="dr-log">${said}${prompt}${reply}</ul>
      ${s ? (st.miss !== null ? `<div class="dr-miss"><p class="dr-wrongline"><span>You said</span>${E(s.o[st.miss].t)}</p><p class="dr-betterline"><span>Say this instead</span>${E(s.o.find((o) => o.ok).t)}</p><button class="btn btn-primary btn-go" data-act="dr-fix">Say it this way <span aria-hidden="true">→</span></button></div>`
        : `<h3 class="dr-q"><span class="dr-sk">${E(s.k)}</span>${E(s.q)}</h3><div class="dr-opts">${st.oo[st.step].map((i, n) => `<button class="dr-opt" data-act="dr-say" data-i="${i}"><kbd>${n + 1}</kbd><span>${E(s.o[i].t)}</span></button>`).join('')}</div>`) : ''}
    </main>${fin ? verdict(ok, ok ? (st.wrong ? 'One line needed fixing, but the call landed.' : 'Clean call: every line earned its place.') : `${st.wrong} lines needed fixing. Read the call above: that's the model.`, k.pearl) : ''}`;
  }

  function meter(m) {
    const lv = LEVEL[Math.round(m)];
    return `<div class="dr-meter" role="meter" aria-label="Agitation" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${m}" aria-valuetext="${lv}">
      <div class="dr-mbar"><i style="--m:${m / 10}"></i></div><span class="dr-mlab"><b>${lv}</b> ${m}/10</span></div>`;
  }
  function vCalm(k, st) {
    const key = face('dr-' + k.id, k.p), fin = st.done, win = fin && st.m <= 3;
    const v = { anxious: Math.min(1, st.m / 8), sweat: st.m >= 8 ? .4 : 0, smile: 0 }, vEnd = fin ? (win ? { anxious: .05 } : v) : v;
    const log = st.log.map((L) => { const t = k.turns[L.turn], o = t.o[L.i], dir = L.to < L.from ? 'down' : L.to > L.from ? 'up' : 'same';
      return `<li class="them">${E(t.say)}</li><li class="me ${L.ok ? 'ok' : 'no'}">${E(o.t)}<span class="dr-delta ${dir}">${dir === 'down' ? '▼' : dir === 'up' ? '▲' : '='} ${Math.abs(L.to - L.from)}</span></li><li class="react">${E(o.r)}</li>${L.ok ? '' : `<li class="better"><span>Better</span>${E(L.better)}</li>`}`; }).join('');
    const t = !fin ? k.turns[st.turn] : null;
    return `<main class="dr-main dr-chat">
      ${chip('calm')}
      <section class="dr-stage sticky">
        <div class="dr-bust sm">${X.R.bust(key, vEnd, 'dr-face')}</div>
        <div><h2>${who(k.p)}</h2><p class="dr-where">${E(k.where)}</p>${meter(st.m)}</div>
      </section>
      ${st.log.length ? '' : `<p class="dr-line setup">${E(k.setup)}</p>`}
      <ul class="dr-log">${log}${t ? `<li class="them now">${E(t.say)}</li>` : ''}${fin ? `<li class="them end ${win ? 'ok' : 'no'}">${E(st.crisis ? k.lose : outcomeLine('calm', k, st, win))}</li>` : ''}</ul>
      ${t ? `<h3 class="dr-q">What do you say?</h3><div class="dr-opts">${st.oo[st.turn].map((i, n) => `<button class="dr-opt" data-act="dr-calm" data-i="${i}"><kbd>${n + 1}</kbd><span>${E(t.o[i].t)}</span></button>`).join('')}</div>` : ''}
    </main>${fin ? verdict(win, st.crisis ? 'It tipped into a crisis. Look for the line that raised the meter most, and the better line under it.' : win ? 'You brought it down without force.' : 'It didn\'t settle. The "Better" lines show what would have.', k.pearl) : ''}`;
  }

  function vResult() {
    const r = X.ui.dr, pct = r.pct, miss = r.res.find((x) => !x.ok), take = (miss || r.res[r.res.length - 1] || {}).pearl;
    const head = pct === 100 ? 'Flawless round.' : pct >= 80 ? 'Strong round.' : pct >= 60 ? 'Good work.' : 'Every miss here is one you won\'t make on the floor.';
    const R = 54, C = 2 * Math.PI * R;
    return `<main class="dr-main dr-res">
      ${chip(r.kind)}
      <div class="dr-score">
        <svg viewBox="0 0 128 128" class="dr-ring" aria-hidden="true"><circle cx="64" cy="64" r="${R}" class="bg"/><circle cx="64" cy="64" r="${R}" class="fg" style="--c:${C};--o:${C * (1 - pct / 100)}"/></svg>
        <div class="dr-sc"><b>${r.right}<small>/${r.total}</small></b><span>decisions right</span></div>
      </div>
      <h2 class="dr-head">${E(head)}</h2>
      <p class="dr-stats"><span>${X.ICON.flame}<b>${r.best}</b> best run</span><span class="dr-day">${X.ICON.flame}<b>${r.streak}</b> day${r.streak === 1 ? '' : 's'} in a row</span>${r.newBest ? '<span class="dr-nb">New best</span>' : ''}</p>
      <section class="dr-fates" aria-label="Your patients">
        <h3>Your patients</h3>
        <ul>${r.res.map((x) => `<li class="${x.ok ? 'ok' : 'no'}"><span class="dr-fi" aria-hidden="true">${x.ok ? '✓' : '!'}</span><span><b>${E(x.name)}</b> <small>${E(KINDS[x.kind].name)}</small><br>${E(x.line)}</span></li>`).join('')}</ul>
      </section>
      ${take ? `<p class="dr-pearl big"><b>Take this with you</b>${E(take)}</p>` : ''}
      ${miss && !r.retry ? '<p class="dr-back">Missed cards also come back in later rounds.</p>' : ''}
      <div class="dr-again">
        ${miss ? (() => { const n = r.res.filter((x) => !x.ok).length; return `<button class="btn btn-primary btn-go dr-retry" data-act="dr-retry">Retry the ${n === 1 ? 'one' : n} you missed <span aria-hidden="true">→</span></button>`; })() : ''}
        <button class="btn ${miss ? '' : 'btn-primary btn-go'}" data-act="dr-again">${miss ? 'New round' : 'Play again'}${miss ? '' : ' <span aria-hidden="true">→</span>'}</button>
        <button class="btn" data-act="dr-quit">Home</button>
      </div>
      ${!X.prof().runs.length && Object.values(P().rounds).reduce((x, y) => x + y, 0) >= 2 ? `<button class="dr-up" data-act="shifts"><b>Ready to put it together?</b><span>Work a whole shift: four patients, report to debrief, about 15 minutes.</span><span class="h2-chev" aria-hidden="true">›</span></button>` : ''}
    </main>`;
  }

  function view() {
    const r = X.ui.dr; if (!r) return '';
    let body = '';
    if (r.done) body = vResult();
    else { const c = r.deck[r.i], k = card(c.kind, c.id), st = r.c; body = c.kind === 'med' ? vMed(k, st) : c.kind === 'first' ? vFirst(k, st) : c.kind === 'sbar' ? vSbar(k, st) : vCalm(k, st); }
    return `<div class="dr k-${KINDS[r.done ? r.kind : r.deck[r.i].kind].color}">${r.done ? `<header class="dr-top"><button class="icon-btn dr-x" data-act="dr-quit" aria-label="Home">${X.ICON.close}</button><div class="dr-prog done">${r.deck.map(() => '<i class="on"></i>').join('')}</div><span></span></header>` : topBar()}${body}</div>`;
  }
  /* After a redraw, bring what just happened into view once: the answer panel (with the options above it when it
     fits), or the next question. The first screen of a card starts at the top. */
  function after(root) {
    const r = X.ui.dr; if (!r || r.done) return;
    const st = r.c, key = `${r.i}:${r.vi}:${st.stage || ''}:${st.miss}`; if (r.seen === key) return; r.seen = key;
    if (!r.vi && !(st.log || st.said || []).length) return;
    const foot = root.querySelector('.dr-foot'), tgt = foot || [...root.querySelectorAll('.dr-miss, .dr-q')].pop(); if (!tgt) return;
    requestAnimationFrame(() => {
      if (!tgt.isConnected) return; const b = tgt.getBoundingClientRect(), vh = innerHeight;
      const want = foot ? (b.height < vh * .72 ? b.bottom - vh + 14 : b.top - vh * .22) : (b.top > vh * .55 ? b.top - vh * .32 : 0);
      if (want > 0) window.scrollBy({ top: want, behavior: X.reduced() ? 'auto' : 'smooth' });
    });
  }
  /* Number keys pick an option; Enter goes on. */
  function key(e) {
    const r = X.ui.dr; if (!r || X.ui.view !== 'drill' || X.ui.ov) return false;
    if (e.key === 'Enter' || e.key === ' ') { const n = document.querySelector('.dr-next, .dr-miss .btn-primary'); if (n && document.activeElement !== n) { e.preventDefault(); n.click(); return true; } return false; }
    if (/^[1-4]$/.test(e.key)) { const b = [...document.querySelectorAll('.dr-opts .dr-opt:not([aria-disabled]), .dr-four .dr-pt:not([aria-disabled])')].find((x) => (x.querySelector('kbd') || {}).textContent === e.key); if (b) { e.preventDefault(); b.click(); return true; } }
    if (e.key === 'Escape') { H['dr-quit'](); return true; }
    return false;
  }

  /* Music follows the room: in de-escalation the score tightens with the agitation meter and eases as it falls. */
  function mood() {
    const r = X.ui.dr; if (!r || r.done) return { scene: 'home', tension: 0, night: false };
    const c = r.deck[r.i], st = r.c;
    return { scene: 'play', tension: c.kind === 'calm' && !st.done ? Math.max(0, (st.m - 3) / 7) : 0, night: false };
  }
  /* The home screen's cast: three patients waiting on you, breathing. */
  function cast() {
    return ['mp-lispro-low', 'mp-metoprolol', 'mp-morphine-sed'].map((id, i) => { const k = card('med', id); return k ? `<span class="h2-p p${i}">${X.R.bust(face('dr-' + id, k.p), i === 1 ? { pale: .2 } : null, 'dr-face')}</span>` : ''; }).join('');
  }
  /* What the home screen needs. */
  function summary() { return { kinds: ORDER.map((k) => Object.assign({ k }, KINDS[k], mastery(k), { rounds: P().rounds[k] || 0, best: P().best[k] || 0 })), streak: streak(), today: playedToday(), rounds: Object.values(P().rounds).reduce((a, b) => a + b, 0), mix: KINDS.mix }; }

  S.drill = { init(ctx) { X = ctx; }, handlers: H, view, after, key, summary, start, cast, mood, KINDS, _lookOf: lookOf };
})(window.Shift = window.Shift || {});
