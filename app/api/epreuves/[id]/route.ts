import { NextResponse } from "next/server"
import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { z } from "zod"

const updateEpreuveSchema = z.object({
  titre: z.string().min(1).optional(),
  type: z.enum(["CONCOURS", "CC", "SN", "EPREUVE_SIMPLE"]).optional(),
  fichierEpreuve: z.string().optional(),
  fichierCorrige: z.string().optional().nullable(),
  isGratuit: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  filiereNiveauId: z.string().uuid().optional(),
  matiereId: z.string().uuid().optional(),
})

// GET /api/epreuves/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const epreuve = await withDB((db) =>
      db.epreuve.findUnique({
        where: { id },
        include: {
          filiereNiveau: { include: { filiere: true, niveau: true } },
          matiere: true,
        },
      })
    )
    if (!epreuve) return NextResponse.json({ error: "Épreuve introuvable" }, { status: 404 })
    return NextResponse.json(epreuve)
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH /api/epreuves/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const data = updateEpreuveSchema.parse(body)

    const epreuve = await withDB((db) =>
      db.epreuve.update({
      where: { id },
      data: {
        ...(data.titre != null && { titre: data.titre }),
        ...(data.type != null && { type: data.type }),
        ...(data.fichierEpreuve != null && { fichierEpreuve: data.fichierEpreuve }),
        ...(data.fichierCorrige !== undefined && { fichierCorrige: data.fichierCorrige }),
        ...(data.isGratuit !== undefined && { isGratuit: data.isGratuit }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
        ...(data.filiereNiveauId != null && { filiereNiveauId: data.filiereNiveauId }),
        ...(data.matiereId != null && { matiereId: data.matiereId }),
      },
      include: {
        filiereNiveau: { include: { filiere: true, niveau: true } },
        matiere: true,
      },
    })
    )
    return NextResponse.json(epreuve)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 })
    }
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE /api/epreuves/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    await withDB((db) => db.epreuve.delete({ where: { id } }))
    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
