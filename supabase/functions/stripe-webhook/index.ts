// The Shift: records shift pack purchases. Stripe calls this after a payment; it writes one row to
// public.entitlements, which the game reads to unlock every shift.
//
// Runs on Supabase Edge Functions. The service role key it uses to write is provided by Supabase inside the
// function's environment (SUPABASE_SERVICE_ROLE_KEY). It is never in the game or the website.
//
// Deploy (see docs/ROADMAP-PROGRESS.md, Session 9):
//   supabase functions deploy stripe-webhook --no-verify-jwt
//   supabase secrets set STRIPE_SECRET_KEY=sk_live_... STRIPE_WEBHOOK_SECRET=whsec_...
// Then in Stripe → Developers → Webhooks, add the endpoint
//   https://<project>.supabase.co/functions/v1/stripe-webhook
// for the events checkout.session.completed and charge.refunded.
import Stripe from 'https://esm.sh/stripe@16.12.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { apiVersion: '2024-06-20', httpClient: Stripe.createFetchHttpClient() });
const db = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', { auth: { persistSession: false } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('POST only', { status: 405 });
  const body = await req.text();
  let event: Stripe.Event;
  try {
    // Only Stripe can produce a valid signature: anything else is turned away before touching the database.
    event = await stripe.webhooks.constructEventAsync(body, req.headers.get('stripe-signature') ?? '', Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '', undefined, Stripe.createSubtleCryptoProvider());
  } catch (e) {
    return new Response('Bad signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session;
    const user = s.client_reference_id ?? '';
    if (s.payment_status !== 'paid' && s.payment_status !== 'no_payment_required') return new Response('not paid yet', { status: 200 });
    if (!UUID.test(user)) {
      // Bought without signing in first (the game always passes the player's id, so this is a link shared elsewhere).
      // Stripe has the email; grant by hand in the Table Editor if they write in.
      console.warn('checkout without a player id', s.id, s.customer_details?.email);
      return new Response('no player id', { status: 200 });
    }
    const ref = typeof s.payment_intent === 'string' ? s.payment_intent : s.id;
    const { error } = await db.from('entitlements').upsert({ user_id: user, product: 'pack', source: 'stripe', ref }, { onConflict: 'user_id,product' });
    if (error) { console.error(error); return new Response('db error', { status: 500 }); }   // Stripe retries
    return new Response('ok', { status: 200 });
  }

  if (event.type === 'charge.refunded') {
    const c = event.data.object as Stripe.Charge;
    if (c.refunded && typeof c.payment_intent === 'string') {
      const { error } = await db.from('entitlements').delete().eq('ref', c.payment_intent).eq('source', 'stripe');
      if (error) { console.error(error); return new Response('db error', { status: 500 }); }
    }
    return new Response('ok', { status: 200 });
  }

  return new Response('ignored', { status: 200 });
});
