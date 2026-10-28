// Writes docs/NCLEX-CHALLENGE-REVIEW.md from src/ngn-challenge.js: every challenge item with its key and the reason for
// every option, for clinical review. Run: node tools/challenge_doc.js
const fs = require('fs'), path = require('path');
global.window = {}; require(path.join(__dirname, '..', 'src', 'ngn-challenge.js'));
const C = window.Shift.ngnChallenge;
let md = '# NCLEX challenge items: clinical review checklist\n\nGenerated from `src/ngn-challenge.js` by `node tools/challenge_doc.js`. Two per shift, after its three regular items. For each: is the key right, is every wrong option clearly wrong, and is the reasoning current?\n';
for (const [cid, L] of Object.entries(C)) {
  md += `\n## ${cid}\n`;
  for (const it of L) {
    md += `\n### [ ] ${it.id} (${it.type}, step: ${it.step}, ${it.topic})\n${it.stem}\n\n**${it.q}**\n\n`;
    if (it.type === 'matrix') md += it.rows.map((r) => `- ${r.t} → **${it.cols[r.ans]}**: ${r.why}`).join('\n');
    if (it.type === 'sata') md += it.opts.map((o) => `- ${o.ok ? '**[x]**' : '[ ]'} ${o.t}: ${o.why}`).join('\n');
    if (it.type === 'highlight') md += it.parts.map((o) => `- ${o.ok ? '**[highlight]**' : '[ ]'} ${o.t}: ${o.why}`).join('\n');
    if (it.type === 'cloze') md += it.parts.filter((x) => typeof x !== 'string').map((x, b) => `- Blank ${b + 1}:\n` + x.opts.map((o, i) => `  - ${i === x.ans ? '**' + o + '**' : o}: ${x.whys[i]}`).join('\n')).join('\n');
    if (it.type === 'bowtie') ['cond', 'actions', 'params'].forEach((k) => { const a = Array.isArray(it[k].ans) ? it[k].ans : [it[k].ans]; md += `- ${k}:\n` + it[k].opts.map((o, i) => `  - ${a.includes(i) ? '**' + o + '**' : o}: ${it.whys[k][i]}`).join('\n') + '\n'; });
    md += `\n- Why: ${it.why}\n- Tip: ${it.tip}\n`;
  }
}
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'NCLEX-CHALLENGE-REVIEW.md'), md);
console.log('wrote docs/NCLEX-CHALLENGE-REVIEW.md', md.length);
