"""Build, then sweep all five shifts at phone and desktop widths, then a soak run. Prints one line per run.
Fails (exit 1) on any JS error, sideways overflow, overlapping text or covered button.
Usage: python tests/run_all.py   (needs: pip install playwright; playwright install chromium)"""
import subprocess, sys, json, pathlib, concurrent.futures as cf
ROOT = pathlib.Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(ROOT / 'build.py')], check=True, stdout=subprocess.DEVNULL)
CASES = ['medsurg-4w-1', 'medsurg-4w-2', 'medsurg-4w-3', 'psych-3e-1', 'peds-5s-1']
jobs = [(c, w, 'light') for c in CASES for w in (390, 1280)] + [('psych-3e-1', 390, 'dark'), ('peds-5s-1', 1280, 'dark'), ('medsurg-4w-2', 768, 'light')]
def run(j):
    r = subprocess.run([sys.executable, str(ROOT / 'tests' / 'sweep.py'), j[0], str(j[1]), j[2]], capture_output=True, text=True)
    return j, r.stdout.strip() or r.stderr.strip()[-400:]
bad = 0
with cf.ThreadPoolExecutor(3) as ex:
    for j, out in ex.map(run, jobs):
        print(out)
        f = ROOT / 'tests' / 'out' / f'{j[0]}-{j[1]}-{j[2]}.json'
        if not f.exists(): bad += 1; continue
        d = json.loads(f.read_text())
        if d['errs'] or any(r['overflow'] or r['overlap'] or r['covered'] for r in d['res']): bad += 1
print(subprocess.run([sys.executable, str(ROOT / 'tests' / 'soak.py')], capture_output=True, text=True).stdout.strip().splitlines()[-1])
print('FAILED' if bad else 'ALL CLEAN', bad)
sys.exit(1 if bad else 0)
