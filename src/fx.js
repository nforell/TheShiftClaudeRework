/* The Shift — sound. Everything is synthesized live: no audio files, no loops.
   Music: a generative ambient score. A slow chord progression drifts through a Markov chain, a pad breathes
   under it, and sparse bell phrases are composed on the fly, so the score never repeats. It listens to the
   shift: tension darkens the harmony and brings in a heartbeat, night lowers the register, a turning point
   resolves home.
   Effects are tuned to whatever chord is playing, so every tap lands in harmony, and quick runs of choices
   climb the scale. Sounds confirm that something registered; they never grade a choice, except where the
   game already shows the answer (triage reveal) or the patient's condition visibly changed. */
(function (S) {
  let ctx = null, master = null, sfx = null, mus = null, verbIn = null, dly = null, on = true, musicOn = true, started = false;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  /* ------------ graph ------------ */
  function impulse(c, secs, decay) {
    const len = Math.floor(c.sampleRate * secs), b = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }
  // Safari rejects suspend/resume when it isn't ready (backgrounded, interrupted by a call, no user gesture yet).
  // The rejection is harmless, so swallow it instead of letting it reach the crash guard.
  const quiet = (p) => { try { if (p && typeof p.catch === 'function') p.catch(() => {}); } catch (e) { /* ignore */ } };
  function audio() {
    if (!on && !musicOn) return null;
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) { on = false; musicOn = false; return null; }
        ctx = new AC();
        const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.connect(ctx.destination);
        master = ctx.createGain(); master.gain.value = .9; master.connect(comp);
        sfx = ctx.createGain(); sfx.gain.value = .42; sfx.connect(master);
        mus = ctx.createGain(); mus.gain.value = 0; mus.connect(master);
        // One shared hall: a long, dark convolution reverb, plus a filtered tape-ish delay feeding it.
        const verb = ctx.createConvolver(); verb.buffer = impulse(ctx, 4.2, 2.6);
        const vlp = ctx.createBiquadFilter(); vlp.type = 'lowpass'; vlp.frequency.value = 4200;
        const vout = ctx.createGain(); vout.gain.value = .85;
        verbIn = ctx.createGain(); verbIn.connect(verb); verb.connect(vlp); vlp.connect(vout); vout.connect(master);
        dly = ctx.createDelay(2); dly.delayTime.value = .43;
        const fb = ctx.createGain(); fb.gain.value = .34; const dlp = ctx.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 2200;
        dly.connect(dlp); dlp.connect(fb); fb.connect(dly); dlp.connect(verbIn); dlp.connect(mus);
        document.addEventListener('visibilitychange', () => { if (!ctx) return; try { quiet(document.hidden ? ctx.suspend() : ctx.resume()); } catch (e) { /* closed */ } });
      }
      if (ctx.state !== 'running' && ctx.state !== 'closed' && !document.hidden) quiet(ctx.resume());
      if (musicOn && !started) startMusic();
      return ctx;
    } catch (e) { on = false; musicOn = false; return null; }
  }

  /* ------------ harmony: the key everything shares ------------ */
  const ROOT = 146.83;                                    // D3
  const hz = (semi) => ROOT * Math.pow(2, semi / 12);
  const CALM = {
    I: [0, 7, 11, 14, 16], IV: [5, 12, 16, 19, 21], vi: [-3, 7, 11, 12, 16], ii: [2, 9, 12, 16, 17], iii: [-8, 7, 11, 14, 19], V: [-5, 9, 12, 14, 19], Isus: [0, 7, 9, 14, 19],
  };
  const CALM_NEXT = { I: ['IV', 'vi', 'ii', 'Isus', 'iii'], Isus: ['I', 'IV', 'vi'], IV: ['I', 'ii', 'vi', 'V', 'Isus'], vi: ['IV', 'ii', 'iii', 'I'], ii: ['V', 'IV', 'vi'], iii: ['vi', 'IV'], V: ['I', 'vi', 'Isus'] };
  const TENSE = { i: [0, 7, 10, 14, 15], bVI: [-4, 7, 12, 15, 19], iv: [5, 12, 15, 17, 20], bVII: [-2, 9, 14, 17, 22], v: [-5, 10, 14, 17, 19], isus: [0, 7, 12, 14, 17] };
  const TENSE_NEXT = { i: ['bVI', 'iv', 'bVII', 'isus'], isus: ['i', 'bVI'], bVI: ['bVII', 'iv', 'i'], iv: ['i', 'bVII', 'v'], bVII: ['i', 'bVI', 'isus'], v: ['i', 'bVI'] };
  const H = { name: 'I', set: 'calm', notes: CALM.I, nextAt: 0, bellAt: 0, beatAt: 0 };
  const mood = { scene: 'home', tension: 0, night: false, duckUntil: 0 };
  // Scale for effects: current chord tones plus the D major pentatonic, in a bright register.
  function palette() {
    const pcs = new Set(H.notes.map((n) => ((n % 12) + 12) % 12)); (H.set === 'tense' ? [0, 3, 7, 10] : [0, 2, 4, 7, 9]).forEach((p) => pcs.add(p));
    const out = []; for (let s = 12; s <= 44; s++) if (pcs.has(((s % 12) + 12) % 12)) out.push(s); return out;
  }
  const keyNote = (i) => { const p = palette(); return hz(p[clamp(Math.round(i), 0, p.length - 1)]); };

  /* ------------ voices ------------ */
  function tone(f, at, dur, o) {
    o = o || {};
    const c = ctx, t = c.currentTime + at, osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.detune) osc.detune.value = o.detune;
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + (o.glide || dur * .6));
    const peak = o.gain || .2;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + (o.attack || .004)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    let node = osc;
    if (o.lp) { const f2 = c.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = o.lp; osc.connect(f2); node = f2; }
    node.connect(g);
    let out = g;
    if (o.pan !== undefined && c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = o.pan; g.connect(p); out = p; }
    out.connect(o.bus || sfx);
    if (o.verb) { const s2 = c.createGain(); s2.gain.value = o.verb; out.connect(s2); s2.connect(verbIn); }
    if (o.echo) { const s3 = c.createGain(); s3.gain.value = o.echo; out.connect(s3); s3.connect(dly); }
    osc.start(t); osc.stop(t + dur + .05);
  }
  function click(at, o) {
    o = o || {};
    const c = ctx, t = c.currentTime + at, len = Math.floor(c.sampleRate * .018), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = o.f || 3200; bp.Q.value = o.q || 1.4;
    const g = c.createGain(); g.gain.value = o.gain || .22;
    src.connect(bp); bp.connect(g); g.connect(sfx); src.start(t);
  }
  // A soft glassy pluck: fundamental plus a quiet bell partial, into the hall.
  function pluck(f, at, o) {
    o = o || {};
    tone(f, at, o.dur || .5, { gain: o.gain || .1, type: 'sine', verb: o.verb === undefined ? .35 : o.verb, echo: o.echo || 0, pan: o.pan });
    tone(f * 2.005, at, (o.dur || .5) * .55, { gain: (o.gain || .1) * .28, type: 'sine', verb: .3, pan: o.pan });
    if (o.shine) tone(f * 4.01, at, .18, { gain: (o.gain || .1) * .12, type: 'sine', verb: .5 });
  }
  const thock = (g) => tone(165, 0, .075, { to: 85, glide: .05, gain: g || .24, type: 'sine' });

  /* ------------ the score ------------ */
  let padFilter = null;
  function startMusic() {
    if (!ctx || started) return; started = true;
    padFilter = ctx.createBiquadFilter(); padFilter.type = 'lowpass'; padFilter.frequency.value = 900; padFilter.Q.value = .6;
    const padGain = ctx.createGain(); padGain.gain.value = 1; padFilter.connect(padGain); padGain.connect(mus);
    const ps = ctx.createGain(); ps.gain.value = .45; padGain.connect(ps); ps.connect(verbIn);
    // Filter breathing: a very slow LFO, so the pad opens and closes like breath rather than pulsing.
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .031; lg.gain.value = 260; lfo.connect(lg); lg.connect(padFilter.frequency); lfo.start();
    // Room tone: a whisper of air handling, band-limited noise that drifts. Long buffer, irregular LFO.
    const len = ctx.sampleRate * 9, nb = ctx.createBuffer(1, len, ctx.sampleRate), nd = nb.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b0 = .997 * b0 + w * .029; b1 = .985 * b1 + w * .032; b2 = .95 * b2 + w * .048; nd[i] = (b0 + b1 + b2) * .5; }
    const ns = ctx.createBufferSource(); ns.buffer = nb; ns.loop = true; ns.playbackRate.value = .93;
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 380; nf.Q.value = .4;
    const ng = ctx.createGain(); ng.gain.value = .05; ns.connect(nf); nf.connect(ng); ng.connect(mus); ns.start();
    const nl = ctx.createOscillator(), nlg = ctx.createGain(); nl.frequency.value = .017; nlg.gain.value = 120; nl.connect(nlg); nlg.connect(nf.frequency); nl.start();
    H.nextAt = ctx.currentTime + .2; H.bellAt = ctx.currentTime + 3; H.beatAt = ctx.currentTime + 1;
    setInterval(schedule, 200);
    fadeMusic();
  }
  function fadeMusic() {
    if (!mus) return;
    const base = mood.scene === 'home' ? .5 : mood.scene === 'debrief' ? .48 : .38;
    const target = !musicOn ? 0 : ctx.currentTime < mood.duckUntil ? base * .3 : base;
    mus.gain.setTargetAtTime(target, ctx.currentTime, musicOn ? 1.2 : .4);
  }
  function nextChord() {
    const tense = mood.tension > .45 && mood.scene === 'play';
    const set = tense ? 'tense' : 'calm', T = tense ? TENSE : CALM, N = tense ? TENSE_NEXT : CALM_NEXT;
    let name;
    if (H.forced) { name = H.forced; H.forced = null; }
    else if (set !== H.set) name = tense ? pick(['i', 'isus', 'bVI']) : pick(['I', 'IV', 'Isus']);
    else name = pick(N[H.name] || Object.keys(T));
    H.set = TENSE[name] ? 'tense' : 'calm';
    H.name = name; H.notes = (TENSE[name] || CALM[name]);
  }
  function padChord(t0, dur) {
    const shift = mood.night ? -2 : 0, bright = clamp(1150 - mood.tension * 420 - (mood.night ? 260 : 0) + (mood.scene === 'home' ? 150 : 0), 380, 1600);
    padFilter.frequency.setTargetAtTime(bright, t0, 3);
    const atk = rnd(3.5, 5.5), rel = rnd(5, 7);
    // Voicing: root low, then three or four upper tones; each voice two saws detuned for width.
    H.notes.forEach((n, i) => {
      const f = hz(n + shift - (i === 0 ? 12 : 0)), lvl = i === 0 ? .05 : .026 * rnd(.8, 1.1);
      [-7, 6].forEach((det) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = i === 0 ? 'triangle' : 'sawtooth'; o.frequency.value = f; o.detune.value = det + rnd(-2, 2);
        g.gain.setValueAtTime(.0001, t0); g.gain.linearRampToValueAtTime(lvl, t0 + atk); g.gain.setValueAtTime(lvl, t0 + dur); g.gain.linearRampToValueAtTime(.0001, t0 + dur + rel);
        o.connect(g); g.connect(padFilter); o.start(t0); o.stop(t0 + dur + rel + .1);
      });
    });
    // Sub: the root, felt more than heard.
    const so = ctx.createOscillator(), sg = ctx.createGain(); so.frequency.value = hz(H.notes[0] + shift - 24);
    sg.gain.setValueAtTime(.0001, t0); sg.gain.linearRampToValueAtTime(.11, t0 + atk); sg.gain.setValueAtTime(.11, t0 + dur); sg.gain.linearRampToValueAtTime(.0001, t0 + dur + rel);
    so.connect(sg); sg.connect(mus); so.start(t0); so.stop(t0 + dur + rel + .1);
  }
  // Bells: short phrases composed from the chord, stepping through the scale, never the same twice.
  let lastIdx = 6;
  function bellPhrase(t0) {
    const p = palette(), n = Math.random() < .55 ? 1 : Math.random() < .7 ? 2 : pick([3, 4]), dir = pick([-1, 1]);
    let idx = clamp(lastIdx + Math.round(rnd(-3, 3)), 2, p.length - 4);
    const low = mood.night ? -12 : 0, gap = rnd(.28, .6);
    for (let k = 0; k < n; k++) {
      const f = hz(p[idx] + low), at = t0 - ctx.currentTime + k * gap * rnd(.85, 1.2), pan = rnd(-.6, .6), g = rnd(.035, .06) * (1 - mood.tension * .35);
      tone(f, at, rnd(2.4, 4), { gain: g, type: 'sine', bus: mus, verb: .7, echo: .28, pan, attack: .008 });
      tone(f * 2.76, at, 1.2, { gain: g * .16, type: 'sine', bus: mus, verb: .8, pan });
      idx = clamp(idx + dir * pick([1, 1, 2]), 1, p.length - 2);
    }
    lastIdx = idx;
  }
  function beat(t0) {
    const at = t0 - ctx.currentTime, g = .07 + mood.tension * .07;
    tone(62, at, .2, { gain: g, type: 'sine', to: 42, glide: .14, bus: mus });
    tone(58, at + .26, .22, { gain: g * .7, type: 'sine', to: 40, glide: .15, bus: mus });
  }
  function schedule() {
    if (!ctx || !musicOn || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    fadeMusic();
    if (now >= H.nextAt - .1) {
      nextChord();
      const dur = mood.tension > .45 ? rnd(7, 11) : rnd(10, 17);
      padChord(Math.max(now, H.nextAt), dur);
      H.nextAt = Math.max(now, H.nextAt) + dur;
    }
    if (now >= H.bellAt) {
      bellPhrase(now + .05);
      const density = mood.scene === 'home' ? 1 : mood.scene === 'debrief' ? 1.2 : .8 - mood.tension * .35;
      H.bellAt = now + rnd(2.2, 7.5) / Math.max(.3, density);
    }
    if (mood.tension > .55 && mood.scene === 'play' && now >= H.beatAt) { beat(now + .05); H.beatAt = now + 60 / (62 + mood.tension * 26); }
  }

  /* ------------ effects ------------ */
  let streak = 0, lastSel = 0;
  const climb = () => { const n = performance.now(); streak = n - lastSel < 1400 ? streak + 1 : 0; lastSel = n; return 4 + Math.min(streak, 9); };
  const SOUNDS = {
    // Plain buttons, tabs, navigation: a crisp switch with body.
    tap() { thock(.1); click(0, { f: 2600, q: 1.1, gain: .15 }); },
    // Choosing an answer or toggling on: switch plus a pluck in the current chord. Quick runs climb the scale.
    select() { thock(.09); click(0, { f: 3000, gain: .14 }); pluck(keyNote(climb()), .004, { gain: .1, dur: .42 }); },
    deselect() { thock(.08); click(0, { f: 2200, gain: .12 }); pluck(keyNote(Math.max(2, 4 + streak - 2)), 0, { gain: .08, dur: .3, verb: .2 }); streak = Math.max(0, streak - 1); },
    // Committing (give, hold, call, lock in): a heavy press and a two-note chime from the chord.
    commit() { thock(.15); click(0, { f: 2600, gain: .16 }); const b = 5 + (streak % 3); pluck(keyNote(b), .01, { gain: .12, dur: .6 }); pluck(keyNote(b + 2), .09, { gain: .11, dur: 1, echo: .2, shine: true }); },
    // A task visibly checked off: a quick rising sparkle that resolves on a chord tone.
    check() { [0, 2, 4].forEach((k, i) => pluck(keyNote(6 + k), i * .065, { gain: .085 - i * .01, dur: .5 + i * .2, shine: i === 2, echo: i === 2 ? .25 : 0 })); tone(keyNote(13), .2, .9, { gain: .02, type: 'sine', verb: .8 }); },
    nope() { tone(210, 0, .08, { gain: .12, type: 'square', lp: 700 }); tone(170, .09, .11, { gain: .11, type: 'square', lp: 600 }); click(0, { f: 900, gain: .12 }); },
    time() { tone(1180, 0, .06, { gain: .05, type: 'sine', to: 900, glide: .04 }); },
    // A new message: two soft notes from the chord, like a distant chime at the desk.
    msg() { pluck(keyNote(7), 0, { gain: .07, dur: .5 }); pluck(keyNote(9), .11, { gain: .065, dur: .8, echo: .2 }); },
    urgent() { [0, .16, .32].forEach((t) => tone(hz(27), t, .12, { gain: .1, type: 'square', lp: 1400 })); },
    right() { [0, 2, 4, 7].forEach((k, i) => pluck(keyNote(4 + k), i * .08, { gain: .1, dur: .9, shine: i === 3, echo: .15 })); },
    miss() { pluck(keyNote(6), 0, { gain: .08, dur: .5, verb: .2 }); pluck(keyNote(4), .12, { gain: .07, dur: .7, verb: .2 }); },
    // A critical event: two heavy heartbeats, a low cluster, and the music drops out of the way and darkens.
    crit() {
      [0, .28].forEach((at, i) => { tone(70, at, .22, { gain: .34 - i * .06, type: 'sine', to: 44, glide: .16 }); click(at, { f: 500, q: .8, gain: .14 }); });
      tone(hz(3), .62, 1.4, { gain: .06, type: 'triangle', lp: 1100, verb: .5 }); tone(hz(4), .62, 1.4, { gain: .045, type: 'triangle', lp: 1100, verb: .5 }); tone(hz(-12), .62, 1.6, { gain: .07, type: 'sine' });
      mood.duckUntil = ctx.currentTime + 3.5; H.forced = pick(['i', 'isus']); H.set = 'tense'; H.nextAt = Math.min(H.nextAt, ctx.currentTime + 3);
    },
    // The patient's condition changed after what you did.
    worse() { tone(hz(15), 0, .5, { gain: .08, type: 'triangle', lp: 1200, to: hz(13), glide: .35, verb: .3 }); tone(hz(1), .14, .8, { gain: .07, type: 'sine', verb: .3 }); H.nextAt = Math.min(H.nextAt, ctx.currentTime + 2.5); },
    better() {
      [0, 4, 7, 12].forEach((k, i) => pluck(hz(12 + k), i * .09, { gain: .085, dur: 1.1 + i * .2, echo: .15, shine: i === 3 }));
      H.forced = 'I'; H.set = 'calm'; H.nextAt = Math.min(H.nextAt, ctx.currentTime + 1.2);   // the score resolves home with you
    },
    open() { tone(420, 0, .12, { to: 620, glide: .08, gain: .045, type: 'sine' }); },
    // Time passing at the station: a soft rising sweep, a tick of the clock at the end.
    whoosh() { tone(180, 0, .7, { gain: .05, type: 'triangle', to: 900, glide: .6, lp: 1600, verb: .5 }); tone(260, .05, .6, { gain: .03, type: 'sine', to: 1300, glide: .5, verb: .5 }); [0.2, 0.42, 0.62].forEach((at) => click(at, { f: 3200, gain: .05 })); },
    // A streak multiplier going up: a quick climb that lands high.
    combo() { [0, 2, 4, 7, 9].forEach((k, i) => pluck(keyNote(5 + k), i * .045, { gain: .08, dur: .5 + i * .1, shine: i >= 3, echo: i === 4 ? .25 : 0 })); },
    // A star or a goal: one bright bell with a shimmer.
    star() { pluck(keyNote(11), 0, { gain: .11, dur: 1.2, shine: true, echo: .3 }); pluck(keyNote(14), .06, { gain: .06, dur: 1.4, shine: true, verb: .6 }); tone(keyNote(18), .1, 1.2, { gain: .018, type: 'sine', verb: .9 }); },
    // Level up: a little fanfare, resolving home.
    levelup() { [0, 4, 7, 12, 16].forEach((k, i) => pluck(hz(12 + k), i * .11, { gain: .1, dur: 1.2 + i * .15, echo: .2, shine: i >= 3 })); tone(hz(0), .5, 1.8, { gain: .05, type: 'sine', verb: .6 }); H.forced = 'I'; H.set = 'calm'; },
  };
  const BUZZ = { crit: [70, 140, 90, 260, 40], worse: [40, 60, 40], better: 10, check: [6, 40, 10], select: 6, deselect: 4, commit: [14, 40, 18], nope: [18, 50, 18], urgent: [30, 60, 30, 60, 30], right: 12, miss: [8, 30, 8], star: [10, 30, 16], combo: [6, 20, 6, 20, 10], levelup: [20, 40, 20, 40, 30] };

  let last = 0;
  function play(name) {
    const now = performance.now();
    if (name === 'tap' && now - last < 40) return;   // don't stack a tap on top of a richer sound
    last = now;
    if (on && navigator.vibrate && BUZZ[name]) { try { navigator.vibrate(BUZZ[name]); } catch (e) { /* not supported */ } }
    const c = audio(); if (!c || !on || !SOUNDS[name]) return;
    try { SOUNDS[name](); } catch (e) { /* audio is best-effort */ }
  }
  function setMood(m) {
    const prevT = mood.tension; Object.assign(mood, m);
    if (!ctx || !started) return;
    // Crossing into or out of danger turns the harmony within a couple of seconds rather than waiting out the chord.
    if ((prevT <= .45) !== (mood.tension <= .45)) H.nextAt = Math.min(H.nextAt, ctx.currentTime + 2);
    fadeMusic();
  }

  S.fx = {
    play, setMood,
    setOn(v) { on = !!v; },
    isOn: () => on,
    setMusic(v) { musicOn = !!v; if (musicOn) audio(); if (mus && ctx) fadeMusic(); },
    musicOn: () => musicOn,
    unlock() { audio(); },
    _debug: () => ({ ctx, master, H, mood }),
  };
})(window.Shift = window.Shift || {});
