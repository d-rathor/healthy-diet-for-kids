'use client';

import Link from 'next/link';
import { Scan } from 'lucide-react';
import { useSession } from '@/hooks/useAuth';

export default function Home() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] || 'There';

  return (
    <div className="p-6 relative min-h-screen pb-28">
      {/* Header Section */}
      <header className="mb-6 mt-2 pr-12">
        <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">
          Good Morning {firstName}
        </h1>
      </header>

      {/* Fridge Scanner Card */}
      <section className="mb-4 rounded-[24px] overflow-hidden shadow-sm active:scale-95 transition-transform">
        <Link href="/scan" className="block outline-none">
          <img
            src="/images/fridge-scanner-banner.png"
            alt="Scan Your Fridge to Find Recipes Fast"
            className="w-full h-auto object-cover"
          />
        </Link>
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
