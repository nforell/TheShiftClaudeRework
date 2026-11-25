/* The Shift — psych law, two ways.
   The psych and adolescent psych shifts are written to California law (5150, 5250, Riese, LPS, 5585). Settings →
   Psych law → General US shows plain terms that hold in most states instead. Each legal phrase is one row here:
   how the content says it (ca) and how General US says it (us). Content stays written in one voice; the game swaps
   phrases at display time, and every case that leans on California law lists the rows it uses in its `law`
   metadata, which tests/law.py checks: every California-specific phrase in that case is covered by its own rows.

   Authoring a row:
     id     stable name, listed by the cases that use it
     ca     the phrase exactly as written in the content
     us     what General US shows instead ('' removes it)
     at     'start': only at the very start of a string (for a capitalized replacement)
     lead   'optional-space': also takes one space before the phrase with it (for a parenthetical)
   Rows apply in order, so a longer phrase ("a 5150", "5150 hold") comes before the bare term ("5150"). A phrase
   that starts or ends with a letter or digit matches whole words only. */
window.Shift = window.Shift || {};
(function (S) {
  const TERMS = [
    { id: 'wic-5150', ca: 'WIC 5150', us: '72-hour involuntary hold' },
    { id: 'wic-5250', ca: 'WIC 5250', us: 'extended involuntary certification' },
    { id: 'a-5150', ca: 'a 5150', us: 'a 72-hour hold' },
    { id: '5150-hold', ca: '5150 hold', us: '72-hour hold' },
    { id: '5150', ca: '5150', us: '72-hour hold' },
    { id: 'a-5250', ca: 'a 5250', us: 'an extended certification' },
    { id: 'the-5250', ca: 'the 5250', us: 'the extended certification' },
    { id: '5250-start', ca: '5250', us: 'Extended certification', at: 'start' },
    { id: '5250', ca: '5250', us: 'extended certification' },
    { id: 'hearing-day', ca: 'the hearing is usually within a day', us: 'the hearing timeline depends on the state' },
    { id: 'riese-petition', ca: 'Riese petition', us: 'petition for court-ordered medication' },
    { id: 'riese-paren', ca: '(Riese)', us: '', lead: 'optional-space' },
    { id: 'riese', ca: 'Riese', us: 'capacity hearing' },
    { id: 'lps', ca: 'LPS conservatorship', us: 'mental health conservatorship' },
    { id: 'wic-5585', ca: 'WIC 5585', us: '72-hour involuntary hold for a minor' },
    { id: '5585', ca: '5585', us: '72-hour hold (minor)' },
    { id: 'illegal-ca', ca: 'illegal in California', us: 'a violation of federal patient rights (CMS 42 CFR 482.13)' },
    { id: 'privacy-ca', ca: 'California law protects', us: 'Privacy law protects' },
    { id: 'hours-36-ca', ca: ' (36 hours in California)', us: ' (the deadline varies by state)' },
  ];
  // What marks a string as California-specific: any whole-word statute or hearing name, or the state itself.
  const TOKENS = /\b(5150|5250|5585|Riese|LPS)\b|California/;
  const HIT = /5150|5250|5585|Riese|LPS|California/;     // a cheap pre-check before running the rows
  const escRe = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const word = (ch) => /[A-Za-z0-9]/.test(ch || '');
  const compile = (t) => {
    let src = escRe(t.ca);
    if (word(t.ca[0])) src = '\\b' + src;
    if (word(t.ca[t.ca.length - 1])) src += '\\b';
    if (t.lead === 'optional-space') src = ' ?' + src;
    if (t.at === 'start') src = '^' + src.replace(/^\\b/, '');
    return new RegExp(src, 'g');
  };
  const RULES = TERMS.map((t) => [compile(t), t.us, t.id]);
  const BY_ID = Object.fromEntries(TERMS.map((t) => [t.id, t]));
  // The text as General US reads it. `only` (a list of row ids) limits the swap to those rows: tests use it to
  // prove a case's own `law.terms` cover everything it says.
  function general(text, only) {
    let x = String(text == null ? '' : text);
    if (!HIT.test(x)) return x;
    RULES.forEach(([re, to, id]) => { if (!only || only.includes(id)) x = x.replace(re, to); });
    return x;
  }
  // mode: 'general' swaps; anything else ('ca', unset) keeps the content as written.
  const render = (text, mode) => (mode === 'general' ? general(text) : text);
  S.law = { TERMS, TOKENS, HIT, BY_ID, general, render, rules: () => RULES.map(([re, to, id]) => ({ id, re: String(re), to })) };
})(window.Shift);
