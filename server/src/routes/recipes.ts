import { Router } from 'express';
import Recipe from '../models/Recipe.js';

const router = Router();

// GET all recipes, with an optional ?type= query param
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};

        if (type) {
            query = { type: type as string };
        }

        const recipes = await Recipe.find(query);
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// GET single recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Failed to fetch recipe' });
    }
});

export default router;
