import mongoose, { Document, Schema } from 'mongoose';

export interface IRecipe extends Document {
    title: string;
    type: 'Breakfast' | 'Lunch Box' | 'Quick Bites';
    prepTimeMins: number;
    ingredients: string[];
    proteinPerServingGrams: number;
    carbPerServingGrams: number;
    proteinToCarbRatio: number; // For the 1:3 ratio check
    isSoggyProof: boolean; // Must be true for Lunch Box
    instructions: string[];
    tips: string[]; // E.g., Protein Hacks
    imageUrl?: string;
}

const RecipeSchema: Schema = new Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Breakfast', 'Lunch Box', 'Quick Bites'], required: true },
    prepTimeMins: { type: Number, required: true },
    ingredients: [{ type: String }],
    proteinPerServingGrams: { type: Number, required: true },
    carbPerServingGrams: { type: Number, required: true },
    proteinToCarbRatio: { type: Number, required: true },
    isSoggyProof: { type: Boolean, default: false },
    instructions: [{ type: String }],
    tips: [{ type: String }],
    imageUrl: { type: String }
}, {
    timestamps: true
});

export default mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);
