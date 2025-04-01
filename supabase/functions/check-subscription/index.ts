
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
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non authentifié" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Find the customer in Stripe
    const { data: customers } = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (!customers || customers.data.length === 0) {
      return new Response(
        JSON.stringify({ subscription: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const customerId = customers.data[0].id;

    // Get the customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    let subscription = null;

    if (subscriptions && subscriptions.data.length > 0) {
      const activeSubscription = subscriptions.data[0];
      
      // Get the price details to determine the plan type
      const priceId = activeSubscription.items.data[0].price.id;
      const product = await stripe.products.retrieve(
        activeSubscription.items.data[0].price.product as string
      );

      subscription = {
        id: activeSubscription.id,
        status: activeSubscription.status,
        planType: product.id === "prod_S3CLObpFqxyJmL" ? "standard" : "premium",
        currentPeriodEnd: new Date(activeSubscription.current_period_end * 1000).toISOString(),
      };

      // Update the user's subscription status in Supabase profiles table
      await supabase
        .from("profiles")
        .update({ subscription: subscription.planType })
        .eq("id", user.id);
    }

    return new Response(
      JSON.stringify({ subscription }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
