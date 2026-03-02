import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const body = req.body;
        let base64Data = body.imageBase64;

        // If an image URL is provided (e.g. from B2 upload), fetch it to avoid large frontend payloads
        if (body.imageUrl) {
            const imgRes = await fetch(body.imageUrl);
            if (!imgRes.ok) throw new Error("Failed to download image from B2");
            const arrayBuffer = await imgRes.arrayBuffer();
            base64Data = Buffer.from(arrayBuffer).toString('base64');
        }

        if (!base64Data) {
            return res.status(400).json({ error: "No image provided" });
        }

        // MOCK RESPONSE FOR LOCAL TESTING
        if (process.env.GEMINI_API_KEY === 'mock-key-for-testing') {
            // Simulate Gemini processing time
            await new Promise(resolve => setTimeout(resolve, 2000));
            return res.json({
                detectedIngredients: ["Paneer", "Spinach", "Tomatoes", "Onions", "Green Peas"]
            });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
      You are an expert Indian culinary nutritionist AI. Your specialty is recognizing food items commonly found in Indian households and recommending high-protein meals for children aged 2-12.

      TASK: Analyze the provided image of a fridge, pantry, kitchen counter, or grocery haul and identify all visible food items.

      INDIAN FOOD KNOWLEDGE:
      - Recognize Indian dairy: Paneer (white cottage cheese blocks), Dahi/Curd (yogurt), Chaas (buttermilk), Ghee, Malai, Khoya/Mawa
      - Recognize Indian lentils/pulses by appearance: Toor Dal (yellow), Moong Dal (green/yellow split), Masoor Dal (red/orange), Chana Dal (split chickpea), Urad Dal (black/white), Rajma (red kidney beans), Chole/Kabuli Chana (chickpeas), Lobia (black-eyed peas)
      - Recognize Indian vegetables by their local names: Palak (spinach), Bhindi (okra/ladyfinger), Lauki/Ghiya (bottle gourd), Tinda (round gourd), Parwal (pointed gourd), Karela (bitter gourd), Turai (ridge gourd), Arbi (colocasia), Shimla Mirch (capsicum/bell pepper), Methi (fenugreek leaves), Sarson (mustard greens), Baingan (eggplant/brinjal)
      - Recognize Indian proteins: Soya Chunks/Granules, Tofu, Sprouts (Moong/Moth), Eggs, Chicken, Fish, Mutton
      - Recognize Indian breads/grains: Atta (wheat flour bags), Rice, Poha (flattened rice), Suji/Rava (semolina), Besan (gram flour), Ragi flour, Oats, Dalia (broken wheat)
      - Recognize Indian fruits: Chiku (sapodilla), Sitaphal (custard apple), Amla (Indian gooseberry), Jamun (java plum), along with common fruits like Mango, Banana, Apple, Pomegranate, Guava, Papaya
      - Recognize packaged Indian items: Amul butter/cheese, Mother Dairy milk packets, MTR/Haldiram's ready mixes, Maggi noodles, Bournvita/Horlicks

      PROTEIN PRIORITY (flag these prominently):
      - Paneer, Soya Chunks, Eggs, Curd/Greek Yogurt, Sprouts, all Dals, Rajma, Chole, Chicken, Fish, Tofu, Nuts (Almonds, Cashews, Peanuts), Seeds (Pumpkin, Sunflower, Flax)

      IGNORE these (assumed always available in Indian kitchens):
      - Salt, Turmeric (Haldi), Red Chili Powder, Cumin (Jeera), Mustard Seeds (Rai), Coriander Powder (Dhaniya), Garam Masala, Hing (Asafoetida), Cooking Oil, Water

      RULES:
      1. Use the most common Indian/Hindi name, followed by English in parentheses if helpful. E.g., "Palak (Spinach)", "Bhindi (Okra)"
      2. Be specific: say "Moong Dal" not just "Lentils". Say "Paneer" not "Cheese".
      3. If you're unsure about a specific dal/vegetable variety, still include it with your best guess.
      4. Group by category mentally but return a flat list.
      5. Return a STRICT JSON object with no markdown formatting or extra text.

      JSON FORMAT:
      {
        "detectedIngredients": ["Ingredient 1", "Ingredient 2", ...]
      }
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
            ],
            config: {
                responseMimeType: "application/json",
            }
        });

        let text = response.text;
        if (!text) {
            throw new Error("No response from Gemini");
        }

        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const data = JSON.parse(text);

        return res.json(data);

    } catch (error: any) {
        console.error("Gemini API Error details:", error);
        return res.status(500).json({
            error: "Failed to analyze image",
            details: error?.message || error?.toString() || "Unknown server exception",
            stack: error?.stack
        });
    }
});

export default router;
