import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { JWT } from "google-auth-library";
import { createClient } from "@supabase/supabase-js";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Supabase for server-side
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wyouwojqsujhofsivywe.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Firebase Admin
if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log("Firebase Admin initialized successfully.");
  } else {
    console.warn("Firebase Admin credentials missing. Push notifications may fail.");
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use express.json() to parse JSON bodies
  app.use(express.json({ limit: '10mb' }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // FCM Push Notification Endpoint
  app.post("/api/send-push", async (req, res) => {
    try {
      const { userId, title, body, data } = req.body;

      if (!userId || !title || !body) {
        return res.status(400).json({ error: "userId, title, and body are required." });
      }

      let fcmToken: string | null = null;

      // 1. Try fetching from Firestore first (Native Firebase)
      try {
        const userDoc = await getFirestore().collection('mifta_user_profiles').doc(userId).get();
        if (userDoc.exists) {
          fcmToken = userDoc.data()?.fcmToken || null;
        }
      } catch (e) {
        console.warn("Firestore fetch failed, falling back to Supabase:", e);
      }

      // 2. Fallback to Supabase
      if (!fcmToken) {
        const { data: profile, error: profileError } = await supabase
          .from('mifta_user_profiles')
          .select('fcm_token')
          .eq('uid', userId)
          .single();

        if (!profileError && profile?.fcm_token) {
          fcmToken = profile.fcm_token;
        }
      }

      if (!fcmToken) {
        return res.status(404).json({ error: "FCM token not found for user." });
      }

      // 3. Send notification via Firebase Admin SDK (V1 API)
      const message = {
        notification: {
          title,
          body
        },
        data: data || {},
        token: fcmToken,
        android: {
          notification: {
            clickAction: "OPEN_ACTIVITY_1",
            sound: "default"
          }
        }
      };

      const response = await getMessaging().send(message);
      res.json({ success: true, messageId: response });
    } catch (error: any) {
      console.error("Push Notification error:", error);
      res.status(500).json({ error: error.message || "Failed to send push notification." });
    }
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message, context } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set." });
      }
      
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      // Construct prompt history
      const formattedHistory = history.map((h: any) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      }));
      
      const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        config: {
          systemInstruction: `You are an AI assistant for "Mifta Attar House", a premium Islamic fragrance and attar store in Bangladesh.
          You must communicate in Bengali (বাংলা). Be polite, helpful, and act as a knowledgeable fragrance advisor.
          
          Here is the current catalog data (database context):
          ${JSON.stringify(context, null, 2)}
          
          Use this catalog to answer user questions about available products, prices, stock, and recommendations. If they ask about something not in the catalog, politely say it is currently unavailable or you don't have information on it.
          `,
          temperature: 0.7
        },
        history: formattedHistory
      });
      
      const response = await chat.sendMessage({ message: message });
      
      res.json({ text: response.text });
      
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: "An error occurred while communicating with the assistant." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
