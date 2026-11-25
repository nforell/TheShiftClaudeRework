"""Days in Labor and Delivery (2 South): plays the shift twice. A careful nurse reads every strip, stops the oxytocin,
rescues the epidural hypotension, catches the rupture and the infection, and attends a safe birth; a nurse who only
skips ahead should see the emergencies play out. Usage: python tests/ld.py"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
VERBOSE = '-v' in sys.argv
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)

with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    def start():
        pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],terms:'9999',settings:{theme:'light',sound:'off',music:'off',motion:'reduced',feedback:'debrief'},seen:{'coach:station':1,'coach:room':1,tour:1,orient:1}}))"); pg.reload(); pg.wait_for_timeout(300)
        return pg
    for run in ('careful', 'skipper'):
        pg = start()
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        st = lambda e: pg.evaluate("(()=>{const s=Shift.ui._state();return " + e + "})()")
        def close():
            for _ in range(6):
                ov = pg.evaluate("Shift.ui._ui.ov")
                if ov == 'crit': H('crit-x')
                elif ov == 'result': H('res-close')
                elif ov == 'dialog':
                    n = pg.evaluate("(()=>{const d=Shift.ui._ui.dlg;return d?1:0})()"); H('close')
                elif ov: H('close')
                else: break
        def go(pid): close(); H('goto', pid=pid); close()
        def act(pid, iid):
            go(pid); t0 = st('s.t'); H('int', id=iid); close()
            if VERBOSE: print('    act', pid, iid, t0, '->', st('s.t'))
        nch = lambda: pg.evaluate("(()=>{const d=Shift.ui._ui.dlg;const c=Shift.engine.getCase('ld-2s-1');const x=d&&c.dialogs[d.id];return Shift.ui._ui.ov==='dialog'&&x&&x.choices?x.choices.length:0})()")
        def dlg(*choices):
            for c in choices:
                if nch() <= c: break
                H('dlg', i=str(c))
            close()
        def talk(pid, *ch): go(pid); H('talk'); dlg(*ch)
        def fam(pid, *ch): go(pid); H('family'); dlg(*ch)
        def sbar(pid, picks, req):
            close(); H('sbar', pid=pid)
            for k in picks: H('sbar-pick', id=k)
            H('sbar-req', id=req); H('sbar-send'); r = pg.evaluate("Shift.ui._ui.sbar && Shift.ui._ui.sbar.reply"); close(); return r or ''
        def give(pid, mid, dose=None):
            go(pid); H('med', id=mid)
            if dose is not None: H('dose', v=str(dose))
            H('med-give'); close()
        def xfer(pid):
            close(); H('away', pid=pid); H('away-ho')
            for k in ('what', 'allergy', 'code', 'legal', 'meds', 'x0', 'x1', 'x2', 'x3'): H('away-pick', id=k)
            H('away-ho-send'); H('away-note'); close()
        def hold(pid, mid):
            go(pid); H('med', id=mid); H('med-holdask'); H('hreason', v='1'); H('med-hold'); close()
        def reply(act_):
            r = pg.evaluate("(a)=>{const s=Shift.ui._state();for(const m of s.inbox){if(!m.replies||m.done)continue;const i=m.replies.findIndex(x=>x.act===a);if(i>=0)return [m.id,i]}return null}", act_)
            if r: H('reply', m=str(r[0]), i=str(r[1])); close()
            return bool(r)
        def until(t, keep=None):
            for _ in range(80):
                if st('s.ended') or st('s.t') >= t: break
                if keep: keep()
                close(); H('back'); close(); H('skip'); pg.wait_for_timeout(20)
            if keep: keep()
            close()
        judg = lambda key: st(f"(s.judg.find(j=>j.key==='{key}')||{{}}).delta")

        H('pick-case', id='ld-2s-1'); H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done')
        if run == 'careful':
            pg.evaluate("Shift.ui._ui.rank=['221','222','224','223']"); H('rank-submit'); H('rank-go')
            check(judg('rank-first') == 2, 'ranking Ms. Fuentes first scores best')
            act('221', 'efm'); reply('l-cat-1t'); give('221', '221-oxy', 3)
            until(24); act('222', 'lateral'); act('222', 'anes'); give('222', '222-phenyl'); act('222', 'bolus'); act('222', 'efm'); reply('b-cat-2')
            act('221', 'lateral'); act('221', 'bolus'); talk('221', 0); fam('222', 0)
            sbar('221', ['ctx', 'strip', 'done'], 'tachy')
            talk('224', 0); give('224', '224-pcn'); act('224', 'gbs'); act('224', 'efm')
            until(31); reply('l-up-no'); act('221', 'reassess'); act('222', 'cath'); sbar('222', ['bp', 'fhr', 'done'], 'hypo')
            until(58); talk('223', 0); act('223', 'ivts'); act('223', 'opnote'); act('223', 'team'); act('223', 'efm'); fam('223', 0)
            until(62); act('221', 'efm'); give('221', '221-oxy', 4); fam('221', 0); act('224', 'saline'); fam('224', 0)
            until(90); talk('223', 0); act('223', 'epidural')
            until(106); act('224', 'efm'); reply('g-cat-2'); act('224', 'tender')
            sbar('224', ['temp', 'hr', 'fhr', 'tender'], 'chorio'); give('224', '224-amp'); give('224', '224-gent')
            until(116); act('223', 'efm'); reply('tl-cat-2')
            until(141); act('223', 'stat'); act('223', 'ivs'); fam('223', 0)
            give('224', '224-apap'); act('224', 'peds'); talk('224', 0); fam('224', 0)
            until(st("(s.p['223'].orAt||999)")); xfer('223')
            until(165); act('224', 'reassess')
            until(185); act('222', 'sve'); act('222', 'setup'); sbar('222', ['cx', 'fast'], 'complete')
            until(201); act('222', 'help'); talk('222', 0); act('222', 'head'); act('222', 'nuchal'); act('222', 'shoulders'); act('222', 'dry')
            reply('apgar1-9'); act('222', 'cordwait'); reply('apgar5-9')
            until(st("(s.p['222'].bornAt||0)+4")); act('222', 'placenta'); give('222', '222-oxypp'); act('222', 'fundus')
        else:
            H('rank-submit'); H('rank-go')
        until(300)
        if not st('s.ended'): H('endask'); H('end-yes')
        close()
        out = pg.evaluate("(()=>{const s=Shift.ui._state();const d=Shift.engine.debrief(s);return {score:d.overall,o:Object.fromEntries(d.outcomes.map(o=>[o.id,[o.tone,o.title,o.text]])),steps:Shift.cjmm.score(d.judg).map(x=>[x.id,x.score])}})()")
        print(run, out['score'], {k: v[:2] for k, v in out['o'].items()})
        if VERBOSE or run == 'careful':
            for k, v in out['o'].items(): print('  ', k, v[2][:300])
            print('  misses:', pg.evaluate("Shift.ui._state().judg.filter(j=>j.delta<=0).map(j=>j.key+' '+j.delta+' '+j.text)"))
            if VERBOSE: print('  all:', pg.evaluate("Shift.ui._state().judg.filter(j=>j.pid==='222'||j.pid==='223').map(j=>j.t+' '+j.key+' '+j.delta)"))
        if run == 'careful':
            for pid in ['221', '222', '223', '224']:
                check(out['o'][pid][0] == 'good', f'careful: {pid} has a good outcome ({out["o"][pid][1]})')
            check(out['score'] >= 80, f'careful: overall score is high ({out["score"]})')
            ev = dict(out['steps']).get('eval')
            check(ev is not None and ev >= 70, f'careful: Evaluate outcomes is scored ({ev})')
        else:
            for pid in ('221', '223', '224'):
                check(out['o'][pid][0] == 'bad', f'skipper: {pid} goes badly ({out["o"][pid][1]})')
            check(out['o']['222'][0] != 'good', f'skipper: 222 is not a good birth without the nurse ({out["o"]["222"][1]})')
            check(out['score'] <= 45, f'skipper: overall score is low ({out["score"]})')
        pg.close()
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('LD ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
