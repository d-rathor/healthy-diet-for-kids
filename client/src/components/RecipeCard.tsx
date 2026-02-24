'use client';

import { useState } from 'react';
import { Recipe } from '@/data/mockRecipes';
import { Clock, ShieldCheck, Dumbbell, Bookmark } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const { data: session } = useSession();
    // In a real app we'd sync this boolean from the backend User state
    const [isSaved, setIsSaved] = useState(false);
    const isHighProtein = recipe.proteinToCarbRatio >= 0.33;

    const toggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent bubbling to the card click
        if (!session?.user) {
            alert("Please login to save recipes");
            return;
        }

        const userId = (session.user as any).id;
        try {
            const isProd = process.env.NODE_ENV === 'production';
            const defaultApiUrl = isProd ? 'https://healthy-diet-for-kids.onrender.com/api' : 'http://localhost:5000/api';
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;

            const method = isSaved ? 'DELETE' : 'POST';
            const res = await fetch(`${apiUrl}/users/${userId}/save-recipe${isSaved ? `/${recipe.id}` : ''}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: method === 'POST' ? JSON.stringify({ recipeId: recipe.id }) : undefined
            });

            if (res.ok) {
                setIsSaved(!isSaved);
            }
        } catch (error) {
            console.error('Failed to toggle save:', error);
        }
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col active:scale-95 transition-transform cursor-pointer relative">
            <div className="relative h-40 w-full bg-gray-200">
                <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                />

                {/* Save Icon absolute positioned */}
                <button
                    onClick={toggleSave}
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-600 hover:text-green-600"
                >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-green-500 text-green-500' : ''}`} />
                </button>

                {recipe.isSoggyProof && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <ShieldCheck className="w-3 h-3" /> Soggy-Proof
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-gray-800 leading-tight">{recipe.title}</h3>

                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                    <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTimeMins}m
                    </div>
                    {recipe.dietaryPreference && (
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${recipe.dietaryPreference === 'Veg' ? 'text-green-700 bg-green-100' :
                            recipe.dietaryPreference === 'Vegan' ? 'text-emerald-700 bg-emerald-100' :
                                'text-red-700 bg-red-100'
                            }`}>
                            {recipe.dietaryPreference}
                        </div>
                    )}
                    <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                        <Dumbbell className="w-3 h-3" />
                        {recipe.proteinPerServingGrams}g Protein
                    </div>
                </div>

                {isHighProtein && (
                    <div className="mt-1 text-[10px] text-green-700 bg-green-50 px-2 py-1 rounded w-fit border border-green-100">
                        P:C Ratio &gt; 1:3 Achieved! 🏆
                    </div>
                )}
            </div>
        </div>
    );
}
