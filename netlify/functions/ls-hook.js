const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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
  if (payload.meta?.event_name !== 'order_created') {
    return { statusCode: 200, body: 'Ignored' };
  }

  const email = payload.data?.attributes?.user_email;
  const orderId = payload.data?.id;
  if (!email) return { statusCode: 400, body: 'Missing email' };

  // Fetch license key from LS API using the order ID
  let licenseKey = null;
  try {
    const lsRes = await fetch(
      `https://api.lemonsqueezy.com/v1/license-keys?filter[order_id]=${orderId}`,
      { headers: { Authorization: `Bearer ${process.env.LS_API_KEY}` } }
    );
    const lsData = await lsRes.json();
    licenseKey = lsData?.data?.[0]?.attributes?.key ?? null;
  } catch (err) {
    console.error('license key fetch error:', err);
  }

  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
    email,
    { redirectTo: 'https://cro-audit-system-shopify.netlify.app/' }
  );

  const alreadyExists = inviteError?.status === 422;
  if (inviteError && !alreadyExists) {
    console.error('inviteUserByEmail error:', inviteError);
    return { statusCode: 500, body: inviteError.message };
  }

  let userId = inviteData?.user?.id;
  if (!userId) {
    const { data: list } = await supabase.auth.admin.listUsers();
    userId = list?.users?.find(u => u.email === email)?.id;
  }

  if (userId) {
    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: userId,
      email,
      audit_limit: 5,
      license_key: licenseKey,
    });
    if (upsertError) console.error('profiles upsert error:', upsertError);
  }

  return { statusCode: 200, body: 'OK' };
};
