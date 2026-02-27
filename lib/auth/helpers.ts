import { auth } from "@/lib/auth"
import { withDB } from "@/lib/db"

export type Role = "USER" | "ADMIN" | "SUPER_ADMIN"

/** Vérifie que l'utilisateur est connecté et retourne la session ou null */
export async function getSession() {
  return await auth()
}

/** Exige un utilisateur connecté. Lance une erreur 401 sinon. */
export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Response(JSON.stringify({ error: "Non authentifié" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }
  return session
}

/** Exige un rôle ADMIN ou SUPER_ADMIN. Lance 403 sinon. */
export async function requireAdmin() {
  const session = await requireAuth()
  const role = session.user.role as Role
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new Response(JSON.stringify({ error: "Accès réservé aux administrateurs" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }
  return session
}

/** Exige le rôle SUPER_ADMIN. Lance 403 sinon. */
export async function requireSuperAdmin() {
  const session = await requireAuth()
  if (session.user.role !== "SUPER_ADMIN") {
    throw new Response(JSON.stringify({ error: "Accès réservé au super administrateur" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }
  return session
}

/** Vérifie si l'utilisateur a un abonnement actif (dateFin >= aujourd'hui, isActive) */
export async function hasActiveAbonnement(userId: string): Promise<boolean> {
  const now = new Date()
  const abo = await withDB((db) =>
    db.abonnement.findFirst({
      where: {
        userId,
        isActive: true,
        dateFin: { gte: now },
      },
    })
  )
  return !!abo
}
