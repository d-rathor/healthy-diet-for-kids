import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

async function main() {
    const pager = await ai.models.list();
    for await (const m of pager) {
        if (m.name?.includes('imagen') || m.name?.includes('image') || m.name?.includes('gemini-2')) {
            console.log(`${m.name}  →  ${JSON.stringify(m.supportedActions)}`);
        }
    }
}

main();
