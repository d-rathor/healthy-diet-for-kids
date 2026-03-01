import Link from 'next/link';
import { Home, LayoutGrid, Bookmark, User } from 'lucide-react';

export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 w-full max-w-md bg-white rounded-t-3xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] z-50" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}>
            <div className="flex justify-around items-center h-[72px] px-2 relative">
                <Link href="/" className="flex flex-col items-center justify-center w-14 h-full text-[#6b8e73] transition-colors">
                    <Home className="w-[22px] h-[22px]" />
                </Link>

                <Link href="/library" className="flex flex-col items-center justify-center w-14 h-full text-gray-300 hover:text-[#6b8e73] transition-colors">
                    <LayoutGrid className="w-[22px] h-[22px]" />
                </Link>

                {/* Scanner - Floating button overlapping the nav */}
                <div className="relative flex justify-center w-20">
                    <div className="absolute -top-[45px] w-[76px] h-[76px] rounded-full bg-[#f4f9f0] flex items-center justify-center shadow-inner">
                        <Link href="/scan" className="flex flex-col items-center justify-center bg-[#6b8e73] text-white rounded-full w-[60px] h-[60px] shadow-sm transition-transform active:scale-95">
                            <span className="font-semibold text-[13px] tracking-wide relative top-[1px]">Scan</span>
                        </Link>
                    </div>
                </div>

                <Link href="/saved" className="flex flex-col items-center justify-center w-14 h-full text-gray-300 hover:text-[#6b8e73] transition-colors">
                    <Bookmark className="w-[22px] h-[22px]" />
                </Link>

                <Link href="/profile" className="flex flex-col items-center justify-center w-14 h-full text-gray-300 hover:text-[#6b8e73] transition-colors">
                    <User className="w-[22px] h-[22px]" />
                </Link>

            </div>
        </nav>
    );
}
