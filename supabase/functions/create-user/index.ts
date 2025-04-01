
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.25.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

interface NewUserData {
  email: string;
  name: string;
  role: string;
  subscription: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if we have an authorization header for the authenticated admin
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      console.error("Missing Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a Supabase client with the Auth context
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the current admin user to check permissions
    const { data: { user: adminUser }, error: adminUserError } = await supabaseAdmin.auth.getUser();

    if (adminUserError || !adminUser) {
      console.error("Error fetching admin user:", adminUserError);
      return new Response(
        JSON.stringify({ error: adminUserError?.message || "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the admin's profile to check role
    const { data: adminProfile, error: adminProfileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", adminUser.id)
      .single();

    if (adminProfileError) {
      console.error("Error fetching admin profile:", adminProfileError);
      return new Response(
        JSON.stringify({ error: adminProfileError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if admin has superadmin rights
    if (adminProfile.role !== 'superadmin') {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Only superadmins can create users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const userData: NewUserData = await req.json();

    // Generate a random password
    const password = Math.random().toString(36).slice(-10);

    // Create user with Supabase Auth
    const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: password,
      email_confirm: true,
      user_metadata: { name: userData.name }
    });

    if (createUserError) {
      console.error("Error creating user:", createUserError);
      return new Response(
        JSON.stringify({ error: createUserError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update the user's profile with role and subscription
    if (newUser.user) {
      const { error: updateProfileError } = await supabaseAdmin
        .from("profiles")
        .update({
          role: userData.role,
          subscription: userData.subscription
        })
        .eq("id", newUser.user.id);

      if (updateProfileError) {
        console.error("Error updating user profile:", updateProfileError);
        // We don't return an error here as the user was already created
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUser.user?.id,
          email: newUser.user?.email,
          temporaryPassword: password
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201
      }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
