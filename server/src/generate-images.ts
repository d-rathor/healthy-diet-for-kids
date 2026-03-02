import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import Recipe from './models/Recipe.js';

// --- Config ---
const BATCH_SIZE = 5;           // Process 5 at a time to avoid rate limits
const DELAY_BETWEEN_MS = 3000;  // 3 second delay between batches

// --- B2 Client ---
const endpoint = process.env.B2_ENDPOINT as string;
const s3 = new S3Client({
    endpoint: endpoint.startsWith('http') ? endpoint : `https://${endpoint}`,
    region: process.env.B2_REGION as string,
    credentials: {
        accessKeyId: process.env.B2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.B2_SECRET_ACCESS_KEY as string,
    },
});

// --- Gemini Client ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

function buildPrompt(recipe: any): string {
    const dietLabel = recipe.dietaryPreference === 'Veg' ? 'vegetarian'
        : recipe.dietaryPreference === 'Egg' ? 'egg-based'
            : recipe.dietaryPreference === 'Non-Veg' ? 'non-vegetarian'
                : 'vegan';

    const typeLabel = recipe.type === 'Lunch Box' ? 'in a colorful compartmentalized kids\' lunchbox'
        : recipe.type === 'Breakfast' ? 'on a beautiful ceramic plate, breakfast table setting'
            : 'on a small colorful plate, snack-style presentation';

    const ingredients = recipe.ingredients.slice(0, 5).join(', ');

    return `Generate a professional top-down food photograph of Indian ${recipe.title}. This is a ${dietLabel} ${recipe.type.toLowerCase()} dish ${typeLabel}. Key ingredients visible: ${ingredients}. The photo should look appetizing, kid-friendly, with warm natural lighting, vibrant colors, and a clean modern Indian kitchen background. High resolution, shallow depth of field, food magazine quality. No text or labels in the image.`;
}

async function uploadToB2(imageBuffer: Buffer, fileName: string): Promise<string> {
    const bucketName = process.env.B2_BUCKET_NAME as string;
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `recipes/${fileName}`,
        Body: imageBuffer,
        ContentType: 'image/png',
    });
    await s3.send(command);

    const rawEndpoint = process.env.B2_ENDPOINT as string;
    const cleanEndpoint = rawEndpoint.replace(/^https?:\/\//, '');
    return `https://${cleanEndpoint}/${bucketName}/recipes/${fileName}`;
}

async function generateImageForRecipe(recipe: any): Promise<string | null> {
    try {
        const prompt = buildPrompt(recipe);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [prompt],
            config: {
                responseModalities: ['IMAGE'],
            }
        });

        // Extract image from response parts
        if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
                    const fileName = `${crypto.randomUUID()}.png`;
                    const url = await uploadToB2(imageBuffer, fileName);
                    return url;
                }
            }
        }

        console.warn(`⚠️  No image in response for "${recipe.title}"`);
        return null;
    } catch (error: any) {
        console.error(`❌ Failed for "${recipe.title}":`, error.message || error);
        return null;
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('🎨 Recipe Image Generator');
    console.log('========================\n');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthy-diet-kids';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find recipes without images
    const recipes = await Recipe.find({
        $or: [
            { imageUrl: { $exists: false } },
            { imageUrl: '' },
            { imageUrl: null }
        ]
    });

    console.log(`📸 Found ${recipes.length} recipes needing images\n`);

    if (recipes.length === 0) {
        console.log('All recipes already have images! Nothing to do.');
        await mongoose.disconnect();
        return;
    }

    let success = 0;
    let failed = 0;

    // Process in batches
    for (let i = 0; i < recipes.length; i += BATCH_SIZE) {
        const batch = recipes.slice(i, i + BATCH_SIZE);
        console.log(`\n--- Batch ${Math.floor(i / BATCH_SIZE) + 1} (recipes ${i + 1}-${Math.min(i + BATCH_SIZE, recipes.length)}) ---`);

        for (const recipe of batch) {
            process.stdout.write(`  🖼️  Generating: "${recipe.title}"... `);

            const imageUrl = await generateImageForRecipe(recipe);

            if (imageUrl) {
                await Recipe.updateOne({ _id: recipe._id }, { imageUrl });
                console.log(`✅ Done`);
                success++;
            } else {
                console.log(`❌ Failed`);
                failed++;
            }

            // Small delay between individual requests
            await sleep(1000);
        }

        // Longer delay between batches to respect rate limits
        if (i + BATCH_SIZE < recipes.length) {
            console.log(`\n  ⏳ Waiting ${DELAY_BETWEEN_MS / 1000}s before next batch...`);
            await sleep(DELAY_BETWEEN_MS);
        }
    }

    console.log(`\n========================`);
    console.log(`🎉 Complete!`);
    console.log(`   ✅ Success: ${success}`);
    console.log(`   ❌ Failed:  ${failed}`);
    console.log(`   📊 Total:   ${recipes.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Database connection closed.');
}

main().catch(err => {
    console.error('❌ Script failed:', err);
    process.exit(1);
});
