
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
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Get the JWT from the request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log("No Authorization header provided");
      return new Response(
        JSON.stringify({ error: "Non autorisé - En-tête d'autorisation manquant" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the JWT from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT and get the user
    const { data: { user: adminUser }, error: jwtError } = await supabaseAdmin.auth.getUser(token);
    
    if (jwtError || !adminUser) {
      console.error("Error verifying JWT:", jwtError);
      return new Response(
        JSON.stringify({ error: jwtError?.message || "Session non valide" }),
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
      console.log("User is not superadmin:", adminProfile.role);
      return new Response(
        JSON.stringify({ error: "Non autorisé - Seuls les superadmins peuvent créer des utilisateurs" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const userData: NewUserData = await req.json();
    console.log("Creating user with data:", JSON.stringify(userData));

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
