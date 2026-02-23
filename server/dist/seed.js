import mongoose from 'mongoose';
import Recipe from './models/Recipe.js';
import dotenv from 'dotenv';
dotenv.config();
const mockRecipes = [
    {
        title: 'Paneer Bhurji Sandwiches',
        type: 'Lunch Box',
        prepTimeMins: 10,
        ingredients: ['Paneer (crumbled)', 'Whole wheat bread', 'Onion', 'Tomato', 'Turmeric', 'Salt', 'Butter'],
        proteinPerServingGrams: 15,
        carbPerServingGrams: 30,
        proteinToCarbRatio: 1 / 2, // Exceeds 1:3
        isSoggyProof: true,
        instructions: [
            'Sauté onions and tomatoes with salt and turmeric.',
            'Add crumbled paneer and mix well until dry.',
            'Stuff between bread slices and toast lightly.'
        ],
        tips: ['Add green peas (Matar) for extra fiber and protein.'],
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop'
    },
    {
        title: 'Sprouts & Moong Dal Chilla',
        type: 'Breakfast',
        prepTimeMins: 15,
        ingredients: ['Sprouted Moong Dal', 'Besan (Gram Flour)', 'Green Chili', 'Ginger', 'Salt', 'Oil'],
        proteinPerServingGrams: 12,
        carbPerServingGrams: 20,
        proteinToCarbRatio: 1.2 / 2,
        isSoggyProof: false,
        instructions: [
            'Blend sprouts, green chili, and ginger into a coarse paste.',
            'Mix with besan, water, and salt to form a batter.',
            'Pour ladles of batter onto a hot pan, spread like a crepe, and cook with oil on both sides.'
        ],
        tips: ['Serve with Greek Yogurt (Hung Curd) dip instead of sweet ketchup for a protein boost.'],
        imageUrl: 'https://images.unsplash.com/photo-1626200419109-d2b4f6531548?w=400&h=300&fit=crop'
    },
    {
        title: 'Soya Chunks Pulao',
        type: 'Lunch Box',
        prepTimeMins: 15,
        ingredients: ['Soya Chunks (boiled)', 'Basmati Rice', 'Carrots', 'Beans', 'Cumin seeds', 'Garam Masala'],
        proteinPerServingGrams: 18,
        carbPerServingGrams: 40,
        proteinToCarbRatio: 18 / 40,
        isSoggyProof: true,
        instructions: [
            'Boil and squeeze out excess water from soya chunks.',
            'In a pan, temper cumin seeds, sauté vegetables and soya chunks.',
            'Add cooked rice, garam masala, and mix gently.'
        ],
        tips: ['The ultimate soggy-proof lunchbox with very high protein!'],
        imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop'
    }
];
const seedDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in the environment.');
        }
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected. Dropping existing recipes...');
        await Recipe.deleteMany({});
        console.log('Inserting mock recipes...');
        await Recipe.insertMany(mockRecipes);
        console.log(`Mock recipes generated successfully: ${mockRecipes.length} recipes available.`);
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};
seedDB();
