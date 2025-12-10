import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful AI assistant living inside a Dynamic Island UI on a phone. Keep your responses concise, short, and to the point (under 40 words if possible) to fit the small screen.",
      }
    });
    
    return response.text || "I couldn't think of an answer.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the network.";
  }
};
