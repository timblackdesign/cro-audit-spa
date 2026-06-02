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
  const eventName = payload.meta?.event_name;

  if (eventName === 'order_created') {
    return handleOrderCreated(payload);
  }

  if (eventName === 'license_key_created') {
    return handleLicenseKeyCreated(payload);
  }

  return { statusCode: 200, body: 'Ignored' };
};

async function handleOrderCreated(payload) {
  const email = payload.data?.attributes?.user_email;
  if (!email) return { statusCode: 400, body: 'Missing email' };

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
    });
    if (upsertError) console.error('profiles upsert error:', upsertError);
  }

  return { statusCode: 200, body: 'OK' };
}

async function handleLicenseKeyCreated(payload) {
  const email = payload.data?.attributes?.user_email;
  const licenseKey = payload.data?.attributes?.key;
  if (!email || !licenseKey) return { statusCode: 400, body: 'Missing email or key' };

  const { data: list } = await supabase.auth.admin.listUsers();
  const userId = list?.users?.find(u => u.email === email)?.id;

  if (userId) {
    const { error } = await supabase
      .from('profiles')
      .update({ license_key: licenseKey })
      .eq('id', userId);
    if (error) console.error('license key update error:', error);
  }

  return { statusCode: 200, body: 'OK' };
}
