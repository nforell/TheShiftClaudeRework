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
      case 'long':
        back = `<path d="M ${-w * 1.1} ${-h * .2} C ${-w * 1.22} ${-h * 1.22} ${w * 1.22} ${-h * 1.22} ${w * 1.1} ${-h * .2} L ${w * 1.2} ${h * 1.45} L ${-w * 1.2} ${h * 1.45} Z" fill="${col}"/>`;
        front = `<path d="M ${-w * 1.03} ${h * .05} C ${-w * 1.03} ${-h * .8} ${-w * .56} ${-h * 1.06} 0 ${-h * 1.06} C ${w * .56} ${-h * 1.06} ${w * 1.03} ${-h * .8} ${w * 1.03} ${h * .05} L ${w * .86} ${h * .05} C ${w * .82} ${-h * .3} ${w * .62} ${-h * .44} ${w * .36} ${-h * .42} L ${w * .18} ${-h * .32} L ${w * .02} ${-h * .44} L ${-w * .2} ${-h * .32} L ${-w * .42} ${-h * .44} C ${-w * .7} ${-h * .42} ${-w * .84} ${-h * .3} ${-w * .86} ${h * .05} Z" fill="${col}"/>`; break;
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
        const dk2 = shade(col, -18), lt2 = shade(col, 22);
        back = `<path d="M ${-w * 1.16} ${h * .2} C ${-w * 1.28} ${-h * 1.28} ${w * 1.28} ${-h * 1.28} ${w * 1.16} ${h * .2} L ${w * 1.1} ${h * 1.45} L ${-w * 1.1} ${h * 1.45} Z" fill="${dk2}"/>`;
        front = `<path d="M ${-w * 1.12} ${h * .98} C ${-w * 1.24} ${-h * 1.24} ${w * 1.24} ${-h * 1.24} ${w * 1.12} ${h * .98} L ${w * .8} ${h * .82} C ${w * .96} ${h * .1} ${w * .82} ${-h * .64} 0 ${-h * .68} C ${-w * .82} ${-h * .64} ${-w * .96} ${h * .1} ${-w * .8} ${h * .82} Z" fill="${col}"/>`
          + `<path d="M ${-w * .82} ${h * .8} Q 0 ${h * 1.3} ${w * .82} ${h * .8} L ${w * 1.1} ${h * 1.5} Q 0 ${h * 1.75} ${-w * 1.1} ${h * 1.5} Z" fill="${col}"/>`
          + `<path d="M ${-w * .74} ${-h * .5} C ${-w * .3} ${-h * .78} ${w * .3} ${-h * .78} ${w * .74} ${-h * .5}" stroke="${lt2}" stroke-width="2" fill="none" opacity=".7"/><path d="M ${w * .9} ${h * .9} Q ${w * .4} ${h * 1.35} ${-w * .2} ${h * 1.42}" stroke="${dk2}" stroke-width="1.6" fill="none" opacity=".7"/>`;
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
  /* Human proportions. The case gives a head size and a few traits; geo() turns them into an adult (or child) face:
     an oval head, eyes on the midline one eye-width apart, brows above, nose and mouth in thirds, a real neck,
     sloped shoulders. Cached on the spec. */
  function geo(c) {
    if (c.__g) return c.__g;
    const kid = c.small ? 1 : 0, w = c.head.w, h = c.head.h, jaw = c.head.jaw || 0;
    const hw = w * (kid ? .9 : .82), hh = h * (kid ? .98 : 1.02), ew = c.eye * .92, eh = ew * (kid ? .68 : .62);
    const ey = hh * (kid ? .14 : .06), G = { kid, hw, hh, jaw, ew, eh, ey, ex: hw * (kid ? .4 : .41), ir: ew * (kid ? .56 : .5), nb: hh * (kid ? .48 : .46), my: hh * (kid ? .7 : .655), T: hh * (kid ? 1.2 : 1.3), bw: c.body.w * 1.1, u: hw / 45 };
    G.nw = hw * (kid ? .5 : .42 + c.body.w * .0018); G.by = ey - eh - ew * .72; G.nose = ew * (kid ? .5 : .62);
    return (c.__g = G);
  }
  function jawPts(G) { const { hw, hh, jaw, kid } = G; return { jx: hw * (kid ? .9 : .8 + .12 * jaw), jy: hh * (kid ? .46 : .54 + .06 * jaw), cw: hw * (kid ? .38 : .2 + .14 * jaw) }; }
  function faceD(G) {
    const { hw, hh } = G, { jx, jy, cw } = jawPts(G);
    return `M 0 ${-hh} C ${hw * .6} ${-hh} ${hw} ${-hh * .64} ${hw} ${-hh * .1} C ${hw} ${hh * .2} ${jx * 1.03} ${jy - hh * .14} ${jx} ${jy} C ${jx * .92} ${jy + hh * .22} ${cw * 1.7} ${hh * .97} ${cw} ${hh * .99} Q 0 ${hh * 1.03} ${-cw} ${hh * .99} C ${-cw * 1.7} ${hh * .97} ${-jx * .92} ${jy + hh * .22} ${-jx} ${jy} C ${-jx * 1.03} ${jy - hh * .14} ${-hw} ${hh * .2} ${-hw} ${-hh * .1} C ${-hw} ${-hh * .64} ${-hw * .6} ${-hh} 0 ${-hh} Z`;
  }
  function beardD(G) {
    const { hw, hh } = G, { jx, jy, cw } = jawPts(G), o = 1.05;
    return `M ${-hw * o} ${-hh * .08} C ${-hw * o} ${hh * .2} ${-jx * 1.03 * o} ${jy - hh * .14} ${-jx * o} ${jy} C ${-jx * .92 * o} ${jy + hh * .24} ${-cw * 1.7} ${hh * 1.05} ${-cw} ${hh * 1.08} Q 0 ${hh * 1.13} ${cw} ${hh * 1.08} C ${cw * 1.7} ${hh * 1.05} ${jx * .92 * o} ${jy + hh * .24} ${jx * o} ${jy} C ${jx * 1.03 * o} ${jy - hh * .14} ${hw * o} ${hh * .2} ${hw * o} ${-hh * .08}`
      + ` L ${hw * .88} ${-hh * .08} C ${hw * .84} ${hh * .3} ${hw * .56} ${hh * .38} ${hw * .42} ${hh * .5} C ${hw * .38} ${hh * .92} ${-hw * .38} ${hh * .92} ${-hw * .42} ${hh * .5} C ${-hw * .56} ${hh * .38} ${-hw * .84} ${hh * .3} ${-hw * .88} ${-hh * .08} Z`;
  }
  function mustacheD(G, big) {
    const { ew, nb, my } = G, k = big ? 1 : .88, top = nb + ew * .22, bot = my - ew * .32;
    return `M 0 ${top} C ${-ew * .7} ${top - ew * .12} ${-ew * 1.8 * k} ${top + ew * .2} ${-ew * 2.05 * k} ${bot + ew * .55} C ${-ew * 1.4} ${bot + ew * .05} ${-ew * .7} ${bot - ew * .02} 0 ${bot + ew * .04} C ${ew * .7} ${bot - ew * .02} ${ew * 1.4} ${bot + ew * .05} ${ew * 2.05 * k} ${bot + ew * .55} C ${ew * 1.8 * k} ${top + ew * .2} ${ew * .7} ${top - ew * .12} 0 ${top} Z`;
  }
  /* An almond eye in its own coordinates: inner corner a touch lower than the outer one. */
  function eyeP(G, s) {
    const { ew, eh } = G, P = { s, Ix: -s * ew, Iy: eh * .16, Ox: s * ew, Oy: -eh * .1, u1: [-s * ew * .5, -eh * 1.2], u2: [s * ew * .45, -eh * 1.3], l1: [s * ew * .5, eh * .95], l2: [-s * ew * .45, eh * 1.05] };
    P.almond = `M ${P.Ix} ${P.Iy} C ${P.u1} ${P.u2} ${P.Ox} ${P.Oy} C ${P.l1} ${P.l2} ${P.Ix} ${P.Iy} Z`;
    P.crease = `M ${P.Ix * .8} ${P.Iy - eh * .95} C ${P.u1[0]} ${-eh * 2.05} ${P.u2[0]} ${-eh * 2.15} ${P.Ox * 1.04} ${P.Oy - eh * .75}`;
    return P;
  }
  /* A lid curve squashed toward the line between the corners: f = 1 is the open lid, negative folds it down. */
  function lidPts(P, f, upper) {
    const base = (x) => P.Iy + (P.Oy - P.Iy) * ((x - P.Ix) / (P.Ox - P.Ix)), a = upper ? P.u1 : P.l1, b = upper ? P.u2 : P.l2;
    return [[a[0], base(a[0]) + (a[1] - base(a[0])) * f], [b[0], base(b[0]) + (b[1] - base(b[0])) * f]];
  }
  function eyeSVG(c, G, uid, s) {
    const P = eyeP(G, s), { ir, eh } = G, lid = mix(c.skin, c.shade, .3);
    return `<g transform="translate(${s * G.ex} ${G.ey})"><clipPath id="rec${uid}${s}"><path d="${P.almond}"/></clipPath>
      <path d="${P.almond}" fill="url(#rsc${uid})"/>
      <g clip-path="url(#rec${uid}${s})"><g class="r-iris"><circle r="${ir}" fill="url(#rir${uid})"/><circle r="${ir}" fill="none" stroke="${shade(c.iris, -45)}" stroke-width="${Math.max(.8, ir * .14)}" opacity=".85"/><circle class="r-pupil" r="${ir * .42}" fill="#0E0806"/><circle class="r-hl" cx="${-ir * .34}" cy="${-ir * .36}" r="${ir * .27}" fill="#fff" opacity=".95"/><circle cx="${ir * .38}" cy="${ir * .3}" r="${ir * .1}" fill="#fff" opacity=".6"/></g>
      <path class="r-lsh" fill="none" stroke="${c.shade}" stroke-width="${eh * .75}" opacity=".3"/><path class="r-lid" fill="${lid}"/><path class="r-low" fill="${lid}"/></g>
      <path class="r-crease" d="${P.crease}" stroke="${c.shade}" stroke-width="1.15" fill="none" stroke-linecap="round" opacity=".5"/>
      <path class="r-llash" fill="none" stroke="${c.shade}" stroke-width="1" stroke-linecap="round" opacity=".6"/>
      <path class="r-lash" fill="none" stroke="#22170F" stroke-width="${G.kid ? 1.5 : 1.75}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }
  function browD(G, c) { const L = G.ew * 1.25, th = c.brow.w * (G.kid ? .72 : .85); return `M ${-L} ${-th * .3} C ${-L * .45} ${-th * 1.25} ${L * .25} ${-th * 1.7} ${L} ${th * .15} C ${L * .35} ${-th * .72} ${-L * .45} ${-th * .12} ${-L} ${th * .62} Z`; }
  function headSVG(c, uid) {
    const G = geo(c), { hw, hh, ew, eh, ex, ey, nb, my, kid } = G, face = faceD(G), H = hair(Object.assign({}, c, { head: { w: hw, h: hh } })), xs = c.extras || [];
    const sk = c.skin, sh = c.shade, soft = mix(sh, sk, .3), dk = shade(sh, -35), nz = G.nose;
    let s = `<g class="r-head">` + H.back;
    s += `<radialGradient id="rsk${uid}" cx=".4" cy=".36" r=".8"><stop offset="0" stop-color="${shade(sk, 14)}"/><stop offset=".55" stop-color="${sk}"/><stop offset="1" stop-color="${mix(sk, sh, .5)}"/></radialGradient>`
      + `<radialGradient id="rbl${uid}"><stop offset="0" stop-color="${c.blush}" stop-opacity=".9"/><stop offset=".6" stop-color="${c.blush}" stop-opacity=".35"/><stop offset="1" stop-color="${c.blush}" stop-opacity="0"/></radialGradient>`
      + `<radialGradient id="rso${uid}"><stop offset="0" stop-color="${sh}" stop-opacity=".4"/><stop offset=".6" stop-color="${sh}" stop-opacity=".16"/><stop offset="1" stop-color="${sh}" stop-opacity="0"/></radialGradient>`
      + `<radialGradient id="rsc${uid}" cx=".45" cy=".4" r=".65"><stop offset="0" stop-color="#FBF8F3"/><stop offset=".7" stop-color="#F1EBE3"/><stop offset="1" stop-color="${mix('#E4D9CE', sh, .25)}"/></radialGradient>`
      + `<radialGradient id="rir${uid}" cy=".58" r=".6"><stop offset="0" stop-color="${shade(c.iris, 30)}"/><stop offset=".55" stop-color="${c.iris}"/><stop offset="1" stop-color="${shade(c.iris, -28)}"/></radialGradient>`;
    // ears, from brow to nose base
    const ecy = (G.by + nb) / 2, ery = (nb - G.by) * .5, erx = hw * .12;
    s += `<g class="r-ears">`;
    [-1, 1].forEach((d) => {
      const lx = d * (hw * .97 + erx * .35), ly = ecy + ery * .86;
      s += `<g transform="translate(${d * hw * .97} ${ecy}) rotate(${d * 7})"><ellipse cx="${d * erx * .35}" rx="${erx}" ry="${ery}" fill="${sk}" stroke="${soft}" stroke-width="1.1"/><ellipse cx="${d * erx * .3}" cy="${-ery * .05}" rx="${erx * .45}" ry="${ery * .5}" fill="${sh}" opacity=".38"/><path d="M ${d * erx * .05} ${-ery * .66} C ${d * erx * 1.05} ${-ery * .72} ${d * erx * 1.1} ${ery * .3} ${d * erx * .3} ${ery * .64}" stroke="${sh}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".75"/></g>`;
      if (xs.includes('hoops')) s += `<circle cx="${lx}" cy="${ly + 5}" r="5.5" fill="none" stroke="#D4A941" stroke-width="1.8"/>`;
      if (xs.includes('gold')) s += `<circle cx="${lx}" cy="${ly}" r="2.6" fill="#D4A941"/>`;
      if (xs.includes('pearls')) s += `<circle cx="${lx}" cy="${ly}" r="3" fill="#F7F3EA" stroke="#CFC7B8" stroke-width=".8"/>`;
      if (xs.includes('studs')) s += `<circle cx="${lx}" cy="${ly}" r="2" fill="#9FC7D6"/>`;
    });
    s += `</g>`;
    // the face, lit from the upper left
    s += `<clipPath id="rfc${uid}"><path d="${face}"/></clipPath><path d="${face}" fill="url(#rsk${uid})" stroke="${soft}" stroke-width="1.1"/>`;
    s += `<linearGradient id="rsd${uid}"><stop offset="0" stop-color="${sh}" stop-opacity=".14"/><stop offset=".2" stop-color="${sh}" stop-opacity="0"/><stop offset=".56" stop-color="${sh}" stop-opacity="0"/><stop offset="1" stop-color="${sh}" stop-opacity=".42"/></linearGradient><radialGradient id="rhl${uid}"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`
      + `<g clip-path="url(#rfc${uid})"><rect x="${-hw}" y="${-hh}" width="${hw * 2}" height="${hh * 2.1}" fill="url(#rsd${uid})"/><ellipse cx="${-hw * .25}" cy="${-hh * .42}" rx="${hw * .5}" ry="${hh * .26}" fill="url(#rhl${uid})"/><ellipse cx="${-hw * .5}" cy="${hh * .2}" rx="${hw * .26}" ry="${hh * .13}" fill="url(#rhl${uid})"/><ellipse cx="${-ew * .1}" cy="${hh * .84}" rx="${hw * .2}" ry="${hh * .08}" fill="url(#rhl${uid})"/>`
      + `<ellipse class="r-fh" cx="0" cy="${-hh * .5}" rx="${hw * .75}" ry="${hh * .3}" fill="#E0503F" opacity="0"/><path class="r-pallor" d="${face}" fill="#CDD6D3" opacity="0"/><path class="r-green" d="${face}" fill="#A5C58B" opacity="0"/>`
      + (c.hair.style !== 'balding' ? `<ellipse cx="${hw * .06}" cy="${-hh * .62}" rx="${hw * 1.05}" ry="${hh * .17}" fill="${shade(sh, -25)}" opacity=".16"/>` : '')
      + `<ellipse cx="0" cy="${hh * 1.02}" rx="${hw * .62}" ry="${hh * .16}" fill="${sh}" opacity=".22"/></g>`;
    // features move together when the head turns
    s += `<g class="r-feat">`;
    [-1, 1].forEach((d) => { s += `<ellipse cx="${d * ex}" cy="${ey - eh * .35}" rx="${ew * 1.65}" ry="${eh * 2.1}" fill="url(#rso${uid})"/>`; });
    s += `<g class="r-cheeks"><ellipse cx="${-hw * .52}" cy="${hh * .34}" rx="${hw * .26}" ry="${hh * .13}" fill="url(#rbl${uid})"/><ellipse cx="${hw * .52}" cy="${hh * .34}" rx="${hw * .26}" ry="${hh * .13}" fill="url(#rbl${uid})"/></g>`;
    if (!kid) [-1, 1].forEach((d) => { s += `<path d="M ${d * ex - ew * .75} ${ey + eh * 1.25} Q ${d * ex} ${ey + eh * 2.05} ${d * ex + ew * .75} ${ey + eh * 1.25}" stroke="${sh}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity="${c.tired ? .5 : .2}"/>`; });
    if (xs.includes('freckles')) [[-.52, .22], [-.42, .29], [-.62, .3], [-.5, .36], [-.18, .24], [.52, .22], [.42, .29], [.62, .3], [.5, .36], [.18, .24], [0, .26]].forEach(([x, y]) => { s += `<circle cx="${x * hw}" cy="${y * hh}" r="1.1" fill="${sh}" opacity=".8"/>`; });
    if (xs.includes('wrinkles')) s += `<g stroke="${sh}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".6"><path d="M ${-hw * .38} ${-hh * .42} q ${hw * .38} -4 ${hw * .76} 0"/><path d="M ${-hw * .28} ${-hh * .32} q ${hw * .28} -3 ${hw * .56} 0"/>${[-1, 1].map((d) => `<path d="M ${d * (ex + ew + 1.5)} ${ey - 1} l ${d * 5} -2.5 M ${d * (ex + ew + 1.5)} ${ey + 2} l ${d * 5} 1.5"/><path d="M ${d * ew * 1.5} ${my + ew * .5} q ${d * 2} ${ew * .6} ${d * 1} ${ew * 1.1}"/>`).join('')}</g>`;
    // nose: bridge shadow on the far side, lit tip, nostril wings
    s += `<g class="r-nose"><path d="M ${ew * .3} ${ey + eh * .3} C ${ew * .42} ${nb * .45} ${ew * .5} ${nb * .72} ${nz * .95} ${nb - ew * .38}" stroke="${sh}" stroke-width="${kid ? 1.2 : 1.6}" fill="none" stroke-linecap="round" opacity=".4"/><ellipse cx="${-ew * .1}" cy="${(ey + nb) * .55}" rx="${ew * .13}" ry="${(nb - ey) * .22}" fill="#fff" opacity=".12"/><ellipse cx="0" cy="${nb - ew * .1}" rx="${nz * .66}" ry="${ew * .3}" fill="${sh}" opacity=".16"/><circle cx="${-ew * .08}" cy="${nb - ew * .44}" r="${ew * .19}" fill="#fff" opacity=".17"/>`
      + `<g class="r-alar">${[-1, 1].map((d) => `<path d="M ${d * nz * .5} ${nb - ew * .56} C ${d * nz * 1.15} ${nb - ew * .52} ${d * nz * 1.18} ${nb + ew * .02} ${d * nz * .48} ${nb + .3}" stroke="${sh}" stroke-width="1.45" fill="none" stroke-linecap="round" opacity=".75"/><ellipse cx="${d * nz * .42}" cy="${nb - ew * .06}" rx="${ew * .17}" ry="${ew * .085}" transform="rotate(${d * 14} ${d * nz * .42} ${nb - ew * .06})" fill="${dk}" opacity=".6"/>`).join('')}</g>`
      + `<path d="M ${-nz * .38} ${nb + .4} Q 0 ${nb + ew * .14} ${nz * .38} ${nb + .4}" stroke="${sh}" stroke-width="1.1" fill="none" opacity=".45"/><ellipse cx="0" cy="${(nb + my) / 2}" rx="${ew * .2}" ry="${(my - nb) * .26}" fill="${sh}" opacity=".12"/></g>`;
    s += `<g class="r-nlf" fill="none" stroke="${sh}" stroke-width="1.3" stroke-linecap="round">${[-1, 1].map((d) => `<path d="M ${d * nz * 1.12} ${nb - ew * .38} C ${d * nz * 1.7} ${nb + ew * .3} ${d * ew * 1.7} ${my - ew * .35} ${d * ew * 1.8} ${my + ew * .3}"/>`).join('')}</g>`;
    if (xs.includes('beard')) s += `<path d="${beardD(G)}" fill="${c.hair.color}"/><path d="${beardD(G)}" fill="none" stroke="${shade(c.hair.color, 22)}" stroke-width="1" opacity=".35"/>`;
    s += `<ellipse class="r-cyan" cx="0" cy="${my}" rx="${hw * .42}" ry="${ew * 1.15}" fill="#7487C0" opacity="0"/>`;
    s += `<g transform="translate(0 ${my})"><clipPath id="rmc${uid}"><path class="r-mclip"/></clipPath><ellipse cx="0" cy="${ew * 1}" rx="${ew * .85}" ry="${ew * .3}" fill="${sh}" opacity=".24"/>`
      + `<path class="r-mouth" fill="#3B1716"/><g clip-path="url(#rmc${uid})"><rect class="r-teeth" x="${-ew * 2.5}" width="${ew * 5}" height="${ew * .42}" fill="#EEE8DE"/></g>`
      + `<path class="r-llip"/><path class="r-ulip"/><path class="r-lline" fill="none" stroke="${mix(c.lip, '#2A1410', .55)}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><ellipse class="r-lhl" rx="${ew * .34}" ry="${ew * .1}" fill="#fff" opacity=".2"/></g>`;
    if (xs.includes('goatee')) s += `<path d="${mustacheD(G)}" fill="${c.hair.color}" opacity=".9"/><path d="M ${-ew * .85} ${my + ew * .78} Q 0 ${my + ew * .58} ${ew * .85} ${my + ew * .78} Q ${ew * .72} ${hh * .97} 0 ${hh * 1.01} Q ${-ew * .72} ${hh * .97} ${-ew * .85} ${my + ew * .78} Z" fill="${c.hair.color}"/>`;
    if (xs.includes('mustache')) s += `<path d="${mustacheD(G, 1)}" fill="${c.hair.color}" stroke="${shade(c.hair.color, -30)}" stroke-width=".8"/>`;
    if (xs.includes('beard')) s += `<path d="${mustacheD(G)}" fill="${c.hair.color}"/>`;
    s += eyeSVG(c, G, uid, -1) + eyeSVG(c, G, uid, 1);
    [-1, 1].forEach((d) => { s += `<g class="r-brow" data-s="${d}"><path transform="scale(${d} 1)" d="${browD(G, c)}" fill="${c.brow.color}" stroke="${c.brow.color}" stroke-width=".6" stroke-linejoin="round" opacity=".93"/></g>`; });
    if (xs.includes('glasses') || xs.includes('thinGlasses')) {
      const thick = xs.includes('glasses'), sw = thick ? 2.5 : 1.4, gw = ew * 1.45, gh = eh * 1.75, gy = ey - eh * .1;
      s += `<g fill="none" stroke="${c.glasses}" stroke-width="${sw}">${[-1, 1].map((d) => `<rect x="${d * ex - gw}" y="${gy - gh}" width="${gw * 2}" height="${gh * 2}" rx="${gh * (thick ? .95 : .62)}" fill="#fff" fill-opacity=".08"/><path d="M ${d * ex - gw * .5} ${gy - gh * .45} l ${gw * .35} ${-gh * .32}" stroke="#fff" stroke-width="1.6" opacity=".35" stroke-linecap="round"/>`).join('')}<path d="M ${-ex + gw} ${gy - gh * .2} Q 0 ${gy - gh * .75} ${ex - gw} ${gy - gh * .2}"/><path d="M ${-ex - gw} ${gy - gh * .45} L ${-hw * .98} ${gy - gh * .55} M ${ex + gw} ${gy - gh * .45} L ${hw * .98} ${gy - gh * .55}"/></g>`;
    }
    if (xs.includes('cannula')) s += `<g fill="none" stroke="#BFE2E8" stroke-width="2.6" stroke-linecap="round">${[-1, 1].map((d) => `<path d="M ${d * hw * .98} ${ecy + ery * .2} Q ${d * hw * .62} ${nb + ew * .25} ${d * nz * .5} ${nb + 1.2}"/>`).join('')}<path d="M ${-nz * .5} ${nb + 1.2} L ${nz * .5} ${nb + 1.2}" stroke-width="3"/><path d="M ${-nz * .3} ${nb + 1} v -3 M ${nz * .3} ${nb + 1} v -3" stroke-width="2"/></g>`;
    s += `</g>`;
    const sweatFirst = c.hair.style === 'hijab';
    let sweat = `<ellipse class="r-sheen" cx="${-hw * .1}" cy="${-hh * .5}" rx="${hw * .4}" ry="${hh * .12}" fill="#fff" opacity="0"/>`;
    [[-.34, -.5], [.36, -.4], [.66, -.08]].forEach(([x, y]) => { const yy = sweatFirst ? y + .38 : y; sweat += `<path class="r-drop" data-x="${x * hw * (sweatFirst ? .8 : 1)}" data-y="${yy * hh}" d="M 0 -4 C 2.5 -.5 3 1.6 0 3.2 C -3 1.6 -2.5 -.5 0 -4 Z" fill="#D4ECF5" stroke="#86B6CC" stroke-width=".9" opacity="0"/>`; });
    if (sweatFirst) s += sweat;
    s += `<g class="r-hairf">` + H.front;
    if (['short', 'bun', 'swoop', 'ponytail', 'bob', 'long', 'shag'].includes(c.hair.style)) { const hl = shade(c.hair.color, 34), hd = shade(c.hair.color, -26); s += `<g fill="none" stroke-linecap="round" stroke-width="${c.hair.style === 'buzz' ? .7 : 1}">` + [-.78, -.5, -.22, .08, .36, .64].map((x, i) => `<path d="M ${x * hw * 1.05} ${-hh * (.6 + Math.abs(x) * .05)} Q ${x * hw * .9 + hw * .08} ${-hh * .9} ${x * hw * .35 + hw * .05} ${-hh * 1.02}" stroke="${i % 2 ? hd : hl}" opacity="${i % 2 ? .35 : .3}"/>`).join('') + `</g>`; }
    if (!['balding', 'hijab', 'buzz'].includes(c.hair.style)) s += `<path d="M ${-hw * .52} ${-hh * .84} Q ${-hw * .05} ${-hh * 1.04} ${hw * .42} ${-hh * .88}" stroke="${shade(c.hair.color, 70)}" stroke-width="${Math.max(3, hh * .07)}" fill="none" stroke-linecap="round" opacity=".26"/>`;
    s += `</g>`;
    if (xs.includes('headset')) s += `<path d="M ${-hw * 1.02} ${ecy - 4} C ${-hw * 1.1} ${-hh * 1.25} ${hw * 1.1} ${-hh * 1.25} ${hw * 1.02} ${ecy - 4}" stroke="#3A3F44" stroke-width="4" fill="none"/><rect x="${-hw * 1.12}" y="${ecy - 10}" width="12" height="20" rx="5" fill="#3A3F44"/><path d="M ${-hw * 1.04} ${ecy + 6} Q ${-hw * .85} ${my + 4} ${-hw * .34} ${my}" stroke="#3A3F44" stroke-width="2.2" fill="none"/><circle cx="${-hw * .34}" cy="${my}" r="3.2" fill="#3A3F44"/>`;
    if (!sweatFirst) s += sweat;
    return s + `</g>`;
  }
  const CLOTH = { gown: ['#BCD3DA', '#8CAEBB'], navy: ['#2C4466', '#1E3150'], teal: ['#2E7C78', '#22605D'], grey: ['#6B7478', '#50585C'], blue: ['#3E6FA8', '#2F5584'], wine: ['#7A2E3E', '#5E2230'], coat: ['#F2F3EF', '#CDD3CC'], blouse: ['#E9D8C6', '#CDB9A3'], plum: ['#6D4A63', '#553A4D'], tee: ['#6F8394', '#566878'], sun: ['#E2A93E', '#BD8A2B'], hoodie: ['#34425A', '#263247'], flannel: ['#7C98B6', '#5E7A98'], onesie: ['#F2D98D', '#D6BC68'], onesie2: ['#A9D3E8', '#84B4CE'], rose: ['#C9677E', '#A44F64'] };
  function torsoD(G, inner) {
    const { T, bw, nw } = G, half = (d) => `${d * bw} ${T + 56} C ${d * bw} ${T + 30} ${d * bw * .93} ${T + 18} ${d * bw * .72} ${T + 13} C ${d * bw * .48} ${T + 7} ${d * nw * 1.7} ${T + 1} ${d * nw * 1.12} ${T - 6}`;
    if (inner) return (d) => `M ${d * (bw + 4)} ${T + 240} L ${half(d)} L ${d * 12} ${T + 240} Z`;
    return `M ${-bw - 4} ${T + 240} L ${half(-1)} Q 0 ${T + 10} ${nw * 1.12} ${T - 6} C ${nw * 1.7} ${T + 1} ${bw * .48} ${T + 7} ${bw * .72} ${T + 13} C ${bw * .93} ${T + 18} ${bw} ${T + 30} ${bw} ${T + 56} L ${bw + 4} ${T + 240} Z`;
  }
  function bodySVG(c, uid) {
    const G = geo(c), { hh, hw, T, bw, nw } = G, k = c.body.cloth, [cl, cd] = CLOTH[k] || CLOTH.gown, sk = c.skin, sh = c.shade, torso = torsoD(G); let s = '';
    if (k === 'hoodie') s += `<path d="M ${-nw * 2.4} ${T + 16} C ${-nw * 2.5} ${T - 18} ${nw * 2.5} ${T - 18} ${nw * 2.4} ${T + 16} Z" fill="${cd}"/>`;
    // neck, shaded under the jaw
    const neck = `M ${-nw} ${hh * .4} L ${-nw * 1.02} ${T - 8} L ${-nw * 1.08} ${T + 30} L ${nw * 1.08} ${T + 30} L ${nw * 1.02} ${T - 8} L ${nw} ${hh * .4} Z`;
    s += `<clipPath id="rnk${uid}"><path d="${neck}"/></clipPath><path d="${neck}" fill="${sk}"/><g clip-path="url(#rnk${uid})"><ellipse cx="0" cy="${hh * .98}" rx="${hw * .78}" ry="${hh * .26}" fill="${sh}" opacity=".6"/><rect x="${nw * .3}" y="${hh * .4}" width="${nw * 1.4}" height="${T}" fill="${sh}" opacity=".22"/>${[-1, 1].map((d) => `<path d="M ${d * nw * .85} ${hh * 1.02} Q ${d * nw * .55} ${T - 10} ${d * nw * .14} ${T + 2}" stroke="${sh}" stroke-width="1.6" fill="none" opacity=".3"/>`).join('')}</g><path d="M -3.5 ${T + 1} Q 0 ${T + 4} 3.5 ${T + 1}" stroke="${sh}" stroke-width="1.3" fill="none" opacity=".5"/>`;
    if (k === 'gown') s += `<pattern id="rgp${uid}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="${cl}"/><path d="M8 4 l3 4 -3 4 -3 -4z" fill="${cd}" opacity=".5"/></pattern>`;
    if (k === 'flannel') s += `<pattern id="rgp${uid}" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="${cl}"/><rect x="8" width="6" height="22" fill="${cd}" opacity=".55"/><rect y="8" width="22" height="6" fill="${cd}" opacity=".45"/><rect x="18" width="1.5" height="22" fill="#E8E2D6" opacity=".35"/></pattern>`;
    s += `<path d="${torso}" fill="${k === 'gown' || k === 'flannel' ? `url(#rgp${uid})` : cl}" stroke="${shade(cl, -35)}" stroke-width="1.1"/>`;
    if (c.body.cardigan) { const cc = c.body.cardigan, half = torsoD(G, true); [-1, 1].forEach((d) => { s += `<path d="${half(d)}" fill="${cc}" stroke="${shade(cc, -30)}" stroke-width="1.1"/>`; for (let i = 0; i < 3; i++) s += `<circle cx="${d * (nw * 1.12 - (nw * 1.12 - 12) * ((i * 34 + 46) / 246))}" cy="${T + 40 + i * 34}" r="2.6" fill="${shade(cc, -40)}"/>`; }); }
    s += `<linearGradient id="rtg${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient><linearGradient id="rth${uid}"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>`
      + `<path d="${torso}" fill="url(#rtg${uid})"/><path d="${torso}" fill="url(#rth${uid})"/>`
      + [-1, 1].map((d) => `<path d="M ${d * bw * .9} ${T + 28} C ${d * bw * .78} ${T + 14} ${d * bw * .5} ${T + 9} ${d * nw * 1.4} ${T + 2}" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".16"/><path d="M ${d * bw * .86} ${T + 64} Q ${d * bw * .7} ${T + 96} ${d * bw * .76} ${T + 136}" stroke="${shade(cl, -45)}" stroke-width="1.6" fill="none" opacity=".22"/>`).join('');
    s += `<g class="r-strain" opacity="0" stroke="${sh}" stroke-width="2.2" stroke-linecap="round" fill="none">${[-1, 1].map((d) => `<path d="M ${d * nw * .8} ${hh * 1.05} Q ${d * nw * .6} ${T - 12} ${d * nw * .2} ${T + 1}"/>`).join('')}</g>`;
    if (k === 'coat') s += `<path d="M ${-nw * 1.25} ${T - 6} L 0 ${T + 62} L ${nw * 1.25} ${T - 6} Z" fill="#A9C3D6"/><path d="M ${-nw * .95} ${T - 6} L 0 ${T + 24} L ${nw * .95} ${T - 6} Z" fill="${sk}"/>${[-1, 1].map((d) => `<path d="M ${d * nw * 1.25} ${T - 7} L ${d * 3} ${T + 64} L ${d * bw * .42} ${T + 80} L ${d * nw * 1.95} ${T + 5} Z" fill="${cd}" stroke="${shade(cd, -25)}" stroke-width="1"/>`).join('')}<rect x="${bw * .34}" y="${T + 78}" width="22" height="28" rx="3" fill="#fff" stroke="#9BB0BC"/><rect x="${bw * .34 + 4}" y="${T + 82}" width="14" height="8" rx="1" fill="#7AA8C4"/>`;
    else if (['navy', 'teal', 'grey', 'blue', 'wine'].includes(k)) s += `<path d="M ${-nw * 1.12} ${T - 6} L 0 ${T + 34} L ${nw * 1.12} ${T - 6}" fill="${sk}" stroke="${cd}" stroke-width="4.5" stroke-linejoin="round"/><path d="M ${-nw * .9} ${T - 4} L 0 ${T + 26} L ${nw * .9} ${T - 4}" fill="${sh}" opacity=".18"/><rect x="${-bw * .6}" y="${T + 58}" width="30" height="24" rx="3" fill="${cd}"/><rect x="${bw * .32}" y="${T + 56}" width="20" height="27" rx="3" fill="#fff"/><rect x="${bw * .32 + 3}" y="${T + 60}" width="14" height="8" rx="1" fill="${cl}"/><path d="M ${-bw * .6 + 7} ${T + 58} v -9" stroke="#3B3B40" stroke-width="3" stroke-linecap="round"/>`;
    else if (k === 'gown') s += `<path d="M ${-nw * 1.35} ${T - 5} Q 0 ${T + 24} ${nw * 1.35} ${T - 5} Z" fill="${sk}"/><path d="M ${-nw * 1.35} ${T - 5} Q 0 ${T + 24} ${nw * 1.35} ${T - 5}" stroke="${cd}" stroke-width="2.4" fill="none"/>${[-1, 1].map((d) => `<circle cx="${d * bw * .52}" cy="${T + 9}" r="2.2" fill="#fff" stroke="${cd}"/>`).join('')}`;
    else if (k === 'flannel' || k === 'blouse') s += `<path d="M ${-nw * 1.15} ${T - 6} L 0 ${T + 24} L ${nw * 1.15} ${T - 6} Z" fill="${sk}"/>${[-1, 1].map((d) => `<path d="M ${d * nw * 1.15} ${T - 7} L ${d * 2} ${T + 26} L ${d * nw * 1.5} ${T + 22} L ${d * nw * 1.75} ${T} Z" fill="${shade(cl, -12)}" stroke="${cd}" stroke-width="1"/>`).join('')}`;
    else s += `<path d="M ${-nw * 1.15} ${T - 6} Q 0 ${T + 15} ${nw * 1.15} ${T - 6} Z" fill="${sk}"/><path d="M ${-nw * 1.15} ${T - 6} Q 0 ${T + 15} ${nw * 1.15} ${T - 6}" stroke="${cd}" stroke-width="3" fill="none"/>`;
    if (k === 'hoodie') s += `<path d="M ${-nw * .7} ${T + 10} l -2 46 M ${nw * .7} ${T + 10} l 2 46" stroke="#E4DED2" stroke-width="2.2" stroke-linecap="round"/>`;
    if (c.body.lanyard) s += `<path d="M ${-nw * 1.15} ${T - 2} L -4 ${T + 70} M ${nw * 1.15} ${T - 2} L 4 ${T + 70}" stroke="#2E7C78" stroke-width="3"/><rect x="-11" y="${T + 70}" width="22" height="28" rx="3" fill="#fff" stroke="#9BB0BC"/>`;
    if (c.body.steth) s += `<g fill="none" stroke="#4A525A" stroke-width="3.2" stroke-linecap="round"><path d="M ${-nw * 1.2} ${T - 2} C ${-nw * 1.6} ${T + 60} ${-nw * .3} ${T + 72} ${-nw * .3} ${T + 104}"/><path d="M ${nw * 1.2} ${T - 2} C ${nw * 1.7} ${T + 40} ${nw * 1.5} ${T + 60} ${nw * 1.3} ${T + 74}"/></g><circle cx="${-nw * .3}" cy="${T + 110}" r="7" fill="#9AA3AB" stroke="#4A525A" stroke-width="2"/>`;
    if ((c.extras || []).includes('pearls')) s += `<path d="M ${-nw * 1.1} ${T - 2} Q 0 ${T + 24} ${nw * 1.1} ${T - 2}" stroke="#F4EFE4" stroke-width="3.4" stroke-dasharray=".1 5.5" stroke-linecap="round" fill="none"/>`;
    return s;
  }
  function armSVG(c) {
    const [cl] = CLOTH[c.body.cloth] || CLOTH.gown; let s = '';
    [-1, 1].forEach((d) => { s += `<g class="r-arm" data-s="${d}"><path class="r-skin" fill="none" stroke="${c.skin}" stroke-width="20" stroke-linecap="round"/><path class="r-mot" fill="none" stroke="#86679C" stroke-width="12" stroke-dasharray="2 6" stroke-linecap="round" opacity="0"/><path class="r-sleeve" fill="none" stroke="${c.body.cardigan || cl}" stroke-width="29" stroke-linecap="round"/><g class="r-hand"><path d="M -11 -6 C -11 -12 9 -13 11 -6 L 12 7 C 12 12 -10 12 -11 7 Z" fill="${c.skin}" stroke="${c.shade}" stroke-width="1.1"/><path d="M ${-d * 9} -4 C ${-d * 16} -6 ${-d * 17} 2 ${-d * 12} 5" fill="${c.skin}" stroke="${c.shade}" stroke-width="1.1"/><path d="M -6 7 v 4 M -1.5 8 v 4 M 3 8 v 4 M 7.5 7 v 3.5" stroke="${c.shade}" stroke-width="1.1" stroke-linecap="round"/></g></g>`; });
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
    const comfort = 1 - clamp(painF + dys + hypoG + fever * .6 + lowBP + nausea + (confused ? .6 : 0) + dizzy + alertEff * .5 + lean + anx * .8 + tremorIn * .5 + rigors * .6);
    return { painF, splint, fever, rigors, lowBP, mottle, cyan, hypoG, dys, lean, alertEff, confused, dizzy, nausea, comfort, tremorIn, pale, anx, sweatIn };
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
    const G = geo(c), { w, h } = c.head;
    const I = {
      c, G, mode, ck, el, v: Object.assign({}, BASE, v || {}), w: G.hw, h: G.hh, T: G.T, B: h * 1.2 + 100, yaw: 0, pitch: 0,
      eyes: qa('.r-iris').map((ir, i) => { const g = ir.parentNode.parentNode, s = i ? 1 : -1, P = eyeP(G, s); return { s, P, iris: ir, pupil: g.querySelector('.r-pupil'), hl: g.querySelector('.r-hl'), lid: g.querySelector('.r-lid'), low: g.querySelector('.r-low'), lash: g.querySelector('.r-lash'), lsh: g.querySelector('.r-lsh'), llash: g.querySelector('.r-llash'), crease: g.querySelector('.r-crease') }; }),
      brows: qa('.r-brow'), mouth: q('.r-mouth'), mclip: q('.r-mclip'), teeth: q('.r-teeth'), ulip: q('.r-ulip'), llip: q('.r-llip'), lline: q('.r-lline'), lhl: q('.r-lhl'),
      feat: q('.r-feat'), nose: q('.r-nose'), alar: q('.r-alar'), nlf: q('.r-nlf'), ears: q('.r-ears'), hairf: q('.r-hairf'),
      head: q('.r-head'), cheeks: q('.r-cheeks'), fh: q('.r-fh'), pallor: q('.r-pallor'), green: q('.r-green'), cyan: q('.r-cyan'), sheen: q('.r-sheen'), drops: qa('.r-drop'),
      torso: q('.r-torso'), strain: q('.r-strain'), blanket: q('.r-blanket'),
      arms: qa('.r-arm').map((a) => ({ s: +a.dataset.s, skin: a.querySelector('.r-skin'), mot: a.querySelector('.r-mot'), sleeve: a.querySelector('.r-sleeve'), hand: a.querySelector('.r-hand'), x: 0, y: 0 })),
      cur: null, micro: { next: now() + rand(3, 7), start: -9, kind: 0 }, sac: { x: 0, y: 0, next: 0 }, gaze: { x: 0, y: 0, tx: 0, ty: 0, next: 0 }, blink: { next: now() + rand(.5, 3), start: -9, dur: .15 }, phase: Math.random(), poke: -9, hover: false, seed: Math.random() * 10, yawn: { next: now() + rand(5, 10), start: -9 },
    };
    const prev = cache[ck];
    if (prev && prev.key === c.__key) {
      I.cur = Object.assign({}, prev.cur); I.phase = prev.phase; I.gaze = Object.assign({}, prev.gaze); I.blink = Object.assign({}, prev.blink); I.poke = prev.poke; I.yawn = Object.assign({}, prev.yawn); I.yaw = prev.yaw || 0; I.pitch = prev.pitch || 0;
      I.arms.forEach((a, i) => { if (prev.arms[i]) { a.x = prev.arms[i].x; a.y = prev.arms[i].y; } });
    } else {
      I.cur = targets(c, derive(I.v, c));
      I.arms.forEach((a) => { a.x = a.s * G.bw * .6; a.y = I.B + 26; });
    }
    return I;
  }
  function remember(I) { cache[I.ck] = { key: I.c.__key, cur: I.cur, phase: I.phase, gaze: I.gaze, blink: I.blink, poke: I.poke, yawn: I.yawn, yaw: I.yaw, pitch: I.pitch, arms: I.arms.map((a) => ({ x: a.x, y: a.y })) }; }
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
    // blink: a quick close, a slower open
    const bl = I.blink, drowsy = d.alertEff >= 1 || c.tired;
    if (t > bl.next) { bl.start = t; bl.dur = drowsy ? 2.4 : 1; bl.next = t + (drowsy ? rand(1.4, 3) : d.confused ? rand(1, 2.5) : rand(2.4, 6)); if (Math.random() < .14) bl.next = t + .35; }
    const bt = (t - bl.start) / (bl.dur > .9 ? bl.dur : 1); let blink = 0;
    if (bt >= 0) { if (bt < .07) blink = bt / .07; else if (bt < .1) blink = 1; else if (bt < .26) { const q = (bt - .1) / .16; blink = 1 - q * q * (3 - 2 * q); } }
    // the head follows the eyes, a beat behind
    const hk = 1 - Math.exp(-dt * (reduced ? 5 : 2.6)), att = attentive ? 1 : .45;
    I.yaw = lerp(I.yaw, clamp(g.tx * .8 * att, -1, 1), hk); I.pitch = lerp(I.pitch, clamp(g.ty * .7, -1, 1), hk);
    const G = I.G, u = G.u, openAmt = clamp(cur.eye * (1 - blink) * (1 - Math.max(0, g.y) * .14) + Math.max(0, -g.y) * .06), f = Math.min(1, -.78 + 1.74 * openAmt), fl = 1 - cur.squint * .55;
    const ix = clamp(g.x - I.yaw * .45 + I.sac.x, -1, 1), iy = clamp(g.y - I.pitch * .3 + I.sac.y, -1, 1);
    I.eyes.forEach((e) => {
      const P = e.P, [a1, a2] = lidPts(P, f, true), [b1, b2] = lidPts(P, fl, false), up = `M ${P.Ix} ${P.Iy} C ${a1} ${a2} ${P.Ox} ${P.Oy}`, lo = `M ${P.Ox} ${P.Oy} C ${b1} ${b2} ${P.Ix} ${P.Iy}`, E = G.eh * 3;
      e.lid.setAttribute('d', `M ${P.Ix} ${-E} L ${P.Ix} ${P.Iy} C ${a1} ${a2} ${P.Ox} ${P.Oy} L ${P.Ox} ${-E} Z`);
      e.low.setAttribute('d', `${lo} L ${P.Ix} ${E} L ${P.Ox} ${E} Z`);
      e.lsh.setAttribute('d', up); e.llash.setAttribute('d', lo);
      e.lash.setAttribute('d', `${up} l ${e.s * G.ew * .13} ${-G.eh * .18}`);
      e.crease.setAttribute('opacity', .5 * clamp(f));
      e.iris.setAttribute('transform', `translate(${ix * G.ew * .42} ${-G.eh * .06 + iy * G.eh * .36 + cur.droop * 1.2})`);
      e.pupil.setAttribute('r', G.ir * .42 * (1 + cur.dil * .45)); e.hl.setAttribute('r', G.ir * .27 * (1 + cur.glassy * .35));
    });
    I.brows.forEach((br) => { const s = +br.dataset.s, ang = cur.worry * 13 - cur.smile * 2 + (d.confused && s === 1 ? -4 : 0); br.setAttribute('transform', `translate(${s * (G.ex + G.ew * .12) - s * cur.worry * 1.6} ${G.by - (cur.raise + Math.max(0, -I.pitch) * .3) * 3.6 * u + cur.worry * 1.2 + blink * .8}) rotate(${s * ang})`); });
    // mouth: lips around a dynamic opening
    const gasp = cur.strain > .05 || v.rr > 24 ? clamp(cur.strain * .8 + (v.rr - 24) / 20) * (.35 + .65 * b) : 0;
    const chatter = d.rigors && d.alertEff < 2 && calm ? (Math.sin(t * 38) > 0 ? .1 : 0) : 0;
    const sm = cur.smile, sp = Math.max(0, sm), open = clamp(cur.open + gasp + chatter + Math.max(0, sm - .5) * .32);
    const mw = (G.kid ? 24 : 28) * u + sp * 7 * u + cur.guard * 4 + open * 3, fd = clamp(v.facial || 0);   // facial droop: the patient's right corner (viewer's left) sags
    const Ly = -sm * 3.6 * u + fd * 6, Ry = -sm * 3.6 * u, Lx = -mw / 2, Rx = mw / 2, up = sm * 4 * u - open * 1.5 + fd * 2, lo = sm * 4 * u + open * 15 * u + fd * 2;
    const opening = `M ${Lx} ${Ly} Q 0 ${up} ${Rx} ${Ry} Q 0 ${lo} ${Lx} ${Ly} Z`, cm = (Ly + Ry) / 2;
    const ul = (G.kid ? 2.6 : 3.3) * u * (1 - sp * .3), ll = (G.kid ? 3.4 : 4.4) * u * (1 - sp * .25), topM = cm / 2 + up / 2, botM = cm / 2 + lo / 2, uT = topM - ul, lB = (botM + ll - cm * .25) / .75;
    I.mouth.setAttribute('d', opening); I.mclip.setAttribute('d', opening); I.lline.setAttribute('d', opening); I.teeth.setAttribute('y', topM - .6);
    I.ulip.setAttribute('d', `M ${Lx} ${Ly} Q 0 ${up} ${Rx} ${Ry} C ${mw * .3} ${uT + ul * .2} ${mw * .17} ${uT - ul * .22} ${mw * .07} ${uT - ul * .12} Q 0 ${uT + ul * .22} ${-mw * .07} ${uT - ul * .12} C ${-mw * .17} ${uT - ul * .22} ${-mw * .3} ${uT + ul * .2} ${Lx} ${Ly} Z`);
    I.llip.setAttribute('d', `M ${Lx} ${Ly} Q 0 ${lo} ${Rx} ${Ry} C ${mw * .3} ${lB} ${-mw * .3} ${lB} ${Lx} ${Ly} Z`);
    I.lhl.setAttribute('cx', -mw * .07); I.lhl.setAttribute('cy', botM + ll * .45);
    const lipC = mix(c.lip, c.skin, .3), cy2 = cur.cyan * .8; I.ulip.setAttribute('fill', mix(shade(lipC, -8), '#5D6FA6', cy2)); I.llip.setAttribute('fill', mix(mix(c.lip, c.skin, .42), '#6E7FB4', cy2));
    I.nlf.setAttribute('opacity', (G.kid ? 0 : .1) + sp * (G.kid ? .14 : .3) + ((c.extras || []).includes('wrinkles') ? .25 : 0));
    I.cheeks.setAttribute('opacity', (G.kid ? .5 : .34) + cur.flush * .55); I.cheeks.setAttribute('transform', `translate(0 ${-sp * 2 * u})`); I.fh.setAttribute('opacity', cur.flush * .18);
    I.pallor.setAttribute('opacity', cur.pallor * .55); I.green.setAttribute('opacity', cur.green * .24); I.cyan.setAttribute('opacity', cur.cyan * .5);
    I.sheen.setAttribute('opacity', cur.sweat * .32);
    I.drops.forEach((dr, i) => { const fr = ((t * .22 + i * .37) % 1); dr.setAttribute('opacity', cur.sweat > .08 ? cur.sweat * (1 - fr * .7) : 0); dr.setAttribute('transform', `translate(${dr.dataset.x} ${+dr.dataset.y + fr * 12 * calm})`); });
    // turning: features slide over the skull, ears the other way (a little parallax reads as a real head)
    const yw = I.yaw * calm, pt = I.pitch * calm;
    I.feat.setAttribute('transform', `translate(${yw * G.hw * .075} ${pt * G.hh * .035})`);
    I.nose.setAttribute('transform', `translate(${yw * G.hw * .035} 0)`);
    I.ears.setAttribute('transform', `translate(${-yw * G.hw * .05} ${-pt * G.hh * .05})`);
    I.hairf.setAttribute('transform', `translate(${yw * G.hw * .02} ${-pt * 1.2})`);
    const flare = 1 + d.dys * .22 * b; I.alar.setAttribute('transform', `translate(0 ${G.nb}) scale(${flare} 1) translate(0 ${-G.nb})`);
    // motion: layered slow sways rather than one sine
    const shiv = d.rigors && d.alertEff < 2 ? calm : 0, jx = shiv * Math.sin(t * 47) * 1.3, jy = shiv * Math.cos(t * 53) * .8, trem = cur.tremor * calm;
    const idle = calm * (1 - cur.droop * .6), sway = d.dizzy * calm, n1 = Math.sin(t * .45 + I.seed), n2 = Math.sin(t * .27 + I.seed * 1.7), n3 = Math.sin(t * 1.13 + I.seed * 2.3);
    const rot = (n1 * 1.1 + n2 * .8 + n3 * .2) * idle + yw * 3.2 * idle + cur.droop * 9 + sway * Math.sin(t * 1.25) * 6 - yawn * 5;
    const hxp = (Math.sin(t * .6 + I.seed) * .9 + n2 * .5) * idle + yw * 2.2 * idle + sway * Math.sin(t * 1.25) * 4 + jx + trem * Math.sin(t * 61) * .6;
    const P = I.B + 40, gain = I.mode === 'bed' ? .032 : .018, riseAmt = (P - I.T) * gain * b * depth;
    const hyp = -riseAmt + cur.droop * 8 + cur.lean * 13 + jy - pe * (d.alertEff < 2 ? 3 : 0) - yawn * 3 + pt * 1.5 * idle + blink * .4;
    I.head.setAttribute('transform', `translate(${hxp} ${hyp}) rotate(${rot} 0 ${G.hh * .85}) scale(${1 + cur.lean * .06})`);
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
        const Sx = s * I.G.bw * .86, Sy = T0 + 22 - riseAmt - cur.lean * 7, Ex = (Sx + hxh) / 2 + s * 24, Ey = (Sy + hyh) / 2 + 8;
        const tt = .38, mx1 = lerp(Sx, Ex, tt), my1 = lerp(Sy, Ey, tt), mx2 = lerp(Ex, hxh, tt), my2 = lerp(Ey, hyh, tt), px = lerp(mx1, mx2, tt), py = lerp(my1, my2, tt);
        const dd = `M ${Sx} ${Sy} Q ${Ex} ${Ey} ${hxh} ${hyh}`; a.skin.setAttribute('d', dd); a.mot.setAttribute('d', dd); a.mot.setAttribute('opacity', cur.mottle * .75);
        a.sleeve.setAttribute('d', `M ${Sx} ${Sy} Q ${mx1} ${my1} ${px} ${py}`);
        a.hand.setAttribute('transform', `translate(${hxh} ${hyh})`);
      });
    }
  }

  /* ---------- public API ---------- */
  const VB = { icon: '-74 -90 148 162', bust: '-108 -104 216 228' };
  const enc = (v) => (v ? encodeURIComponent(JSON.stringify(v)) : '');
  function define(key, spec) { spec.__key = key; CH[key] = spec; }
  function has(key) { return !!CH[key]; }
  /* Placeholder markup; hydrate() turns it into a live character. */
  function icon(key, v, cls) {
    if (!CH[key]) return `<svg class="${cls || 'portrait'}" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="30" fill="var(--line)"/><path d="M42 34h16M44 34v14l-9 16h30l-9-16V34" stroke="var(--ink-2)" stroke-width="3.5" fill="none" stroke-linejoin="round"/></svg>`;
    return `<svg class="${cls || 'portrait'}" viewBox="${VB.icon}" aria-hidden="true" data-rig="${key}" data-mode="icon" data-v="${enc(v)}"></svg>`;
  }
  function bust(key, v, cls, vb) { return `<svg class="${cls || 'portrait'}" viewBox="${vb || VB.bust}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" data-rig="${key}" data-mode="bust" data-v="${enc(v)}"></svg>`; }
  function place(key, mode, v, transform, ck) { return `<g data-rig="${key}" data-mode="${mode}" data-v="${enc(v)}" transform="${transform}"${ck ? ` data-ck="${ck}"` : ''}></g>`; }
  function hydrate(root) {
    live.forEach(remember); live = [];
    const seen = {};
    root.querySelectorAll('[data-rig]').forEach((el) => {
      const key = el.dataset.rig, mode = el.dataset.mode || 'icon', c = CH[key]; if (!c) return;
      let ck = el.dataset.ck || key + ':' + mode; seen[ck] = (seen[ck] || 0) + 1; if (seen[ck] > 1) ck += ':' + seen[ck];
      let target = el; if (el.tagName.toLowerCase() === 'svg') { target = document.createElementNS('http://www.w3.org/2000/svg', 'g'); el.appendChild(target); }
      let v = {}; try { v = el.dataset.v ? JSON.parse(decodeURIComponent(el.dataset.v)) : {}; } catch (e) {}
      const I = build(target, c, mode, ck, v); live.push(I);
      step(I, now(), 1 / 60, 0);
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
  S.rig = { define, has, icon, bust, place, hydrate, poke, hover, say, setReduced, setPower, stats, derive, BASE };
})(window.Shift);
