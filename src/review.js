/* The Shift — clinical review record.
   Who reviewed each shift, against which version of its content, and what they cited. This is what the game shows
   players under "Clinical review", so only put people here who actually signed off.

   To record a sign-off (after a reviewer submits /review/<shift>/):
     1. Add them to that shift's `reviewers`: { name, credentials, role, date: 'YYYY-MM-DD' }.
     2. Set `hash` to the content hash shown on their submission (it's also printed on the review page).
     3. Add any references they cite to `references`: { text, url }.
   If the shift's content changes after that, the game shows "Updated since review" until it's reviewed again.
   The build fills in Shift.reviewHashes with each shift's current content hash. */
(function (S) {
  const CASES = {
    'medsurg-4w-1': { reviewers: [], hash: '', references: [] },
    'medsurg-4w-2': { reviewers: [], hash: '', references: [] },
    'medsurg-4w-3': { reviewers: [], hash: '', references: [] },
    'psych-3e-1': { reviewers: [], hash: '', references: [] },
    'peds-5s-1': { reviewers: [], hash: '', references: [] },
  };
  const now = (id) => (S.reviewHashes || {})[id] || '';
  /* awaiting: nobody has signed off yet · reviewed: signed off on this exact content · changed: signed off on an older version */
  function status(id) {
    const r = CASES[id];
    if (!r || !r.reviewers.length) return { state: 'awaiting', label: 'Awaiting clinical review', r: r || { reviewers: [], references: [] } };
    if (r.hash && now(id) && r.hash !== now(id)) return { state: 'changed', label: 'Updated since its last review', r };
    return { state: 'reviewed', label: 'Clinically reviewed', r };
  }
  S.review = { CASES, status, hash: now };
})(window.Shift = window.Shift || {});
