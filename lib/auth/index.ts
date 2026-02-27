import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { withDB } from "@/lib/db"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = String(credentials.email).trim().toLowerCase()
        const user = await withDB((db) =>
          db.user.findUnique({
            where: { email },
            select: { id: true, email: true, fullName: true, password: true, role: true },
          })
        )

        if (!user) return null
        const ok = await bcrypt.compare(String(credentials.password), user.password)
        if (!ok) return null

        return {
          id: user.id,
          email: user.email,
          name: user.fullName ?? undefined,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  session: {
    ...authConfig.session,
    maxAge: 30 * 24 * 60 * 60,
  },
})
