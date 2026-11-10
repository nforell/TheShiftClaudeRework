"""Apply option-text rewrites to a source file. Usage: python3 tools/apply_rewrites.py src/<file>.js <patch.json>
The patch is a JSON list of [old, new] pairs. Each old string must appear exactly once in the file (as written in a
single-quoted JS string, so apostrophes are matched escaped). For short labels that repeat ("Potassium"), give
[old, new, anchor]: the first match after the anchor text (a card id such as mp-kcl) is replaced.
Nothing is written unless every pair applies."""
import sys, json, pathlib
f = pathlib.Path(sys.argv[1]); s = f.read_text(encoding='utf8'); bad = 0
for row in json.loads(pathlib.Path(sys.argv[2]).read_text(encoding='utf8')):
    old, new = row[0], row[1]
    if len(row) > 2:
        a = s.find("'" + row[2] + "'"); o = "t: '" + old.replace("'", "\\'") + "'"; i = s.find(o, a) if a >= 0 else -1
        if i < 0 or i - a > 1500: bad += 1; print('NOT APPLIED:', row[2], old[:60]); continue
        s = s[:i] + "t: '" + new.replace("'", "\\'") + "'" + s[i + len(o):]; continue
    for esc in (lambda x: x.replace("'", "\\'"), lambda x: x):
        o, n = esc(old), esc(new)
        if s.count("'" + o + "'") == 1: s = s.replace("'" + o + "'", "'" + n + "'"); break
        if s.count('`' + o + '`') == 1: s = s.replace('`' + o + '`', '`' + n + '`'); break
    else: bad += 1; print('NOT APPLIED:', old[:90])
if bad: sys.exit(f'{bad} pairs did not apply; file left unchanged')
f.write_text(s, encoding='utf8'); print('applied')
