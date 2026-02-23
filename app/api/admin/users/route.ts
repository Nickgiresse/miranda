import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/helpers"
import bcrypt from "bcryptjs"
import { z } from "zod"

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).default("USER"),
})

// GET /api/admin/users
export async function GET() {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        _count: { select: { abonnements: true, downloads: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/admin/users
export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = createUserSchema.parse(body)
    const email = data.email.trim().toLowerCase()
    const passwordHash = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        fullName: data.name ?? null,
        password: passwordHash,
        role: data.role,
      },
      select: { id: true, email: true, fullName: true, role: true, createdAt: true },
    })
    return NextResponse.json(user)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 })
    }
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
