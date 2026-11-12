"""Answer-length check for in-shift conversations: for every `choices: [` block in the shift cases and stories, is the
best-scored reply (highest J(...) points) also the longest? Run: python3 tools/length_tell_dialogs.py [-v]
Survey only. Chance is about 33%."""
import re, sys, pathlib
SRC = pathlib.Path(__file__).resolve().parent.parent / 'src'
files = sorted(SRC.glob('case-*.js')) + sorted((SRC / 'stories').glob('*.js')) + sorted(SRC.glob('floor*.js'))
opt = re.compile(r"\{ (?:label|t): (?:'((?:[^'\\]|\\.)*)'|`([^`]*)`|\"((?:[^\"\\]|\\.)*)\")(.*)")
PTS = re.compile(r"(?:\bJ|judge)\((?:'[^']*'|`[^`]*`), (?:'[^']*'|`[^`]*`), (-?[\d.]+)|\brap: (-?[\d.]+)|\bv: (-?[\d.]+)")
tot = [0, 0]
for f in files:
    lines = f.read_text(encoding='utf8').split('\n'); n = longest = 0; ratio = 0.0; i = 0; worst = []
    while i < len(lines):
        if 'choices: [' in lines[i] or 'opts: [' in lines[i]:
            opts = []; j = i if ('{ label:' in lines[i] or '{ t:' in lines[i]) else i + 1
            while j < len(lines) and ('{ label:' in lines[j] or '{ t:' in lines[j]):
                m = opt.search(lines[j])
                if m:
                    text = (m.group(1) or m.group(2) or m.group(3) or '').replace("\\'", "'"); pts = PTS.search(m.group(4))
                    opts.append((len(text), float(next(g for g in pts.groups() if g is not None)) if pts else 0.0, text))
                j += 1
            if len(opts) >= 3:
                best = max(o[1] for o in opts); top = [o for o in opts if o[1] == best]
                if len(top) == 1 and best > 0:
                    others = [o[0] for o in opts if o is not top[0]]; n += 1; r = top[0][0] / (sum(others) / len(others)); ratio += r
                    if top[0][0] > max(others): longest += 1; worst.append((r, i + 1, top[0][2][:70]))
            i = j
        else: i += 1
    if n:
        tot[0] += n; tot[1] += longest
        print(f"{f.name:28} {n:4} conversations   best reply is longest {round(100 * longest / n):3}%   length best/others {ratio / n:.2f}")
        if '-v' in sys.argv:
            for r, ln, t in sorted(worst, reverse=True)[:8]: print(f"      line {ln}: x{r:.1f}  {t}")
print(f"{'ALL':28} {tot[0]:4} conversations   best reply is longest {round(100 * tot[1] / max(1, tot[0])):3}%")
