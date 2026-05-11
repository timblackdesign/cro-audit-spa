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

  const params = new URLSearchParams(event.body);
  const email = params.get('email');
  if (!email) return { statusCode: 400, body: 'Missing email' };

  // Create user — email_confirm: true skips the verification email flow
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  const isAlreadyExists = createError?.status === 422;
  if (createError && !isAlreadyExists) {
    console.error('createUser error:', createError);
    return { statusCode: 500, body: createError.message };
  }

  // Resolve user id — present on new creation; requires lookup for existing users
  let userId = userData?.user?.id;
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
};
