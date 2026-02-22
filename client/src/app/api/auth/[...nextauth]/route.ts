import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "mock-secret-for-dev",
    callbacks: {
        async signIn({ user }) {
            if (user.email) {
                try {
                    // Sync with our Express/MongoDB backend
                    const res = await fetch(`http://localhost:5000/api/users/sync`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            image: user.image
                        })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        // Store our MongoDB _id back into the NextAuth user object
                        user.id = data.user._id;
                        return true;
                    }
                } catch (error) {
                    console.error("Error syncing user with backend:", error);
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user && token) {
                (session.user as any).id = token.sub; // token.sub gets the user.id mapped during signIn
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as NextAuth, handler as POST };
