// Writes docs/DRILLS-REVIEW.md from src/drills-content.js: every card, its right answer and its teaching, for clinical
// review. Run: node tools/drills_doc.js
const fs = require('fs'), path = require('path');
global.window = {}; ['drills-content.js', 'drills-more-1.js', 'drills-more-2.js', 'drills-nclex-1.js', 'drills-nclex-2.js'].forEach((f) => require(path.join(__dirname, '..', 'src', f)));
const D = window.Shift.drillData, ok = (L) => (L.find((o) => o.ok) || {}).t, rest = (L) => L.filter((o) => !o.ok).map((o) => o.t + (o.w ? ` _(why not: ${o.w})_` : '')), LV = (c) => (c.lv >= 2 ? ' **[NCLEX level]**' : '');
let md = `# Drill content: clinical review checklist\n\nGenerated from \`src/drills-content.js\` by \`node tools/drills_doc.js\`. Do not edit by hand; edit the content and regenerate.\n\nFor each card: is the right answer right, is every wrong answer clearly wrong (not just less good), are the numbers current, and is the pearl safe to remember as a rule? Tick the box and initial it.\n\nCards: ${D.med.length} Med Pass, ${D.first.length} Who's First, ${D.sbar.length} SBAR, ${D.calm.length} De-escalation.\n`;
md += `\n## Med Pass\n`;
D.med.forEach((c) => { md += `\n### [ ] ${c.id}${LV(c)}: ${c.med} (${c.p.n}, ${c.p.a})\n${c.line}\n\n- **Check first:** ${ok(c.check)} → ${c.check.find((o) => o.ok).v}\n- Other checks: ${c.check.filter((o) => !o.ok).map((o) => `${o.t} (${o.v})`).join('; ')}\n- **Decision:** ${ok(c.pick)}\n- Wrong:\n${rest(c.pick).map((x) => '  - ' + x).join('\n')}\n- Why: ${c.why}\n- Pearl: ${c.pearl}\n`; });
md += `\n## Who's First\n`;
D.first.forEach((c) => { md += `\n### [ ] ${c.id}${LV(c)}: ${c.where}\n${c.pts.map((x) => `- ${x.ok ? '**' : ''}${x.p.n}, ${x.p.a}: ${x.line}${x.ok ? '** ← first' : x.w ? ` _(not first: ${x.w})_` : ''}`).join('\n')}\n- Why: ${c.why}\n- Pearl: ${c.pearl}\n`; });
md += `\n## SBAR\n`;
D.sbar.forEach((c) => { md += `\n### [ ] ${c.id}${LV(c)}: ${c.p.n}, calling ${c.to}\n${c.setup}\n\n${c.steps.map((s) => `- **${s.k}:** ${ok(s.o)}${s.say ? `\n  - Provider: ${s.say}` : ''}\n  - Wrong:\n${rest(s.o).map((x) => '    - ' + x).join('\n')}`).join('\n')}\n- Pearl: ${c.pearl}\n`; });
md += `\n## De-escalation\n`;
D.calm.forEach((c) => { md += `\n### [ ] ${c.id}${LV(c)}: ${c.p.n}, ${c.where} (starts at ${c.m}/10)\n${c.setup}\n\n${c.turns.map((t, i) => { const lo = Math.min(...t.o.map((o) => o.d)); return `- Turn ${i + 1}: ${t.say}\n  - **Best (${lo}):** ${t.o.find((o) => o.d === lo).t}\n  - Others: ${t.o.filter((o) => o.d !== lo).map((o) => `${o.t} (${o.d > 0 ? '+' : ''}${o.d})`).join(' / ')}`; }).join('\n')}\n- Pearl: ${c.pearl}\n`; });
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'DRILLS-REVIEW.md'), md);
console.log('wrote docs/DRILLS-REVIEW.md', md.length);
