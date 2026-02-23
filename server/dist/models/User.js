import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    googleId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    dietaryPreferences: [{ type: String }]
}, { timestamps: true });
export default mongoose.models.User || mongoose.model('User', UserSchema);
