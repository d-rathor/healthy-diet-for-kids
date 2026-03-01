export type RecipeType = 'Breakfast' | 'Lunch Box' | 'Quick Bites';
export type DietaryPreference = 'Veg' | 'Non-Veg' | 'Vegan';

export interface Recipe {
    id: string;
    title: string;
    type: RecipeType;
    dietaryPreference: DietaryPreference;
    prepTimeMins: number;
    proteinPerServingGrams: number;
    carbPerServingGrams: number;
    proteinToCarbRatio: number;
    isSoggyProof: boolean;
    imageUrl: string;
}

export const mockRecipes: Recipe[] = [
    {
        id: '1',
        title: 'Paneer Bhurji Sandwiches',
        type: 'Lunch Box',
        dietaryPreference: 'Veg',
        prepTimeMins: 10,
        proteinPerServingGrams: 15,
        carbPerServingGrams: 30,
        proteinToCarbRatio: 15 / 30,
        isSoggyProof: true,
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop'
    },
    {
        id: '2',
        title: 'Sprouts & Moong Dal Chilla',
        type: 'Breakfast',
        dietaryPreference: 'Vegan',
        prepTimeMins: 15,
        proteinPerServingGrams: 12,
        carbPerServingGrams: 20,
        proteinToCarbRatio: 12 / 20,
        isSoggyProof: false,
        imageUrl: 'https://images.unsplash.com/photo-1626200419109-d2b4f6531548?w=600&h=400&fit=crop'
    },
    {
        id: '3',
        title: 'Soya Chunks Pulao',
        type: 'Lunch Box',
        dietaryPreference: 'Vegan',
        prepTimeMins: 15,
        proteinPerServingGrams: 18,
        carbPerServingGrams: 40,
        proteinToCarbRatio: 18 / 40,
        isSoggyProof: true,
        imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop'
    },
    {
        id: '4',
        title: 'Egg & Spinach Wrap (Roti)',
        type: 'Quick Bites',
        dietaryPreference: 'Non-Veg',
        prepTimeMins: 8,
        proteinPerServingGrams: 14,
        carbPerServingGrams: 22,
        proteinToCarbRatio: 14 / 22,
        isSoggyProof: true,
        imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&h=400&fit=crop'
    },
    {
        id: '5',
        title: 'Besan & Nut Mini Idlis',
        type: 'Breakfast',
        dietaryPreference: 'Vegan',
        prepTimeMins: 20,
        proteinPerServingGrams: 10,
        carbPerServingGrams: 28,
        proteinToCarbRatio: 10 / 28,
        isSoggyProof: true,
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=600&h=400&fit=crop'
    }
];
