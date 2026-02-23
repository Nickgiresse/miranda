import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireSuperAdmin } from "@/lib/auth/helpers"
import { z } from "zod"

const updateFiliereSchema = z.object({
  nom: z.string().min(1).optional(),
  code: z.string().min(1).max(20).optional(),
  couleur: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

// GET /api/filieres/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const filiere = await prisma.filiere.findUnique({
      where: { id },
      include: {
        filiereNiveaux: { include: { niveau: true } },
        matieres: true,
      },
    })
    if (!filiere) return NextResponse.json({ error: "Filière introuvable" }, { status: 404 })
    return NextResponse.json(filiere)
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH /api/filieres/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSuperAdmin()
    const { id } = await params
    const body = await req.json()
    const data = updateFiliereSchema.parse(body)

    const filiere = await prisma.filiere.update({
      where: { id },
      data: {
        ...(data.nom != null && { nom: data.nom }),
        ...(data.code != null && { code: data.code.toUpperCase() }),
        ...(data.couleur != null && { couleur: data.couleur }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
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

// DELETE /api/filieres/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSuperAdmin()
    const { id } = await params
    await prisma.filiere.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
