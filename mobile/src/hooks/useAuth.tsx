'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useRouter } from 'next/navigation';

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        // Hydrate from localStorage on mount
        const storedUser = localStorage.getItem('capacitor_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setStatus("authenticated");
        } else {
            setStatus("unauthenticated");
        }

        try {
            GoogleAuth.initialize({
                clientId: '336976706017-detaqsrukk09i8606neautv3igojthb3.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
                grantOfflineAccess: true,
            });
        } catch (e) {
            console.error("Auth init error", e);
        }
    }, []);

    const signIn = async (provider: string) => {
        if (provider === 'google') {
            try {
                const response = await GoogleAuth.signIn();
                if (response) {
                    const userData = {
                        id: response.id,
                        name: response.name || response.givenName,
                        email: response.email,
                        image: response.imageUrl
                    };
                    setUser(userData);
                    setStatus("authenticated");
                    localStorage.setItem('capacitor_user', JSON.stringify(userData));
                    return true;
                }
            } catch (error) {
                console.error("Native Login failed", error);
                return false;
            }
        }
        return false;
    };

    const signOut = async () => {
        try {
            await GoogleAuth.signOut();
            setUser(null);
            setStatus("unauthenticated");
            localStorage.removeItem('capacitor_user');
            return true;
        } catch (error) {
            console.error("Native Sign out failed", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ data: user ? { user } : null, status, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

const AuthContext = createContext<any>(null);

export const useSession = () => {
    const context = useContext(AuthContext);
    if (!context) return { data: null, status: "unauthenticated", signIn: async () => false, signOut: async () => false };
    return context;
};

// Export dummy functions for backward compatibility with isolated components that don't use the hook return values
export const signIn = async () => console.warn("Use signIn from useSession instead");
export const signOut = async () => console.warn("Use signOut from useSession instead");
