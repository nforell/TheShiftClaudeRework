"""Build, then sweep all five shifts at phone and desktop widths, then a soak run, then the telemetry and app tests. Prints one line per run.
Fails (exit 1) on any JS error, sideways overflow, overlapping text, covered button or undersized control (tests/audit.js: 24px minimum, 44px tall on phones).
Usage: python tests/run_all.py   (needs: pip install playwright; playwright install chromium)"""
import subprocess, sys, json, pathlib, concurrent.futures as cf
ROOT = pathlib.Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(ROOT / 'build.py')], check=True, stdout=subprocess.DEVNULL)
CASES = ['medsurg-4w-1', 'medsurg-4w-2', 'medsurg-4w-3', 'stepdown-6e-1', 'icu-3w-1', 'ed-podb-1', 'ld-2s-1', 'ob-2n-1', 'psych-3e-1', 'psych-4n-1', 'peds-5s-1']
jobs = [(c, w, 'light') for c in CASES for w in (390, 1280)] + [('psych-3e-1', 390, 'dark'), ('psych-4n-1', 1280, 'dark'), ('peds-5s-1', 1280, 'dark'), ('stepdown-6e-1', 390, 'dark'), ('ed-podb-1', 390, 'dark'), ('icu-3w-1', 1280, 'dark'), ('ld-2s-1', 390, 'dark'), ('ob-2n-1', 1280, 'dark'), ('medsurg-4w-2', 768, 'light')]
def run(j):
    r = subprocess.run([sys.executable, str(ROOT / 'tests' / 'sweep.py'), j[0], str(j[1]), j[2]], capture_output=True, text=True)
    return j, r.stdout.strip() or r.stderr.strip()[-400:]
bad = 0
with cf.ThreadPoolExecutor(3) as ex:
    for j, out in ex.map(run, jobs):
        print(out)
        f = ROOT / 'tests' / 'out' / f'{j[0]}-{j[1]}-{j[2]}.json'
        if not f.exists(): bad += 1; print(f"::error title={j[0]} {j[1]}px {j[2]}::sweep crashed: {out[-280:]}"); continue
        d = json.loads(f.read_text())
        probs = [f"JS error: {e}" for e in d['errs']] + [f"{r['state']}: {k} {x if k != 'overflow' else r['overflow']}" for r in d['res'] for k in ('overflow', 'overlap', 'covered', 'small') for x in (r[k] if isinstance(r[k], list) else ([r[k]] if r[k] else []))]
        if probs:
            bad += 1
            for pr in probs[:4]: print(f"::error title={j[0]} {j[1]}px {j[2]}::{pr[:300]}")   # shows on the GitHub check
r = subprocess.run([sys.executable, str(ROOT / 'tests' / 'soak.py')], capture_output=True, text=True)
print((r.stdout.strip().splitlines() or ['soak: no output'])[-1])
if r.returncode:
    bad += 1
    print('::error title=soak.py::' + (r.stderr.strip().splitlines() or r.stdout.strip().splitlines() or ['failed'])[-1][:300])
# Analytics, feedback and signup end to end; then the installable app and offline play.
for extra in ('telemetry.py', 'robust.py', 'safari.py', 'sbar_done.py', 'pwa.py', 'cloud.py', 'email_link.py', 'review.py', 'guide.py', 'law.py', 'teen.py', 'stepdown.py', 'ob.py', 'ed.py', 'ngn.py', 'teach.py', 'pack.py', 'clarity.py', 'restraint.py', 'pacing.py', 'terms.py', 'orient.py', 'errors.py', 'practice.py', 'icu.py', 'ld.py', 'playtest.py'):
    r = subprocess.run([sys.executable, str(ROOT / 'tests' / extra)], capture_output=True, text=True)
    print((r.stdout.strip().splitlines() or [r.stderr.strip()[-300:]])[-1])
    if r.returncode:
        bad += 1
        for ln in r.stdout.splitlines():
            if ln.startswith('FAIL'): print(f"::error title={extra}::{ln[5:300]}")
# Dead ends: every task on a patient's list must lead to an action (quick mode, shifts in parallel).
def fu(c):
    r = subprocess.run([sys.executable, str(ROOT / 'tests' / 'followup.py'), '--quick', c], capture_output=True, text=True)
    return c, r
with cf.ThreadPoolExecutor(3) as ex:
    for c, r in ex.map(fu, CASES):
        lines = r.stdout.strip().splitlines() or [r.stderr.strip()[-300:]]
        print(c, lines[-1])
        if r.returncode:
            bad += 1
            for ln in lines:
                if ln.startswith('FAIL'): print(f"::error title=followup {c}::{ln[5:300]}")
print('FAILED' if bad else 'ALL CLEAN', bad)
sys.exit(1 if bad else 0)
