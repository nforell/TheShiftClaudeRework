/* The Shift — character rig. Draws people as layered SVG and animates them from clinical inputs
   (RR, SpO2, HR, SBP, temp, pain, glucose, alertness, confusion, nausea). Generic: designs come from the case. */
(function (S) {
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const hx = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const toHex = (r, g, b) => '#' + [r, g, b].map((x) => Math.round(clamp(x, 0, 255)).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = hx(a), B = hx(b); return toHex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)); };
  const shade = (a, amt) => { const A = hx(a); return toHex(A[0] + amt, A[1] + amt, A[2] + amt); };
  const rand = (a, b) => a + Math.random() * (b - a);
  const BASE = { rr: 16, spo2: 97, hr: 80, sbp: 124, temp: 37, pain: 0, glu: 110, alert: 0, confused: false, nausea: false, lean: 0 };
  const CH = {};
  let UID = 0, live = [], cache = {}, reduced = false, running = false;
  const osReduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- drawing ---------- */
  function faceD(w, h, jaw) { const j = .3 + .35 * jaw, k = .36 + .42 * jaw; return `M ${-w} 0 C ${-w} ${-h * .56} ${-w * .56} ${-h} 0 ${-h} C ${w * .56} ${-h} ${w} ${-h * .56} ${w} 0 C ${w} ${h * j} ${w * k} ${h} 0 ${h} C ${-w * k} ${h} ${-w} ${h * j} ${-w} 0 Z`; }
  function cap(w, h, top, line, side) { return `M ${-w * 1.01} ${h * side} C ${-w * 1.03} ${-h * .72} ${-w * .58} ${-h * top} 0 ${-h * top} C ${w * .58} ${-h * top} ${w * 1.03} ${-h * .72} ${w * 1.01} ${h * side} C ${w * .9} ${-h * .3} ${w * .55} ${-h * line} 0 ${-h * line} C ${-w * .55} ${-h * line} ${-w * .9} ${-h * .3} ${-w * 1.01} ${h * side} Z`; }
  function hair(c) {
    const { w, h } = c.head, col = c.hair.color, dk = shade(col, -22), lt = shade(col, 28); let back = '', front = '';
    switch (c.hair.style) {
      case 'buzz': front = `<path d="${cap(w, h, 1.03, .6, .08)}" fill="${col}" opacity=".92"/><path d="M ${-w * .55} ${-h * .62} q ${w * .55} -8 ${w * 1.1} 0" stroke="${dk}" stroke-width="1.2" fill="none" opacity=".6"/>`; break;
      case 'bun':
        back = `<circle cx="${w * .05}" cy="${-h * 1.1}" r="${h * .37}" fill="${col}"/><path d="M ${-w * .25} ${-h * 1.3} q ${w * .28} ${-h * .14} ${w * .55} ${-h * .02}" stroke="${lt}" stroke-width="2" fill="none" opacity=".6"/>`;
        if (c.hair.pencil) back = `<g><path d="M ${-w * .72} ${-h * 1.4} L ${w * .5} ${-h * .86}" stroke="#E7B63B" stroke-width="6"/><path d="M ${-w * .72} ${-h * 1.4} l -7 -3" stroke="#E58C98" stroke-width="6"/><path d="M ${w * .5} ${-h * .86} l 7 3.2" stroke="#E9CFA4" stroke-width="5"/><path d="M ${w * .5 + 6} ${-h * .86 + 2.8} l 3 1.3" stroke="#333" stroke-width="3"/></g>` + back;
        front = `<path d="${cap(w, h, 1.06, .52, .12)}" fill="${col}"/><path d="M ${-w * .18} ${-h * 1.04} C ${-w * .28} ${-h * .86} ${-w * .42} ${-h * .66} ${-w * .62} ${-h * .5}" stroke="${lt}" stroke-width="1.6" fill="none" opacity=".7"/>`;
        if (c.hair.streak) front += `<path d="M ${w * .08} ${-h * 1.04} C ${w * .3} ${-h * .94} ${w * .5} ${-h * .72} ${w * .62} ${-h * .46}" stroke="#CFC9C3" stroke-width="5" fill="none" stroke-linecap="round"/>`;
        break;
      case 'curls': {
        for (let a = 195; a <= 345; a += 18) { const r = a * Math.PI / 180; back += `<circle cx="${Math.cos(r) * w}" cy="${Math.sin(r) * h * .94 - h * .04}" r="${h * .27}" fill="${col}" stroke="${dk}" stroke-width="1.3"/>`; }
        [-1, 1].forEach((s) => { back += `<circle cx="${s * w * 1.04}" cy="${h * .04}" r="${h * .2}" fill="${col}" stroke="${dk}" stroke-width="1.3"/><circle cx="${s * w * .98}" cy="${h * .3}" r="${h * .15}" fill="${col}" stroke="${dk}" stroke-width="1.3"/>`; });
        front = `<path d="${cap(w, h, 1.02, .64, -.12)}" fill="${col}"/>`;
        for (let i = -3; i <= 3; i++) front += `<circle cx="${i * w * .22}" cy="${-h * .7 + Math.abs(i) * 3.5}" r="${h * .17}" fill="${col}" stroke="${dk}" stroke-width="1.2"/>`;
        break;
      }
      case 'balding':
        front = [-1, 1].map((d) => [[.9, -.34, .11], [.99, -.16, .12], [.97, .02, .1], [.84, -.46, .08]].map(([x, y, r]) => `<circle cx="${d * w * x}" cy="${h * y}" r="${h * r}" fill="${col}" stroke="${dk}" stroke-width="1"/>`).join('')).join('') + `<ellipse cx="${-w * .3}" cy="${-h * .74}" rx="13" ry="5.5" transform="rotate(-24 ${-w * .3} ${-h * .74})" fill="#fff" opacity=".28"/>`; break;
      case 'swoop':
        front = `<path d="${cap(w, h, 1.08, .55, .06)}" fill="${col}"/><path d="M ${-w * .62} ${-h * .84} C ${-w * .3} ${-h * 1.36} ${w * .62} ${-h * 1.34} ${w * .8} ${-h * .72} C ${w * .45} ${-h * 1.02} ${w * .02} ${-h * .98} ${-w * .62} ${-h * .84} Z" fill="${col}"/><path d="M ${-w * .2} ${-h * 1.1} q ${w * .4} ${-h * .1} ${w * .7} ${h * .1}" stroke="${lt}" stroke-width="1.6" fill="none" opacity=".6"/>`; break;
      case 'long': {
        // Two soft locks that fall either side of the neck and end in rounded tips (no slab over the chest),
        // a swept side part instead of a jagged fringe, and a few strands for texture.
        const side = (s) => `C ${s * w * 1.18} ${h * .32} ${s * w * 1.27} ${h * .84} ${s * w * 1.16} ${h * 1.18} C ${s * w * 1.11} ${h * 1.42} ${s * w * .86} ${h * 1.46} ${s * w * .77} ${h * 1.3} C ${s * w * .68} ${h * 1.16} ${s * w * .66} ${h * .96} ${s * w * .52} ${h * .8}`;
        back = `<path d="M ${-w * 1.06} ${-h * .25} C ${-w * 1.18} ${-h * 1.24} ${w * 1.18} ${-h * 1.24} ${w * 1.06} ${-h * .25} ${side(1)} L ${-w * .52} ${h * .8} C ${-w * .66} ${h * .96} ${-w * .68} ${h * 1.16} ${-w * .77} ${h * 1.3} C ${-w * .86} ${h * 1.46} ${-w * 1.11} ${h * 1.42} ${-w * 1.16} ${h * 1.18} C ${-w * 1.27} ${h * .84} ${-w * 1.18} ${h * .32} ${-w * 1.06} ${-h * .25} Z" fill="${col}"/>`
          + [-1, 1].map((s) => `<path d="M ${s * w * .96} ${h * .2} C ${s * w * 1.04} ${h * .6} ${s * w * 1.06} ${h * .92} ${s * w * .98} ${h * 1.2}" stroke="${dk}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".55"/><path d="M ${s * w * 1.1} ${h * .1} C ${s * w * 1.17} ${h * .5} ${s * w * 1.18} ${h * .84} ${s * w * 1.1} ${h * 1.08}" stroke="${lt}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".45"/>`).join('');
        front = `<path d="M ${-w * 1.03} ${h * .1} C ${-w * 1.04} ${-h * .8} ${-w * .56} ${-h * 1.07} 0 ${-h * 1.07} C ${w * .56} ${-h * 1.07} ${w * 1.04} ${-h * .8} ${w * 1.03} ${h * .1} L ${w * .89} ${h * .1} C ${w * .87} ${-h * .28} ${w * .7} ${-h * .5} ${w * .4} ${-h * .55} C ${w * .1} ${-h * .6} ${-w * .12} ${-h * .7} ${-w * .26} ${-h * .8} C ${-w * .46} ${-h * .62} ${-w * .82} ${-h * .44} ${-w * .89} ${h * .1} Z" fill="${col}"/>`
          + `<path d="M ${-w * .24} ${-h * 1.02} C ${-w * .26} ${-h * .94} ${-w * .26} ${-h * .86} ${-w * .26} ${-h * .8}" stroke="${dk}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".6"/>`
          + `<path d="M ${-w * .1} ${-h * .98} C ${w * .2} ${-h * .9} ${w * .5} ${-h * .78} ${w * .7} ${-h * .5}" stroke="${lt}" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".6"/>`
          + `<path d="M ${-w * .4} ${-h * .94} C ${-w * .6} ${-h * .8} ${-w * .78} ${-h * .5} ${-w * .84} ${-h * .1}" stroke="${lt}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".4"/>`;
        break;
      }
      case 'bob':
        back = `<path d="M ${-w * 1.12} ${-h * .1} C ${-w * 1.2} ${-h * 1.2} ${w * 1.2} ${-h * 1.2} ${w * 1.12} ${-h * .1} L ${w * 1.14} ${h * .62} Q ${w * .9} ${h * .74} ${w * .78} ${h * .6} L ${-w * .78} ${h * .6} Q ${-w * .9} ${h * .74} ${-w * 1.14} ${h * .62} Z" fill="${col}"/>`;
        front = `<path d="M ${-w * 1.04} ${h * .2} C ${-w * 1.05} ${-h * .82} ${-w * .5} ${-h * 1.08} ${w * .1} ${-h * 1.06} C ${w * .7} ${-h * 1.02} ${w * 1.05} ${-h * .7} ${w * 1.04} ${h * .2} L ${w * .9} ${h * .2} C ${w * .86} ${-h * .3} ${w * .6} ${-h * .52} ${w * .2} ${-h * .56} C ${-w * .2} ${-h * .44} ${-w * .7} ${-h * .5} ${-w * .9} ${h * .2} Z" fill="${col}"/><path d="M ${w * .15} ${-h * 1.02} C ${w * .05} ${-h * .82} ${-w * .3} ${-h * .62} ${-w * .6} ${-h * .52}" stroke="${lt}" stroke-width="1.6" fill="none" opacity=".6"/>`; break;
      case 'short':
        front = `<path d="${cap(w, h, 1.07, .58, .1)}" fill="${col}"/><path d="M ${-w * .4} ${-h * .84} q ${w * .4} ${-h * .14} ${w * .85} ${-h * .02}" stroke="${lt}" stroke-width="1.5" fill="none" opacity=".5"/>`; break;
      case 'curlyshort':
        for (let a = 190; a <= 350; a += 20) { const r = a * Math.PI / 180; back += `<circle cx="${Math.cos(r) * w}" cy="${Math.sin(r) * h * .95 - h * .02}" r="${h * (c.hair.big ? .28 : .21)}" fill="${col}"/>`; }
        front = `<path d="${cap(w, h, 1.03, .6, .02)}" fill="${col}"/>`;
        for (let i = -3; i <= 3; i++) front += `<circle cx="${i * w * .21}" cy="${-h * .66 + Math.abs(i) * 3}" r="${h * .14}" fill="${shade(col, 8)}"/>`;
        break;
      case 'hijab': {
        // A wrapped scarf: it covers the whole crown and the ears, frames the face in an oval from the forehead to just
        // under the chin, then drapes over the shoulders. Drawn as an outer shape with a face-shaped opening (evenodd).
        const dk2 = shade(col, -20), lt2 = shade(col, 20);
        const outer = `M 0 ${-h * 1.17} C ${w * .78} ${-h * 1.17} ${w * 1.21} ${-h * .7} ${w * 1.21} ${h * .05} C ${w * 1.21} ${h * .72} ${w * 1.02} ${h * 1.16} ${w * .72} ${h * 1.36} L ${-w * .72} ${h * 1.36} C ${-w * 1.02} ${h * 1.16} ${-w * 1.21} ${h * .72} ${-w * 1.21} ${h * .05} C ${-w * 1.21} ${-h * .7} ${-w * .78} ${-h * 1.17} 0 ${-h * 1.17} Z`;
        const hole = `M 0 ${-h * .68} C ${w * .62} ${-h * .68} ${w * .9} ${-h * .32} ${w * .89} ${h * .14} C ${w * .87} ${h * .6} ${w * .5} ${h * 1.07} 0 ${h * 1.07} C ${-w * .5} ${h * 1.07} ${-w * .87} ${h * .6} ${-w * .89} ${h * .14} C ${-w * .9} ${-h * .32} ${-w * .62} ${-h * .68} 0 ${-h * .68} Z`;
        back = `<path d="M ${-w * 1.24} ${h * .1} C ${-w * 1.24} ${-h * 1.24} ${w * 1.24} ${-h * 1.24} ${w * 1.24} ${h * .1} L ${w * 1.34} ${h * 1.8} L ${-w * 1.34} ${h * 1.8} Z" fill="${dk2}"/>`;
        front = `<path d="${outer} ${hole}" fill="${col}" fill-rule="evenodd" stroke="${dk2}" stroke-width="1.2"/>`
          + `<path d="M ${-w * .86} ${h * 1.18} C ${-w * .4} ${h * 1.42} ${w * .4} ${h * 1.42} ${w * .86} ${h * 1.18} L ${w * 1.3} ${h * 1.86} Q 0 ${h * 2.1} ${-w * 1.3} ${h * 1.86} Z" fill="${col}"/>`
          + `<path d="${hole}" fill="none" stroke="${dk2}" stroke-width="3" opacity=".45"/>`
          + `<path d="M ${-w * .62} ${-h * .86} C ${-w * .25} ${-h * 1.02} ${w * .25} ${-h * 1.02} ${w * .62} ${-h * .86}" stroke="${lt2}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>`
          + `<path d="M ${w * 1.05} ${h * .3} C ${w * 1.02} ${h * .8} ${w * .82} ${h * 1.12} ${w * .5} ${h * 1.3}" stroke="${dk2}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"/>`
          + `<path d="M ${-w * .3} ${h * 1.42} Q ${w * .3} ${h * 1.6} ${w * .9} ${h * 1.78}" stroke="${dk2}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".6"/>`;
        break;
      }
      case 'shag':
        front = `<path d="${cap(w, h, 1.08, .5, .16)}" fill="${col}"/><path d="M ${-w * .78} ${-h * .52} L ${-w * .62} ${-h * .22} L ${-w * .48} ${-h * .5} L ${-w * .3} ${-h * .2} L ${-w * .14} ${-h * .5} L ${w * .06} ${-h * .24} L ${w * .2} ${-h * .52} L ${w * .42} ${-h * .3} L ${w * .6} ${-h * .56} L ${w * .6} ${-h * .7} L ${-w * .78} ${-h * .7} Z" fill="${col}"/>`; break;
      case 'ponytail':
        back = `<ellipse cx="${w * 1.02}" cy="${-h * .05}" rx="${w * .25}" ry="${h * .58}" transform="rotate(-16 ${w * 1.02} ${-h * .05})" fill="${col}"/><circle cx="${w * .86}" cy="${-h * .62}" r="7" fill="#7A9BC2"/>`;
        front = `<path d="${cap(w, h, 1.05, .56, .1)}" fill="${col}"/><path d="M ${w * .12} ${-h * 1.04} C ${w * .02} ${-h * .86} ${-w * .22} ${-h * .66} ${-w * .52} ${-h * .56}" stroke="${lt}" stroke-width="1.8" fill="none" opacity=".6"/>`; break;
    }
    return { back, front };
  }
  function eyeSVG(c, uid, s) {
    const { w, h } = c.head, ex = s * w * .4, ey = h * .1, rx = c.eye, ry = rx * 1.12, ir = rx * .8;
    return `<g transform="translate(${ex} ${ey})"><clipPath id="rec${uid}${s}"><ellipse rx="${rx}" ry="${ry}"/></clipPath>
      <g clip-path="url(#rec${uid}${s})"><ellipse rx="${rx}" ry="${ry}" fill="#FBFAF6"/>
      <g class="r-iris"><circle r="${ir}" fill="${c.iris}" stroke="${shade(c.iris, -40)}" stroke-width="${Math.max(1, ir * .12)}"/><circle r="${ir * .62}" fill="${shade(c.iris, -18)}" opacity=".5"/><circle class="r-pupil" r="${ir * .46}" fill="#120B08"/><circle class="r-hl" cx="${-ir * .36}" cy="${-ir * .4}" r="${ir * .32}" fill="#fff"/><circle cx="${ir * .38}" cy="${ir * .34}" r="${ir * .14}" fill="#fff" opacity=".85"/></g>
      <rect class="r-lid" x="${-rx - 3}" y="${-ry - 3}" width="${2 * rx + 6}" height="0" fill="${c.skin}"/><rect class="r-low" x="${-rx - 3}" y="${ry + 3}" width="${2 * rx + 6}" height="0" fill="${c.skin}"/></g>
      <path class="r-lash" fill="none" stroke="#1C1310" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M ${-rx * .78} ${-ry - 4.5} Q 0 ${-ry - 9} ${rx * .78} ${-ry - 4.5}" stroke="${c.shade}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".5"/>
      <path d="M ${-rx * .7} ${ry + 2.6} Q 0 ${ry + 4.6} ${rx * .7} ${ry + 2.6}" stroke="${c.shade}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".35"/></g>`;
  }
  function headSVG(c, uid) {
    const { w, h } = c.head, face = faceD(w, h, c.head.jaw), H = hair(c), ex = c.extras || []; let s = `<g class="r-head">`;
    s += H.back;
    if (c.hair.style !== 'hijab') [-1, 1].forEach((d) => {
      s += `<ellipse cx="${d * w * .97}" cy="${h * .14}" rx="8.5" ry="12.5" fill="${c.skin}" stroke="${c.shade}" stroke-width="1.4"/><ellipse cx="${d * w * .99}" cy="${h * .15}" rx="4.4" ry="8" fill="${c.shade}" opacity=".35"/><path d="M ${d * w} ${h * .05} q ${d * 4.5} 7 0 15" stroke="${c.shade}" stroke-width="1.6" fill="none"/>`;
      if (ex.includes('hoops')) s += `<circle cx="${d * w * .99}" cy="${h * .42}" r="6" fill="none" stroke="#D4A941" stroke-width="2"/>`;
      if (ex.includes('gold')) s += `<circle cx="${d * w * .99}" cy="${h * .36}" r="3.2" fill="#D4A941"/>`;
      if (ex.includes('pearls')) s += `<circle cx="${d * w * .99}" cy="${h * .34}" r="3.6" fill="#F7F3EA" stroke="#CFC7B8"/>`;
      if (ex.includes('studs')) s += `<circle cx="${d * w * .99}" cy="${h * .34}" r="2.4" fill="#9FC7D6"/>`;
    });
    s += `<radialGradient id="rsk${uid}" cx=".4" cy=".34" r=".78"><stop offset="0" stop-color="${shade(c.skin, 16)}"/><stop offset=".5" stop-color="${c.skin}"/><stop offset="1" stop-color="${mix(c.skin, c.shade, .45)}"/></radialGradient>`
      + `<radialGradient id="rbl${uid}"><stop offset="0" stop-color="${c.blush}" stop-opacity=".95"/><stop offset=".55" stop-color="${c.blush}" stop-opacity=".5"/><stop offset="1" stop-color="${c.blush}" stop-opacity="0"/></radialGradient>`;
    s += `<clipPath id="rfc${uid}"><path d="${face}"/></clipPath><path d="${face}" fill="url(#rsk${uid})" stroke="${c.shade}" stroke-width="1.5"/>`;
    s += `<g clip-path="url(#rfc${uid})"><ellipse cx="${w * .62}" cy="${h * .55}" rx="${w * .72}" ry="${h}" fill="${c.shade}" opacity=".24"/><ellipse class="r-fh" cx="0" cy="${-h * .5}" rx="${w * .75}" ry="${h * .32}" fill="#E0503F" opacity="0"/><path class="r-pallor" d="${face}" fill="#CDD6D3" opacity="0"/><path class="r-green" d="${face}" fill="#A5C58B" opacity="0"/>${c.hair.style !== 'balding' ? `<ellipse cx="${w * .06}" cy="${-h * .5}" rx="${w * .95}" ry="${h * .2}" fill="${shade(c.shade, -25)}" opacity=".16"/>` : ''}<ellipse cx="0" cy="${h * .98}" rx="${w * .7}" ry="${h * .2}" fill="${c.shade}" opacity=".22"/></g>`;
    s += `<g class="r-cheeks"><ellipse cx="${-w * .58}" cy="${h * .4}" rx="${w * .27}" ry="${h * .16}" fill="url(#rbl${uid})"/><ellipse cx="${w * .58}" cy="${h * .4}" rx="${w * .27}" ry="${h * .16}" fill="url(#rbl${uid})"/></g>`;
    if (ex.includes('freckles')) [[-.55, .28], [-.45, .36], [-.64, .36], [.55, .28], [.45, .36], [.64, .36], [-.1, .3], [.1, .3]].forEach(([x, y]) => { s += `<circle cx="${x * w}" cy="${y * h}" r="1.3" fill="${c.shade}"/>`; });
    if (ex.includes('wrinkles')) s += `<g stroke="${c.shade}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".7"><path d="M ${-w * .35} ${-h * .5} q ${w * .35} -5 ${w * .7} 0"/><path d="M ${-w * .25} ${-h * .4} q ${w * .25} -4 ${w * .5} 0"/><path d="M ${-w * .32} ${h * .36} q -5 8 -2 16"/><path d="M ${w * .32} ${h * .36} q 5 8 2 16"/><path d="M ${-w * .66} ${h * .1} l -6 -2 M ${-w * .66} ${h * .16} l -6 1 M ${w * .66} ${h * .1} l 6 -2 M ${w * .66} ${h * .16} l 6 1"/></g>`;
    // Marcus Bell: layered editorial portrait details. Generated from his existing
    // facial geometry so the drawing remains animateable in portrait and bedside
    // rigs. No external image or large raster payload.
    if (c.signature === 'marcus-v2') {
      s += `<g class="r-marcus-details" pointer-events="none">
        <path d="M ${-w*.81} ${-h*.16} Q ${-w*.68} ${-h*.06} ${-w*.70} ${h*.12} M ${w*.81} ${-h*.16} Q ${w*.68} ${-h*.06} ${w*.70} ${h*.12}" stroke="${c.shade}" stroke-width="1.35" opacity=".54" fill="none" stroke-linecap="round"/>
        <path d="M ${-w*.50} ${h*.30} Q ${-w*.43} ${h*.45} ${-w*.25} ${h*.49} M ${w*.50} ${h*.30} Q ${w*.43} ${h*.45} ${w*.25} ${h*.49}" stroke="${c.shade}" stroke-width="1.5" opacity=".4" fill="none" stroke-linecap="round"/>
        <path d="M ${-w*.47} ${-h*.44} Q 0 ${-h*.52} ${w*.46} ${-h*.43} M ${-w*.37} ${-h*.35} Q 0 ${-h*.41} ${w*.36} ${-h*.35}" stroke="${c.shade}" stroke-width="1.65" opacity=".55" fill="none" stroke-linecap="round"/>
        <path d="M ${-w*.72} ${h*.27} Q ${-w*.56} ${h*.32} ${-w*.46} ${h*.31} M ${w*.72} ${h*.27} Q ${w*.56} ${h*.32} ${w*.46} ${h*.31}" stroke="${shade(c.skin,28)}" stroke-width="2.4" opacity=".36" fill="none" stroke-linecap="round"/>
        <ellipse cx="${-w*.57}" cy="${h*.40}" rx="${w*.23}" ry="${h*.13}" fill="${shade(c.skin,20)}" opacity=".11"/>
        <ellipse cx="${w*.57}" cy="${h*.40}" rx="${w*.23}" ry="${h*.13}" fill="${shade(c.skin,20)}" opacity=".11"/>
      </g>`;
    }

    s += `<ellipse cx="1.5" cy="${h * .28}" rx="2" ry="${h * .065}" fill="#fff" opacity=".13"/><path d="M -1.5 ${h * .24} Q -7 ${h * .38} 0 ${h * .41} Q 5.5 ${h * .4} 5 ${h * .33}" stroke="${c.shade}" stroke-width="2.1" fill="none" stroke-linecap="round"/><ellipse cx="-4" cy="${h * .39}" rx="1.8" ry="1.1" fill="${shade(c.shade, -30)}" opacity=".45"/><ellipse cx="4.2" cy="${h * .385}" rx="1.8" ry="1.1" fill="${shade(c.shade, -30)}" opacity=".45"/>`;
    s += `<ellipse class="r-cyan" cx="0" cy="${h * .6}" rx="17" ry="10" fill="#7487C0" opacity="0"/>`;
    if (ex.includes('beard')) s += `<path d="M ${-w * .95} 0 C ${-w * .95} ${h * .92} ${-w * .42} ${h * 1.12} 0 ${h * 1.12} C ${w * .42} ${h * 1.12} ${w * .95} ${h * .92} ${w * .95} 0 C ${w * .82} ${h * .55} ${w * .42} ${h * .76} 0 ${h * .76} C ${-w * .42} ${h * .76} ${-w * .82} ${h * .55} ${-w * .95} 0 Z" fill="${c.hair.color}"/>`;
    s += `<g transform="translate(0 ${h * .6})"><path class="r-mouth" fill="#4A1F1E" stroke="${c.lip}" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"/></g>`;
    if (ex.includes('goatee')) s += `<path d="M -13 ${h * .5} Q 0 ${h * .43} 13 ${h * .5}" stroke="${c.hair.color}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M -9 ${h * .78} Q 0 ${h * 1.02} 9 ${h * .78} Q 0 ${h * .86} -9 ${h * .78} Z" fill="${c.hair.color}"/>`;
    if (ex.includes('mustache')) s += `<path d="M 0 ${h * .46} C -8 ${h * .37} -24 ${h * .4} -27 ${h * .55} C -18 ${h * .52} -9 ${h * .54} 0 ${h * .52} C 9 ${h * .54} 18 ${h * .52} 27 ${h * .55} C 24 ${h * .4} 8 ${h * .37} 0 ${h * .46} Z" fill="${c.hair.color}" stroke="${shade(c.hair.color, -30)}" stroke-width="1"/>`;
    if (ex.includes('beard')) s += `<path d="M 0 ${h * .47} C -7 ${h * .4} -18 ${h * .43} -20 ${h * .53} C -12 ${h * .51} -6 ${h * .52} 0 ${h * .51} C 6 ${h * .52} 12 ${h * .51} 20 ${h * .53} C 18 ${h * .43} 7 ${h * .4} 0 ${h * .47} Z" fill="${c.hair.color}"/>`;
    s += eyeSVG(c, uid, -1) + eyeSVG(c, uid, 1);
    [-1, 1].forEach((d) => { s += `<g class="r-brow" data-s="${d}"><path d="M -9.5 1.5 Q 0 -3.5 9.5 1.5" stroke="${c.brow.color}" stroke-width="${c.brow.w}" fill="none" stroke-linecap="round"/></g>`; });
    const sweatFirst = c.hair.style === 'hijab';
    let sweat = `<ellipse class="r-sheen" cx="${-w * .1}" cy="${-h * .55}" rx="${w * .4}" ry="${h * .12}" fill="#fff" opacity="0"/>`;
    [[-.34, -.5], [.36, -.4], [.66, -.08]].forEach(([x, y]) => { const yy = sweatFirst ? y + .38 : y; sweat += `<path class="r-drop" data-x="${x * w * (sweatFirst ? .8 : 1)}" data-y="${yy * h}" d="M 0 -4.5 C 2.8 -.6 3.4 1.8 0 3.6 C -3.4 1.8 -2.8 -.6 0 -4.5 Z" fill="#D4ECF5" stroke="#86B6CC" stroke-width=".9" opacity="0"/>`; });
    if (sweatFirst) s += sweat;
    s += H.front;
    if (!['balding', 'hijab', 'buzz'].includes(c.hair.style)) s += `<path d="M ${-w * .52} ${-h * .84} Q ${-w * .05} ${-h * 1.04} ${w * .42} ${-h * .88}" stroke="${shade(c.hair.color, 70)}" stroke-width="${Math.max(3, h * .07)}" fill="none" stroke-linecap="round" opacity=".28"/>`;
    const gx = w * .4, gy = h * .1, gr = c.eye * 1.12 + 4.5;
    if (ex.includes('glasses') || ex.includes('thinGlasses')) { const sw = ex.includes('glasses') ? 2.8 : 1.6; s += `<g fill="none" stroke="${c.glasses}" stroke-width="${sw}"><circle cx="${-gx}" cy="${gy}" r="${gr}" fill="#fff" fill-opacity=".07"/><circle cx="${gx}" cy="${gy}" r="${gr}" fill="#fff" fill-opacity=".07"/><path d="M ${-gx + gr} ${gy - 1} Q 0 ${gy - 6} ${gx - gr} ${gy - 1}"/><path d="M ${-gx - gr} ${gy - 2} L ${-w * .98} ${gy - 4} M ${gx + gr} ${gy - 2} L ${w * .98} ${gy - 4}"/></g>`; }
    if (ex.includes('headset')) s += `<path d="M ${-w * 1.02} ${h * .05} C ${-w * 1.1} ${-h * 1.2} ${w * 1.1} ${-h * 1.2} ${w * 1.02} ${h * .05}" stroke="#3A3F44" stroke-width="4" fill="none"/><rect x="${-w * 1.1}" y="${-h * .08}" width="12" height="20" rx="5" fill="#3A3F44"/><path d="M ${-w * 1.02} ${h * .2} Q ${-w * .8} ${h * .62} ${-w * .3} ${h * .6}" stroke="#3A3F44" stroke-width="2.4" fill="none"/><circle cx="${-w * .3}" cy="${h * .6}" r="3.4" fill="#3A3F44"/>`;
    // Endotracheal tube: taped at the corner of the mouth, running down to the ventilator circuit.
    if (ex.includes('ett')) s += `<g stroke-linecap="round" fill="none"><path d="M ${w * .08} ${h * .6} C ${w * .3} ${h * .78} ${w * .62} ${h * .98} ${w * .9} ${h * 1.36}" stroke="#93A7B2" stroke-width="13"/><path d="M ${w * .08} ${h * .6} C ${w * .3} ${h * .78} ${w * .62} ${h * .98} ${w * .9} ${h * 1.36}" stroke="#EDF3F5" stroke-width="9"/><path d="M ${w * .16} ${h * .67} C ${w * .34} ${h * .8} ${w * .6} ${h * .98} ${w * .84} ${h * 1.3}" stroke="#FFFFFF" stroke-width="2" opacity=".8"/></g><rect x="${-w * .66}" y="${h * .54}" width="${w * 1.32}" height="10" rx="3" fill="#FBF8F0" stroke="#D6CFBF" stroke-width="1.2"/><rect x="${w * .02}" y="${h * .5}" width="15" height="18" rx="3" fill="#F2F5F7" stroke="#93A7B2" stroke-width="1.5"/><rect x="${w * .74}" y="${h * 1.18}" width="18" height="12" rx="3" transform="rotate(52 ${w * .83} ${h * 1.24})" fill="#5B8DB8"/>`;
    if (ex.includes('cannula')) s += `<g fill="none" stroke="#BFE2E8" stroke-width="3" stroke-linecap="round"><path d="M ${-w * .98} ${h * .2} Q ${-w * .5} ${h * .5} -6 ${h * .42}"/><path d="M ${w * .98} ${h * .2} Q ${w * .5} ${h * .5} 6 ${h * .42}"/><path d="M -6 ${h * .42} L 6 ${h * .42}" stroke-width="3.4"/></g><path d="M -3 ${h * .42} v -4 M 3 ${h * .42} v -4" stroke="#BFE2E8" stroke-width="2.2" stroke-linecap="round"/>`;
    if (!sweatFirst) s += sweat;
    return s + `</g>`;
  }
  const CLOTH = { gown: ['#BCD3DA', '#8CAEBB'], navy: ['#2C4466', '#1E3150'], teal: ['#2E7C78', '#22605D'], grey: ['#6B7478', '#50585C'], blue: ['#3E6FA8', '#2F5584'], wine: ['#7A2E3E', '#5E2230'], coat: ['#F2F3EF', '#CDD3CC'], blouse: ['#E9D8C6', '#CDB9A3'], plum: ['#6D4A63', '#553A4D'], tee: ['#6F8394', '#566878'], sun: ['#E2A93E', '#BD8A2B'], hoodie: ['#34425A', '#263247'], flannel: ['#7C98B6', '#5E7A98'], onesie: ['#F2D98D', '#D6BC68'], onesie2: ['#A9D3E8', '#84B4CE'], rose: ['#C9677E', '#A44F64'] };
  function bodySVG(c, uid) {
    const { w, h } = c.head, T = h * 1.2, bw = c.body.w, [cl, cd] = CLOTH[c.body.cloth] || CLOTH.gown; let s = '';
    const torso = `M ${-bw} ${T + 32} C ${-bw} ${T + 6} ${-bw * .55} ${T} ${-w * .32} ${T} L ${w * .32} ${T} C ${bw * .55} ${T} ${bw} ${T + 6} ${bw} ${T + 32} L ${bw + 4} ${T + 240} L ${-bw - 4} ${T + 240} Z`;
    if (c.body.cloth === 'gown') s += `<pattern id="rgp${uid}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="${cl}"/><path d="M8 4 l3 4 -3 4 -3 -4z" fill="${cd}" opacity=".55"/></pattern>`;
    s += `<path d="${torso}" fill="${c.body.cloth === 'gown' ? `url(#rgp${uid})` : cl}" stroke="${shade(cl, -35)}" stroke-width="1.2"/>`;
    s += `<linearGradient id="rtg${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient><path d="${torso}" fill="url(#rtg${uid})"/>`
      + `<path d="M ${-bw * .92} ${T + 30} C ${-bw * .8} ${T + 12} ${-bw * .5} ${T + 8} ${-w * .4} ${T + 6}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".18"/><path d="M ${bw * .92} ${T + 30} C ${bw * .8} ${T + 12} ${bw * .5} ${T + 8} ${w * .4} ${T + 6}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".18"/>`;
    s += `<path d="M ${-w * .28} ${h * .55} L ${-w * .31} ${T + 3} L ${w * .31} ${T + 3} L ${w * .28} ${h * .55} Z" fill="${c.skin}"/><ellipse cx="0" cy="${h * .86}" rx="${w * .3}" ry="8" fill="${c.shade}" opacity=".55"/>`;
    s += `<g class="r-strain" opacity="0" stroke="${c.shade}" stroke-width="2.2" stroke-linecap="round"><path d="M ${-w * .2} ${h * .9} L ${-w * .3} ${T + 2}"/><path d="M ${w * .2} ${h * .9} L ${w * .3} ${T + 2}"/></g>`;
    const k = c.body.cloth;
    if (k === 'coat') s += `<path d="M ${-w * .46} ${T} L 0 ${T + 64} L ${w * .46} ${T} Z" fill="#A9C3D6"/><path d="M ${-w * .3} ${T} L 0 ${T + 26} L ${w * .3} ${T} Z" fill="${c.skin}"/><path d="M ${-w * .46} ${T} L -3 ${T + 66} L ${-w * .62} ${T + 80} L ${-w * .74} ${T + 8} Z" fill="${cd}"/><path d="M ${w * .46} ${T} L 3 ${T + 66} L ${w * .62} ${T + 80} L ${w * .74} ${T + 8} Z" fill="${cd}"/><rect x="${bw * .3}" y="${T + 76}" width="22" height="28" rx="3" fill="#fff" stroke="#9BB0BC"/><rect x="${bw * .3 + 4}" y="${T + 80}" width="14" height="8" rx="1" fill="#7AA8C4"/>`;
    else if (k === 'navy' || k === 'teal' || k === 'grey' || k === 'blue' || k === 'wine') s += `<path d="M ${-w * .34} ${T - 1} L 0 ${T + 32} L ${w * .34} ${T - 1}" fill="${c.skin}" stroke="${cd}" stroke-width="5" stroke-linejoin="round"/><rect x="${-bw * .62}" y="${T + 56}" width="30" height="24" rx="3" fill="${cd}"/><rect x="${bw * .3}" y="${T + 54}" width="20" height="27" rx="3" fill="#fff"/><rect x="${bw * .3 + 3}" y="${T + 58}" width="14" height="8" rx="1" fill="${cl}"/><path d="M ${-bw * .62 + 7} ${T + 56} v -9" stroke="#3B3B40" stroke-width="3" stroke-linecap="round"/>`;
    else s += `<path d="M ${-w * .31} ${T - 1} L 0 ${T + 22} L ${w * .31} ${T - 1} Z" fill="${c.skin}"/><path d="M ${-w * .31} ${T} L 0 ${T + 22} L ${w * .31} ${T}" stroke="${cd}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>`;
    if (c.body.lanyard) s += `<path d="M ${-w * .32} ${T} L -4 ${T + 70} M ${w * .32} ${T} L 4 ${T + 70}" stroke="#2E7C78" stroke-width="3"/><rect x="-11" y="${T + 70}" width="22" height="28" rx="3" fill="#fff" stroke="#9BB0BC"/>`;
    if (c.body.steth) s += `<g fill="none" stroke="#4A525A" stroke-width="3.4" stroke-linecap="round"><path d="M ${-w * .34} ${T + 2} C ${-w * .5} ${T + 62} ${-w * .1} ${T + 72} ${-w * .1} ${T + 104}"/><path d="M ${w * .34} ${T + 2} C ${w * .52} ${T + 40} ${w * .46} ${T + 60} ${w * .4} ${T + 74}"/></g><circle cx="${-w * .1}" cy="${T + 110}" r="7" fill="#9AA3AB" stroke="#4A525A" stroke-width="2"/>`;
    if (c.body.cardigan) { const cc = c.body.cardigan; [-1, 1].forEach((d) => { s += `<path d="M ${d * bw} ${T + 32} C ${d * bw} ${T + 6} ${d * bw * .55} ${T} ${d * w * .34} ${T} L ${d * 12} ${T + 240} L ${d * (bw + 4)} ${T + 240} Z" fill="${cc}" stroke="${shade(cc, -30)}" stroke-width="1.2"/>`; for (let i = 0; i < 3; i++) s += `<circle cx="${d * (w * .3 - (w * .3 - 14) * ((i * 34 + 40) / 240))}" cy="${T + 40 + i * 34}" r="2.8" fill="${shade(cc, -40)}"/>`; }); }
    if ((c.extras || []).includes('pearls')) s += `<path d="M ${-w * .3} ${T + 2} Q 0 ${T + 26} ${w * .3} ${T + 2}" stroke="#F4EFE4" stroke-width="3.6" stroke-dasharray=".1 6" stroke-linecap="round" fill="none"/>`;
    return s;
  }
  function armSVG(c) {
    const [cl] = CLOTH[c.body.cloth] || CLOTH.gown; let s = '';
    [-1, 1].forEach((d) => { s += `<g class="r-arm" data-s="${d}"><path class="r-skin" fill="none" stroke="${c.skin}" stroke-width="22" stroke-linecap="round"/><path class="r-mot" fill="none" stroke="#86679C" stroke-width="12" stroke-dasharray="2 6" stroke-linecap="round" opacity="0"/><path class="r-sleeve" fill="none" stroke="${c.body.cardigan || cl}" stroke-width="30" stroke-linecap="round"/><g class="r-hand"><ellipse rx="13.5" ry="11.5" fill="${c.skin}" stroke="${c.shade}" stroke-width="1.3"/><ellipse cx="${-d * 10}" cy="-5" rx="5" ry="7.5" fill="${c.skin}" stroke="${c.shade}" stroke-width="1.2"/><path d="M -6 6 v 4 M 0 7 v 4 M 6 6 v 4" stroke="${c.shade}" stroke-width="1.2" stroke-linecap="round"/></g></g>`; });
    return s;
  }
  function blanketSVG(c) {
    const B = c.head.h * 1.2 + 100;
    let s = `<g class="r-blanket"><path d="M -236 ${B + 10} C -140 ${B - 6} 140 ${B - 6} 236 ${B + 10} L 244 300 L -244 300 Z" style="fill:var(--scene-blanket)"/>`;
    if (c.legUp) s += `<path d="M 70 ${B + 34} C 110 ${B + 6} 190 ${B + 8} 226 ${B + 26} L 230 ${B + 60} L 72 ${B + 60} Z" style="fill:var(--scene-blanket)"/><path d="M 84 ${B + 30} C 120 ${B + 12} 180 ${B + 14} 214 ${B + 26}" style="stroke:var(--scene-blanket-2)" stroke-width="2" fill="none"/>`;
    s += `<path d="M -236 ${B + 10} C -140 ${B - 6} 140 ${B - 6} 236 ${B + 10}" style="stroke:var(--scene-sheet)" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M -150 ${B + 56} C -80 ${B + 46} -20 ${B + 62} 40 ${B + 54}" style="stroke:var(--scene-blanket-2)" stroke-width="2.4" fill="none"/><path d="M 60 ${B + 90} C 110 ${B + 82} 160 ${B + 92} 210 ${B + 84}" style="stroke:var(--scene-blanket-2)" stroke-width="2.4" fill="none"/></g>`;
    return s;
  }

  /* ---------- clinical inputs → expression ---------- */
  function derive(v, c) {
    const painF = clamp((v.pain - 3) / 6), splint = c.guard ? clamp((v.pain - 5) / 3) : 0, fever = clamp((v.temp - 37.7) / 1.3), rigors = (v.temp >= 39.2 || v.chills) ? 1 : 0;
    const tremorIn = clamp(v.tremor || 0), pale = clamp(v.pale || 0), anx = clamp(v.anxious || 0), sweatIn = clamp(v.sweat || 0);
    const lowBP = clamp((96 - v.sbp) / 24), mottle = clamp((80 - v.sbp) / 12), cyan = clamp((92 - v.spo2) / 8), hypoG = clamp((72 - v.glu) / 28);
    const dys = clamp(Math.max(clamp((v.rr - 22) / 12), cyan * .9)), lean = clamp(Math.max(v.lean || 0, Math.min((v.rr - 25) / 6, (93 - v.spo2) / 5)));
    const alertEff = Math.max(v.alert || 0, v.glu < 45 ? 2 : v.glu < 56 ? 1 : 0, v.sbp < 72 ? 2 : v.sbp < 84 ? 1 : 0, v.spo2 < 83 ? 1 : 0, v.rr < 10 ? (v.rr < 8 ? 2 : 1) : 0);
    const confused = (v.confused || v.glu < 56) && alertEff < 2, dizzy = (v.hr < 52 && v.sbp < 96 && alertEff < 2) ? 1 : 0, nausea = v.nausea ? 1 : 0;
    const postOpGuard = clamp(v.postOpGuard || 0), breathEffort = clamp(v.breathEffort || 0), rapport = clamp(v.rapport || 0);
    const comfort = 1 - clamp(painF + dys + hypoG + fever * .6 + lowBP + nausea + (confused ? .6 : 0) + dizzy + alertEff * .5 + lean + anx * .8 + tremorIn * .5 + rigors * .6);
    return { painF, splint, fever, rigors, lowBP, mottle, cyan, hypoG, dys, lean, alertEff, confused, dizzy, nausea, comfort, tremorIn, pale, anx, sweatIn, postOpGuard, breathEffort, rapport };
  }
  function targets(c, d) {
    const T = {};
    T.smile = clamp((c.smile || 0) * d.comfort + d.comfort * .2 - d.painF * .75 - d.dys * .45 - d.hypoG * .45 - d.nausea * .4 - d.dizzy * .3 - (d.confused ? .15 : 0) - d.anx * .45 - d.rigors * .3, -.8, 1);
    T.open = (d.alertEff === 2 ? .22 : 0) + d.painF * .1;
    T.worry = clamp(d.painF * .9 + d.hypoG * .75 + (d.confused ? .55 : 0) + d.dys * .7 + d.dizzy * .6 + d.nausea * .5 + d.anx * .75 + d.rigors * .4 - (d.alertEff === 2 ? .7 : 0));
    T.raise = d.confused ? .25 : 0;
    T.squint = clamp(d.painF * .6 + Math.max(0, T.smile) * .4 + d.nausea * .2);
    T.eye = [1, .5, .1][d.alertEff] * (1 - d.painF * .18) * (d.dizzy ? .78 : 1) * (c.tired ? .72 : 1);
    T.dil = clamp(d.hypoG + d.dys * .3 + d.anx * .35); T.flush = d.fever; T.pallor = clamp(Math.max(d.lowBP * .85, d.hypoG * .6, d.nausea * .3, d.cyan * .35, d.pale * .75));
    T.cyan = d.cyan; T.sweat = clamp(Math.max(d.hypoG, d.dys * .75, d.rigors * .5, d.painF > .8 ? .4 : 0, d.mottle * .85, d.fever > .7 ? .3 : 0, d.lean * .8, d.sweatIn));
    T.mottle = d.mottle; T.green = d.nausea; T.lean = d.lean; T.droop = [0, .3, 1][d.alertEff]; T.guard = d.splint; T.guard2 = c.guard && d.painF > .85 ? 1 : 0;
    T.pick = d.confused ? 1 : 0; T.tremor = Math.max(d.hypoG > .15 ? d.hypoG : 0, d.tremorIn); T.glassy = d.fever; T.strain = clamp(d.lean * .9 + d.dys * .35);
    // Single-patient v2 treatment: pain-related guarding, visible respiratory
    // effort and calm engagement follow patient state rather than random events.
    if (c.signature === 'marcus-v2') {
      const guard = clamp(d.postOpGuard), 0, 1);
      const effort = clamp(d.breathEffort), 0, 1);
      const rapport = clamp(d.rapport), 0, 1);
      T.guard = Math.max(T.guard, guard);
      T.guard2 = Math.max(T.guard2, guard * .55);
      T.strain = Math.max(T.strain, effort * .72);
      T.worry = clamp(T.worry + guard * .18 + effort * .24 - rapport * .24);
      T.smile = clamp(T.smile + rapport * .32 - guard * .12, -.8, 1);
      T.raise += rapport * .11;
    }
    return T;
  }
  const breathCurve = (p) => (p < .42 ? .5 - .5 * Math.cos(Math.PI * p / .42) : .5 + .5 * Math.cos(Math.PI * (p - .42) / .58));

  /* ---------- instances ---------- */
  function build(el, c, mode, ck, v) {
    const uid = ++UID;
    let s = '';
    if (mode === 'bed') s = `<g class="r-torso">${bodySVG(c, uid)}</g><g>${headSVG(c, uid)}</g>${blanketSVG(c)}<g>${armSVG(c)}</g>`;
    else if (mode === 'bust') s = `<g class="r-torso">${bodySVG(c, uid)}</g><g>${headSVG(c, uid)}</g>`;
    else s = `<g>${headSVG(c, uid)}</g>`;
    el.innerHTML = s;
    const q = (x) => el.querySelector(x), qa = (x) => [...el.querySelectorAll(x)];
    const { w, h } = c.head, T0 = h * 1.2;
    const I = {
      c, mode, ck, el, v: Object.assign({}, BASE, v || {}), w, h, T: T0, B: T0 + 100,
      eyes: qa('.r-iris').map((ir, i) => { const g = ir.parentNode.parentNode; return { s: i ? 1 : -1, iris: ir, pupil: g.querySelector('.r-pupil'), hl: g.querySelector('.r-hl'), lid: g.querySelector('.r-lid'), low: g.querySelector('.r-low'), lash: g.querySelector('.r-lash'), rx: c.eye, ry: c.eye * 1.12 }; }),
      brows: qa('.r-brow'), mouth: q('.r-mouth'), head: q('.r-head'), cheeks: q('.r-cheeks'), fh: q('.r-fh'), pallor: q('.r-pallor'), green: q('.r-green'), cyan: q('.r-cyan'), sheen: q('.r-sheen'), drops: qa('.r-drop'),
      torso: q('.r-torso'), strain: q('.r-strain'), blanket: q('.r-blanket'),
      arms: qa('.r-arm').map((a) => ({ s: +a.dataset.s, skin: a.querySelector('.r-skin'), mot: a.querySelector('.r-mot'), sleeve: a.querySelector('.r-sleeve'), hand: a.querySelector('.r-hand'), x: 0, y: 0 })),
      cur: null, micro: { next: now() + rand(3, 7), start: -9, kind: 0 }, sac: { x: 0, y: 0, next: 0 }, gaze: { x: 0, y: 0, tx: 0, ty: 0, next: 0 }, blink: { next: now() + rand(.5, 3), start: -9, dur: .15 }, phase: Math.random(), poke: -9, hover: false, seed: Math.random() * 10, yawn: { next: now() + rand(5, 10), start: -9 },
    };
    const prev = cache[ck];
    if (prev && prev.key === c.__key) {
      I.cur = Object.assign({}, prev.cur); I.phase = prev.phase; I.gaze = Object.assign({}, prev.gaze); I.blink = Object.assign({}, prev.blink); I.poke = prev.poke; I.yawn = Object.assign({}, prev.yawn);
      I.arms.forEach((a, i) => { if (prev.arms[i]) { a.x = prev.arms[i].x; a.y = prev.arms[i].y; } });
    } else {
      I.cur = targets(c, derive(I.v, c));
      I.arms.forEach((a) => { a.x = a.s * c.body.w * .64; a.y = I.B + 26; });
    }
    return I;
  }
  function remember(I) { cache[I.ck] = { key: I.c.__key, cur: I.cur, phase: I.phase, gaze: I.gaze, blink: I.blink, poke: I.poke, yawn: I.yawn, arms: I.arms.map((a) => ({ x: a.x, y: a.y })) }; }
  const now = () => performance.now() / 1000;
  let pointer = { x: 0, y: 0, t: -99 };
  if (typeof addEventListener === 'function') addEventListener('pointermove', (e) => { pointer = { x: e.clientX, y: e.clientY, t: now() }; }, { passive: true });

  function step(I, t, dt, frame) {
    const c = I.c, v = I.v, d = derive(v, c), T = targets(c, d), cur = I.cur, k = 1 - Math.exp(-dt * 5);
    const calm = reduced ? 0 : 1;
    const pe = Math.max(0, 1 - (t - I.poke) / 1.6);
    if (I.hover) { T.smile = Math.min(1, T.smile + .4); T.raise += .35; }
    if (pe > 0) { if (d.alertEff < 2) { T.raise += pe * .7; if (d.painF > .5) { T.squint += pe * .3; T.worry = clamp(T.worry + pe * .3); } else T.smile = Math.min(1, T.smile + pe * .35); } else T.eye += pe * .18; }
    let yawn = 0;
    if (c.tired && calm) { if (t > I.yawn.next) { I.yawn.start = t; I.yawn.next = t + rand(9, 15); } const yt = t - I.yawn.start; if (yt >= 0 && yt < 2.2) yawn = Math.sin(Math.PI * yt / 2.2); }
    // Small, human moments when they're comfortable: a brief smile, a raised brow, a glance.
    let micro = 0;
    if (calm && d.comfort > .55 && d.alertEff === 0) { const m = I.micro; if (t > m.next) { m.start = t; m.kind = Math.random() < .55 ? 0 : 1; m.next = t + rand(5, 11); } const mt = t - m.start; if (mt >= 0 && mt < 1.6) micro = Math.sin(Math.PI * mt / 1.6); if (micro) { if (I.micro.kind === 0) T.smile = Math.min(1, T.smile + micro * .3); else { T.raise += micro * .45; } } }
    if (yawn) { T.open += yawn * .95; T.eye *= 1 - yawn; T.raise += yawn * .5; T.smile = lerp(T.smile, 0, yawn); }
    for (const key in T) cur[key] = lerp(cur[key], T[key], k);
    I.phase = (I.phase + dt * Math.max(4, v.rr) / 60) % 1; const b = breathCurve(I.phase);
    const depth = (d.alertEff === 2 ? 1.2 : 1) * (1 - cur.guard * .55) * (v.rr > 26 ? .8 : 1) * (reduced ? .6 : 1);
    // Separate visible effort from measured respiratory rate. Diminished chest
    // excursion with pain remains plausible and is never used for scoring.
    const breathEffort = c.signature === 'marcus-v2' ? d.breathEffort : 0;
    // gaze
    const g = I.gaze, attentive = d.alertEff === 0 && !d.confused && !d.dizzy;
    if (attentive && (now() - pointer.t < 3 || I.hover)) {
      if (frame % 6 === 0 || !I.hc) { const r = I.head.getBoundingClientRect(); I.hc = [r.left + r.width / 2, r.top + r.height / 2]; }
      let dx = (pointer.x - I.hc[0]) / 260, dy = (pointer.y - I.hc[1]) / 260; const L = Math.hypot(dx, dy); if (L > 1) { dx /= L; dy /= L; } g.tx = dx; g.ty = dy;
    } else if (t > g.next) {
      if (d.confused) { g.tx = rand(-1, 1); g.ty = rand(-.6, .6); g.next = t + rand(.35, 1); }
      else if (d.alertEff >= 1 || d.dizzy) { g.tx = rand(-.3, .3); g.ty = rand(.3, .8); g.next = t + rand(2, 4); }
      else { if (Math.random() < .35) { g.tx = 0; g.ty = 0; } else { g.tx = rand(-.7, .7); g.ty = rand(-.35, .35); } g.next = t + rand(1.2, 3.6); }
    }
    if (pe > 0 && d.alertEff < 2) { g.tx = 0; g.ty = 0; }
    const gk = 1 - Math.exp(-dt * (reduced ? 6 : 16)); g.x = lerp(g.x, g.tx, gk); g.y = lerp(g.y, g.ty, gk);
    const sc = I.sac; if (calm && t > sc.next) { sc.x = rand(-.08, .08); sc.y = rand(-.06, .06); sc.next = t + rand(.4, 1.1); }
    // blink
    const bl = I.blink, drowsy = d.alertEff >= 1 || c.tired;
    if (t > bl.next) { bl.start = t; bl.dur = drowsy ? .4 : .15; bl.next = t + (drowsy ? rand(1.4, 3) : d.confused ? rand(1, 2.5) : rand(2.4, 6)); if (Math.random() < .14) bl.next = t + .3; }
    const bt = t - bl.start, blink = bt >= 0 && bt < bl.dur ? Math.sin(Math.PI * bt / bl.dur) : 0;
    const openAmt = clamp(cur.eye * (1 - blink) * (1 - Math.max(0, g.y) * .14)), maxOff = 2.8 + (c.eye - 9.5) * .3;
    I.eyes.forEach((e) => {
      const { rx, ry } = e, lidY = lerp(-ry * 1.02, ry * .94, 1 - openAmt), lowY = ry - cur.squint * ry * .7;
      e.lid.setAttribute('height', Math.max(0, lidY + ry + 3));
      e.low.setAttribute('y', lowY); e.low.setAttribute('height', Math.max(0, ry + 3 - lowY));
      const cy = Math.max(-ry * .08, lidY), hw = lidY < -ry * .08 ? rx + 1.2 : rx * Math.sqrt(Math.max(0, 1 - (cy / ry) ** 2)) + 1.4;
      const apex = lidY + (openAmt < .3 ? 3.2 * (1 - openAmt / .3) : 0);
      e.lash.setAttribute('d', `M ${-e.s * hw} ${cy} Q 0 ${2 * apex - cy} ${e.s * hw} ${cy} L ${e.s * (hw + 2.4)} ${cy - 1.8}`);
      e.iris.setAttribute('transform', `translate(${(g.x + I.sac.x) * maxOff} ${(g.y + I.sac.y) * maxOff * .8 + cur.droop * 1.5})`);
      const ir = rx * .8; e.pupil.setAttribute('r', ir * .46 * (1 + cur.dil * .42)); e.hl.setAttribute('r', ir * .32 * (1 + cur.glassy * .35));
    });
    const by = I.h * .1 - c.eye * 1.12 - 8;
    I.brows.forEach((br) => { const s = +br.dataset.s, ang = cur.worry * 16 - cur.smile * 2; br.setAttribute('transform', `translate(${s * I.w * .4 - s * cur.worry * 2} ${by - cur.raise * 4 + cur.worry * 1.5}) rotate(${s * ang})`); });
    // mouth
    const gasp = cur.strain > .05 || v.rr > 24 ? clamp(cur.strain * .8 + (v.rr - 24) / 20) * (.35 + .65 * b) : 0;
    const chatter = d.rigors && d.alertEff < 2 && calm ? (Math.sin(t * 38) > 0 ? .1 : 0) : 0;
    const open = clamp(cur.open + gasp + chatter), sm = cur.smile, mw = 18 + Math.max(0, sm) * 6 + cur.guard * 5 + open * 3;
    const my = -sm * 4.6, up = sm * 5.6 - open * 2, lo = sm * 5.6 + open * 17;
    const fd = clamp(v.facial || 0);   // facial droop: the patient's right corner (viewer's left) sags
    I.mouth.setAttribute('d', `M ${-mw / 2} ${my + fd * 7} Q 0 ${up + fd * 2.5} ${mw / 2} ${my} Q 0 ${lo + fd * 2.5} ${-mw / 2} ${my + fd * 7} Z`);
    I.mouth.setAttribute('stroke', mix(c.lip, '#5D6FA6', cur.cyan * .8));
    I.cheeks.setAttribute('opacity', .5 + cur.flush * .45); I.fh.setAttribute('opacity', cur.flush * .18);
    I.pallor.setAttribute('opacity', cur.pallor * .55); I.green.setAttribute('opacity', cur.green * .24); I.cyan.setAttribute('opacity', cur.cyan * .5);
    I.sheen.setAttribute('opacity', cur.sweat * .32);
    I.drops.forEach((dr, i) => { const f = ((t * .22 + i * .37) % 1); dr.setAttribute('opacity', cur.sweat > .08 ? cur.sweat * (1 - f * .7) : 0); dr.setAttribute('transform', `translate(${dr.dataset.x} ${+dr.dataset.y + f * 12 * calm})`); });
    // motion
    const shiv = d.rigors && d.alertEff < 2 ? calm : 0, jx = shiv * Math.sin(t * 47) * 1.3, jy = shiv * Math.cos(t * 53) * .8, trem = cur.tremor * calm;
    const idle = calm * (1 - cur.droop * .6), sway = d.dizzy * calm;
    const rot = Math.sin(t * .45 + I.seed) * (c.signature === 'marcus-v2' ? .8 : 1.6) * idle + g.x * 3 * idle + cur.droop * 9 + sway * Math.sin(t * 1.25) * 6 - yawn * 5;
    const hxp = Math.sin(t * .6 + I.seed) * 1.2 * idle + g.x * 2.2 * idle + sway * Math.sin(t * 1.25) * 4 + jx + trem * Math.sin(t * 61) * .6;
    const P = I.B + 40, gain = I.mode === 'bed' ? .032 : .018, riseAmt = (P - I.T) * gain * b * depth;
    const hyp = -riseAmt + cur.droop * 8 + cur.lean * 13 + jy - pe * (d.alertEff < 2 ? 3 : 0) - yawn * 3 + breathEffort * Math.sin(I.phase * Math.PI * 2) * .8 * calm;
    I.head.setAttribute('transform', `translate(${hxp} ${hyp}) rotate(${rot} 0 ${I.h * .8}) scale(${1 + cur.lean * .06})`);
    if (I.torso) { const sy = 1 + gain * b * depth + cur.lean * .04, sx = 1 + .015 * b * depth + cur.lean * .03; I.torso.setAttribute('transform', `translate(${jx} ${jy}) translate(0 ${P}) scale(${sx} ${sy}) translate(0 ${-P})`); }
    if (I.strain) I.strain.setAttribute('opacity', cur.strain * (.6 + .4 * b));
    if (I.blanket) I.blanket.setAttribute('transform', `translate(0 ${-b * depth * 1.4})`);
    if (I.arms.length) {
      const bw = c.body.w, B = I.B, T0 = I.T;
      I.arms.forEach((a) => {
        const s = a.s; let tx = s * bw * .64, ty = B + 26;
        if (s === 1) { tx = lerp(tx, bw * .12, cur.guard); ty = lerp(ty, B + 16, cur.guard); }
        if (s === -1) {
          tx = lerp(tx, -bw * .2, cur.guard2); ty = lerp(ty, B + 22, cur.guard2);
          if (cur.pick > .02) { tx = lerp(tx, -bw * .74 + Math.sin(t * 3.1) * 9 * calm, cur.pick); ty = lerp(ty, B + 22 - Math.abs(Math.sin(t * 6.2)) * 5 * calm, cur.pick); }
        }
        tx = lerp(tx, s * bw * .42, cur.lean); ty = lerp(ty, B + 40, cur.lean);
        if (s === -1 && v.facial) { tx = lerp(tx, -bw * .72, clamp(v.facial)); ty = lerp(ty, B + 38, clamp(v.facial)); }   // weak right arm lies still
        const ak = 1 - Math.exp(-dt * 4); a.x = lerp(a.x, tx, ak); a.y = lerp(a.y, ty, ak);
        const hxh = a.x + trem * Math.sin(t * 57 + s) * 1.8 + jx, hyh = a.y + trem * Math.cos(t * 63 + s) * 1.4 + jy;
        const Sx = s * bw * .84, Sy = T0 + 24 - riseAmt - cur.lean * 7, Ex = (Sx + hxh) / 2 + s * 24, Ey = (Sy + hyh) / 2 + 8;
        const tt = .38, mx1 = lerp(Sx, Ex, tt), my1 = lerp(Sy, Ey, tt), mx2 = lerp(Ex, hxh, tt), my2 = lerp(Ey, hyh, tt), px = lerp(mx1, mx2, tt), py = lerp(my1, my2, tt);
        const dd = `M ${Sx} ${Sy} Q ${Ex} ${Ey} ${hxh} ${hyh}`; a.skin.setAttribute('d', dd); a.mot.setAttribute('d', dd); a.mot.setAttribute('opacity', cur.mottle * .75);
        a.sleeve.setAttribute('d', `M ${Sx} ${Sy} Q ${mx1} ${my1} ${px} ${py}`);
        a.hand.setAttribute('transform', `translate(${hxh} ${hyh})`);
      });
    }
  }

  /* ---------- public API ---------- */
  const VB = { icon: '-78 -96 156 160', bust: '-110 -112 220 232' };
  const enc = (v) => (v ? encodeURIComponent(JSON.stringify(v)) : '');
  function define(key, spec) { spec.__key = key; CH[key] = spec; Object.keys(stills).forEach((k) => { if (k.startsWith(key + '|')) delete stills[k]; }); }
  function has(key) { return !!CH[key]; }
  /* Placeholder markup; hydrate() turns it into a live character. */
  function icon(key, v, cls) {
    if (!CH[key]) return `<svg class="${cls || 'portrait'}" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="30" fill="var(--line)"/><path d="M42 34h16M44 34v14l-9 16h30l-9-16V34" stroke="var(--ink-2)" stroke-width="3.5" fill="none" stroke-linejoin="round"/></svg>`;
    return `<svg class="${cls || 'portrait'}" viewBox="${VB.icon}" aria-hidden="true" data-rig="${key}" data-mode="icon" data-v="${enc(v)}"></svg>`;
  }
  /* A portrait that never moves (shift-picker cards): drawn once, then reused as plain markup, so a screen full of
     faces costs nothing per frame and almost nothing per redraw. */
  const stills = {};
  function still(key, cls, vb) {
    const k = key + '|' + (vb || VB.bust), head = `<svg class="${cls || 'portrait'}" viewBox="${vb || VB.bust}" preserveAspectRatio="xMidYMax meet" aria-hidden="true"`;
    return stills[k] ? `<img class="${cls || 'portrait'}" src="${stills[k]}" alt="" aria-hidden="true" decoding="async">` : `${head} data-rig="${key}" data-mode="bust" data-still="${k}"></svg>`;
  }
  function bust(key, v, cls, vb) { return `<svg class="${cls || 'portrait'}" viewBox="${vb || VB.bust}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" data-rig="${key}" data-mode="bust" data-v="${enc(v)}"></svg>`; }
  function place(key, mode, v, transform, ck) { return `<g data-rig="${key}" data-mode="${mode}" data-v="${enc(v)}" transform="${transform}"${ck ? ` data-ck="${ck}"` : ''}></g>`; }
  /* Stills below the fold wait until they're about to scroll into view, so the first screen draws only the faces
     you can see. Once drawn, a still is plain markup for the rest of the visit. */
  let io = null;
  function one(el, seen) {
    const key = el.dataset.rig, mode = el.dataset.mode || 'icon', c = CH[key]; if (!c) return;
    let ck = el.dataset.ck || key + ':' + mode; seen[ck] = (seen[ck] || 0) + 1; if (seen[ck] > 1) ck += ':' + seen[ck];
    let target = el; if (el.tagName.toLowerCase() === 'svg') { target = document.createElementNS('http://www.w3.org/2000/svg', 'g'); el.appendChild(target); }
    let v = {}; try { v = el.dataset.v ? JSON.parse(decodeURIComponent(el.dataset.v)) : {}; } catch (e) {}
    const I = build(target, c, mode, ck, v);
    step(I, now(), 1 / 60, 0);
    if (el.dataset.still) { const x = el.cloneNode(true); x.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); x.removeAttribute('class'); x.removeAttribute('data-rig'); x.removeAttribute('data-still'); stills[el.dataset.still] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(x)); el.removeAttribute('data-rig'); return; }
    live.push(I);
  }
  function hydrate(root) {
    live.forEach(remember); live = [];
    if (io) { io.disconnect(); io = null; }
    const seen = {}, vh = window.innerHeight || 800, lazy = typeof IntersectionObserver === 'function';
    root.querySelectorAll('[data-rig]').forEach((el) => {
      if (lazy && el.dataset.still && !stills[el.dataset.still] && el.getBoundingClientRect().top > vh * 1.4) {
        if (!io) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && e.target.dataset.rig) { io.unobserve(e.target); one(e.target, {}); } }), { rootMargin: '500px 0px' });
        io.observe(el); return;
      }
      one(el, seen);
    });
    if (!running && live.length) { running = true; last = now(); requestAnimationFrame(loop); }
  }
  /* Budget: characters step at 30 fps (12 in lite mode), and only the ones on screen. Breathing and blinking
     read the same at 30 as at 60, at half the cost. */
  let last = 0, frame = 0, fps = 30;
  function loop() {
    if (!live.length) { running = false; return; }
    const t = now();
    if (t - last >= 1 / fps - .003) {
      const dt = Math.min(.12, t - last); last = t; frame++;
      if (frame % 12 === 1) live.forEach((I) => { if (!I.el.isConnected) { I.vis = false; return; } const r = I.el.getBoundingClientRect(); I.vis = r.width > 0 && r.bottom > -40 && r.top < innerHeight + 40 && r.right > -40 && r.left < innerWidth + 40; });
      for (const I of live) { if (I.vis !== false && I.el.isConnected) step(I, t, dt, frame); }
    }
    requestAnimationFrame(loop);
  }
  function setPower(p) { fps = p === 'lite' ? 12 : 30; }
  const stats = () => ({ live: live.length, onscreen: live.filter((I) => I.vis !== false && I.el.isConnected).length, fps });
  function find(ck) { return live.find((I) => I.ck === ck || I.ck.startsWith(ck + ':')); }
  function poke(ck) { const I = find(ck); if (I) { I.poke = now(); remember(I); } }
  function hover(ck, on) { const I = find(ck); if (I) I.hover = on; }
  /* What a character says when you speak to them, chosen from their current state. */
  function say(key, v) {
    const c = CH[key]; if (!c || !c.lines) return null;
    const d = derive(Object.assign({}, BASE, v || {}), c), L = c.lines;
    if (d.alertEff === 2) return { quiet: true, text: L.none };
    const pick = (k) => L[k] && { text: L[k] };
    return (d.dys > .5 && pick('dys')) || (d.hypoG > .15 && pick('hypo')) || (d.rigors && pick('chills')) || (d.anx > .4 && pick('anxious')) || (d.tremorIn > .3 && pick('shaky')) || (d.dizzy && pick('dizzy')) || (d.confused && pick('confused')) || (d.painF > .4 && pick('pain')) || (d.nausea && pick('nausea')) || (d.fever > .4 && pick('fever')) || (d.alertEff === 1 && pick('drowsy')) || (d.dys > .3 && pick('dys')) || { text: L.calm };
  }
  function setReduced(on) { reduced = !!on || osReduced; }
  setReduced(false);
  S.rig = { define, has, icon, bust, still, place, hydrate, poke, hover, say, setReduced, setPower, stats, derive, BASE };
})(window.Shift);
