
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.12.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { admin_secret } = await req.json();
    
    // Simple security check - this should be a proper environment variable in production
    if (admin_secret !== 'task_manager_secure_key') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create test users with different roles
    const testUsers = [
      {
        email: 'user@example.com',
        password: 'password123',
        name: 'Normal User',
        role: 'user'
      },
      {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        email: 'superadmin@example.com',
        password: 'password123',
        name: 'Super Admin',
        role: 'superadmin'
      }
    ];

    const results = [];

    for (const user of testUsers) {
      // Create user in Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { name: user.name }
      });

      if (authError) {
        results.push({
          email: user.email,
          success: false,
          error: authError.message
        });
        continue;
      }

      // Update user role in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: user.role })
        .eq('id', authData.user.id);

      results.push({
        email: user.email,
        password: user.password,
        role: user.role,
        success: !profileError,
        error: profileError?.message
      });
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
