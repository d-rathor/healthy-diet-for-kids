import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    googleId?: string;
    name: string;
    email: string;
    avatarUrl?: string;
    savedRecipes: mongoose.Types.ObjectId[];
    dietaryPreferences: string[];
}

const UserSchema: Schema = new Schema({
    googleId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    dietaryPreferences: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
