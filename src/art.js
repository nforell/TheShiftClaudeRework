/* The Shift — procedural editorial illustration (SVG). */
(function (S) {
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  let uid = 0;
  /* Time-of-day window light. */
  const isNight = (t) => { const a = ((S.engine.abs(t) % 1440) + 1440) % 1440; return a >= 1260 || a < 300; };
  function sky(t) {
    const a = ((S.engine.abs(t) % 1440) + 1440) % 1440; // minutes after midnight
    if (isNight(t)) return ['#2a3558', '#0b1026'];   // night
    if (a < 480) return ['#f3c9a8', '#9fb7cf'];      // dawn
    if (a < 600) return ['#f6e2c4', '#a9c7dc'];      // morning
    if (a < 1050) return ['#e8f1f6', '#8fb8d6'];     // day
    if (a < 1140) return ['#f5c48e', '#b9a9c6'];     // golden hour
    return ['#e59a78', '#3f4d7a'];                   // dusk
  }
  const hot = (id, label, inner) => `<g class="clue" data-act="clue" data-id="${id}" tabindex="0" role="button" aria-label="${label}">${inner}</g>`;

  /* Room scene. The patient is a live rig character centered at x 515; f = scene flags from the case; v = rig inputs. */
  function room(def, s, P, f, v, callLight, tension) {
    const [s1, s2] = sky(s.t), gid = 'r' + (++uid), X = 515, R = S.rig;
    const Hc = def.look.head.h, B = 150 + Hc * 1.2 + 100;       // blanket top in room coordinates
    let back = '', front = '';
    // headwall with outlets and oxygen flowmeter
    back += `<rect x="404" y="58" width="222" height="34" rx="7" fill="var(--scene-panel)"/><circle cx="426" cy="75" r="6.5" fill="#6FA785"/><circle cx="446" cy="75" r="6.5" fill="var(--scene-frame)" stroke="#9AA9A6"/><rect x="592" y="67" width="22" height="16" rx="3" fill="var(--scene-frame)" stroke="#9AA9A6"/>`;
    back += hot('o2', 'Oxygen flowmeter', `<rect x="562" y="62" width="16" height="36" rx="4" fill="#DCE8E5" stroke="#86A39C"/><circle cx="570" cy="${f.o2 ? 92 - Math.min(+f.o2 || 2, 10) * 2.4 : 90}" r="3.5" fill="${+f.o2 >= 5 ? '#D9822B' : '#2F8F6B'}"/>${f.o2 ? `<path d="M570 98 C 572 140 590 160 576 172" stroke="#BFE2E8" stroke-width="3" fill="none"/>` : ''}`);
    if (f.tele) {
      const hr = S.engine.api(s).vitals(def.id).HR;
      back += hot('monitor', 'Cardiac monitor', `<rect x="648" y="112" width="124" height="74" rx="7" fill="#0f1b1f" stroke="#2b3a3f" stroke-width="3"/>
        <polyline points="${f.teleWave === 'peaked' ? '656,152 666,152 670,144 674,160 678,152 686,152 693,122 700,152 712,152 716,144 720,160 724,152 732,152 739,122 746,152 764,152' : '656,152 670,152 674,140 678,162 682,152 706,152 710,136 714,164 718,152 740,152 746,144 750,158 754,152 764,152'}" stroke="#58d68d" stroke-width="1.8" fill="none" class="ecg"/>
        <text x="764" y="132" text-anchor="end" fill="${hr < 50 ? '#ff6b5f' : '#58d68d'}" font-size="16" font-weight="700" font-family="Public Sans, sans-serif">${hr}</text>
        <text x="656" y="132" fill="#58d68d" font-size="9" font-weight="700" font-family="Public Sans, sans-serif">HR</text><text x="656" y="180" fill="#7fc8e8" font-size="9" font-weight="700" font-family="Public Sans, sans-serif">SpO₂</text><text x="764" y="180" text-anchor="end" fill="#7fc8e8" font-size="13" font-weight="700" font-family="Public Sans, sans-serif">${S.engine.api(s).vitals(def.id).SpO2}</text><path d="M710 186 V 250" stroke="#8F9A98" stroke-width="4"/>`);
    }
    // IV pole, pump and line
    const ivOn = f.iv && f.iv !== 'lock', blood = f.iv === 'blood', bag = blood ? '#9E1B22' : '#E8F2F6', line = blood ? '#B3262D' : '#BCD7E0';
    back += hot('iv', 'IV site and pump', `<rect x="236" y="50" width="56" height="350" fill="#fff" fill-opacity="0"/><path d="M262 52 V400" stroke="#8F9A98" stroke-width="4.5"/><path d="M246 52 h32" stroke="#8F9A98" stroke-width="4"/>
      ${ivOn ? `<path d="M250 58 q-8 30 8 48 q14 -18 6 -48 Z" fill="${bag}" stroke="#9FB6C1" stroke-width="1.5"/>` : ''}${f.bloodHung && !blood ? `<path d="M272 60 q-6 22 6 36 q10 -14 4 -36 Z" fill="#9E1B22" opacity=".8"/><path d="M278 96 v10" stroke="#555" stroke-width="4"/>` : ''}
      <rect x="247" y="160" width="32" height="44" rx="5" fill="#E4EBE9" stroke="#8A9A96" opacity="${ivOn ? 1 : .55}"/><rect x="252" y="167" width="22" height="11" rx="2" fill="${f.iv === 'bolus' ? '#F3C35B' : ivOn ? '#9FE0B8' : '#C9D2CF'}" class="${f.iv === 'bolus' ? 'blink' : ''}"/>
      ${ivOn ? `<path d="M263 204 C 262 280 360 300 ${X - 50} ${B + 16}" stroke="${line}" stroke-width="${blood ? 3 : 2.4}" fill="none"/>` : ''}`);
    if (f.pca) back += hot('pca', 'PCA pump', `<rect x="244" y="212" width="36" height="40" rx="5" fill="#EFE6D2" stroke="#9A8E72"/><rect x="250" y="218" width="24" height="10" rx="2" fill="#2F6B5A"/><circle cx="262" cy="240" r="4" fill="#C84B3A"/><path d="M262 252 C 270 330 330 350 ${X - 190} 360" stroke="#6E6A60" stroke-width="2.4" fill="none"/><rect x="${X - 196}" y="352" width="16" height="28" rx="6" fill="#C84B3A" stroke="#7C2A20"/>`);
    back += `<rect x="409" y="112" width="212" height="170" rx="26" fill="var(--scene-headboard)"/><ellipse cx="${X}" cy="238" rx="122" ry="46" fill="var(--scene-pillow)"/>`;
    if (f.commode) back += hot('commode', 'Bedside commode', `<g transform="translate(140 318)"><rect x="0" y="0" width="70" height="12" rx="4" fill="#9AA6A9"/><path d="M6 12 L2 62 M64 12 L68 62" stroke="#9AA6A9" stroke-width="5"/><rect x="12" y="14" width="46" height="26" rx="5" fill="#E6EBEA" stroke="#9AA6A9"/></g>`);
    if (f.bipap) back += hot('bipap', 'BiPAP machine', `<rect x="300" y="330" width="66" height="44" rx="7" fill="#DDE4E6" stroke="#8B979A"/><rect x="310" y="338" width="30" height="14" rx="2" fill="#1d2b30"/><path d="M366 346 C 420 330 440 240 ${X - 26} 205" stroke="#B9C6CA" stroke-width="7" fill="none"/>`);
    if (f.cpap) back += hot('cpap', 'CPAP machine', `<rect x="150" y="352" width="54" height="34" rx="7" fill="#DFE3E3" stroke="#9AA4A4"/><circle cx="189" cy="369" r="7" fill="#BCC4C4"/><path d="M170 352 C 170 330 200 326 214 312" stroke="#BCC4C4" stroke-width="3" fill="none"/>`);
    // patient
    const person = f.empty
      ? `<rect x="${X - 236}" y="${B}" width="472" height="140" rx="10" fill="var(--scene-blanket)" opacity=".8"/><rect x="${X - 90}" y="${B - 20}" width="180" height="26" rx="10" fill="var(--scene-sheet)"/><text x="${X}" y="${B + 70}" text-anchor="middle" fill="var(--ink-2)" font-size="18" font-family="Source Serif 4, serif" font-style="italic">${f.emptyText || 'Bed stripped. Transferred to ICU.'}</text>`
      : `<g class="pt" data-act="poke" tabindex="0" role="button" aria-label="Speak to ${def.name}">${R.place(def.id, 'bed', v, `translate(${X} 150)`, 'room:' + def.id)}</g>`;
    if (f.elevated && !f.empty) front += hot('leg', 'Elevated left leg', `<rect x="${X + 70}" y="${B + 4}" width="160" height="58" rx="20" fill="#fff" opacity="0"/><path d="M${X + 96} ${B + 22} q 44 -10 96 2" stroke="#D8918A" stroke-width="4" stroke-dasharray="3 4" fill="none" opacity=".75"/>`);
    // foley
    if (f.foley) front += hot('foley', 'Foley bag', `<g transform="translate(${X + 170} 392)"><path d="M0 0 q-8 16 4 30" stroke="#E7D98F" stroke-width="3" fill="none"/><rect x="-14" y="26" width="36" height="40" rx="6" fill="#F7EBA4" stroke="#B9AD6A"/></g>`);
    // bed frame and alarm
    front += `<rect x="${X - 242}" y="402" width="484" height="14" rx="5" fill="var(--scene-bedframe)"/><rect x="${X - 224}" y="416" width="9" height="22" fill="var(--scene-bedframe)"/><rect x="${X + 215}" y="416" width="9" height="22" fill="var(--scene-bedframe)"/>`;
    let alarm = '';
    if (f.fallPrec) alarm = hot('alarm', 'Fall precautions', `<rect x="${X - 230}" y="398" width="46" height="8" rx="3" fill="#F0B64A" class="alarm-lamp"/><rect x="${X - 180}" y="420" width="140" height="10" rx="3" fill="#6B8F9A" opacity=".6"/>`);
    else if (def.id === '416' && !f.empty) alarm = hot('alarm', 'Bed rails and alarm', `<rect x="${X - 232}" y="300" width="18" height="90" rx="4" fill="#fff" fill-opacity="0" stroke="#A7B3B2" stroke-width="2" stroke-dasharray="4 4"/>`);
    // overbed table and its contents
    let tbl = '';
    if (f.tray && f.tray !== 'none') tbl += hot('tray', 'Meal tray', `<rect x="776" y="278" width="66" height="14" rx="3" fill="#DFE4E2"/>${f.tray === 'full' || f.tray === 'untouched' ? `<ellipse cx="796" cy="277" rx="14" ry="6" fill="#F5E7C8"/><ellipse cx="824" cy="277" rx="10" ry="5" fill="#E9C77F"/>` : f.tray === 'barely' ? `<ellipse cx="796" cy="277" rx="14" ry="6" fill="#F5E7C8"/><ellipse cx="824" cy="277" rx="5" ry="3" fill="#E9C77F"/>` : f.tray === 'soup' ? `<rect x="786" y="248" width="22" height="30" rx="5" fill="#B4453B"/><rect x="786" y="244" width="22" height="6" rx="2" fill="#7C2F28"/>` : f.tray === 'renal' ? `<path d="M782 272 q14 -14 30 -4 q-14 2 -30 4Z" fill="#F2CF4A" stroke="#B8962A"/><rect x="818" y="256" width="14" height="20" rx="2" fill="#F5A031" opacity=".9"/><ellipse cx="800" cy="277" rx="12" ry="4" fill="#E9D7B0"/>` : `<rect x="784" y="262" width="14" height="16" rx="2" fill="#F2B85B" opacity=".85"/><rect x="804" y="266" width="16" height="10" rx="2" fill="#D85F60" opacity=".75"/>`}`);
    if (f.soda) tbl += hot('soda', 'Large soda cup', `<path d="M850 240 L872 240 L868 292 L854 292Z" fill="#E24B3F"/><rect x="848" y="236" width="26" height="6" rx="2" fill="#fff"/><path d="M864 236 L870 216" stroke="#fff" stroke-width="3"/>`);
    if (f.is) tbl += hot('is', 'Incentive spirometer', `<rect x="850" y="248" width="24" height="44" rx="4" fill="${f.isUsed ? '#DFF1F7' : '#E6EEF1'}" stroke="#7EA9B8"/><circle cx="862" cy="${f.isUsed ? 262 : 284}" r="4.5" fill="#3D86A3"/>${f.isUsed ? '' : `<path d="M846 246 L878 294" stroke="#C5CED1" stroke-width="1.3"/>`}`);
    if (f.aids) tbl += hot('aids', 'Glasses and hearing aids', `<rect x="778" y="280" width="34" height="12" rx="5" fill="#6D4A63"/><circle cx="824" cy="284" r="7" fill="none" stroke="#3A3A3E" stroke-width="2.2"/><circle cx="842" cy="284" r="7" fill="none" stroke="#3A3A3E" stroke-width="2.2"/><path d="M831 284 h4" stroke="#3A3A3E" stroke-width="2"/>`);
    if (f.tablet) tbl += hot('tablet', 'Tablet', `<rect x="776" y="${f.tray && f.tray !== 'none' ? 270 : 286}" width="46" height="6" rx="2" fill="#2D3438"/><rect x="780" y="${f.tray && f.tray !== 'none' ? 267 : 283}" width="38" height="3" fill="#6FA0C4"/>`);
    if (f.gingerale) tbl += hot('gingerale', 'Ginger ale', `<rect x="852" y="266" width="14" height="26" rx="3" fill="#7BB070"/><rect x="852" y="270" width="14" height="6" fill="#E8E0B8"/>`);
    if (f.flowers) tbl += hot('flowers', 'Card on the table', `<path d="M850 264 L876 264 L876 292 L850 292Z" fill="#FFF6E8" stroke="#D5C7AD"/><path d="M856 274 q6 -6 12 0" stroke="#E07A5F" stroke-width="2" fill="none"/>`);
    front += `<g><rect x="764" y="292" width="124" height="11" rx="3" fill="var(--scene-table)"/><rect x="820" y="303" width="9" height="100" fill="#8A8F91"/><rect x="796" y="400" width="56" height="8" rx="3" fill="#6F7577"/>${tbl}</g>`;
    if (f.consent) tbl += hot('consent', 'Clipboard', `<rect x="840" y="262" width="30" height="30" rx="3" fill="#C7A57A"/><rect x="844" y="266" width="22" height="24" fill="#FAFAF7"/><path d="M848 272 h14 M848 277 h14 M848 282 h9" stroke="#9AA" stroke-width="1.3"/>`);
    if (f.thermos) tbl += hot('thermos', 'Thermos', `<rect x="784" y="248" width="16" height="44" rx="5" fill="#3E7C6E"/><rect x="782" y="244" width="20" height="8" rx="3" fill="#2C5A50"/>`);
    if (f.walker) front += hot('walker', 'Walker', `<g transform="translate(930 250)"><rect x="-6" y="-6" width="62" height="168" fill="#fff" fill-opacity="0"/><path d="M0 0 L10 150 M50 0 L40 150 M0 0 H50 M4 60 H46" stroke="#9AA6A9" stroke-width="5" fill="none"/><circle cx="10" cy="152" r="5" fill="#555"/><circle cx="40" cy="152" r="5" fill="#555"/></g>`);
    if (f.family) front += hot('family', f.familyLabel || 'Family at the bedside', `<rect x="900" y="286" width="126" height="116" rx="14" fill="#8B6F5A"/><rect x="908" y="240" width="110" height="60" rx="14" fill="#9C7F69"/>${R.place(f.family, 'bust', null, 'translate(963 250) scale(.62)', 'room:' + f.family)}<rect x="900" y="330" width="126" height="72" rx="12" fill="#8B6F5A"/>`);
    front += alarm;
    const light = callLight ? `<circle cx="1004" cy="30" r="10" fill="#F0B64A" class="blink"/>` : '';
    return `<svg class="scene" viewBox="0 30 1030 410" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Room ${def.room}. ${def.name} in bed. Select objects in the room to inspect them, or ${def.short} to speak with them.">
      <defs><linearGradient id="${gid}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s2}"/><stop offset="1" stop-color="${s1}"/></linearGradient>
      <radialGradient id="${gid}v" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="${tension ? '#5a0f0a' : '#000'}" stop-opacity="${tension ? '.38' : '.12'}"/></radialGradient></defs>
      <rect width="1030" height="440" fill="var(--scene-wall)"/><rect y="378" width="1030" height="62" fill="var(--scene-floor)"/><path d="M0 378 H1030" stroke="var(--scene-trim)" stroke-width="5"/>
      <polygon points="40,212 222,212 470,440 0,440" fill="${s1}" opacity=".16"/>
      <g><rect x="40" y="42" width="182" height="170" rx="5" fill="url(#${gid}s)" stroke="var(--scene-frame)" stroke-width="9"/><path d="M40 176 q44 -26 90 -8 q44 14 92 -12 V212 H40Z" fill="#8AA99A" opacity=".55"/>${isNight(s.t) ? '<circle cx="178" cy="78" r="13" fill="#F4EBD0" opacity=".9"/><circle cx="184" cy="74" r="11" fill="#2a3558" opacity=".9"/><circle cx="70" cy="64" r="1.6" fill="#fff"/><circle cx="104" cy="96" r="1.2" fill="#fff"/><circle cx="200" cy="112" r="1.2" fill="#fff"/>' : ''}<path d="M131 42 V212 M40 127 H222" stroke="var(--scene-frame)" stroke-width="5"/></g>
      ${back}${person}${front}${light}
      ${isNight(s.t) ? '<rect width="1030" height="440" fill="#0a1230" opacity=".2" pointer-events="none"/>' : ''}<rect width="1030" height="440" fill="url(#${gid}v)" pointer-events="none"/>
    </svg>`;
  }

  /* Hallway with four doors. */
  function hallway(s, doors) {
    const gid = 'h' + (++uid);
    const n = doors.length, x0 = 170, span = 1060 - x0 - 20, dw = Math.min(150, (span - (n - 1) * 30) / n), gap = n > 1 ? (span - n * dw) / (n - 1) : 0;
    const d = doors.map((o, i) => {
      const x = x0 + i * (dw + gap);
      if (o.pending) return `<g class="door pending" aria-label="Room ${o.room}, admission arriving">
        <rect x="${x - 10}" y="58" width="${dw + 20}" height="232" rx="4" fill="var(--scene-trim)"/><rect x="${x}" y="68" width="${dw}" height="222" rx="2" fill="var(--door)" opacity=".45"/>
        <rect x="${x + dw / 2 - 30}" y="24" width="60" height="22" rx="3" fill="var(--scene-panel)"/>
        <text x="${x + dw / 2}" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" font-family="Public Sans, sans-serif">${o.room}</text>
        <text x="${x + dw / 2}" y="170" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="Public Sans, sans-serif">Admission</text>
        <text x="${x + dw / 2}" y="188" text-anchor="middle" font-size="13" fill="var(--ink)" font-family="Public Sans, sans-serif">${o.eta}</text></g>`;
      return `<g class="door ${o.state || ''}" data-act="goto" data-pid="${o.pid}" tabindex="0" role="button" aria-label="Enter room ${o.room}, ${o.name}${o.alert ? ', ' + o.alert : ''}">
        <rect x="${x - 10}" y="58" width="${dw + 20}" height="232" rx="4" fill="var(--scene-trim)"/>
        <rect x="${x}" y="68" width="${dw}" height="222" rx="2" fill="var(--door)"/>
        <rect x="${x + dw - 46}" y="92" width="30" height="80" rx="2" fill="${o.gone ? 'var(--scene-wall)' : 'var(--door-glass)'}" opacity=".85"/>
        <rect x="${x + 16}" y="176" width="10" height="26" rx="3" fill="#a3aaa8"/>
        <rect x="${x + dw / 2 - 30}" y="24" width="60" height="22" rx="3" fill="var(--scene-panel)"/>
        <text x="${x + dw / 2}" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" font-family="Public Sans, sans-serif">${o.room}</text>
        <circle cx="${x + dw / 2 + 44}" cy="35" r="7" fill="${o.light ? '#f0b64a' : 'var(--line)'}" class="${o.light ? 'blink' : ''}"/>
        <rect class="door-hi" x="${x}" y="68" width="${dw}" height="222" rx="2" fill="#fff" opacity="0"/>
      </g>`;
    }).join('');
    const warm = sky(s.t)[0];
    return `<svg class="hall" viewBox="0 0 1060 300" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Hallway. Rooms 412 to 418.">
      <defs><linearGradient id="${gid}" x1="0" x2="1"><stop offset="0" stop-color="${warm}" stop-opacity=".45"/><stop offset=".5" stop-color="${warm}" stop-opacity="0"/></linearGradient></defs>
      <rect width="1060" height="300" fill="var(--scene-wall)"/><rect y="290" width="1060" height="10" fill="var(--scene-floor)"/>
      <rect y="206" width="1060" height="6" fill="var(--scene-trim)"/>
      <rect x="18" y="80" width="112" height="200" rx="4" fill="var(--scene-panel)"/><rect x="30" y="92" width="88" height="54" rx="3" fill="#0f1b1f"/>
      <text x="74" y="126" text-anchor="middle" font-size="16" font-weight="700" fill="#9fe0b8" font-family="Public Sans, sans-serif">${S.engine.clock(s.t)}</text>
      <text x="74" y="176" text-anchor="middle" font-size="12" fill="var(--ink-2)" font-family="Public Sans, sans-serif">4 West</text>
      ${d}
      <rect width="1060" height="300" fill="url(#${gid})" pointer-events="none"/>
    </svg>`;
  }

  S.art = { room, hallway };
})(window.Shift);
