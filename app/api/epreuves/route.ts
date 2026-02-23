import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/helpers"
import { z } from "zod"

const createEpreuveSchema = z.object({
  titre: z.string().min(1),
  type: z.enum(["CONCOURS", "CC", "SN", "EPREUVE_SIMPLE"]),
  fichierEpreuve: z.string().url().or(z.string().min(1)),
  fichierCorrige: z.string().url().or(z.string()).optional().nullable(),
  isGratuit: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  filiereNiveauId: z.string().uuid(),
  matiereId: z.string().uuid(),
})

const EPREUVE_TYPES = ["CONCOURS", "CC", "SN", "EPREUVE_SIMPLE"] as const
type TypeEpreuve = (typeof EPREUVE_TYPES)[number]

function isTypeEpreuve(s: string | null): s is TypeEpreuve {
  return s !== null && EPREUVE_TYPES.includes(s as TypeEpreuve)
}

// GET /api/epreuves?niveau=1&filiere=uuid&type=CONCOURS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const niveauNumero = searchParams.get("niveau")
    const filiereId = searchParams.get("filiere")
    const typeParam = searchParams.get("type")

    const where: Record<string, unknown> = { isPublished: true }
    if (isTypeEpreuve(typeParam)) where.type = typeParam
    if (filiereId || niveauNumero) {
      where.filiereNiveau = {}
      if (filiereId) (where.filiereNiveau as Record<string, string>).filiereId = filiereId
      if (niveauNumero) {
        const niveau = await prisma.niveau.findFirst({ where: { numero: Number(niveauNumero) } })
        if (niveau) (where.filiereNiveau as Record<string, number>).niveauId = niveau.id
      }
    }

    const epreuves = await prisma.epreuve.findMany({
      where,
      include: {
        filiereNiveau: { include: { filiere: true, niveau: true } },
        matiere: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(epreuves)
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/epreuves
export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = await req.json()
    const data = createEpreuveSchema.parse(body)

    const epreuve = await prisma.epreuve.create({
      data: {
        titre: data.titre,
        type: data.type,
        fichierEpreuve: data.fichierEpreuve,
        fichierCorrige: data.fichierCorrige ?? null,
        isGratuit: data.isGratuit,
        isPublished: data.isPublished ?? true,
        filiereNiveauId: data.filiereNiveauId,
        matiereId: data.matiereId,
      },
      include: {
        filiereNiveau: { include: { filiere: true, niveau: true } },
        matiere: true,
      },
    })
    return NextResponse.json(epreuve)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 })
    }
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
