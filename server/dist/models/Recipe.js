import mongoose, { Schema } from 'mongoose';
const RecipeSchema = new Schema({
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
export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
