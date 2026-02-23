import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireSuperAdmin } from "@/lib/auth/helpers"
import { z } from "zod"

const createFiliereSchema = z.object({
  nom: z.string().min(1),
  code: z.string().min(1).max(20),
  couleur: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
})

// GET /api/filieres
export async function GET() {
  try {
    const filieres = await prisma.filiere.findMany({
      where: { isActive: true },
      include: {
        filiereNiveaux: { include: { niveau: true } },
        matieres: true,
      },
      orderBy: { code: "asc" },
    })
    return NextResponse.json(filieres)
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/filieres (Super Admin uniquement)
export async function POST(req: Request) {
  try {
    await requireSuperAdmin()
    const body = await req.json()
    const data = createFiliereSchema.parse(body)

    const filiere = await prisma.filiere.create({
      data: {
        nom: data.nom,
        code: data.code.toUpperCase(),
        couleur: data.couleur,
        description: data.description ?? null,
        isActive: data.isActive,
      },
    })
    return NextResponse.json(filiere)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 })
    }
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
