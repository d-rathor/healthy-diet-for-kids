import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
import path from 'path';
import Recipe from './models/Recipe.js';

const EXCEL_PATH = path.resolve('C:/Dev1/Recipes/Lunchbox_App_60_Recipes_Final.xlsx');

interface ExcelRow {
    Title: string;
    Type: string;
    DietaryPreference: string;
    PrepTimeMins: number;
    Ingredients: string;
    ProteinPerServingGrams: number;
    CarbPerServingGrams: number;
    proteinToCarbRatio: number;
    isSoggyProof: string;
    instructions: string;
    Tips: string;
    AgeGroup: string;
    AllergyTags: string;
}

async function seed() {
    console.log('🌱 Starting recipe seed...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthy-diet-kids';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Read Excel
    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

    console.log(`📖 Found ${rows.length} recipes in Excel`);

    // Filter out empty rows
    const validRows = rows.filter(row => row.Title && row.Title.trim() !== '');
    console.log(`✅ ${validRows.length} valid recipes after filtering`);

    // Clear existing recipes
    const deleteResult = await Recipe.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing recipes`);

    // Transform and insert
    const recipes = validRows.map((row, index) => {
        // Parse ingredients (semicolon-separated)
        const ingredients = row.Ingredients
            ? row.Ingredients.split(';').map(i => i.trim()).filter(Boolean)
            : [];

        // Parse instructions (semicolon-separated)
        const instructions = row.instructions
            ? row.instructions.split(';').map(i => i.trim()).filter(Boolean)
            : [];

        // Parse tips (semicolon-separated or single string)
        const tips = row.Tips
            ? row.Tips.split(';').map(i => i.trim()).filter(Boolean)
            : [];

        // Parse allergy tags (comma-separated)
        const allergyTags = row.AllergyTags
            ? row.AllergyTags.split(',').map(t => t.trim()).filter(Boolean)
            : [];

        // Parse soggy proof
        const isSoggyProof = row.isSoggyProof?.toString().toLowerCase() === 'yes' ||
            row.isSoggyProof?.toString().toLowerCase() === 'true';

        // Map dietary preference
        let dietaryPreference = row.DietaryPreference || 'Veg';
        if (!['Veg', 'Non-Veg', 'Egg', 'Vegan'].includes(dietaryPreference)) {
            console.warn(`⚠️  Row ${index + 1} "${row.Title}": Unknown dietary preference "${dietaryPreference}", defaulting to "Veg"`);
            dietaryPreference = 'Veg';
        }

        // Map type
        let type = row.Type || 'Quick Bites';
        if (!['Breakfast', 'Lunch Box', 'Quick Bites'].includes(type)) {
            console.warn(`⚠️  Row ${index + 1} "${row.Title}": Unknown type "${type}", defaulting to "Quick Bites"`);
            type = 'Quick Bites';
        }

        return {
            title: row.Title.trim(),
            type,
            dietaryPreference,
            prepTimeMins: Number(row.PrepTimeMins) || 15,
            ingredients,
            proteinPerServingGrams: Number(row.ProteinPerServingGrams) || 0,
            carbPerServingGrams: Number(row.CarbPerServingGrams) || 0,
            proteinToCarbRatio: Number(row.proteinToCarbRatio) || 0,
            isSoggyProof,
            instructions,
            tips,
            ageGroup: row.AgeGroup?.toString() || '',
            allergyTags,
            imageUrl: '' // Will be populated later with generated images
        };
    });

    // Insert all recipes
    const insertResult = await Recipe.insertMany(recipes);
    console.log(`\n🎉 Successfully inserted ${insertResult.length} recipes!\n`);

    // Summary
    const byType = {
        Breakfast: recipes.filter(r => r.type === 'Breakfast').length,
        'Lunch Box': recipes.filter(r => r.type === 'Lunch Box').length,
        'Quick Bites': recipes.filter(r => r.type === 'Quick Bites').length
    };
    console.log('📊 Breakdown:');
    console.log(`   Breakfast:   ${byType.Breakfast}`);
    console.log(`   Lunch Box:   ${byType['Lunch Box']}`);
    console.log(`   Quick Bites: ${byType['Quick Bites']}`);

    const byDiet = {
        Veg: recipes.filter(r => r.dietaryPreference === 'Veg').length,
        'Non-Veg': recipes.filter(r => r.dietaryPreference === 'Non-Veg').length,
        Egg: recipes.filter(r => r.dietaryPreference === 'Egg').length,
        Vegan: recipes.filter(r => r.dietaryPreference === 'Vegan').length
    };
    console.log(`\n   Veg:     ${byDiet.Veg}`);
    console.log(`   Non-Veg: ${byDiet['Non-Veg']}`);
    console.log(`   Egg:     ${byDiet.Egg}`);
    console.log(`   Vegan:   ${byDiet.Vegan}`);

    await mongoose.disconnect();
    console.log('\n✅ Done! Database connection closed.');
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
