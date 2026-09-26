import pathlib
src=pathlib.Path(__file__).parent/'src'
css=(src/'styles.css').read_text()
js=''.join((src/f).read_text()+'\n' for f in ['engine.js','case-medsurg1.js','case-medsurg2.js','rig.js','art.js','ui.js'])
html=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>The Shift — 4 West Med-Surg</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@200;300;400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet">
<style>{css}</style></head>
<body><div id="app"></div>
<script>{js}</script></body></html>'''
out=pathlib.Path(__file__).parent/'dist'/'the-shift.html'; out.write_text(html); print(len(html))
