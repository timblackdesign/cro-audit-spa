const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const HANDLED_EVENTS = new Set([
  'subscription_created',
  'subscription_cancelled',
  'subscription_expired',
  'subscription_payment_success',
]);

async function resolveUserId(email) {
  const { data: list } = await supabase.auth.admin.listUsers();
  return list?.users?.find(u => u.email === email)?.id ?? null;
}

async function inviteOrFindUser(email) {
  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
    email,
    { redirectTo: 'https://cro-audit-system-shopify.netlify.app/' }
  );
  const alreadyExists = inviteError?.status === 422;
  if (inviteError && !alreadyExists) throw new Error(inviteError.message);
  return inviteData?.user?.id ?? (await resolveUserId(email));
}

async function getSubscriptionRenewsAt(subscriptionId) {
  try {
    const res = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
      { headers: { Authorization: `Bearer ${process.env.LS_API_KEY}` } }
    );
    const data = await res.json();
    return data?.data?.attributes?.renews_at ?? null;
  } catch {
    return null;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['x-signature'];
  const expected = crypto
    .createHmac('sha256', process.env.LS_WEBHOOK_SECRET)
    .update(event.body)
    .digest('hex');
  if (!sig || sig !== expected) {
    return { statusCode: 401, body: 'Invalid signature' };
  }

  const payload = JSON.parse(event.body);
  const eventName = payload.meta?.event_name;

  if (!HANDLED_EVENTS.has(eventName)) {
    return { statusCode: 200, body: 'Ignored' };
  }

  const attrs = payload.data?.attributes ?? {};
  const email = attrs.user_email;

  try {
    switch (eventName) {

      case 'subscription_created': {
        const subscriptionId = String(payload.data.id);
        const renewsAt = attrs.renews_at ?? null;
        if (!email) return { statusCode: 400, body: 'Missing email' };

        const userId = await inviteOrFindUser(email);
        if (!userId) {
          console.error('Could not resolve user ID for', email);
          return { statusCode: 500, body: 'Could not resolve user' };
        }

        const { error } = await supabase.from('profiles').upsert({
          id: userId,
          email,
          audit_limit: 5,
          subscription_id: subscriptionId,
          subscription_status: 'active',
          renews_at: renewsAt,
        });
        if (error) console.error('subscription_created upsert error:', error);
        break;
      }

      case 'subscription_cancelled': {
        const subscriptionId = String(payload.data.id);
        // ends_at is when access actually stops on a cancelled subscription
        const endsAt = attrs.ends_at ?? attrs.renews_at ?? null;

        const { error } = await supabase.from('profiles')
          .update({ subscription_status: 'cancelled', ...(endsAt ? { renews_at: endsAt } : {}) })
          .eq('subscription_id', subscriptionId);
        if (error) console.error('subscription_cancelled update error:', error);
        break;
      }

      case 'subscription_expired': {
        const subscriptionId = String(payload.data.id);

        const { error } = await supabase.from('profiles')
          .update({ subscription_status: 'expired' })
          .eq('subscription_id', subscriptionId);
        if (error) console.error('subscription_expired update error:', error);
        break;
      }

      case 'subscription_payment_success': {
        // data is a subscription-invoice object; subscription ID lives in relationships
        const subscriptionId = String(
          payload.data.relationships?.subscription?.data?.id ??
          attrs.subscription_id ??
          ''
        );
        if (!subscriptionId) {
          console.error('subscription_payment_success: no subscription ID in payload');
          return { statusCode: 200, body: 'No subscription ID' };
        }

        const renewsAt = await getSubscriptionRenewsAt(subscriptionId);
        const { error } = await supabase.from('profiles')
          .update({ subscription_status: 'active', ...(renewsAt ? { renews_at: renewsAt } : {}) })
          .eq('subscription_id', subscriptionId);
        if (error) console.error('subscription_payment_success update error:', error);
        break;
      }
    }
  } catch (err) {
    console.error(`Error handling ${eventName}:`, err);
    return { statusCode: 500, body: err.message };
  }

  return { statusCode: 200, body: 'OK' };
};
