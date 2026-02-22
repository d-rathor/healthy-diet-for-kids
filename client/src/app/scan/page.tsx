'use client';

import { useState, useRef } from 'react';
import { Camera, RefreshCcw, Check, Loader2 } from 'lucide-react';
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
            // 1. Upload to Backblaze B2 via Express API
            // We convert dataURI to Blob
            const resBlob = await fetch(imageUri);
            const blob = await resBlob.blob();
            const formData = new FormData();
            formData.append('image', blob, 'fridge-scan.jpg');

            const uploadRes = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });

            const b2Data = await uploadRes.json();
            console.log('B2 Upload success:', b2Data);

            // Strip data uri prefix if present for Gemini
            const base64Data = imageUri.split(',')[1] || imageUri;

            // 2. Process with Gemini via Next.js
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: base64Data })
            });

            if (!res.ok) throw new Error('Analysis failed');
            const data = await res.json();
            setIngredients(data.detectedIngredients || []);
        } catch (err) {
            console.error(err);
            alert("Failed to analyze image. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const proceedToRecipes = () => {
        // In a full app, we'd pass these ingredients to a recipe generation agent
        // For this prototype, we'll just redirect to the library to "find" matches
        alert(`Searching recipes for: ${ingredients.join(', ')}`);
        router.push('/library');
    };

    return (
        <div className="flex flex-col h-full bg-white relative">

            {/* Header */}
            <div className="p-6 pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Scanner</h1>
                <p className="text-gray-500 font-medium">Find protein hacks from your fridge.</p>
            </div>

            {/* Main View Area */}
            <div className="flex-1 px-6 pb-24 overflow-y-auto w-full flex flex-col items-center">

                {!imageUri ? (
                    <div className="w-full flex flex-col gap-4">
                        <div
                            className="w-full aspect-[4/5] bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 text-gray-400 cursor-pointer active:scale-95 transition-transform shadow-sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="bg-white p-6 rounded-full shadow-sm">
                                <Camera className="w-10 h-10 text-green-500" />
                            </div>
                            <span className="font-bold text-lg text-gray-600">Tap to capture Fridge</span>
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleCapture}
                            />
                        </div>
                        <button onClick={useMockImage} className="text-sm text-green-600 font-bold p-2 bg-green-50 rounded-xl">
                            [Dev Tool] Simulate Photo
                        </button>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center gap-6">
                        <div className="w-full aspect-[4/5] bg-gray-900 rounded-3xl overflow-hidden relative shadow-lg">
                            <img src={imageUri} alt="Captured Fridge" className="w-full h-full object-cover opacity-90" />

                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center backdrop-blur-sm">
                                    <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                                    <span className="text-white font-bold text-lg tracking-wide">Gemini 1.5 Analyzing...</span>
                                </div>
                            )}
                        </div>

                        {ingredients.length > 0 && (
                            <div className="w-full bg-green-50 rounded-2xl p-5 border border-green-100">
                                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                                    <Check className="w-5 h-5" /> Detected Ingredients
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {ingredients.map((ing, idx) => (
                                        <span key={idx} className="bg-white px-3 py-1.5 rounded-full text-sm font-medium text-green-700 shadow-sm border border-green-100">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Thumb-zone controls */}
                        <div className="flex gap-4 w-full mt-2">
                            <button
                                onClick={() => setImageUri(null)}
                                disabled={isAnalyzing}
                                className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <RefreshCcw className="w-5 h-5" /> Retake
                            </button>

                            {ingredients.length === 0 ? (
                                <button
                                    onClick={analyzeImage}
                                    disabled={isAnalyzing}
                                    className="flex-[2] py-4 bg-orange-500 text-white font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50 shadow-md text-lg"
                                >
                                    Analyze Image
                                </button>
                            ) : (
                                <button
                                    onClick={proceedToRecipes}
                                    className="flex-[2] py-4 bg-green-500 text-white font-bold rounded-xl active:scale-95 transition-transform shadow-md text-lg"
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
