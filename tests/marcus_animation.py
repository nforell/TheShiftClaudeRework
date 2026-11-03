"""Regression checks for Marcus Bell's production-rig character prototype."""
import pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / 'dist' / 'prototype' / 'marcus' / 'index.html').as_uri()

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(URL)
        page.wait_for_selector('svg.marcus-bust .r-head')
        count = page.locator('svg.marcus-bust .r-marcus-details').count()
        assert count == 1, 'signature portrait detail missing'
        assert page.locator('svg.marcus-bust .r-brow').count() == 2
        page.get_by_role('button', name='Pain and guarding').click()
        assert page.locator('#painValue').inner_text() == '8'
        assert page.locator('button[data-state="pain"]').get_attribute('aria-pressed') == 'true'
        assert page.evaluate('Shift.rig.derive(MarcusPrototype.states.pain.v,{guard:true}).postOpGuard') == .8
        page.get_by_role('button', name='Breathing difficulty').click()
        assert page.locator('#spoValue').inner_text() == '91%'
        assert page.locator('svg.marcus-bust .r-strain').count() == 1
        page.get_by_role('button', name='Comfort after care').click()
        assert page.locator('#painValue').inner_text() == '3'
        assert page.locator('button[data-state="relief"]').get_attribute('aria-pressed') == 'true'
        page.locator('#reduced').check()
        assert page.locator('#reduced').is_checked()
        assert page.evaluate('Shift.rig.stats().live') == 1
        assert not errors, 'JavaScript errors: ' + repr(errors)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Phone-width overflow'
        page.close()
        browser.close()
    print('PASS Marcus animation prototype: portrait, four states, reduced motion, no JS errors')

if __name__ == '__main__':
    main()
