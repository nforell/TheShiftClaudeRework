"""Educator view end to end: an instructor signs in at /teach/ and makes a class; students join from the game with
the code; finished shifts and practice questions reach the dashboard (including ones played before signing in);
someone outside the class stays invisible; leaving and removing work; CSV export. Usage: python tests/teach.py"""
import sys, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from standin import Supa, device, signin, SITE
from playwright.sync_api import sync_playwright
fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
OUT = ROOT / 'tests' / 'out'; OUT.mkdir(exist_ok=True)
db = Supa()
db.user('tt', 'u-teach', 'prof@school.edu'); db.user('s1', 'u-ana', 'ana@school.edu'); db.user('s2', 'u-ben', 'ben@school.edu'); db.user('s3', 'u-out', 'other@else.com')

def H(pg, a, **kw): return pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
def play(pg, case, ngn=False):
    H(pg, 'pick-case', id=case); H(pg, 'new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H(pg, 'intro-go')
    H(pg, 'h-done'); H(pg, 'rank-submit'); H(pg, 'rank-go'); H(pg, 'endask'); H(pg, 'end-yes'); pg.wait_for_timeout(200)
    if ngn:   # the first practice question, answered with everything selected / first option
        H(pg, 'ngn-open', i='0'); it = pg.evaluate("Shift.ngn.items(Shift.ui._state().caseId)[0]")
        if it['type'] == 'bowtie':
            for k, v in (('c', 0), ('a', 0), ('a', 1), ('p', 0), ('p', 1)): H(pg, 'ngn-pick', k=k, v=str(v))
        elif it['type'] == 'matrix':
            for ri in range(len(it['rows'])): H(pg, 'ngn-pick', k='r', row=str(ri), v='0')
        elif it['type'] == 'cloze':
            for ri in range(len([x for x in it['parts'] if not isinstance(x, str)])): H(pg, 'ngn-pick', k='d', row=str(ri), v='0')
        else: H(pg, 'ngn-pick', k='s', v='0')
        H(pg, 'ngn-check'); pg.wait_for_timeout(300)
    H(pg, 'home'); pg.wait_for_timeout(300)

def drill_round(pg, kind, best, same=None):
    # Answer a whole round right (best) or wrong, card by card.
    PICK = """(best) => { const r = Shift.ui._ui.dr, c = r.deck[r.i], D = Shift.drillData, k = D[c.kind].find((x) => x.id === c.id), st = r.c;
      if (c.kind === 'med') { const L = st.stage === 'check' ? k.check : k.pick; return [st.stage === 'check' ? 'dr-check' : 'dr-pick', L.findIndex((o) => !!o.ok === best)]; }
      if (c.kind === 'first') return ['dr-pick', k.pts.findIndex((o) => !!o.ok === best)];
      if (c.kind === 'sbar') { if (st.miss !== null) return ['dr-fix', 0]; const o = k.steps[st.step].o; return ['dr-say', o.findIndex((x) => !!x.ok === best)]; }
      const ds = k.turns[st.turn].o.map((x) => x.d); return ['dr-calm', ds.indexOf(best ? Math.min(...ds) : Math.max(...ds))]; }"""
    H(pg, 'dr-start', k=kind)
    if same: pg.evaluate("(ids) => { const r = Shift.ui._ui.dr; r.deck = ids.map((id) => ({ kind: r.kind, id })); }", same)   # same cards as another student
    for _ in range(80):
        if pg.evaluate("Shift.ui._ui.dr.done"): break
        if pg.evaluate("Shift.ui._ui.dr.c && Shift.ui._ui.dr.res.length > Shift.ui._ui.dr.i"): H(pg, 'dr-next'); continue
        a, i = pg.evaluate(f"({PICK})({'true' if best else 'false'})"); H(pg, a, i=str(i))
    ids = pg.evaluate("Shift.ui._ui.dr.deck.map((c) => c.id)"); H(pg, 'dr-quit'); pg.wait_for_timeout(300); return ids

with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    # Instructor: signed out, then the link, then a class.
    T = device(b, db, '/teach/', 'teach', errs, vw=1280)
    check(T.locator('#em').count() == 1, 'dashboard asks an instructor to sign in')
    T.fill('#em', 'prof@school.edu'); T.click('form[data-form=link] button'); T.wait_for_timeout(400)
    check(db.otp and db.otp[-1]['redirect_to'] == SITE + '/teach/', 'sign-in link comes back to the dashboard')
    signin(T, 'tt', '/teach/')
    check('haven\'t made a class' in T.content(), 'signed in with no classes yet')
    T.fill('#cn', 'NURS 310 Tuesday'); T.click('form[data-form=make] button'); T.wait_for_timeout(600)
    code = T.inner_text('#code').strip()
    check(len(db.classes) == 1 and code == db.classes[0]['code'], f'made a class and shows its code ({code})')
    check('No students yet' in T.content(), 'empty class says to share the code')

    # Student 1 plays before signing in, then signs in and joins.
    A = device(b, db, '/play/', 'ana', errs)
    play(A, 'medsurg-4w-1', ngn=True)
    check(A.evaluate("Shift.cloud.pending()") == 2, 'signed-out shift and practice question wait on the device')
    H(A, 'menu'); check(A.locator('[data-act=cls]').count() == 1, 'menu has Your class'); H(A, 'cls')
    check(A.locator('[data-act=account]').count() >= 1 and A.locator('#cls-code').count() == 0, 'joining a class asks to sign in first')
    signin(A, 's1'); A.wait_for_timeout(400)
    check(A.evaluate("Shift.cloud.pending()") == 0 and len(db.results) == 1 and len(db.ngn) == 1, 'signing in uploads what was played before')
    check(all(r['user_id'] == 'u-ana' for r in db.results + db.ngn), 'uploads are filed under the student')
    r0 = db.results[0]
    check(r0['case_id'] == 'medsurg-4w-1' and r0['steps'] and r0['domains'] and isinstance(r0['misses'], list), 'a result carries skill, NCLEX step and missed decisions')
    H(A, 'cls'); A.wait_for_timeout(300)
    A.fill('#cls-code', 'ZZZZZZ'); A.fill('#cls-name', 'Ana Ruiz'); H(A, 'cls-join'); A.wait_for_timeout(400)
    check('No class with that code' in A.content(), 'a wrong code says so')
    A.fill('#cls-code', code.lower()); H(A, 'cls-join'); A.wait_for_timeout(700)
    check(any(m['user_id'] == 'u-ana' and m['display_name'] == 'Ana Ruiz' for m in db.members), 'student joined with their name')
    check('You\'re in NURS 310 Tuesday' in A.content() and A.locator('.cls-list li').count() == 1, 'game confirms and lists the class')
    A.screenshot(path=str(OUT / 'class-join.png'))
    play(A, 'medsurg-4w-2', ngn=True)   # after joining: this one is the instructor's to see
    a_first = drill_round(A, 'first', False)   # Ana misses every Who's First card
    drill_round(A, 'med', True)
    check(sum(1 for r in db.drills if r['user_id'] == 'u-ana') == len(a_first) + 4 and A.evaluate("Shift.cloud.pending()") == 0, 'drill cards upload as they\'re answered')

    # Student 2 joins first, then plays signed in: uploads right away.
    B2 = device(b, db, '/play/', 'ben', errs); signin(B2, 's2'); H(B2, 'cls'); B2.wait_for_timeout(300)
    B2.fill('#cls-code', code); B2.fill('#cls-name', 'Ben Okafor'); H(B2, 'cls-join'); B2.wait_for_timeout(600)
    play(B2, 'medsurg-4w-1'); play(B2, 'stepdown-6e-1')
    drill_round(B2, 'first', False, a_first)   # Ben misses the same cards: these show as the class's most-missed cards
    check(sum(1 for r in db.results if r['user_id'] == 'u-ben') == 2, 'a signed-in student\'s shifts upload as they finish')
    # Someone outside the class.
    O = device(b, db, '/play/', 'out', errs); signin(O, 's3'); play(O, 'psych-3e-1')
    check(any(r['user_id'] == 'u-out' for r in db.results), 'outsider\'s shift is saved to their own account')

    # Instructor sees the class.
    T.click('[data-act=refresh]') if T.locator('[data-act=refresh]').count() else T.reload(); T.wait_for_timeout(900)
    txt = T.inner_text('#app')
    check('2 / 2' in txt.replace('\n', ' ') or '2/ 2' in txt, 'overview counts both students')
    check('Recognize cues' in txt and 'Take action' in txt, 'overview shows NCLEX steps')
    check('Time management' in txt or 'Clinical judgment' in txt, 'overview shows skills')
    T.screenshot(path=str(OUT / 'teach-overview.png'), full_page=True)
    T.click('[data-act=tab][data-v=students]'); T.wait_for_timeout(200)
    names = T.locator('tbody [data-act=student]').all_inner_texts()
    check(names == ['Ana Ruiz', 'Ben Okafor'], f'roster lists the class ({names})')
    T.click('tbody [data-act=student] >> text=Ana Ruiz'); T.wait_for_timeout(200)
    check(T.locator('.card h3').count() == 1 and 'Days on 4 West' not in T.inner_text('.card h3'), 'what a student played before joining stays private')
    T.click('[data-act=back]')
    check('other@' not in T.content() and 'u-out' not in T.content(), 'someone outside the class never shows')
    T.screenshot(path=str(OUT / 'teach-students.png'), full_page=True)
    T.click('tbody [data-act=student] >> text=Ben Okafor'); T.wait_for_timeout(200)
    check(T.locator('.card h3').count() == 2, 'a student\'s page lists each shift')
    T.click('[data-act=back]'); T.click('[data-act=tab][data-v=missed]'); T.wait_for_timeout(200)
    check(T.locator('.miss').count() >= 1, 'most-missed decisions listed')
    T.screenshot(path=str(OUT / 'teach-missed.png'), full_page=True)
    T.click('[data-act=tab][data-v=drills]'); T.wait_for_timeout(200)
    dt = T.inner_text('#app')
    check('Med Pass' in dt and 'Who\'s First' in dt and T.locator('.bars .b').count() >= 4, 'the Drills tab shows each drill')
    check('100' in T.inner_text('.bars .b:first-child') and T.locator('.miss').count() >= 1, 'right and missed drill cards are counted (Med Pass all right, Who\'s First missed)')
    check('2 of 2' in dt, 'a card both students missed shows as missed by 2 of 2')
    T.screenshot(path=str(OUT / 'teach-drills.png'), full_page=True)
    with T.expect_download() as dl: T.click('[data-act=dcsv]')
    drows = open(dl.value.path()).read().strip().splitlines()
    check(drows[0].startswith('student,drill,card_id') and len(drows) - 1 == sum(1 for r in db.drills if r['user_id'] in ('u-ana', 'u-ben')), f'drill CSV has a row per card answered ({len(drows) - 1})')
    T.click('[data-act=tab][data-v=ngn]'); T.wait_for_timeout(200)
    check(T.locator('tbody tr').count() == 1, 'practice-question results listed')
    T.select_option('#sf', 'stepdown-6e-1'); T.click('[data-act=tab][data-v=overview]'); T.wait_for_timeout(200)
    check('1 / 2' in T.inner_text('#app').replace('\n', ' '), 'filtering by shift narrows the overview')
    T.select_option('#sf', 'all')
    with T.expect_download() as dl: T.click('[data-act=csv]')
    rows = open(dl.value.path()).read().strip().splitlines()
    check(len(rows) == 4 and rows[0].startswith('student,shift') and 'Ana Ruiz' in ''.join(rows), f'CSV has a row per finished shift ({len(rows) - 1})')

    # Student leaves; instructor removes the other.
    H(A, 'cls'); A.wait_for_timeout(400); A.click('[data-act=cls-leave]'); A.wait_for_timeout(500)
    check(not any(m['user_id'] == 'u-ana' for m in db.members), 'student can leave the class')
    T.click('[data-act=refresh]'); T.wait_for_timeout(700); T.click('[data-act=tab][data-v=students]'); T.wait_for_timeout(200)
    check(T.locator('tbody [data-act=student]').all_inner_texts() == ['Ben Okafor'], 'roster updates after leaving')
    T.on('dialog', lambda d: d.accept()); T.click('[data-act=remove]'); T.wait_for_timeout(800)
    check(not db.members and 'No students yet' in T.content(), 'instructor can remove a student')

    # The outsider deletes their account from the game.
    H(O, 'account'); O.wait_for_timeout(200); O.click('[data-act=acct-del-ask]'); O.wait_for_timeout(200)
    check('Delete your account?' in O.content(), 'deleting asks first and says what goes')
    O.click('[data-act=acct-del-yes]'); O.wait_for_timeout(700)
    check('u-out' in getattr(db, 'deleted', []) and not any(r['user_id'] == 'u-out' for r in db.results), 'deleting removes the account and its results')
    check(O.evaluate("Shift.cloud.user()") is None and 'Account deleted' in O.content(), 'the game signs out and says the account is gone')

    # Phone width and dark mode don't break the dashboard.
    M = device(b, db, '/teach/', 'teach-phone', errs, vw=390); signin(M, 'tt', '/teach/'); M.wait_for_timeout(500)
    over = M.evaluate("document.documentElement.scrollWidth - innerWidth")
    check(over <= 1, f'no sideways scroll on a phone ({over}px)')
    M.emulate_media(color_scheme='dark'); M.screenshot(path=str(OUT / 'teach-phone-dark.png'), full_page=True)
    check('SECRET KEY SEEN' not in db.log, 'no secret key ever reaches Supabase from a page')
    check(not errs, 'no page errors' + (': ' + errs[0][:300] if errs else ''))
    b.close()
print('TEACH ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
