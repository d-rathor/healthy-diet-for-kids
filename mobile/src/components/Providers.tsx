'use client';

import { SessionProvider } from "@/hooks/useAuth";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
