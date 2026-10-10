"""Days in the ICU (3 West): plays the shift twice. A careful nurse should get every patient to a good outcome (for
714, a good death: the right referral, the meeting, comfort care and the hard questions answered well); a nurse who
only skips ahead should see the hidden emergencies play out. Usage: python tests/icu.py"""
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
        def act(pid, iid): go(pid); H('int', id=iid); close()
        nch = lambda: pg.evaluate("(()=>{const d=Shift.ui._ui.dlg;const c=Shift.engine.getCase('icu-3w-1');const x=d&&c.dialogs[d.id];return Shift.ui._ui.ov==='dialog'&&x&&x.choices?x.choices.length:0})()")
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
        mapv = lambda: st("(()=>{const v=Shift.engine.api(s).vitals('711');return Math.round((v.SBP+2*v.DBP)/3)})()")
        def tend():   # keep Mr. Kowalski's MAP at goal, step by step, as the order says
            if st("s.p['711'].away") or st("s.p['711'].site") == 'off': return
            m = st("Shift.engine.getCase('icu-3w-1')&&(()=>{const P=s.p['711'];return Math.round(55+(P.site==='peri'?P.ne*(1-Math.min(.7,P.ext*.6)):P.ne)+(P.vaso?6:0)-(P.sev-1)*12-P.bpDrop)})()")
            if m is not None and m < 65: give('711', '711-ne', 1)
            elif m is not None and m > 75: give('711', '711-ne', 2)
        judg = lambda key: st(f"(s.judg.find(j=>j.key==='{key}')||{{}}).delta")

        H('pick-case', id='icu-3w-1'); H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done')
        if run == 'careful':
            pg.evaluate("Shift.ui._ui.rank=['711','712','713','714']"); H('rank-submit'); H('rank-go')
            check(judg('rank-first') == 2, 'ranking Mr. Kowalski first scores best')
            reply('abg-ok')
            act('711', 'site'); act('711', 'cxr'); act('711', 'central'); hold('711', '711-meto'); hold('711', '711-lisin')
            talk('711', 0); fam('711', 0)
            act('712', 'hob'); act('712', 'screen')
            act('713', 'ct'); give('713', '713-kcl'); give('713', '713-mag'); act('713', 'bg'); act('713', 'wires')
            act('714', 'ad'); act('714', 'opo'); talk('714', 0)
            until(26, tend); reply('sat-only'); act('712', 'sat'); fam('712', 0)
            until(40, tend); act('712', 'cam'); give('712', '712-fent', 1); act('712', 'reorient')
            until(46, tend); act('711', 'lactate'); give('712', '712-prop', 1); act('712', 'oral')
            until(60, tend); give('712', '712-hep'); give('714', '714-hep'); act('713', 'is')
            until(85, tend); act('711', 'lacread'); act('713', 'ct')
            until(96, tend); act('713', 'ct')
            r = sbar('713', ['ct', 'hr', 'bp', 'cvp', 'sounds', 'jvd'], 'tamp'); print('  713 reply:', r[:120])
            act('713', 'prep'); hold('713', '713-meto'); hold('713', '713-lasix')
            until(101, tend); reply('cons-surr')
            until(121, tend); give('712', '712-osel'); give('712', '712-panto'); give('713', '713-asa')
            until(126, tend); act('713', 'reassess')
            until(136, tend); act('712', 'bag'); act('712', 'tubepos'); act('712', 'suction'); act('712', 'postplug')
            until(151, tend); give('711', '711-pip'); reply('pastor-yes')
            until(166, tend); reply('kofi-surr'); act('714', 'meetprep')
            until(206, tend); act('714', 'meeting'); dlg(0, 0, 0, 0)
            reply('kofi-surr'); act('714', 'stopcare'); give('714', '714-morph'); act('714', 'extprep'); act('714', 'extubate'); dlg(0, 0)
            until(245, tend); reply('son-de'); act('711', 'postir'); act('711', 'eval')
            until(258, tend); give('714', '714-glyco'); give('714', '714-morph'); act('714', 'presence'); dlg(0, 0)
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
        if run == 'careful':
            for pid in ['711', '712', '713', '714']:
                check(out['o'][pid][0] == 'good', f'careful: {pid} has a good outcome ({out["o"][pid][1]})')
            check(out['score'] >= 80, f'careful: overall score is high ({out["score"]})')
            ev = dict(out['steps']).get('eval')
            check(ev is not None and ev >= 70, f'careful: Evaluate outcomes is scored ({ev})')
        else:
            for pid in ('711', '712', '713'):
                check(out['o'][pid][0] == 'bad', f'skipper: {pid} goes badly ({out["o"][pid][1]})')
            check(out['o']['714'][0] != 'good', f'skipper: 714 is not a good death without the nurse ({out["o"]["714"][1]})')
            check(out['score'] <= 45, f'skipper: overall score is low ({out["score"]})')
        pg.close()
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('ICU ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
