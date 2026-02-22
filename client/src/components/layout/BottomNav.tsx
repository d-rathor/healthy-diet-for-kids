import Link from 'next/link';
import { Home, ScanLine, Library, User } from 'lucide-react';

export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50">
            <div className="flex justify-around items-center h-20 px-4">

                <Link href="/" className="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-green-600 active:text-green-700 transition-colors">
                    <Home className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link href="/library" className="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-green-600 active:text-green-700 transition-colors">
                    <Library className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">Library</span>
                </Link>

                {/* Scanner - Prominent primary action in thumb zone */}
                <Link href="/scan" className="relative -top-5 flex flex-col items-center justify-center">
                    <div className="bg-green-500 text-white rounded-full p-4 shadow-lg shadow-green-200 ring-4 ring-white transition-transform active:scale-95">
                        <ScanLine className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold text-green-600 mt-1">Scan</span>
                </Link>

                <Link href="/saved" className="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-green-600 active:text-green-700 transition-colors">
                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-[10px] font-medium">Saved</span>
                </Link>

                <Link href="/profile" className="flex flex-col items-center justify-center w-16 h-full text-gray-400 hover:text-green-600 active:text-green-700 transition-colors">
                    <User className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">Profile</span>
                </Link>

            </div>
        </nav>
    );
}
