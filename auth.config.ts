import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnAdmin = nextUrl.pathname.startsWith("/admin")
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")

            if (isOnAdmin) {
                if (isLoggedIn) {
                    // Check role here if possible, but for simple auth check:
                    return true
                }
                return false // Redirect unauthenticated users to login page
            }
            return true
        },
        // We will add session callbacks in the main auth.ts to avoid hydration issues in middleware
        async session({ session, token }: any) {
            if (token && session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
