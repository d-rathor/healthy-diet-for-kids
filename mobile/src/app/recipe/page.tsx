'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Dumbbell, ShieldCheck, Users, AlertTriangle, ChefHat, Lightbulb, Bookmark } from 'lucide-react';

interface RecipeDetail {
    _id: string;
    title: string;
    type: string;
    dietaryPreference: string;
    prepTimeMins: number;
    ingredients: string[];
    proteinPerServingGrams: number;
    carbPerServingGrams: number;
    proteinToCarbRatio: number;
    isSoggyProof: boolean;
    instructions: string[];
    tips: string[];
    imageUrl?: string;
    ageGroup?: string;
    allergyTags?: string[];
}

function RecipeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const recipeId = searchParams.get('id');
    const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const isProd = process.env.NODE_ENV === 'production';
                const defaultApiUrl = isProd ? 'https://healthy-diet-for-kids.onrender.com/api' : 'http://localhost:5000/api';
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;
                const res = await fetch(`${apiUrl}/recipes/${recipeId}`);
                if (!res.ok) throw new Error('Not found');
                const data = await res.json();
                setRecipe(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        if (recipeId) fetchRecipe();
    }, [recipeId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f4f9f0] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen bg-[#f4f9f0] flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 text-lg font-medium">Recipe not found</p>
                <button onClick={() => router.back()} className="text-green-600 font-bold">← Go Back</button>
            </div>
        );
    }

    const isHighProtein = recipe.proteinToCarbRatio >= 0.33;
    const dietColors: Record<string, string> = {
        'Veg': 'bg-green-500',
        'Non-Veg': 'bg-red-500',
        'Egg': 'bg-yellow-500',
        'Vegan': 'bg-emerald-500'
    };

    return (
        <div className="min-h-screen bg-[#f4f9f0]">
            {/* Hero Image */}
            <div className="relative h-[320px] w-full overflow-hidden">
                <img
                    src={recipe.imageUrl || '/placeholder-food.jpg'}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full shadow-lg active:scale-90 transition-transform"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full shadow-lg active:scale-90 transition-transform"
                >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`${dietColors[recipe.dietaryPreference] || 'bg-gray-500'} text-white text-[11px] font-bold px-3 py-1 rounded-full`}>
                            {recipe.dietaryPreference}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
                            {recipe.type}
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white leading-tight drop-shadow-lg">{recipe.title}</h1>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white mx-4 -mt-4 rounded-2xl shadow-lg p-4 flex justify-around items-center relative z-10 border border-gray-100">
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-orange-50 p-2 rounded-full">
                        <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="text-[13px] font-extrabold text-gray-800">{recipe.prepTimeMins} min</span>
                    <span className="text-[10px] text-gray-400 font-medium">Prep Time</span>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-blue-50 p-2 rounded-full">
                        <Dumbbell className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-[13px] font-extrabold text-gray-800">{recipe.proteinPerServingGrams}g</span>
                    <span className="text-[10px] text-gray-400 font-medium">Protein</span>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-purple-50 p-2 rounded-full">
                        <span className="text-purple-500 font-bold text-sm">C</span>
                    </div>
                    <span className="text-[13px] font-extrabold text-gray-800">{recipe.carbPerServingGrams}g</span>
                    <span className="text-[10px] text-gray-400 font-medium">Carbs</span>
                </div>
                {recipe.isSoggyProof && (
                    <>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="bg-green-50 p-2 rounded-full">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                            </div>
                            <span className="text-[10px] font-bold text-green-600">Soggy</span>
                            <span className="text-[10px] text-gray-400 font-medium">Proof</span>
                        </div>
                    </>
                )}
            </div>

            {isHighProtein && (
                <div className="mx-4 mt-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-4 py-2.5 border border-green-200 flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <span className="text-[12px] font-bold text-green-700">
                        High Protein! P:C Ratio {recipe.proteinToCarbRatio.toFixed(2)} (Target &gt; 0.33)
                    </span>
                </div>
            )}

            {/* Age Group & Allergies */}
            {(recipe.ageGroup || (recipe.allergyTags && recipe.allergyTags.length > 0)) && (
                <div className="mx-4 mt-3 flex gap-2 flex-wrap">
                    {recipe.ageGroup && (
                        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl border border-blue-100">
                            <Users className="w-4 h-4" />
                            <span className="text-[12px] font-bold">Ages {recipe.ageGroup}</span>
                        </div>
                    )}
                    {recipe.allergyTags && recipe.allergyTags.map((tag, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-2 rounded-xl border border-amber-100">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">{tag}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Ingredients */}
            <div className="mx-4 mt-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-green-500 p-1.5 rounded-lg">
                        <ChefHat className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-extrabold text-gray-800">Ingredients</h2>
                    <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-bold">{recipe.ingredients.length} items</span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {recipe.ingredients.map((item, index) => (
                        <div key={index} className={`flex items-center gap-3 px-4 py-3 ${index < recipe.ingredients.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                            <span className="text-[13px] font-medium text-gray-700">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            <div className="mx-4 mt-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-orange-500 p-1.5 rounded-lg">
                        <span className="text-white text-sm font-bold">📝</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-gray-800">Instructions</h2>
                </div>
                <div className="space-y-3">
                    {recipe.instructions.map((step, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3 items-start">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold flex-shrink-0 mt-0.5 shadow-sm">
                                {index + 1}
                            </div>
                            <p className="text-[13px] font-medium text-gray-700 leading-relaxed flex-1">{step}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            {recipe.tips && recipe.tips.length > 0 && (
                <div className="mx-4 mt-5 mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-yellow-500 p-1.5 rounded-lg">
                            <Lightbulb className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-extrabold text-gray-800">Pro Tips</h2>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-4 space-y-2">
                        {recipe.tips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <span className="text-yellow-500 mt-0.5">💡</span>
                                <p className="text-[13px] font-medium text-amber-800 leading-relaxed">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="h-24"></div>
        </div>
    );
}

export default function RecipePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f4f9f0] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <RecipeContent />
        </Suspense>
    );
}
