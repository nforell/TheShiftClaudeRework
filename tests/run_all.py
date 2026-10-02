"""Build, then sweep all five shifts at phone and desktop widths, then a soak run, then the telemetry and app tests. Prints one line per run.
Fails (exit 1) on any JS error, sideways overflow, overlapping text or covered button.
Usage: python tests/run_all.py   (needs: pip install playwright; playwright install chromium)"""
import subprocess, sys, json, pathlib, concurrent.futures as cf
ROOT = pathlib.Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(ROOT / 'build.py')], check=True, stdout=subprocess.DEVNULL)
CASES = ['medsurg-4w-1', 'medsurg-4w-2', 'medsurg-4w-3', 'stepdown-6e-1', 'psych-3e-1', 'psych-4n-1', 'peds-5s-1']
jobs = [(c, w, 'light') for c in CASES for w in (390, 1280)] + [('psych-3e-1', 390, 'dark'), ('psych-4n-1', 1280, 'dark'), ('peds-5s-1', 1280, 'dark'), ('stepdown-6e-1', 390, 'dark'), ('medsurg-4w-2', 768, 'light')]
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
        probs = [f"JS error: {e}" for e in d['errs']] + [f"{r['state']}: {k} {x if k != 'overflow' else r['overflow']}" for r in d['res'] for k in ('overflow', 'overlap', 'covered') for x in (r[k] if isinstance(r[k], list) else ([r[k]] if r[k] else []))]
        if probs:
            bad += 1
            for pr in probs[:4]: print(f"::error title={j[0]} {j[1]}px {j[2]}::{pr[:300]}")   # shows on the GitHub check
print(subprocess.run([sys.executable, str(ROOT / 'tests' / 'soak.py')], capture_output=True, text=True).stdout.strip().splitlines()[-1])
# Analytics, feedback and signup end to end; then the installable app and offline play.
for extra in ('telemetry.py', 'pwa.py', 'cloud.py', 'review.py', 'guide.py', 'law.py', 'teen.py', 'stepdown.py', 'ngn.py', 'teach.py', 'pack.py', 'clarity.py', 'restraint.py'):
    r = subprocess.run([sys.executable, str(ROOT / 'tests' / extra)], capture_output=True, text=True)
    print((r.stdout.strip().splitlines() or [r.stderr.strip()[-300:]])[-1])
    if r.returncode:
        bad += 1
        for ln in r.stdout.splitlines():
            if ln.startswith('FAIL'): print(f"::error title={extra}::{ln[5:300]}")
print('FAILED' if bad else 'ALL CLEAN', bad)
sys.exit(1 if bad else 0)
