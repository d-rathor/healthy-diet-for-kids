import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { imageBase64 } = await req.json();

        if (!imageBase64) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // MOCK RESPONSE FOR LOCAL TESTING
        if (process.env.GEMINI_API_KEY === 'mock-key-for-testing') {
            // Simulate Gemini processing time
            await new Promise(resolve => setTimeout(resolve, 2000));
            return NextResponse.json({
                detectedIngredients: ["Paneer", "Spinach", "Tomatoes", "Onions", "Green Peas"]
            });
        }

        const prompt = `
      You are an expert Indian culinary AI specializing in high-protein kids' meals.
      Analyze the provided image of a fridge or grocery haul.
      
      RULES:
      1. Identify all visible food items, prioritizing: Paneer, Soya Chunks, Greek Yogurt (Hung Curd), Sprouts, Eggs, Dal, Chickpeas, Vegetables, Breads/Rotis.
      2. IGNORE standard Indian Masala Box items (Salt, Turmeric, Cumin, Mustard Seeds, Chili Powder) as they are assumed available.
      3. Return a STRICT JSON object with no markdown formatting or extra text.
      
      JSON FORMAT:
      {
        "detectedIngredients": ["Ingredient 1", "Ingredient 2", ...],
      }
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }
            ],
            config: {
                responseMimeType: "application/json",
            }
        });

        let text = response.text;
        if (!text) {
            throw new Error("No response from Gemini");
        }

        const data = JSON.parse(text);
        return NextResponse.json(data);

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
    }
}
