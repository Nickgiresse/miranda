import { NextResponse } from "next/server"
import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import bcrypt from "bcryptjs"
import { z } from "zod"

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional().nullable(),
  password: z.string().min(6).optional(),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).optional(),
})

// PATCH /api/admin/users/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const data = updateUserSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    if (data.email != null) updateData.email = data.email.trim().toLowerCase()
    if (data.name !== undefined) updateData.fullName = data.name
    if (data.role != null) updateData.role = data.role
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10)

    const user = await withDB((db) =>
      db.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, fullName: true, role: true, createdAt: true },
    })
    )
    return NextResponse.json(user)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 })
    }
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const { id } = await params
    await withDB((db) => db.user.delete({ where: { id } }))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
