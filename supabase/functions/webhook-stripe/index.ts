
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return new Response("No signature provided", { status: 400 });
  }

  try {
    const body = await req.text();
    let event;

    // Verify the signature
    if (STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
      }
    } else {
      // If no webhook secret is configured, parse the event from the request body
      try {
        event = JSON.parse(body);
      } catch (err) {
        console.error(`⚠️ Invalid request body: ${err.message}`);
        return new Response(`Invalid request body: ${err.message}`, { status: 400 });
      }
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Update the user's subscription status in the database
        if (session.metadata?.userId && session.metadata?.planType) {
          await supabase
            .from("profiles")
            .update({ subscription: session.metadata.planType })
            .eq("id", session.metadata.userId);
          
          console.log(`Updated subscription for user ${session.metadata.userId} to ${session.metadata.planType}`);
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get the customer to find the user
        const customer = await stripe.customers.retrieve(customerId);
        
        if (customer && !customer.deleted && customer.metadata?.userId) {
          // Determine the plan type from the subscription
          const priceId = subscription.items.data[0].price.id;
          const product = await stripe.products.retrieve(
            subscription.items.data[0].price.product as string
          );
          
          const planType = product.id === "prod_S3CLObpFqxyJmL" ? "standard" : "premium";
          
          // Update the user's subscription status
          await supabase
            .from("profiles")
            .update({ subscription: planType })
            .eq("id", customer.metadata.userId);
            
          console.log(`Updated subscription for user ${customer.metadata.userId} to ${planType}`);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get the customer to find the user
        const customer = await stripe.customers.retrieve(customerId);
        
        if (customer && !customer.deleted && customer.metadata?.userId) {
          // Update the user's subscription status to trial
          await supabase
            .from("profiles")
            .update({ subscription: "trial" })
            .eq("id", customer.metadata.userId);
            
          console.log(`Reverted subscription for user ${customer.metadata.userId} to trial`);
        }
        break;
      }
      
      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error(`Error handling webhook: ${error.message}`);
    return new Response(`Error handling webhook: ${error.message}`, { status: 500 });
  }
});
