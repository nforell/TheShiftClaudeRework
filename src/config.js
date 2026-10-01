/* The Shift — deployment settings. The only file you need to touch to turn on analytics and feedback.
   posthogKey: the project API key from PostHog (Project settings → Project API key, starts with "phc_").
   It is a public, write-only key; it's safe in the page. Leave it empty and nothing is ever sent:
   events stay on the device (Settings → Health check shows them) and feedback opens an email instead. */
window.Shift = window.Shift || {};
window.Shift.config = Object.assign({
  version: '0.6.0-beta',
  posthogKey: '',
  posthogHost: 'https://us.i.posthog.com',
  feedbackEmail: 'nicholasforell@gmail.com',
}, window.Shift.config || {});   // a test harness may set values first
