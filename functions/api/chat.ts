import { GoogleGenAI } from "@google/genai";

export async function onRequestPost(context: any) {
  try {
    // Cloudflare Pages stores environment variables in context.env
    const GEMINI_API_KEY = context.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not set in Cloudflare Settings." }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await context.request.json();
    const { history, message, context: catalogContext } = body;

    const ai = new GoogleGenAI({ 
      apiKey: GEMINI_API_KEY 
    });

    const formattedHistory = history.map((h: any) => ({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `You are an AI assistant for "Mifta Attar House", a premium Islamic fragrance and attar store in Bangladesh.
        You must communicate in Bengali (বাংলা). Be polite, helpful, and act as a knowledgeable fragrance advisor.
        
        Here is the current catalog data:
        ${JSON.stringify(catalogContext, null, 2)}
        `,
        temperature: 0.7
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message: message });

    return new Response(JSON.stringify({ text: response.text }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Cloudflare Chat API error:", error);
    return new Response(JSON.stringify({ error: "An error occurred while communicating with the assistant." }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
