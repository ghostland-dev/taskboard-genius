
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("No signature provided", { status: 400 });
    }
    
    // Get the raw body
    const body = await req.text();
    
    // Verify the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
      );
    } catch (err) {
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
    
    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get the price ID
        const priceId = subscription.items.data[0].price.id;
        
        // Determine the subscription level from the price ID
        let subscriptionLevel = "trial";
        if (priceId === "prod_S3CLObpFqxyJmL") {
          subscriptionLevel = "standard";
        } else if (priceId === "prod_S3CLSKAjkdYGg8") {
          subscriptionLevel = "premium";
        }
        
        // Update the user's subscription status
        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId);
          
        if (profiles && profiles.length > 0) {
          await supabaseAdmin
            .from("profiles")
            .update({ subscription: subscriptionLevel })
            .eq("stripe_customer_id", customerId);
        }
        
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Revert to trial when subscription is canceled
        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId);
          
        if (profiles && profiles.length > 0) {
          await supabaseAdmin
            .from("profiles")
            .update({ subscription: "trial" })
            .eq("stripe_customer_id", customerId);
        }
        
        break;
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
