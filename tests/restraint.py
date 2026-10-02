"""Seclusion, restraint and emergency medication on the psych units: the order, the one-hour face-to-face,
continuous observation, 15-minute checks, post-IM checks, a debrief, and notes that are checked claim by claim
against what happened. Plays Jasmine (3 East) by the book with an IM, by the book with seclusion, and with the
shortcuts that get nurses cited; then Marcus's uncharted hold on 4 North. Usage: python tests/restraint.py"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
OUT = ROOT / 'tests' / 'out'; OUT.mkdir(exist_ok=True)
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)

with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    for run in ('book-im', 'book-secl', 'shortcuts', 'teen-book', 'teen-miss'):
        pg = b.new_page(viewport={'width': 1280, 'height': 900}); pg.on('pageerror', lambda e: errs.append(run + ': ' + str(e)[:300])); fontroute(pg)
        pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced',feedback:'now'},seen:{'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        st = lambda e: pg.evaluate("(()=>{const s=Shift.ui._state();return " + e + "})()")
        def close():
            for _ in range(5):
                ov = pg.evaluate("Shift.ui._ui.ov")
                if ov == 'crit': H('crit-x')
                elif ov == 'result': H('res-close')
                elif ov: H('close')
                else: break
        def go(pid): close(); H('goto', pid=pid); close()
        def act(pid, iid): go(pid); H('int', id=iid); close()
        def assess(pid, sys_): go(pid); H('assess', sys=sys_); close()
        def sbar(pid, picks, req):
            close(); H('sbar', pid=pid)
            for k in picks: H('sbar-pick', id=k)
            H('sbar-req', id=req); H('sbar-send'); r = pg.evaluate("Shift.ui._ui.sbar && Shift.ui._ui.sbar.reply"); close(); return r or ''
        def give(pid, mid): go(pid); H('med', id=mid); H('med-give'); close()
        def wait(n): close(); pg.evaluate(f"(()=>{{const s=Shift.ui._state();Shift.engine.advance(s,{n});}})()"); H('back'); close()
        def note(pid, iid, answers, shot=None):
            go(pid); H('int', id=iid)
            for sec, opts in answers.items():
                for o in opts: H('doc-pick', s=sec, o=o)
            if shot: pg.screenshot(path=str(OUT / (shot + '-form.png')), full_page=False)
            H('doc-sign')
            if shot: pg.screenshot(path=str(OUT / (shot + '-signed.png')))
            close()
        J = lambda pre: st(f"s.judg.filter(j=>(j.key||'').startsWith('{pre}')).map(j=>[j.key,j.delta])")
        case = 'psych-4n-1' if run.startswith('teen') else 'psych-3e-1'
        H('pick-case', id=case); H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done'); H('rank-submit'); H('rank-go'); close()

        if run == 'book-im':
            act('303', 'quiet'); st("s.p['303'].esc=2.8,s.p['303'].quietUntil=-1"); wait(1)
            assess('303', 'general'); go('303'); H('med', id='303-odt'); H('med-declined'); close()
            check(st("s.p['303'].poOffered"), f'{run}: the oral PRN was offered and refused')
            sbar('303', ['esc', 'tried'], 'im'); give('303', '303-im')
            e = st("s.p['303'].ep")
            check(e and e['kinds'] == ['hold'] and e['ordered'] is not None and e['f2fCalled'] is not None, f'{run}: the hold for the IM starts a restraint episode, covered by the phone order')
            due = st("Shift.ui._ui && 0") ; wait(20); act('303', 'postim')
            check(st("s.judg.find(j=>j.key==='303-postim').delta") == 1, f'{run}: post-IM check on time')
            wait(10)
            check(st("s.p['303'].ep.f2fAt") is not None and any(n['author'] == 'Dr. Iyer' for n in st("s.p['303'].notes")), f'{run}: Dr. Iyer comes for the face-to-face and charts it')
            note('303', 'snote', {'type': ['hold'], 'beh': ['tray'], 'tried': ['quiet', 'prn'], 'mon': ['order', 'f2f'], 'rel': ['inj']}, 'restraint-note')
            note('303', 'imnote', {'beh': ['tray'], 'po': ['offered'], 'hold': ['held'], 'after': ['md', 'resp'], 'rights': ['emerg']})
            wait(50); act('303', 'debrief')
            js = J('303-note') + J('303-imnote') + J('303-f2f') + J('303-debrief') + J('303-postim')
            check(js and all(d > 0 for k, d in js), f'{run}: every documentation decision scores well {js}')
            check(len([n for n in st("s.p['303'].notes") if n['author'] == 'You (RN)']) >= 3, f'{run}: the signed notes and the debrief are in her chart')
        elif run == 'book-secl':
            act('303', 'quiet'); act('303', 'walk'); st("s.p['303'].esc=2.8,s.p['303'].quietUntil=-1"); wait(1); assess('303', 'general')
            go('303'); H('int', id='seclude'); H('int', id='obs'); close()
            check(st("s.p['303'].ep.kinds") == ['secl'] and st("s.judg.find(j=>j.key==='303-obs').delta") == 1, f'{run}: seclusion starts an episode and observation is set up at once')
            sbar('303', ['esc', 'tried'], 'f2f')
            for _ in range(4): act('303', 'scheck'); wait(11)
            check(st("s.p['303'].ep.f2fAt") is not None and st("s.p['303'].ep.f2fAt - s.p['303'].ep.at") <= 60, f'{run}: face-to-face within the hour')
            st("s.p['303'].esc=1.2"); act('303', 'scheck'); act('303', 'release')
            check(st("s.judg.find(j=>j.key==='303-checks').delta") == 1, f'{run}: no gap over 15 minutes in seclusion checks')
            note('303', 'snote', {'type': ['secl'], 'beh': ['tray'], 'tried': ['quiet', 'walk'], 'mon': ['order', 'f2f', 'obs', 'q15'], 'rel': ['calm']}, 'seclusion-note')
            js = J('303-note') + J('303-f2f') + J('303-checks') + J('303-obs') + J('303-sbar-f2f')
            check(js and all(d > 0 for k, d in js), f'{run}: every documentation decision scores well {js}')
        elif run == 'shortcuts':
            st("s.p['303'].esc=2.8"); wait(1); act('303', 'seclude'); wait(70)
            check(st("s.judg.find(j=>j.key==='303-obs-miss').delta") == -2, f'{run}: nobody watching the seclusion room is caught')
            check(st("s.judg.find(j=>j.key==='303-f2f-miss').delta") == -2, f'{run}: no face-to-face in an hour is caught')
            note('303', 'snote', {'type': ['secl', 'mech'], 'beh': ['agit', 'refuse'], 'tried': ['quiet', 'prn'], 'mon': ['order', 'f2f', 'obs', 'q15'], 'rel': ['meds']})
            js = dict(J('303-note'))
            check(js.get('303-note-beh') == -2 and js.get('303-note-label') == -1 and js.get('303-note-release') == -2 and js.get('303-note-true') == -2, f'{run}: vague behavior, coercive release and false claims are each caught {js}')
            fake = st("s.judg.find(j=>j.key==='303-note-true').text")
            check('mechanical restraints' in fake and 'the quiet room' in fake and 'checks every 15 minutes' in fake, f'{run}: the false claims are named')
            H('endask'); H('end-yes'); pg.wait_for_timeout(200)
            check(st("(s.judg.find(j=>j.key==='303-checks')||{}).delta") == -2, f'{run}: the missing seclusion checks are scored at the end')
        elif run == 'teen-book':
            check(st("Shift.engine.getCase('psych-4n-1').patients.find(d=>d.id==='405').report.some(r=>/hold him/.test(r.text))"), f'{run}: report mentions the hold')
            act('405', 'docrev'); check('isn\'t charted as a restraint' in st("s.log.filter(l=>l.pid==='405').map(l=>l.text).join(' ')"), f'{run}: the record review finds the gaps')
            r = sbar('405', ['halo'], 'f2f'); act('405', 'ben'); act('405', 'mom')
            wait(12)
            check(st("s.p['405'].f2fAt") is not None and st("s.p['405'].f2fAt") <= 30, f'{run}: Dr. Adeyemi does the face-to-face by 15:30')
            check(any(n['author'] == 'Ben, day RN' for n in st("s.p['405'].notes")), f'{run}: Ben charts the hold he was part of')
            js = J('405-docrev') + J('405-sbar-f2f') + J('405-f2f') + J('405-ben') + J('405-mom')
            check(len(js) == 5 and all(d > 0 for k, d in js), f'{run}: every step scores well {js}')
        elif run == 'teen-miss':
            H('endask'); H('end-yes'); pg.wait_for_timeout(200)
            check(st("(s.judg.find(j=>j.key==='405-docrev-miss')||{}).delta") == -1, f'{run}: an uncaught, uncharted hold costs at the end')
        close()
        pg.close()
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('RESTRAINT ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
