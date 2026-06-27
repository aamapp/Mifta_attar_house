import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use express.json() to parse JSON bodies
  app.use(express.json({ limit: '10mb' }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
        model: "gemini-1.5-flash-8b",
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
