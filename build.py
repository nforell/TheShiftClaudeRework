import pathlib
src=pathlib.Path(__file__).parent/'src'
css=(src/'styles.css').read_text()
js=''.join((src/f).read_text()+'\n' for f in ['engine.js','fx.js','case-medsurg1.js','case-medsurg2.js','case-medsurg3.js','case-psych1.js','case-peds1.js','rig.js','art.js','ui.js'])
html=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>The Shift — a nursing shift simulator</title>
<meta name="description" content="Work a real med-surg shift. Take report, walk the hall, and decide who needs you first. Your patients get better or worse based on what you notice.">
<meta name="theme-color" content="#1E6B63">
<meta property="og:title" content="The Shift — a nursing shift simulator">
<meta property="og:description" content="Four patients. One is quietly getting worse. Will you notice in time?">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%231E6B63'/%3E%3Cpath d='M8 36h12l5-12 8 22 6-14 4 4h13' fill='none' stroke='white' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@200;300;400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet">
<style>{css}</style></head>
<body><div id="app"></div>
<script>{js}</script></body></html>'''
root=pathlib.Path(__file__).parent; dist=root/'dist'
# The game: /play/ on the site, plus a standalone single file.
(dist/'play').mkdir(parents=True, exist_ok=True)
(dist/'the-shift.html').write_text(html); (dist/'play'/'index.html').write_text(html)
# The beta landing page at / and its screenshots at /assets/.
import shutil
(dist/'index.html').write_text((root/'site'/'index.html').read_text())
shutil.copytree(root/'site'/'assets', dist/'assets', dirs_exist_ok=True)
print(len(html))
