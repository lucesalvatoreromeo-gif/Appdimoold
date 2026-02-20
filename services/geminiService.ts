
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const polishText = async (text: string, language: Language): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional hospitality expert. Improve and polish the following text for a luxury guest welcome guide. Keep the meaning identical but make it more welcoming, elegant, and professional. Return ONLY the polished text in ${language} language.\n\nText: "${text}"`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return text;
  }
};
