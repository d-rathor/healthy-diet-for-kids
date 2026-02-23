import { Router } from 'express';
import Recipe from '../models/Recipe.js';
const router = Router();
// GET all recipes, with an optional ?type= query param
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        if (type) {
            query = { type: type };
        }
        const recipes = await Recipe.find(query);
        res.json(recipes);
    }
    catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});
export default router;
