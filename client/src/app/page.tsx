'use client';

import Link from 'next/link';
import { Scan } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] || 'Bits';

  return (
    <div className="p-6 relative min-h-screen pb-28">
      {/* Header Section */}
      <header className="mb-6 mt-2 pr-12">
        <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">
          Good Morning {firstName}
        </h1>
      </header>

      {/* Fridge Scanner Card */}
      <section className="bg-gradient-to-br from-[#fcb086] via-[#fdc791] to-[#fde1aa] rounded-[24px] p-6 text-gray-900 relative shadow-sm mb-4 h-[180px] flex flex-col justify-center overflow-hidden">
        <div className="w-[65%] relative z-10">
          <h2 className="text-[22px] font-extrabold tracking-tight mb-3 text-gray-900 drop-shadow-sm">Fridge Scanner</h2>
          <div className="mb-5 leading-tight">
            <span className="block text-[12px] font-bold text-gray-900/50 uppercase tracking-[0.15em] mb-1">Scan Your Fridge.</span>
            <span className="block text-[17px] font-black tracking-tight text-gray-900">
              Find Recipes. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 italic">Fast.</span>
            </span>
          </div>
          <Link href="/scan" className="inline-block">
            <button className="bg-[#fef4dd] hover:bg-[#faeec5] text-gray-900 font-semibold px-5 py-2 rounded-full text-[13px] shadow-sm transition-colors cursor-pointer">
              Scan Ingredients
            </button>
          </Link>
        </div>

        {/* Camera Icon Overlay */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-0">
          <div className="relative w-[72px] h-[72px]">
            <Scan className="w-full h-full text-gray-900 opacity-90" strokeWidth={1} />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-900 opacity-90 relative top-0.5"
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

      {/* Carousel Dots */}
      <div className="flex justify-center gap-1.5 mb-8">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
      </div>

      {/* Images Grid */}
      <section className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/library?tab=Lunch%20Box" className="block outline-none group">
            <div className="relative h-44 rounded-[24px] overflow-hidden shadow-sm">
              <img src="/images/lunch-box-custom.png" alt="Soggy-Proof Lunch Box" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
              <div className="absolute top-3 left-3 bg-[#e4f3e8]/95 backdrop-blur-sm text-[#113a24] text-[13px] font-bold px-3 py-1.5 rounded-full tracking-wide shadow-sm">
                Soggy-Proof
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="font-bold text-lg drop-shadow-md">Lunch Box</span>
              </div>
            </div>
          </Link>

          <Link href="/library?tab=Breakfast" className="block outline-none group">
            <div className="relative h-44 rounded-[24px] overflow-hidden shadow-sm">
              <img src="/images/breakfast-custom.png" alt="Breakfast" className="w-full h-full object-cover scale-[1.15] object-[90%_center]" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
              <div className="absolute top-3 left-3 bg-[#f6efe7]/95 backdrop-blur-sm text-[#000000] text-[13px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                &lt; 15 MINS
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="font-bold text-lg drop-shadow-md">Breakfast</span>
              </div>
            </div>
          </Link>
        </div>

        <Link href="/library?tab=Quick%20Bites" className="block outline-none group">
          <div className="relative h-40 rounded-[24px] overflow-hidden shadow-sm">
            <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80" alt="Quick Bites Paneer Tikka" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            <div className="absolute top-3 left-3 bg-[#f2e2c8]/95 backdrop-blur-sm text-[#151515] text-[13px] font-bold px-3 py-1.5 rounded-full shadow-sm">
              Quick Bites (&lt; 15m)
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <span className="font-bold text-xl drop-shadow-md">Quick Bites (&lt; 15m)</span>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
