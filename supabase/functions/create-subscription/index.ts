
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plan, returnUrl } = await req.json();
    
    // Validate plan
    if (!plan || (plan !== "standard" && plan !== "premium")) {
      return new Response(
        JSON.stringify({ error: "Plan invalide. Choisissez 'standard' ou 'premium'." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing Authorization header");
      return new Response(
        JSON.stringify({ error: "Non autorisé - En-tête d'autorisation manquant" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: authHeader },
      },
    });
    
    // Get user from auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: userError?.message || "Utilisateur non authentifié" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Check if user already has a Stripe customer ID
    let customerId;
    try {
      const { data: customers } = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers && customers.data && customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        // Create a new customer if none exists
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;
      }
    } catch (stripeError) {
      console.error("Stripe customer error:", stripeError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la vérification du client Stripe" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Set price based on plan
    const priceId = plan === "standard" 
      ? "price_1PhCnGGRMrfUdZQTVQldVfL5" // Standard plan price ID
      : "price_1PhCoKGRMrfUdZQTKRXpGCsw"; // Premium plan price ID

    // Create checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${returnUrl || req.headers.get("origin")}/settings?success=true`,
        cancel_url: `${returnUrl || req.headers.get("origin")}/settings?canceled=true`,
        metadata: {
          userId: user.id,
          planType: plan,
        },
      });

      // Return the session URL
      return new Response(
        JSON.stringify({ sessionUrl: session.url }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (sessionError) {
      console.error("Stripe session error:", sessionError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la création de la session de paiement" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating subscription:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
