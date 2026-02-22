import mongoose, { Document } from 'mongoose';
export interface IRecipe extends Document {
    title: string;
    type: 'Breakfast' | 'Lunch Box' | 'Quick Bites';
    prepTimeMins: number;
    ingredients: string[];
    proteinPerServingGrams: number;
    carbPerServingGrams: number;
    proteinToCarbRatio: number;
    isSoggyProof: boolean;
    instructions: string[];
    tips: string[];
    imageUrl?: string;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any, any>;
export default _default;
//# sourceMappingURL=Recipe.d.ts.map