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
          model: "gemini-3.5-flash", // Using 3.5-flash
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
    
    // Fallback to static assets (handled by Cloudflare Workers Assets)
    // If env.ASSETS is not available, it might be deployed without assets configured correctly.
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    
    return new Response("Not Found", { status: 404 });
  }
};
