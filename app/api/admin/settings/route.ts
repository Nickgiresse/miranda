import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/helpers"
import { z } from "zod"

const updateSettingsSchema = z.object({
  prixAbonnement: z.number().positive().optional(),
  contactEmail: z.string().email().optional().nullable(),
  contactTel: z.string().optional().nullable(),
  contactAdresse: z.string().optional().nullable(),
})

// GET /api/admin/settings
export async function GET() {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    let settings = await prisma.systemSettings.findFirst()
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: { id: 1, prixAbonnement: 1000 },
      })
    }
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH /api/admin/settings
export async function PATCH(req: Request) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = updateSettingsSchema.parse(body)

    let settings = await prisma.systemSettings.findFirst()
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: { id: 1, prixAbonnement: 1000 },
      })
    }

    settings = await prisma.systemSettings.update({
      where: { id: 1 },
      data: {
        ...(data.prixAbonnement != null && { prixAbonnement: data.prixAbonnement }),
        ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
        ...(data.contactTel !== undefined && { contactTel: data.contactTel }),
        ...(data.contactAdresse !== undefined && { contactAdresse: data.contactAdresse }),
      },
    })
    return NextResponse.json(settings)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 })
    }
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
