import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// Sync user from NextAuth
router.post('/sync', async (req, res) => {
    try {
        const { email, name, image } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name: name || 'Indian Mom',
                avatarUrl: image,
                savedRecipes: [],
                dietaryPreferences: []
            });
        } else {
            // Update latest info
            user.name = name || user.name;
            if (image) user.avatarUrl = image;
            await user.save();
        }

        res.json({ user });
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ error: 'Failed to sync user' });
    }
});

// Save recipe
router.post('/:userId/save-recipe', async (req, res) => {
    try {
        const { userId } = req.params;
        const { recipeId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.savedRecipes.includes(recipeId)) {
            user.savedRecipes.push(recipeId);
            await user.save();
        }

        res.json({ success: true, savedRecipes: user.savedRecipes });
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).json({ error: 'Failed to save recipe' });
    }
});

// Unsave recipe
router.delete('/:userId/save-recipe/:recipeId', async (req, res) => {
    try {
        const { userId, recipeId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
        await user.save();

        res.json({ success: true, savedRecipes: user.savedRecipes });
    } catch (error) {
        console.error('Error unsaving recipe:', error);
        res.status(500).json({ error: 'Failed to unsave recipe' });
    }
});

export default router;
