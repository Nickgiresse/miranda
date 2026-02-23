import "server-only"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/** Utilisateur courant depuis la session NextAuth (pour usage serveur, ex. layout alternatif). */
export async function getCurrentUser() {
  try {
    const session = await auth()
    if (!session?.user?.id) return null

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, fullName: true, role: true },
    })
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName ?? null,
      role: user.role,
    }
  } catch {
    return null
  }
}
