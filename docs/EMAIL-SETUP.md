# Email setup: professional sign-in emails and inbox copies

Supabase's built-in mailer is for testing only. It delivers only to people on your Supabase team, sends 2 emails an hour, and its emails come from a generic Supabase address with a link to `omcorltahsnnmpifefpm.supabase.co`. Testers outside the team get "Email address not authorized" and no email.

The code side is done: the branded templates link straight to the game, the game finishes the sign-in itself, and sending errors are in plain words. This page is the dashboard side. It takes about 30 minutes, most of it waiting for DNS.

## 1. A domain (once)

Emails need to come from a domain you own, like `hello@theshiftgame.com`. Buy one (Vercel → Domains, Cloudflare or Namecheap, about $10–15 a year). Optional but worth it: point the site at it too (Vercel → the project → Settings → Domains), so the game's address matches the email's.

## 2. Resend: the mail sender (free tier: 3,000 emails a month)

1. Sign up at https://resend.com.
2. **Domains → Add domain**, enter your domain, and add the DNS records it shows (SPF, DKIM and the suggested DMARC) where you bought the domain. Wait until Resend shows it as **Verified**.
3. Leave **click tracking off** for the domain. Tracking rewrites links, which breaks the sign-in link and looks like spam.
4. **API Keys → Create API key** with "Sending access". Copy it (starts with `re_`).

## 3. Supabase: send through Resend

In the Supabase dashboard for the project:

1. **Authentication → Emails → SMTP Settings → Enable custom SMTP**:
   - Sender email: `hello@<your domain>` · Sender name: `The Shift`
   - Host: `smtp.resend.com` · Port: `465` · Username: `resend` · Password: the `re_` key
2. **Authentication → Rate Limits**: emails per hour starts at 30 with custom SMTP. Raise it to 100 or so before a big invite push.
3. **Authentication → Emails → Templates**:
   - **Magic Link**: subject `Your sign-in link for The Shift`, body = everything in `supabase/email-templates/magic-link.html`.
   - **Confirm signup**: subject `Your sign-in link for The Shift`, body = everything in `supabase/email-templates/confirm-signup.html`.
   A first-time player gets "Confirm signup"; after that, "Magic Link". Both link to the game, not to supabase.co.
4. **Authentication → URL Configuration**:
   - Site URL: `https://<your domain>/play/` (or `https://the-shift-claude-rework.vercel.app/play/` if you skip the custom domain).
   - Redirect URLs: `/play/` and `/teach/` on every address the site uses, for example `https://the-shift-claude-rework.vercel.app/play/`, `https://the-shift-claude-rework.vercel.app/teach/`, and the same two on your domain. The link goes back to whichever of these the player started from.

**Test it:** sign in from the game with an email that is *not* on your Supabase team (a second Gmail works). The email should come from The Shift, have a "Sign in" button, and open the game signed in.

## 4. Inbox copies of signups, reviews and reports (optional)

Beta signups, clinical reviews, question and decision reports, and debrief feedback all go to PostHog. To also get each one by email, deploy the `notify` function. It only ever mails the one address you set.

```
npm i -g supabase                       # or: brew install supabase/tap/supabase
supabase login
supabase link --project-ref omcorltahsnnmpifefpm
supabase functions deploy notify --no-verify-jwt
supabase secrets set RESEND_API_KEY=re_... NOTIFY_TO=nicholasforell@gmail.com NOTIFY_FROM="The Shift <hello@your-domain>"
```

Then set `notify: true` in `src/config.js` and rebuild (or ask Claude to flip it). Each email's subject says what it is ("Clinical review: icu-3w-1 from Jane Doe, RN, CCRN (signed off)"), and replying goes to the reviewer or the person who signed up when they gave an email.

## What the game does with the link

The email's button is `<page they came from>#token_hash=…&type=email`. The game reads the token after `#`, trades it for a session with Supabase (`POST /auth/v1/verify`), and clears it from the address bar. Because the token is after `#`, email security scanners that pre-open links (Outlook's Safe Links, for one) can't use it up. If a link has expired or was already used, the sign-in sheet opens and says so. Links from the old Supabase template still work.
