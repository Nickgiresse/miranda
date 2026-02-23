import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAdminRoute = nextUrl.pathname.startsWith("/admin")
      if (isAdminRoute) return !!auth?.user
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id
        token.role = (user as { role?: string }).role
        token.name = (user as { name?: string }).name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        if (token.name) session.user.name = token.name as string
      }
      return session
    },
  },
  providers: [], // vide — les providers sont dans lib/auth
  session: { strategy: "jwt" },
}
