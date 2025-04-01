
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the user from the request
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get the user's profile to check for stripe_customer_id
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ 
          status: 'error',
          subscription: null,
          message: 'Erreur lors de la récupération du profil'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // If the user doesn't have a customer ID, they don't have a subscription
    if (!profile?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ 
          status: 'success',
          subscription: null,
          message: 'Pas d\'abonnement actif'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      expand: ['data.default_payment_method'],
    });

    let subscriptionData = null;
    
    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string);
      
      subscriptionData = {
        id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        plan: subscription.metadata.plan || (product.name === 'Premium' ? 'premium' : 'standard'),
        product_name: product.name,
        price: subscription.items.data[0].price.unit_amount ? 
          (subscription.items.data[0].price.unit_amount / 100).toFixed(2) : 0,
        currency: subscription.items.data[0].price.currency,
        cancel_at_period_end: subscription.cancel_at_period_end,
      };
      
      // Update the user's profile with subscription information
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ 
          subscription: subscriptionData.plan,
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Error updating profile with subscription data:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        status: 'success',
        subscription: subscriptionData,
        message: subscriptionData ? 'Abonnement actif trouvé' : 'Pas d\'abonnement actif'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error checking subscription:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error',
        subscription: null,
        message: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
