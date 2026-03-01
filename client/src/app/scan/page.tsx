'use client';

import { useState, useRef } from 'react';
import { Camera, RefreshCcw, Check, Loader2, ImagePlus, Scan } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [ingredients, setIngredients] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUri(reader.result as string);
                setIngredients([]); // Reset previous scan
            };
            reader.readAsDataURL(file);
        }
    };

    const useMockImage = async () => {
        // For local prototype testing we fetch a sample fridge photo
        const res = await fetch('https://images.unsplash.com/photo-1584282572236-41cecf5dbbba?w=600&h=800&fit=crop');
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUri(reader.result as string);
            setIngredients([]);
        };
        reader.readAsDataURL(blob);
    };

    const analyzeImage = async () => {
        if (!imageUri) return;
        setIsAnalyzing(true);

        try {
            // Upload to Backblaze B2 via Express API
            const resBlob = await fetch(imageUri);
            const blob = await resBlob.blob();
            const formData = new FormData();
            formData.append('image', blob, 'fridge-scan.jpg');

            const isProd = process.env.NODE_ENV === 'production';
            const defaultApiUrl = isProd ? 'https://healthy-diet-for-kids.onrender.com/api' : 'http://localhost:5000/api';
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;
            const uploadRes = await fetch(`${apiUrl}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error('B2 Upload failed');

            const b2Data = await uploadRes.json();
            console.log('B2 Upload success:', b2Data);

            // Send the uploaded public B2 Image URL to the Next.js API route instead of the raw Base64 string
            // This prevents Netlify Serverless Functions from crashing due to 4MB Payload Limits
            const reqBody = b2Data?.url ? { imageUrl: b2Data.url } : { imageBase64: imageUri.split(',')[1] || imageUri };

            // Process with Gemini via Next.js
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                console.error("Server API Error details:", errData);
                throw new Error(errData?.details || 'Analysis failed with status ' + res.status);
            }
            const data = await res.json();
            setIngredients(data.detectedIngredients || []);
        } catch (err: any) {
            console.error('Scan exception:', err);
            alert(`Failed: ${err.message || 'Please try again.'}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const proceedToRecipes = () => {
        const ingredientParams = ingredients.map(i => encodeURIComponent(i)).join(',');
        router.push(`/library?ingredients=${ingredientParams}`);
    };

    return (
        <div className="flex flex-col h-full bg-[#f4f9f0] relative min-h-screen">
            {/* Header */}
            <div className="p-6 pb-2 mt-4">
                <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight">Scanner</h1>
                <p className="text-gray-500 font-medium mt-1">Find protein hacks from your fridge.</p>
            </div>

            {/* Main View Area */}
            <div className="flex-1 px-6 pb-32 overflow-y-auto w-full flex flex-col items-center">
                {!imageUri ? (
                    <div className="w-full flex flex-col items-center gap-4 mt-4">
                        <label
                            className="w-full aspect-[4/5] bg-gradient-to-b from-white to-gray-50 rounded-[32px] border-[3px] border-dashed border-[#dcebdc] flex flex-col items-center justify-center gap-6 text-gray-400 cursor-pointer active:scale-95 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-active:opacity-100 transition-opacity"></div>

                            <div className="bg-[#eaf3ea] p-6 rounded-full shadow-inner relative">
                                <div className="absolute inset-0 bg-[#6b8e73] rounded-full animate-ping opacity-20"></div>
                                <Camera className="w-12 h-12 text-[#6b8e73] relative z-10" strokeWidth={1.5} />
                            </div>

                            <div className="text-center z-10">
                                <span className="font-bold text-xl text-gray-800 block mb-1">Tap to capture Fridge</span>
                                <span className="text-sm font-medium text-gray-400">or upload from gallery</span>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCapture}
                            />
                        </label>

                        {/* Instructions Box */}
                        <section className="w-full bg-gradient-to-br from-[#fcb086] via-[#fdc791] to-[#fde1aa] rounded-[24px] p-6 text-gray-900 relative shadow-sm mt-2 flex flex-col justify-center overflow-hidden">
                            <div className="w-[75%] relative z-10">
                                <h2 className="text-[20px] font-extrabold tracking-tight mb-3 text-gray-900 drop-shadow-sm">Fridge Scanner</h2>
                                <div className="mb-1 leading-tight">
                                    <span className="block text-[14px] font-semibold text-gray-800 mb-2 leading-snug">
                                        Use the above button to scan your fridge, any food items in your household.
                                    </span>
                                    <span className="block text-[15px] font-black tracking-tight text-gray-900 leading-snug">
                                        We will suggest recipes based on those <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 italic">ingredients!</span>
                                    </span>
                                </div>
                            </div>

                            {/* Camera Icon Overlay */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-0">
                                <div className="relative w-[64px] h-[64px]">
                                    <Scan className="w-full h-full text-gray-900 opacity-90" strokeWidth={1} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg
                                            className="w-7 h-7 text-gray-900 opacity-90 relative top-0.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                            <circle cx="12" cy="13" r="4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center gap-6 mt-4">
                        <div className="w-full aspect-[4/5] bg-gray-900 rounded-[32px] overflow-hidden relative shadow-lg ring-4 ring-white/50">
                            <img src={imageUri} alt="Captured Fridge" className="w-full h-full object-cover opacity-95" />

                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-md">
                                    <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                                    <span className="text-white font-bold text-lg tracking-wide">AI is analyzing...</span>
                                </div>
                            )}
                        </div>

                        {ingredients.length > 0 && (
                            <div className="w-full bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-[#6b8e73] mb-4 flex items-center gap-2 text-lg">
                                    <div className="bg-[#e4f3e8] p-1.5 rounded-full">
                                        <Check className="w-4 h-4 text-[#113a24]" />
                                    </div>
                                    Detected Ingredients
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {ingredients.map((ing, idx) => (
                                        <span key={idx} className="bg-gray-50 px-4 py-2 rounded-xl text-[14px] font-semibold text-gray-700 border border-gray-100 shadow-sm">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex gap-4 w-full mt-2">
                            <button
                                onClick={() => setImageUri(null)}
                                disabled={isAnalyzing}
                                className="flex-1 py-4 bg-white text-gray-500 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm border border-gray-100 hover:text-gray-700"
                            >
                                <RefreshCcw className="w-5 h-5" />
                            </button>

                            {ingredients.length === 0 ? (
                                <button
                                    onClick={analyzeImage}
                                    disabled={isAnalyzing}
                                    className="flex-[3] py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-2xl active:scale-95 transition-all disabled:opacity-50 shadow-[0_8px_16px_-6px_rgba(255,165,0,0.4)] text-[17px]"
                                >
                                    Analyze Image
                                </button>
                            ) : (
                                <button
                                    onClick={proceedToRecipes}
                                    className="flex-[3] py-4 bg-[#6b8e73] text-white font-bold rounded-2xl active:scale-95 transition-all shadow-[0_8px_16px_-6px_rgba(107,142,115,0.4)] text-[17px] hover:bg-[#57755e]"
                                >
                                    Find Recipes
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
