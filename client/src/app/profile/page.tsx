'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="p-6 flex justify-center items-center h-full min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[70vh]">
                <div className="text-center mb-8">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">👋</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome</h1>
                    <p className="text-gray-500 mt-3 text-lg px-4">Sign in to sync your recipes and preferences across your devices.</p>
                </div>

                <button
                    onClick={() => signIn("google")}
                    className="w-full max-w-sm flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-gray-700 font-bold text-lg"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <header className="mb-8 mt-4">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile</h1>
            </header>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                <div className="relative mt-8">
                    {session.user?.image ? (
                        <Image
                            src={session.user.image}
                            alt="Profile Photo"
                            width={96}
                            height={96}
                            className="rounded-full border-4 border-white shadow-md bg-white object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-green-100 flex items-center justify-center text-3xl font-bold text-green-700">
                            {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>

                <h2 className="mt-4 text-2xl font-bold text-gray-900">{session.user?.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{session.user?.email}</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-2xl p-4 font-bold hover:bg-red-100 active:scale-95 transition-all text-lg"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
