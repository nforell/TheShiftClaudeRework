// Records a practice-content sign-off from a reviewer's submission (the text from "Copy as text" or the email).
//   node tools/record_review.js --reviewer "Jane Doe, RN, BSN" --date 2026-11-10 submission.txt
// Only items marked ACCURATE are recorded, and only if the version they saw is still the current one; anything
// marked NEEDS CHANGE or NOT SURE, or seen at an older version, is listed so you can fix it and ask again.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : null; };
const reviewer = opt('--reviewer'), date = opt('--date') || new Date().toISOString().slice(0, 10), regPath = opt('--registry'), file = args[0];
if (!reviewer || !file) { console.error('usage: node tools/record_review.js --reviewer "Name, credentials" [--date YYYY-MM-DD] submission.txt'); process.exit(1); }
const text = fs.readFileSync(file, 'utf8');
const packs = JSON.parse(execFileSync('node', [path.join(__dirname, 'review_items.js')], { maxBuffer: 64 << 20 })).packs;
const now = Object.fromEntries(packs.flatMap((p) => p.items.map((it) => [it.id, it.hash])));
const REG = regPath || path.join(__dirname, '..', 'src', 'review-items.json'), reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
const out = { recorded: [], stale: [], flagged: [], unknown: [] };
for (const m of text.matchAll(/^\[(ACCURATE|NEEDS CHANGE|NOT SURE|NOTE)\] (\S+) \(version ([0-9a-f]+)\)(?:\n {2}→ (.*))?/gm)) {
  const [, v, id, hash, note] = m;
  if (!now[id]) { out.unknown.push(id); continue; }
  if (v !== 'ACCURATE') { out.flagged.push(`${id}: ${v}${note ? ` (${note})` : ''}`); continue; }
  if (hash !== now[id]) { out.stale.push(`${id}: reviewed version ${hash}, current is ${now[id]}`); continue; }
  reg.items[id] = { hash, reviewer, date };
  out.recorded.push(id);
}
fs.writeFileSync(REG, JSON.stringify(reg, null, 2) + '\n');
console.log(`Recorded ${out.recorded.length} sign-off(s) for ${reviewer}.`);
if (out.flagged.length) console.log(`\nNeeds a fix before it can be signed off (${out.flagged.length}):\n  ` + out.flagged.join('\n  '));
if (out.stale.length) console.log(`\nChanged since the reviewer saw it; ask them to look again (${out.stale.length}):\n  ` + out.stale.join('\n  '));
if (out.unknown.length) console.log(`\nNot found (removed or renamed): ${out.unknown.join(', ')}`);
console.log('\nThen run python3 build.py and commit.');
