import pathlib, os, subprocess
src=pathlib.Path(__file__).parent/'src'
# Minify with a pinned esbuild (tools/minify), so every machine builds byte-identical dist/. One-time setup:
#   cd tools/minify && npm ci
# SHIFT_NO_MINIFY=1 skips it for a quick local build (dist/ will then differ from the committed one).
ESB = pathlib.Path(__file__).parent/'tools'/'minify'/'node_modules'/'.bin'/('esbuild.cmd' if os.name == 'nt' else 'esbuild')
NOMIN = os.environ.get('SHIFT_NO_MINIFY') == '1'
if not NOMIN and not ESB.exists():
    sys_ = __import__('sys'); sys_.stderr.write('The minifier is not installed. Run:  cd tools/minify && npm ci\n(or set SHIFT_NO_MINIFY=1 for a quick unminified local build)\n'); sys_.exit(1)
def _esb(code, loader):
    if NOMIN: return code
    r = subprocess.run([str(ESB), '--minify', '--loader=' + loader, '--target=es2020', '--charset=utf8', '--legal-comments=none', '--log-level=error'], input=code.encode('utf-8'), capture_output=True)
    if r.returncode: raise SystemExit('esbuild failed: ' + r.stderr.decode()[:2000])
    return r.stdout.decode('utf-8').rstrip('\n')
minjs = lambda code: _esb(code, 'js').replace('</script', '<\\/script')
mincss = lambda code: _esb(code, 'css')
css=mincss((src/'styles.css').read_text())
# Clinical review: each shift's content hash (its case file + story file), so the game can tell a reviewed shift
# from one that changed after review. See src/review.js and docs/CLINICAL-REVIEW.md.
import hashlib, json, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent / 'tools'))
import decisions as DEC
CF = DEC.case_files()
hashes = {cid: hashlib.sha256(b''.join(f.read_bytes() for f in fs)).hexdigest()[:10] for cid, fs in CF.items()}
pre = 'window.Shift = window.Shift || {}; window.Shift.reviewHashes = ' + json.dumps(hashes) + ';\n'
# Terms of use and disclaimer: one source (src/terms.json) for the in-game sheet and the /terms/ page.
TERMS = json.loads((src/'terms.json').read_text())
pre += 'window.Shift.terms = ' + json.dumps(TERMS).replace('</', '<\\/') + ';\n'
# The NCLEX data (rationales, focus items, the question bank, case studies) is about a quarter of the game. It ships
# as JSON blocks that are parsed the first time something reads them, so starting the game doesn't pay for it; the
# home screen's counts come from ngnMeta, computed here.
DATA = {'ngnWhy': 'ngn-why.js', 'ngnFocus': 'ngn-focus.js', 'ngnBank': 'ngn-bank.js', 'ngnCases': 'ngn-cases.js'}
def _data(f):
    s = (src/f).read_text(); i = s.index('window.Shift.ngn'); body = s[s.index('=', i) + 1:].strip().rstrip(';')
    return json.loads(body)
DATAV = {k: _data(f) for k, f in DATA.items()}
meta = {'focus': len(DATAV['ngnFocus']), 'bank': len(DATAV['ngnBank']), 'cases': [{'id': c['id'], 'sp': c.get('sp')} for c in DATAV['ngnCases']]}
datablocks = ''.join(f'<script type="application/json" id="sd-{k}">' + json.dumps(v, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + '</script>\n' for k, v in DATAV.items())
lazy = ('window.Shift.ngnMeta = ' + json.dumps(meta) + ';\n'
  "(function (S) { ['ngnWhy', 'ngnFocus', 'ngnBank', 'ngnCases'].forEach(function (k) { var v; Object.defineProperty(S, k, { configurable: true, enumerable: true, "
  "get: function () { if (v === undefined) { var el = document.getElementById('sd-' + k); try { v = el ? JSON.parse(el.textContent) : undefined; (S.dataParsed = S.dataParsed || []).push(k); } catch (e) { v = undefined; } if (v === undefined) v = k === 'ngnWhy' ? {} : []; } return v; }, "
  "set: function (x) { v = x; } }); }); })(window.Shift);\n")
js=minjs(pre+lazy+''.join((src/f).read_text()+'\n' for f in ['config.js','telemetry.js','engine.js','cloud.js','cjmm.js','ngn.js','ref.js','review.js','flow.js','floor.js','floor-more.js','reward.js','fx.js','case-medsurg1.js','case-medsurg2.js','case-medsurg3.js','case-psych1.js','case-adolpsych1.js','case-peds1.js','case-stepdown1.js','case-icu1.js','case-ob1.js','case-ed1.js','case-ld1.js','drills-content.js','drills-more-1.js','drills-more-2.js','drills-nclex-1.js','drills-nclex-2.js','drill.js','story.js','stories/medsurg1.js','stories/medsurg2.js','stories/medsurg3.js','stories/psych1.js','stories/adolpsych1.js','stories/peds1.js','stories/stepdown1.js','stories/icu1.js','stories/ob1.js','stories/ed1.js','stories/ld1.js','rig.js','art.js','orient.js','ui.js']))
html=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>The Shift — a nursing shift simulator</title>
<meta name="description" content="Work a real nursing shift: med-surg, step-down, ED, mother-baby, psych and peds. Take report, walk the hall, and decide who needs you first. Your patients get better or worse based on what you notice.">
<meta name="theme-color" content="#22406A">
<link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="The Shift"><meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta property="og:title" content="The Shift — a nursing shift simulator">
<meta property="og:description" content="Four patients. One is quietly getting worse. Will you notice in time?">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%2322406A'/%3E%3Ccircle cx='32' cy='32' r='20' fill='none' stroke='%23FAF8F3' stroke-width='5'/%3E%3Cpath d='M32 32V18M32 32l-6.5 11' stroke='%23FAF8F3' stroke-width='5' stroke-linecap='round'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&family=Atkinson+Hyperlegible+Mono:wght@200..800&family=Barlow+Condensed:wght@500;600;700&family=Kalam:wght@400;700&display=swap" rel="stylesheet">
<style>{css}</style></head>
<body><div id="app"></div>
{datablocks}<script>{js}</script>
<script>if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {{}}));</script></body></html>'''
root=pathlib.Path(__file__).parent; dist=root/'dist'
# The game: /play/ on the site, plus a standalone single file.
(dist/'play').mkdir(parents=True, exist_ok=True)
(dist/'the-shift.html').write_text(html); (dist/'play'/'index.html').write_text(html)
# The beta landing page at / and its screenshots at /assets/.
import shutil
# The landing page shares the game's config and telemetry, so a visit, a signup and the shifts played line up.
tel='<script>'+minjs((src/'config.js').read_text()+'\n'+(src/'telemetry.js').read_text())+'</script>'
(dist/'index.html').write_text((root/'site'/'index.html').read_text().replace('<!--TELEMETRY-->', tel))
# Installable app: manifest, icons, and a service worker whose cache name follows the app version.
import re
ver=re.search(r"version: '([^']+)'", (src/'config.js').read_text()).group(1)
(dist/'sw.js').write_text((root/'site'/'sw.js').read_text().replace('__VERSION__', ver))
(dist/'manifest.webmanifest').write_text((root/'site'/'manifest.webmanifest').read_text())
shutil.copytree(root/'site'/'icons', dist/'icons', dirs_exist_ok=True)
# Clinical review pages: /review/ lists the shifts, /review/<shift>/ is the reviewer's checklist.
LOGIC=['config.js','telemetry.js','engine.js','cjmm.js','review.js','flow.js','floor.js','floor-more.js','reward.js','case-medsurg1.js','case-medsurg2.js','case-medsurg3.js','case-psych1.js','case-adolpsych1.js','case-peds1.js','case-stepdown1.js','case-icu1.js','case-ob1.js','case-ed1.js','case-ld1.js']
logic='<script>'+minjs(pre+''.join((src/f).read_text()+'\n' for f in LOGIC))+'</script>'
common=DEC.find([src/'flow.js'])   # call lights, transfers, PRN follow-up, report: scored on every shift
decs={cid: DEC.find(fs)+common for cid, fs in CF.items()}
rv=(root/'site'/'review.html').read_text().replace('<!--SCRIPTS-->', logic+'<script>window.REVIEW_DECISIONS='+json.dumps(decs).replace('</','<\\/')+';</script>')
(dist/'review').mkdir(exist_ok=True); (dist/'review'/'index.html').write_text(rv)
for cid in CF:
    (dist/'review'/cid).mkdir(exist_ok=True)
    (dist/'review'/cid/'index.html').write_text(rv.replace('<!--SCRIPTS-->','').replace('<script>window.REVIEW_DECISIONS=', '<script>window.REVIEW_CASE='+json.dumps(cid)+';window.REVIEW_DECISIONS=', 1))
# Instructor dashboard: the shifts' logic (titles, skills, NCLEX steps), accounts, and the practice questions.
TEACH=['config.js','telemetry.js','engine.js','cloud.js','cjmm.js','ngn.js','ngn-focus.js','ngn-bank.js','ngn-cases.js','drills-content.js','drills-more-1.js','drills-more-2.js','drills-nclex-1.js','drills-nclex-2.js']+[f for f in LOGIC if f.startswith('case-')]
(dist/'teach').mkdir(exist_ok=True); (dist/'teach'/'index.html').write_text((root/'site'/'teach.html').read_text().replace('<!--SCRIPTS-->', '<script>'+minjs(''.join((src/f).read_text()+'\n' for f in TEACH))+'</script>'))
(dist/'privacy').mkdir(exist_ok=True); (dist/'privacy'/'index.html').write_text((root/'site'/'privacy.html').read_text())
import html as _h
_sum = '<ul>' + ''.join(f'<li><b>{_h.escape(h)}</b> {_h.escape(x)}</li>' for h, x in TERMS['summary']) + '</ul>'
_sec = ''.join(f'  <h2>{_h.escape(s["h"])}</h2>\n' + ''.join(f'  <p>{_h.escape(x)}</p>\n' for x in s['p']) for s in TERMS['sections'])
(dist/'terms').mkdir(exist_ok=True); (dist/'terms'/'index.html').write_text((root/'site'/'terms.html').read_text().replace('<!--UPDATED-->', TERMS['updated']).replace('<!--SUMMARY-->', _sum).replace('<!--SECTIONS-->', _sec).replace('<!--CONTACT-->', TERMS['contact']))
shutil.copytree(root/'site'/'assets', dist/'assets', dirs_exist_ok=True)
print(len(html))
