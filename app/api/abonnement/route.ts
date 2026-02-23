import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireAdmin } from "@/lib/auth/helpers"
import { z } from "zod"

const createAbonnementSchema = z.object({
  userId: z.string().uuid(),
  prix: z.number().positive(),
  dureeMois: z.number().int().positive().default(12),
})

// GET /api/abonnement - liste des abonnements de l'utilisateur connecté (ou tous si admin)
export async function GET(req: Request) {
  try {
    const session = await requireAuth()
    const { searchParams } = new URL(req.url)
    const asAdmin = searchParams.get("admin") === "true"
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"

    if (asAdmin && isAdmin) {
      const abonnements = await prisma.abonnement.findMany({
        include: { user: { select: { id: true, email: true, fullName: true } } },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(abonnements)
    }

    const abonnements = await prisma.abonnement.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(abonnements)
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/abonnement - créer un abonnement (admin) ou demander (user: à brancher paiement)
export async function POST(req: Request) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"

    if (isAdmin) {
      await requireAdmin()
      const data = createAbonnementSchema.parse(body)
      const dateDebut = new Date()
      const dateFin = new Date()
      dateFin.setMonth(dateFin.getMonth() + data.dureeMois)

      const abonnement = await prisma.abonnement.create({
        data: {
          userId: data.userId,
          prix: data.prix,
          dateDebut,
          dateFin,
          isActive: true,
        },
      })
      return NextResponse.json(abonnement)
    }

    // Utilisateur : création abonnement pour soi (après paiement simulé)
    const settings = await prisma.systemSettings.findFirst()
    const prix = settings?.prixAbonnement ?? 1000
    const dateDebut = new Date()
    const dateFin = new Date()
    dateFin.setFullYear(dateFin.getFullYear() + 1)

    const abonnement = await prisma.abonnement.create({
      data: {
        userId: session.user.id,
        prix,
        dateDebut,
        dateFin,
        isActive: true,
      },
    })
    return NextResponse.json(abonnement)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 })
    }
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
