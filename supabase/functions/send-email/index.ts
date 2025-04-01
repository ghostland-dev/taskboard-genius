
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
}

serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, subject, body }: EmailRequest = await req.json();

    // Validation des données
    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ error: "Les champs to, subject et body sont requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Configuration Mailtrap
    const MAIL_HOST = Deno.env.get("MAIL_HOST") || "sandbox.smtp.mailtrap.io";
    const MAIL_PORT = parseInt(Deno.env.get("MAIL_PORT") || "2525");
    const MAIL_USERNAME = Deno.env.get("MAIL_USERNAME");
    const MAIL_PASSWORD = Deno.env.get("MAIL_PASSWORD");

    // Vérifier que les identifiants Mailtrap sont configurés
    if (!MAIL_USERNAME || !MAIL_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Configuration Mailtrap incomplète" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Préparer la requête pour l'API Mailtrap
    const emailData = {
      from: {
        email: "noreply@taskmanager.com",
        name: "Task Manager"
      },
      to: [{ email: to }],
      subject: subject,
      html: body
    };

    // Envoyer l'email via l'API Mailtrap
    const response = await fetch(`https://${MAIL_HOST}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${MAIL_USERNAME}:${MAIL_PASSWORD}`)}`
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    console.log("Réponse Mailtrap:", result);

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur d'envoi d'email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
