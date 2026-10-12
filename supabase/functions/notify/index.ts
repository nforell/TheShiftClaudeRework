// The Shift: emails the developer a copy of each beta signup, clinical review, and problem report or feedback note.
// The game and the website still send these to PostHog; this is so they also land in an inbox.
//
// It only ever mails one fixed address (NOTIFY_TO), so it can't be used to send mail to anyone else.
// Mail goes out through Resend's API (https://resend.com), with a sender on a domain verified there.
//
// Deploy (docs/EMAIL-SETUP.md):
//   supabase functions deploy notify --no-verify-jwt
//   supabase secrets set RESEND_API_KEY=re_... NOTIFY_TO=you@example.com NOTIFY_FROM="The Shift <hello@yourdomain>"
// then set notify: true in src/config.js and rebuild.

const KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const TO = Deno.env.get('NOTIFY_TO') ?? '';
const FROM = Deno.env.get('NOTIFY_FROM') ?? '';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'apikey, content-type, authorization, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const SUBJECT: Record<string, (f: Record<string, unknown>) => string> = {
  signup: (f) => `Beta signup: ${f.email ?? ''}${f.role ? ` (${f.role})` : ''}`,
  clinical_review: (f) => `Clinical review: ${f.case ?? ''} from ${f.reviewer ?? ''}${f.credentials ? `, ${f.credentials}` : ''}${f.signoff ? ' (signed off)' : ''}`,
  question: (f) => `Question reported: ${f.question_id ?? ''}${f.problem ? ` (${f.problem})` : ''}`,
  decision: (f) => `Decision reported: ${f.case ?? ''}${f.problem ? ` (${f.problem})` : ''}`,
  general: (f) => `Problem reported${f.case ? `: ${f.case}` : ''}`,
  debrief: (f) => `Feedback${f.case ? ` on ${f.case}` : ''}${f.would_pay ? ` (would pay: ${f.would_pay})` : ''}`,
};

// A light per-address throttle, so one person can't flood the inbox. Resets when the function instance recycles.
const seen = new Map<string, number[]>();
const tooMany = (ip: string) => {
  const now = Date.now(), t = (seen.get(ip) ?? []).filter((x) => now - x < 3600_000);
  t.push(now); seen.set(ip, t);
  return t.length > 30;
};
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json(405, { error: 'POST only' });
  if (!KEY || !TO || !FROM) return json(503, { error: 'not configured' });
  const raw = await req.text();
  if (raw.length > 100_000) return json(413, { error: 'too large' });
  let b: { kind?: string; fields?: Record<string, unknown>; version?: string; page?: string };
  try { b = JSON.parse(raw); } catch { return json(400, { error: 'bad json' }); }
  const kind = String(b.kind ?? ''), f = b.fields && typeof b.fields === 'object' ? b.fields : {};
  if (!SUBJECT[kind]) return json(400, { error: 'unknown kind' });
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (tooMany(ip)) return json(429, { error: 'slow down' });

  // A long review's full text goes last; everything else is one "field: value" line each.
  const long = typeof f.text === 'string' ? f.text : '';
  const lines = Object.entries(f).filter(([k, v]) => k !== 'text' && v !== '' && v != null).map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`);
  const text = [...lines, '', `version: ${b.version ?? ''}`, `page: ${b.page ?? ''}`, long ? `\n----\n${long}` : ''].join('\n');
  const reply = typeof f.reviewer_email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.reviewer_email) ? f.reviewer_email
    : typeof f.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) ? f.email : undefined;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [TO], subject: '[The Shift] ' + SUBJECT[kind](f).slice(0, 180), text, ...(reply ? { reply_to: reply } : {}) }),
  });
  if (!r.ok) return json(502, { error: 'mail failed', status: r.status });
  return json(200, { ok: true });
});
