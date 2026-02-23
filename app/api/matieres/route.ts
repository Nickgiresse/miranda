import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/helpers"
import { z } from "zod"

const createMatiereSchema = z.object({
  nom: z.string().min(1),
  filiereId: z.string().uuid(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filiereCode = searchParams.get("filiere")
    const filiereId = searchParams.get("filiereId")

    const matieres = await prisma.matiere.findMany({
      where: {
        ...(filiereCode
          ? { filiere: { code: filiereCode.toUpperCase() } }
          : {}),
        ...(filiereId ? { filiereId } : {}),
      },
      select: { id: true, nom: true, filiereId: true },
      orderBy: { nom: "asc" },
    })

    return NextResponse.json(matieres)
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = await req.json()
    const data = createMatiereSchema.parse(body)

    const matiere = await prisma.matiere.create({
      data: { nom: data.nom, filiereId: data.filiereId },
      include: { filiere: true },
    })
    return NextResponse.json(matiere)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 })
    }
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
