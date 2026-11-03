/* Clinical review of the practice content (drills and NCLEX questions), one pack per page.
   build.py writes the page from site/review.html's head and styles plus this script, with window.RI:
     { pack: null | { id, title, sub, items: [{ id, hash, title, body: [lines], st: 'awaiting'|'reviewed'|'changed', by }] },
       packs: [{ id, title, sub, n, reviewed, changed }] }
   A sign-off is recorded per item, against that item's fingerprint, in src/review-items.json (see docs/CLINICAL-REVIEW.md). */
(() => {
  const S = window.Shift || {}, TEL = S.tel, RI = window.RI || { packs: [] }, app = document.getElementById('app');
  const esc = (x) => String(x == null ? '' : x).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LBL = { awaiting: 'Awaiting clinical review', reviewed: 'Clinically reviewed', changed: 'Changed since its review' };
  const packChip = (p) => (p.reviewed === p.n ? '<span class="chip reviewed">Clinically reviewed</span>'
    : `<span class="chip awaiting">${p.reviewed} of ${p.n} reviewed</span>`) + (p.changed ? ` <span class="chip changed">${p.changed} changed since review</span>` : '');

  if (!RI.pack) {   // index: every pack
    const groups = [['Drills', (p) => p.id.startsWith('drill-')], ['NCLEX questions after each shift', (p) => p.id.startsWith('ngn-shift')], ['NCLEX question bank', (p) => p.id.startsWith('bank-')], ['Unfolding case studies', (p) => p.id.startsWith('cases-')]];
    app.innerHTML = `<a class="home" href="/">The Shift</a><h1>Clinical review: practice content</h1>
      <p class="muted">The drills and NCLEX practice questions, split into packs a clinician can check in one sitting (about 30 to 45 minutes each). Each item shows the right answer and why every other option is wrong. Pick a pack that matches your experience.</p>
      <p><a href="/review/">Reviewing a whole shift instead? Shift reviews are here.</a></p>
      ${groups.map(([h, f]) => { const L = RI.packs.filter(f); return L.length ? `<h2>${esc(h)}</h2><div class="shifts">${L.map((p) => `<a href="/review/practice/${esc(p.id)}/"><div class="card"><div style="display:flex;justify-content:space-between;gap:.6rem;flex-wrap:wrap"><h3>${esc(p.title)}</h3><span>${packChip(p)}</span></div><p class="muted" style="margin:.3rem 0 0">${p.n} items. ${esc(p.sub)}</p></div></a>`).join('')}</div>` : ''; }).join('')}`;
    return;
  }

  const P = RI.pack, KEY = 'theshift.review.items.' + P.id;
  let R = {}; try { R = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { R = {}; }
  R.marks = R.marks || {}; R.notes = R.notes || {};
  const saveDraft = () => { try { localStorage.setItem(KEY, JSON.stringify(R)); } catch (e) { /* storage off: still works for this visit */ } };
  // Body lines: ✓ marks the keyed answer, "- " a wrong one, two-space indents are the reason under it.
  const line = (l) => {
    if (!l) return '<div class="sp"></div>';
    if (/^  /.test(l)) return `<p class="why">${esc(l.trim())}</p>`;
    if (/^✓/.test(l)) return `<p class="ok"><b>${esc(l)}</b></p>`;
    if (/^(- ✗|- |✗)/.test(l)) return `<p class="no">${esc(l.replace(/^- /, ''))}</p>`;
    return `<p>${esc(l)}</p>`;
  };
  const verdict = (id) => `<div class="verdict" role="group" aria-label="Your verdict">${[['ok', 'Accurate'], ['fix', 'Needs change'], ['unsure', 'Not sure']].map(([v, l]) => `<button type="button" data-rid="${esc(id)}" data-v="${v}" aria-pressed="${R.marks[id] === v}">${l}</button>`).join('')}</div>
    <textarea data-note="${esc(id)}" placeholder="What should it say instead? A source helps." ${R.marks[id] === 'fix' || R.notes[id] ? '' : 'hidden'} aria-label="Your comment">${esc(R.notes[id] || '')}</textarea>`;
  const itemHTML = (it, k) => `<div class="dec item" id="i-${k + 1}"><div class="top"><span class="pts">${k + 1}</span><span class="chip ${it.st}">${esc(LBL[it.st])}${it.by ? `: ${esc(it.by)}` : ''}</span><span>${esc(it.id)} · version ${esc(it.hash)}</span></div>
      <b>${esc(it.title)}</b><div class="body">${it.body.map(line).join('')}</div>${verdict(it.id)}</div>`;
  const items = P.items.map((x) => x.id);

  app.innerHTML = `<a class="home" href="/review/practice/">The Shift · Practice review</a>
    <h1>${esc(P.title)}</h1>
    <p class="muted" style="margin:0">${esc(P.sub)}</p>
    <div class="meta">${packChip(RI.packs.find((p) => p.id === P.id) || { n: items.length, reviewed: 0, changed: 0 })}<span class="chip">${items.length} items</span></div>
    <div class="card how"><h3>How to review</h3><ol>
      <li>For each item, check that the marked answer is right, that every other option is clearly wrong (not just slightly less good), that the numbers are current, and that any tip is safe to remember as a rule.</li>
      <li>Mark <b>Accurate</b>, <b>Needs change</b> or <b>Not sure</b>. Say what's wrong when something needs changing.</li>
      <li>Add your details and any references, then send. Your answers save in this browser as you go, so you can stop and come back.</li></ol>
      <p class="muted" style="margin-bottom:0">These are practice items for nursing students, written to common US teaching. Judge them against what a safe, current standard of care would teach a new nurse, not your facility's policy.</p></div>
    <div class="bar"><span id="count"></span><span class="prog" aria-hidden="true"><i id="progbar"></i></span><a class="btn" href="#send" style="min-height:38px">Send</a></div>
    <h2>About you</h2>
    <div class="grid2"><div><label for="rv-name">Name</label><input id="rv-name" type="text" autocomplete="name" data-f="name" value="${esc(R.name || '')}"></div>
      <div><label for="rv-cred">Credentials</label><input id="rv-cred" type="text" placeholder="RN, MSN, PharmD…" data-f="cred" value="${esc(R.cred || '')}"></div>
      <div><label for="rv-role">Current role and specialty</label><input id="rv-role" type="text" placeholder="Med-surg RN, 6 years; nurse educator…" data-f="role" value="${esc(R.role || '')}"></div>
      <div><label for="rv-email">Email</label><input id="rv-email" type="email" autocomplete="email" data-f="email" value="${esc(R.email || '')}"></div></div>
    <h2>Items</h2>${P.items.map(itemHTML).join('')}
    <h2 id="send">Send your review</h2>
    <label for="rv-refs">References you'd cite</label><textarea id="rv-refs" data-f="refs" placeholder="Guidelines, drug references or textbooks that support or contradict the content">${esc(R.refs || '')}</textarea>
    <label for="rv-overall">Anything else</label><textarea id="rv-overall" data-f="overall" placeholder="Patterns you noticed, items a new grad would find unfair, anything missing">${esc(R.overall || '')}</textarea>
    <label class="check"><input type="checkbox" id="rv-ok" ${R.signoff ? 'checked' : ''}><span>The items I marked Accurate are clinically accurate for nursing education, and I'm happy to be named as a reviewer.</span></label>
    <div class="row"><button class="btn btn-primary" id="rv-send" type="button">Send review</button><button class="btn" id="rv-copy" type="button">Copy as text</button></div>
    <div class="msg" id="rv-msg" role="status" aria-live="polite"></div><pre id="rv-text" hidden></pre>`;

  const count = () => { const n = items.filter((k) => R.marks[k]).length; document.getElementById('count').textContent = `${n} of ${items.length} reviewed`; document.getElementById('progbar').style.width = Math.round((n / Math.max(1, items.length)) * 100) + '%'; };
  count();
  app.addEventListener('click', (e) => {
    const b = e.target.closest('.verdict button'); if (!b) return;
    const id = b.dataset.rid, v = R.marks[id] === b.dataset.v ? null : b.dataset.v;
    if (v) R.marks[id] = v; else delete R.marks[id];
    b.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.v === v)));
    const ta = b.parentElement.nextElementSibling; if (ta) { ta.hidden = v !== 'fix' && v !== 'unsure' && !R.notes[id]; if (v === 'fix' && !R.notes[id]) ta.focus(); }
    saveDraft(); count();
  });
  app.addEventListener('input', (e) => { const t = e.target; if (t.dataset.note) { R.notes[t.dataset.note] = t.value; saveDraft(); } else if (t.dataset.f) { R[t.dataset.f] = t.value; saveDraft(); } });
  document.getElementById('rv-ok').addEventListener('change', (e) => { R.signoff = e.target.checked; saveDraft(); });

  // Every verdict travels with the item's version, so a sign-off can only ever apply to the text the reviewer saw.
  const marked = () => P.items.filter((x) => R.marks[x.id] || R.notes[x.id]).map((x) => ({ id: x.id, hash: x.hash, v: R.marks[x.id] || 'note', note: R.notes[x.id] || '' }));
  function asText() {
    const lab = { ok: 'ACCURATE', fix: 'NEEDS CHANGE', unsure: 'NOT SURE', note: 'NOTE' };
    const L = [`Practice content review: ${P.title} (${P.id})`, `Reviewer: ${R.name || ''}, ${R.cred || ''} · ${R.role || ''} · ${R.email || ''}`, `Sign-off: ${R.signoff ? 'yes' : 'no'}`, `Reviewed ${items.filter((k) => R.marks[k]).length} of ${items.length}`, ''];
    marked().forEach((m) => L.push(`[${lab[m.v]}] ${m.id} (version ${m.hash})${m.note ? '\n  → ' + m.note : ''}`));
    if (R.refs) L.push('', 'References:', R.refs); if (R.overall) L.push('', 'Other comments:', R.overall);
    return L.join('\n');
  }
  const msg = (t, cls) => { const m = document.getElementById('rv-msg'); m.className = 'msg ' + (cls || ''); m.textContent = t; };
  const showText = () => { const pre = document.getElementById('rv-text'); pre.textContent = asText(); pre.hidden = false; try { const w = navigator.clipboard.writeText(asText()); if (w && w.catch) w.catch(() => {}); } catch (e) { /* the text is shown to select instead */ } };
  document.getElementById('rv-copy').addEventListener('click', () => { showText(); msg('Copied. It\'s also shown below.', 'ok'); });
  document.getElementById('rv-send').addEventListener('click', () => {
    if (!R.name || !R.cred) { msg('Add your name and credentials first, so the review can be credited.', 'err'); document.getElementById(R.name ? 'rv-cred' : 'rv-name').focus(); return; }
    if (!items.some((k) => R.marks[k])) { msg('Mark at least one item first.', 'err'); return; }
    const res = TEL && TEL.configured && TEL.configured() && /^https:/.test(location.protocol)
      ? TEL.feedback('clinical_review_items', { pack: P.id, reviewer: R.name, credentials: R.cred, role: R.role || '', reviewer_email: R.email || '', signoff: !!R.signoff, reviewed: items.filter((k) => R.marks[k]).length, of: items.length, accurate: items.filter((k) => R.marks[k] === 'ok').length, marks: JSON.stringify(marked()).slice(0, 60000), references: R.refs || '', comments: R.overall || '' })
      : null;
    if (res === 'sent') { msg('Sent. Thank you. Every flagged item gets looked at, and you\'ll hear back by email.', 'ok'); return; }
    showText();
    location.href = `mailto:${(S.config || {}).feedbackEmail || ''}?subject=${encodeURIComponent('Practice review: ' + P.title)}&body=${encodeURIComponent('My review is below (also copied to the clipboard; paste it here if it got cut off).\n\n' + asText().slice(0, 1500))}`;
    msg('Your email app should open. The full review is copied: paste it into the email if it got cut off.', 'ok');
  });
})();
