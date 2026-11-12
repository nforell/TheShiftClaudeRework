"""Answer-length and position check for the NCLEX-style items that aren't single-answer: dropdowns (cloze) and
select-all (sata), in ngn-cases, ngn-challenge, ngn-focus and ngn-bank. Run: python3 tools/length_tell_ngn.py
Dropdowns: how often the right choice is the longest, and where it sits in the list as written.
Select-all: average length of right options against wrong ones (1.0 is even)."""
import re, pathlib, collections
SRC = pathlib.Path(__file__).resolve().parent.parent / 'src'
STR = r"(?:\"((?:[^\"\\]|\\.)*)\"|'((?:[^'\\]|\\.)*)')"
for f in ['ngn-bank.js', 'ngn-cases.js', 'ngn-challenge.js', 'ngn-focus.js']:
    s = (SRC / f).read_text(encoding='utf8'); n = longest = 0; pos = collections.Counter()
    for m in re.finditer(r"\{\s*\"?opts\"?:\s*\[([^\[\]]*)\],\s*\"?ans\"?:\s*(\d+)", s):
        opts = [a or b for a, b in re.findall(STR, m.group(1))]; a = int(m.group(2))
        if len(opts) < 2 or a >= len(opts): continue
        L = [len(o) for o in opts]; n += 1; pos[a] += 1
        if L[a] == max(L) and L.count(L[a]) == 1: longest += 1
    ok, no = [], []
    for m in re.finditer(r"\{\s*\"?t\"?:\s*" + STR + r",\s*\"?ok\"?:\s*(true|false)", s):
        (ok if m.group(3) == 'true' else no).append(len(m.group(1) or m.group(2)))
    line = f"{f:18}"
    if n: line += f" dropdowns {n:3}: right is longest {round(100 * longest / n):3}%, written first {round(100 * pos[0] / n):3}%"
    if ok and no: line += f"   select-all/single options: right avg {sum(ok) / len(ok):.0f} chars, wrong avg {sum(no) / len(no):.0f} (x{(sum(ok) / len(ok)) / (sum(no) / len(no)):.2f})"
    print(line)
