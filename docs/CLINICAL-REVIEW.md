# Clinical review

How a shift goes from "Awaiting clinical review" to "Clinically reviewed", and stays honest after that.

## What reviewers see
`/review/` lists every shift. `/review/<shift>/` (for example `/review/psych-3e-1/`) shows:
- every patient: history, report, labs, medications and orders;
- every scored decision: points, skill area, NCLEX step, and the rationale the debrief gives the player, with a link to the line of source it comes from;
- the floor calls for that unit, with every option and its feedback;
- for each item: **Accurate**, **Needs change** or **Not sure**, and a comment box.

Answers save in the reviewer's browser as they go. **Send review** delivers it as a `feedback` event with `kind = clinical_review` in PostHog (or, without an analytics key, opens an email with the review copied to the clipboard). Each submission carries the shift's **content version**.

The pages are not linked from search engines (`noindex`), but anyone with the link can open them. They contain spoilers for the game.

## Who to ask
One reviewer per shift is the minimum; two is better. Match the shift to the specialty:

| Shift | Ideal reviewer |
| --- | --- |
| Days, evenings and nights on 4 West (med-surg) | Med-surg RN with 3+ years, or a med-surg clinical instructor |
| Days on 3 East (adult psych) | Inpatient psych RN; California-licensed for the 5150/5250/Riese content |
| Evenings on 5 South (peds) | Pediatric RN |
| Evenings in the ED (Pod B) | Emergency RN, ideally with stroke and STEMI coordinator experience |
| Days on 2 North (mother-baby) | Postpartum or mother-baby RN; an L&D nurse for the hemorrhage and magnesium content |
| Any shift with heavy medication content | A PharmD for the medication traps |

Credit them by name in the game (the sign-off checkbox asks permission).

## Recording a sign-off
1. In PostHog, open the reviewer's `clinical_review` event (or their email).
2. Fix what they flagged in `src/case-*.js` / `src/stories/*.js`. Fixing content changes its version.
3. If you changed anything, send them the new link and ask for a quick re-check of just those items.
4. In `src/review.js`, under that shift, add the reviewer and the content version they approved:
   ```js
   'psych-3e-1': {
     reviewers: [{ name: 'Jane Doe', credentials: 'RN, MSN', role: 'Inpatient psych, 8 years', date: '2026-10-15' }],
     hash: 'abc123def0',   // "Content version" shown on the review page
     references: [{ text: 'Reference they cited', url: 'https://…' }],
   },
   ```
5. Run `python3 build.py`, commit, push.

## After a sign-off
If anyone edits that shift's case or story file later, its content version changes, and the game shows **Updated since its last review** until a reviewer checks the new version and you update `hash`.
