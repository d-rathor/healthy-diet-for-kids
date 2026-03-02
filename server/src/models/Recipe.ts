import mongoose, { Document, Schema } from 'mongoose';

export interface IRecipe extends Document {
    title: string;
    type: 'Breakfast' | 'Lunch Box' | 'Quick Bites';
    dietaryPreference: 'Veg' | 'Non-Veg' | 'Egg' | 'Vegan';
    prepTimeMins: number;
    ingredients: string[];
    proteinPerServingGrams: number;
    carbPerServingGrams: number;
    proteinToCarbRatio: number;
    isSoggyProof: boolean;
    instructions: string[];
    tips: string[];
    imageUrl?: string;
    ageGroup?: string;
    allergyTags?: string[];
}

const RecipeSchema: Schema = new Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Breakfast', 'Lunch Box', 'Quick Bites'], required: true },
    dietaryPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Egg', 'Vegan'], required: true, default: 'Veg' },
    prepTimeMins: { type: Number, required: true },
    ingredients: [{ type: String }],
    proteinPerServingGrams: { type: Number, required: true },
    carbPerServingGrams: { type: Number, required: true },
    proteinToCarbRatio: { type: Number, required: true },
    isSoggyProof: { type: Boolean, default: false },
    instructions: [{ type: String }],
    tips: [{ type: String }],
    imageUrl: { type: String },
    ageGroup: { type: String },
    allergyTags: [{ type: String }]
}, {
    timestamps: true
});

export default mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);
