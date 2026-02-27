import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth?.user
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return Response.redirect(loginUrl)
  }

  if (isAdminRoute && isLoggedIn) {
    const role = req.auth?.user?.role as string | undefined
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return Response.redirect(new URL("/", nextUrl.origin))
    }
  }

  return undefined
})

export const config = {
  matcher: ["/admin/:path*"],
}
