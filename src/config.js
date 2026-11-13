/* The Shift — deployment settings. The only file you need to touch to turn on analytics and feedback.
   posthogKey: the project API key from PostHog (Settings → Project → Project token, starts with "phc_").
   It is a public, write-only key; it's safe in the page. Leave it empty and nothing is ever sent:
   events stay on the device (Settings → Health check shows them) and feedback opens an email instead. */
window.Shift = window.Shift || {};
window.Shift.config = Object.assign({
  version: '0.7.0-beta',
  build: '70d719b',   // written by build.py: a short fingerprint of the source, so a tester can say which build they played
  posthogKey: 'phc_tisU8pDBvqfZjZj4Xhdur9yhtnhzqAAcmDwByf35n3Rc',
  posthogHost: 'https://us.i.posthog.com',
  feedbackEmail: 'nicholasforell@gmail.com',
  // Accounts and cloud saves (Supabase → Connect, or Project Settings → API Keys). The publishable key is meant to
  // sit in web pages; row level security in supabase/schema.sql keeps each player's data to themselves.
  // Never put the secret / service_role key here.
  supabaseUrl: 'https://omcorltahsnnmpifefpm.supabase.co',
  supabaseKey: 'sb_publishable_gXXC0_aKPHdzsZu8N6UkLg_rljVc_89',
  // Email copies of beta signups, reviews and problem reports, sent by supabase/functions/notify. Turn on after
  // deploying that function with a mail sender (docs/EMAIL-SETUP.md).
  notify: false,
  // The shift pack: a few shifts free, the rest (and every shift added later) for one payment. Off until Stripe is
  // set up (docs/ROADMAP-PROGRESS.md, Session 9). checkoutUrl is a Stripe Payment Link; its "after payment" page
  // should be https://<your site>/play/?pack=thanks. Purchases are recorded by supabase/functions/stripe-webhook.
  pack: { on: false, free: ['medsurg-4w-1', 'medsurg-4w-2', 'psych-3e-1'], price: '$12', checkoutUrl: '' },
}, window.Shift.config || {});   // a test harness may set values first
