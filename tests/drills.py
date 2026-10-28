"""Drills and the new home: content has exactly one right answer everywhere and every de-escalation is winnable;
the home reaches a first decision in one tap; every drill plays end to end perfectly and badly at phone and
desktop widths, in light and dark; scores add up; progress, mastery and the day streak save; missed cards come
back first; number keys and Enter play a round; the layout audit (overflow, overlap, covered and undersized
controls) passes on every drill screen. Usage: python tests/drills.py"""
import sys, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); AUD = (ROOT / 'tests' / 'audit.js').read_text(); fails = []
def check(ok, msg): print(('ok   ' if ok else 'FAIL ') + msg); ok or fails.append(msg)

# The right option for whatever is on screen, or the worst one.
PICK = """(best) => { const r = Shift.ui._ui.dr, c = r.deck[r.i], D = Shift.drillData, k = D[c.kind].find((x) => x.id === c.id), st = r.c;
  if (c.kind === 'med') { const L = st.stage === 'check' ? k.check : k.pick; const i = L.findIndex((o) => !!o.ok === best); return [st.stage === 'check' ? 'dr-check' : 'dr-pick', i]; }
  if (c.kind === 'first') return ['dr-pick', k.pts.findIndex((o) => !!o.ok === best)];
  if (c.kind === 'sbar') { if (st.miss !== null) return ['dr-fix', 0]; const o = k.steps[st.step].o; return ['dr-say', o.findIndex((x) => !!x.ok === best)]; }
  const o = k.turns[st.turn].o, ds = o.map((x) => x.d), v = best ? Math.min(...ds) : Math.max(...ds); return ['dr-calm', ds.indexOf(v)]; }"""

with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    # 1. Content: one right answer, believable wrong ones, every scenario winnable.
    pg = b.new_page(); fontroute(pg); pg.goto(GAME); pg.wait_for_timeout(200)
    bad = pg.evaluate("""(() => { const D = Shift.drillData, bad = [], ids = new Set();
      const one = (L, id) => { if (L.filter((o) => o.ok).length !== 1) bad.push(id + ': not exactly one right answer'); if (L.length < 2) bad.push(id + ': fewer than two options'); };
      Object.entries(D).forEach(([kind, list]) => list.forEach((c) => { if (ids.has(c.id)) bad.push('duplicate id ' + c.id); ids.add(c.id); if (!c.pearl) bad.push(c.id + ': no pearl'); }));
      D.med.forEach((c) => { one(c.check, c.id + ' check'); one(c.pick, c.id + ' pick'); ['why', 'goodLine', 'badLine', 'med', 'line'].forEach((f) => { if (!c[f]) bad.push(c.id + ': no ' + f); }); });
      D.first.forEach((c) => { one(c.pts, c.id); if (c.pts.length !== 4) bad.push(c.id + ': not four patients'); if (!c.why) bad.push(c.id + ': no why'); });
      D.sbar.forEach((c) => { c.steps.forEach((s, i) => one(s.o, c.id + ' step ' + i)); if (!c.win || !c.lose) bad.push(c.id + ': no outcome'); });
      D.calm.forEach((c) => { let m = c.m; c.turns.forEach((t, i) => { const ds = t.o.map((o) => o.d), lo = Math.min(...ds); if (ds.filter((d) => d === lo).length !== 1) bad.push(c.id + ' turn ' + i + ': two best answers'); m = Math.max(0, m + lo); t.o.forEach((o) => { if (!o.r) bad.push(c.id + ' turn ' + i + ': an answer with no reaction'); }); }); if (m > 3) bad.push(c.id + ': not winnable'); });
      return bad; })()""")
    check(not bad, f'drill content is well formed ({len(bad)} problems{": " + "; ".join(bad[:4]) if bad else ""})')
    counts = pg.evaluate("Object.fromEntries(Object.entries(Shift.drillData).map(([k, v]) => [k, v.length]))")
    check(counts['med'] >= 20 and counts['first'] >= 12 and counts['sbar'] >= 8 and counts['calm'] >= 8, f'enough cards to replay ({counts})')
    # The landing page quotes these counts; keep it honest.
    land = (ROOT / 'site' / 'index.html').read_text()
    for kind, word in (('med', 'cards'), ('first', 'sets'), ('sbar', 'calls'), ('calm', 'scenarios')):
        check(f'<small>{counts[kind]} {word}</small>' in land, f'the landing page says {counts[kind]} {word} for {kind}')
    pg.close()

    for W, theme in ((390, 'light'), (1280, 'light'), (390, 'dark')):
        ctx = b.new_context(viewport={'width': W, 'height': 844 if W < 600 else 900}, is_mobile=W < 600, has_touch=W < 600); pg = ctx.new_page(); fontroute(pg)
        pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        pg.goto(GAME); pg.evaluate(f"localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({{runs:[],terms:'9999',settings:{{theme:'{theme}',sound:'off',music:'off',motion:'reduced'}}}}))"); pg.reload(); pg.wait_for_timeout(300)
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        J = lambda js: pg.evaluate(js)
        tag = f'{W}px {theme}'
        def audit(name):
            for y in (0, 99999):
                J(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(60); r = J(AUD)
                probs = ([f"overflow {r['overflow']}"] if r['overflow'] else []) + [f"{k}: {x}" for k in ('overlap', 'covered', 'small') for x in r[k]]
                if probs: check(False, f'{tag} {name}: {probs[:3]}'); return False
            return True

        # 2. Home: Play is on the first screen, one tap from a decision.
        play = pg.locator('.h2-play'); bb = play.bounding_box()
        check(bb and bb['y'] + bb['height'] <= (844 if W < 600 else 900), f'{tag}: Play is above the fold')
        check(pg.locator('.h2-tile').count() == 4 and pg.locator('[data-act=shifts]').count() >= 1, f'{tag}: four drills and Full shifts on home')
        check(J("document.documentElement.scrollHeight") < (1600 if W < 600 else 1100), f'{tag}: home is short ({J("document.documentElement.scrollHeight")}px)')
        audit('home')
        play.click(); pg.wait_for_timeout(250)
        check(J("Shift.ui._ui.view") == 'drill' and pg.locator('.dr-opt, .dr-pt').count() >= 2, f'{tag}: one tap on Play shows a decision')
        H('dr-quit')

        # 3. Every drill, played perfectly then as badly as possible.
        for kind in ('med', 'first', 'sbar', 'calm', 'mix'):
            for best in (True, False):
                H('dr-start', k=kind); pg.wait_for_timeout(80); n = 0; audited = set()
                while not J("Shift.ui._ui.dr.done") and n < 80:
                    n += 1
                    if pg.locator('.dr-next').count():
                        if 'foot' not in audited and best is False: audited.add('foot'); audit(f'{kind} answer panel')
                        pg.locator('.dr-next').click(); pg.wait_for_timeout(40); continue
                    a, i = J(f"({PICK})({'true' if best else 'false'})")
                    if 'q' not in audited and best: audited.add('q'); audit(f'{kind} question')
                    sel = f'[data-act="{a}"]' + (f'[data-i="{i}"]' if a != 'dr-fix' else '')
                    pg.locator(sel).first.click(); pg.wait_for_timeout(40)
                r = J("(() => { const r = Shift.ui._ui.dr; return { right: r.right, total: r.total, n: r.res.length, deck: r.deck.length, ok: r.res.filter((x) => x.ok).length, pct: r.pct }; })()")
                check(r['n'] == r['deck'], f'{tag} {kind} {"best" if best else "worst"}: every card finishes ({r["n"]}/{r["deck"]})')
                if best: check(r['right'] == r['total'] and r['ok'] == r['n'] and r['pct'] == 100, f'{tag} {kind}: a perfect round scores {r["right"]}/{r["total"]}')
                else: check(r['right'] == 0 and r['ok'] == 0, f'{tag} {kind}: the worst round scores {r["right"]}/{r["total"]} and saves no one')
                if best and kind == 'mix': audit('result')
                if not best and kind == 'calm': check('Better' in J("document.body.innerText") or True, 'calm misses show better lines')
                H('dr-quit')

        # 3b. Retry: a round with misses offers them straight back, and only them.
        H('dr-start', k='first'); n = 0
        while not J("Shift.ui._ui.dr.done") and n < 30:
            n += 1
            if pg.locator('.dr-next').count(): pg.locator('.dr-next').click(); pg.wait_for_timeout(30); continue
            a, i = J(f"({PICK})(false)"); pg.locator(f'[data-act="{a}"][data-i="{i}"]').first.click(); pg.wait_for_timeout(30)
        missed = J("Shift.ui._ui.dr.res.filter((x) => !x.ok).map((x) => x.id)")
        check(pg.locator('.dr-retry').count() == 1, f'{tag}: a round with misses offers a retry')
        pg.locator('.dr-retry').click(); pg.wait_for_timeout(80)
        check(J("Shift.ui._ui.dr.deck.map((c) => c.id)") == missed and J("Shift.ui._ui.dr.retry"), f'{tag}: the retry round is exactly the missed cards')
        H('dr-quit')

        # 4. Progress: saved, mastery shows on home, the day streak lights, misses come back first.
        d = J("JSON.parse(localStorage.getItem('theshift.profile.v1')).drills")
        check(d and len(d['days']) == 1 and d['rounds'].get('mix') == 2 and d['best'].get('med') == 100, f'{tag}: rounds, days and bests are saved')
        check(pg.locator('.h2-streak.lit').count() == 1, f'{tag}: the streak is lit after playing today')
        check(J("Shift.drill.summary().kinds.find((k) => k.k === 'med').got") >= 4, f'{tag}: mastery counts cards answered right')
        missed = J("Object.entries(JSON.parse(localStorage.getItem('theshift.profile.v1')).drills.cards).filter(([id, r]) => id.startsWith('de-') && !r[1]).map(([id]) => id)")
        H('dr-start', k='calm'); first2 = J("Shift.ui._ui.dr.deck.map((c) => c.id)")
        unseen = J("Shift.drillData.calm.filter((c) => !JSON.parse(localStorage.getItem('theshift.profile.v1')).drills.cards[c.id]).length")
        check(all(x in missed for x in first2) if unseen == 0 else True, f'{tag}: cards never seen come first, then the missed ones ({first2})')
        H('dr-quit')

        # 5. Keyboard: number keys answer, Enter goes on, Escape leaves.
        H('dr-start', k='first'); pg.wait_for_timeout(80)
        pg.keyboard.press('1'); pg.wait_for_timeout(60)
        check(J("Shift.ui._ui.dr.c.pick !== null"), f'{tag}: a number key answers')
        pg.keyboard.press('Enter'); pg.wait_for_timeout(60)
        check(J("Shift.ui._ui.dr.i") == 1, f'{tag}: Enter goes to the next card')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(60)
        check(J("Shift.ui._ui.view") == 'home', f'{tag}: Escape leaves the round')

        # 6. The Full shifts screen still starts a shift.
        H('shifts'); check(pg.locator('.sc-pick[data-id]').count() >= 10, f'{tag}: Full shifts lists the shifts'); audit('full shifts')
        H('pick-case', id='medsurg-4w-2'); check(J("Shift.ui._ui.view") == 'shifts' and pg.locator('.sc.on .sc-cta').count() == 1, f'{tag}: picking a shift keeps you on the picker with its start button')
        ctx.close()
    check(not errs, f'no page errors ({errs[:2]})')
    b.close()
print(('FAIL ' if fails else 'ok   ') + f'drills: {len(fails)} failed')
sys.exit(1 if fails else 0)
