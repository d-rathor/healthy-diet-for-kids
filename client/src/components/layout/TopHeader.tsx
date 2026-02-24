'use client';

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function TopHeader() {
    const { data: session } = useSession();

    if (!session?.user) {
        return null;
    }

    return (
        <div className="absolute top-[34px] right-6 z-50">
            {session.user.image ? (
                <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full shadow-sm"
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs text-green-700 font-bold shadow-sm">
                    {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase()}
                </div>
            )}
        </div>
    );
}
