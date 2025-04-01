
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

// Stripe webhook secret
const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response(JSON.stringify({ error: 'No signature provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.text();
    let event;
    
    // Verify the event came from Stripe
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        
        // Find user by customer ID
        const { data: profiles, error: profilesError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer)
          .maybeSingle();

        if (profilesError) {
          console.error('Error querying profiles:', profilesError);
          break;
        }

        if (profiles) {
          const userId = profiles.id;
          
          // Get the product details
          const product = await stripe.products.retrieve(
            subscription.items.data[0].price.product as string
          );
          
          // Determine the subscription plan
          const plan = subscription.metadata.plan || 
            (product.name === 'Premium' ? 'premium' : 'standard');
            
          // Update user profile with subscription details
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({
              subscription: plan,
              subscription_id: subscription.id,
              subscription_status: subscription.status,
              subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating user profile:', updateError);
          } else {
            console.log(`Updated subscription for user ${userId} to ${plan}`);
          }
        }
        break;
        
      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        
        // Find user by customer ID
        const { data: canceledProfiles, error: canceledProfilesError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', canceledSubscription.customer)
          .maybeSingle();
          
        if (canceledProfilesError) {
          console.error('Error querying profiles:', canceledProfilesError);
          break;
        }
        
        if (canceledProfiles) {
          const userId = canceledProfiles.id;
          
          // Update user profile to remove subscription
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({
              subscription: 'trial',
              subscription_status: 'canceled',
              subscription_period_end: null
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating user profile:', updateError);
          } else {
            console.log(`Marked subscription as canceled for user ${userId}`);
          }
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
