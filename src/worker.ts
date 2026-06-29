import { GoogleGenAI } from "@google/genai";

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        if (!env.GEMINI_API_KEY) {
          return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not set." }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        const body = await request.json() as any;
        const { history, message, context: catalogContext } = body;

        const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

        const formattedHistory = history.map((h: any) => ({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        }));

        const chat = ai.chats.create({
          model: "gemini-2.0-flash", // Using 2.0-flash
          config: {
            systemInstruction: `You are an AI assistant for "Mifta Attar House", a premium Islamic fragrance and attar store in Bangladesh.\nYou must communicate in Bengali (বাংলা). Be polite, helpful, and act as a knowledgeable fragrance advisor.\n\nHere is the current catalog data:\n${JSON.stringify(catalogContext, null, 2)}`,
            temperature: 0.7
          },
          history: formattedHistory
        });

        const response = await chat.sendMessage({ message: message });

        return new Response(JSON.stringify({ text: response.text }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error: any) {
        console.error("Worker Chat API error:", error);
        return new Response(JSON.stringify({ error: error.message || "An error occurred" }), { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    if (url.pathname === '/api/send-push' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const { userId, title, body: msgBody, data } = body;

        if (!userId || !title || !msgBody) {
          return new Response(JSON.stringify({ error: "userId, title, and body are required." }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 1. Initialize Supabase - Better logging for missing envs
        const supabaseUrl = env.VITE_SUPABASE_URL;
        const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.error("Supabase configuration is missing in environment.");
          return new Response(JSON.stringify({ 
            error: "SUPABASE_CONFIG_MISSING", 
            details: "Supabase URL or Key is missing in Cloudflare environment variables. Please ensure they are set in the dashboard." 
          }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 2. Fetch user's FCM token(s) from Supabase
        let tokens: string[] = [];
        if (userId === 'ADMINS') {
          // Fetch all tokens for broadcast (simple admin notification)
          const { data: profiles, error: profileError } = await supabase
            .from('mifta_user_profiles')
            .select('fcm_token')
            .not('fcm_token', 'is', null);
          
          if (!profileError && profiles) {
            tokens = profiles.map(p => p.fcm_token).filter(t => !!t);
          }
        } else {
          const { data: profile, error: profileError } = await supabase
            .from('mifta_user_profiles')
            .select('fcm_token')
            .eq('uid', userId)
            .maybeSingle();

          if (!profileError && profile?.fcm_token) {
            tokens = [profile.fcm_token];
          }
        }

        if (tokens.length === 0) {
          console.error(`Token not found for user: ${userId}`);
          return new Response(JSON.stringify({ 
            success: false,
            error: "TOKEN_NOT_FOUND",
            details: `FCM token not found in Supabase for ${userId}.` 
          }), { 
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 3. Get FCM Access Token via Google Auth
        const { JWT } = await import("google-auth-library");
        const clientEmail = env.FIREBASE_CLIENT_EMAIL;
        const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const projectId = env.FIREBASE_PROJECT_ID;

        if (!clientEmail || !privateKey || !projectId) {
          const missing = [];
          if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
          if (!privateKey) missing.push("FIREBASE_PRIVATE_KEY");
          if (!projectId) missing.push("FIREBASE_PROJECT_ID");
          
          console.error("Firebase credentials missing in environment:", missing.join(", "));
          return new Response(JSON.stringify({ 
            error: "FIREBASE_CREDENTIALS_MISSING", 
            details: `Missing environment variables: ${missing.join(", ")}. Please check wrangler.toml or Cloudflare Dashboard.` 
          }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        const jwtClient = new JWT({
          email: clientEmail,
          key: privateKey,
          scopes: ["https://www.googleapis.com/auth/cloud-platform"]
        });

        const authTokens = await jwtClient.authorize();
        const accessToken = authTokens.access_token;

        // 4. Send notification via FCM v1 API
        const results = [];
        for (const targetToken of tokens) {
          try {
            const fcmResponse = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: {
                  token: targetToken,
                  notification: {
                    title,
                    body: msgBody
                  },
                  data: data || {},
                  android: {
                    priority: 'high',
                    notification: {
                      click_action: "OPEN_ACTIVITY_1",
                      sound: "default",
                      channel_id: "default_channel_id"
                    }
                  }
                }
              })
            });
            const resData = await fcmResponse.json() as any;
            results.push({ token: targetToken, success: fcmResponse.ok, result: resData });
          } catch (e) {
            results.push({ token: targetToken, success: false, error: String(e) });
          }
        }

        const successCount = results.filter(r => r.success).length;

        return new Response(JSON.stringify({ 
          success: successCount > 0, 
          message: `Sent to ${successCount} of ${tokens.length} devices.`,
          details: results
        }), {
          headers: { "Content-Type": "application/json" }
        });

      } catch (error: any) {
        console.error("Worker Send Push error:", error);
        return new Response(JSON.stringify({ error: error.message || "An error occurred" }), { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    // Fallback to static assets (handled by Cloudflare Workers Assets)
    // If env.ASSETS is not available, it might be deployed without assets configured correctly.
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    
    return new Response("Not Found", { status: 404 });
  }
};
