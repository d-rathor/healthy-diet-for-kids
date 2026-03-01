'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RecipeType, Recipe as MockRecipeType } from '@/data/mockRecipes';
import { Search } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';

// Extend Recipe type to accept _id from MongoDB
export interface Recipe extends MockRecipeType {
    _id?: string;
}

function LibraryContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get('tab') as RecipeType;
    const ingredientsParam = searchParams.get('ingredients');

    const scannedIngredients = ingredientsParam
        ? ingredientsParam.split(',').map(i => decodeURIComponent(i))
        : [];

    const tabs: RecipeType[] = ['Breakfast', 'Lunch Box', 'Quick Bites'];
    const initialTab = tabs.includes(tabParam) ? tabParam : 'Breakfast';

    const [activeTab, setActiveTab] = useState<RecipeType>(initialTab);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Update state if URL param changes
    useEffect(() => {
        if (tabParam && tabs.includes(tabParam) && tabParam !== activeTab) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = (tab: RecipeType) => {
        setActiveTab(tab);
        const params = new URLSearchParams();
        params.set('tab', tab);
        if (ingredientsParam) params.set('ingredients', ingredientsParam);
        router.replace(`/library?${params.toString()}`);
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            setIsLoading(true);
            try {
                const isProd = process.env.NODE_ENV === 'production';
                const defaultApiUrl = isProd ? 'https://healthy-diet-for-kids.onrender.com/api' : 'http://localhost:5000/api';
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;
                const res = await fetch(`${apiUrl}/recipes`, {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    }
                });
                if (!res.ok) throw new Error('Failed to fetch recipes');

                const data = await res.json();

                const formattedData = data.map((item: any) => ({
                    ...item,
                    id: item._id?.toString() || item.id
                }));

                setRecipes(formattedData);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const filteredRecipes = recipes.filter(r => r.type === activeTab);

    return (
        <div className="h-full flex flex-col bg-gray-50">

            {/* Header Sticky Area */}
            <div className="bg-white px-6 pt-6 pb-2 sticky top-0 z-10 shadow-sm">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Recipe Library</h1>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search ingredients (e.g., Paneer)..."
                        className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-12 pr-4 text-md focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-700"
                    />
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${activeTab === tab
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scanned Ingredients Banner */}
            {scannedIngredients.length > 0 && (
                <div className="mx-4 mt-3 bg-gradient-to-r from-[#e4f3e8] to-[#d4eadb] rounded-2xl px-4 py-3 border border-[#c5ddc9]">
                    <p className="text-[13px] font-semibold text-[#2d5a3a]">
                        🔍 Recipes that contain: <span className="font-extrabold text-[#1a3d24]">{scannedIngredients.join(', ')}</span>
                    </p>
                </div>
            )}

            {/* Recipe Grid */}
            <div className="p-4 grid grid-cols-2 gap-4">
                {isLoading ? (
                    // Loading Skeletons
                    Array(4).fill(0).map((_, idx) => (
                        <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-64 animate-pulse">
                            <div className="w-full h-40 bg-gray-200"></div>
                            <div className="p-4 flex flex-col gap-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        {filteredRecipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                        {filteredRecipes.length === 0 && (
                            <div className="col-span-2 py-12 text-center text-gray-400">
                                <p className="font-medium text-lg mb-2">No recipes found.</p>
                                <p className="text-sm">We're cooking up some new ideas!</p>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
}

export default function LibraryPage() {
    return (
        <Suspense fallback={
            <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LibraryContent />
        </Suspense>
    );
}
