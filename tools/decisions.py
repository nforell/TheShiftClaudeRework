"""Finds every scored decision in the game's source: each A.judge(key, domain, points, text, why, patient) call.
Ternaries become one row per branch, so "P.bruises ? 'You made a report' : 'You reported without a concern'" gives
both. Template values (${...}) show as [value]. Used by build.py for the clinical review packets.
Run directly to print a count: python tools/decisions.py"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'


def _skip_string(s, i):
    """s[i] is a quote; return the index just past the closing quote (handles nested template literals)."""
    q = s[i]; i += 1
    while i < len(s):
        c = s[i]
        if c == '\\': i += 2; continue
        if q == '`' and s.startswith('${', i):
            i = _skip_expr(s, i + 2, '}'); continue
        if c == q: return i + 1
        i += 1
    return i


def _skip_expr(s, i, close):
    """Skip a JS expression up to the matching close bracket; return index just past it."""
    depth = 0
    while i < len(s):
        c = s[i]
        if c in '\'"`': i = _skip_string(s, i); continue
        if c in '([{': depth += 1
        elif c in ')]}':
            if depth == 0 and c == close: return i + 1
            depth -= 1
        i += 1
    return i


def _args(s, i):
    """s[i] is just after 'judge('. Split the top-level arguments."""
    out, start, depth = [], i, 0
    while i < len(s):
        c = s[i]
        if c in '\'"`': i = _skip_string(s, i); continue
        if c in '([{': depth += 1
        elif c in ')]}':
            if depth == 0:
                out.append(s[start:i].strip()); return out
            depth -= 1
        elif c == ',' and depth == 0:
            out.append(s[start:i].strip()); start = i + 1
        i += 1
    return out


def _literal(tok):
    """A JS string literal token -> readable text. Template values ${...} become [value]."""
    q, body = tok[0], tok[1:-1]
    if q == '`':
        out, i = [], 0
        while i < len(body):
            if body.startswith('${', i):
                i = _skip_expr(body, i + 2, '}'); out.append('[value]'); continue
            if body[i] == '\\': out.append(body[i:i + 2]); i += 2; continue
            out.append(body[i]); i += 1
        body = ''.join(out)
    return body.replace("\\'", "'").replace('\\"', '"').replace('\\n', ' ').replace('\\`', '`')


def _strings(expr):
    """All top-level string literals in an expression (one for a plain string, two for a ternary)."""
    found, i = [], 0
    while i < len(expr):
        c = expr[i]
        if c in '\'"`':
            j = _skip_string(expr, i); found.append(_literal(expr[i:j])); i = j; continue
        if c in '([{':
            i = _skip_expr(expr, i + 1, {'(': ')', '[': ']', '{': '}'}[c]); continue
        i += 1
    return found


def _numbers(expr):
    n = re.findall(r'-?\d+(?:\.\d+)?', re.sub(r'\.\d+\s*\)', ')', expr))
    return [float(x) if '.' in x else int(x) for x in n] if re.fullmatch(r'[\s\w.!?:()<>=&|+\-*/\'"\[\]]*', expr) else []


def _key(expr):
    s = _strings(expr)
    if expr[:1] in '\'"`' and s: return s[0]
    return re.sub(r'\s+', ' ', expr)[:60]


def find(files=None):
    files = files or sorted(list(SRC.glob('*.js')) + list((SRC / 'stories').glob('*.js')))
    rows = []
    for f in files:
        src = f.read_text()
        for m in re.finditer(r'\bjudge\(', src):
            if src[max(0, m.start() - 9):m.start()].endswith('function '): continue
            a = _args(src, m.end())
            if len(a) < 5 or not re.fullmatch(r"'[a-z]+'", a[1]): continue
            line = src.count('\n', 0, m.start()) + 1
            texts, whys, pts = _strings(a[3]), _strings(a[4]), _numbers(a[2])
            texts = [x for x in texts if len(x.split()) >= 3] or texts   # drop stray fragments like 'sepsis'
            if not texts: continue
            pid = (_strings(a[5]) or [None])[0] if len(a) > 5 else None
            key = _key(a[0])
            if not pid:
                mm = re.match(r'^(?:st-)?(\d{3})-', key); pid = mm.group(1) if mm else None
            n = max(len(texts), 1)
            for k in range(n):
                rows.append({
                    'file': str(f.relative_to(ROOT)), 'line': line, 'key': key, 'domain': a[1].strip("'"),
                    'points': pts[k] if len(pts) == n else (pts[0] if len(pts) == 1 else 'varies'),
                    'text': texts[k], 'why': whys[k] if len(whys) == n else (whys[0] if whys else ''), 'pid': pid,
                })
    return rows


# Which source files belong to which shift.
def case_files():
    out = {}
    for f in sorted(SRC.glob('case-*.js')):
        m = re.search(r"\bid: '([a-z]+-[0-9a-z]+-\d+)'", f.read_text())
        if not m: continue
        story = SRC / 'stories' / f.name.replace('case-', '')
        out[m.group(1)] = [f] + ([story] if story.exists() else [])
    return out


if __name__ == '__main__':
    rows = find()
    print(len(rows), 'decisions;', sum(1 for r in rows if r['why']), 'with a rationale')
    for cid, fs in case_files().items():
        print(cid, len(find(fs)))
