import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadToStorage } from "@/lib/storage"

export async function POST(request: NextRequest) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role

  if (
    !session?.user ||
    (role !== "ADMIN" && role !== "SUPER_ADMIN")
  ) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File
  const type = (formData.get("type") as string) || "epreuve"

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Fichier PDF requis" },
      { status: 400 }
    )
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Fichier trop lourd (max 10 Mo)" },
      { status: 400 }
    )
  }

  try {
    const folder = type === "corrige" ? "corriges" : "epreuves"
    const url = await uploadToStorage(file, folder)
    return NextResponse.json({
      url,
      path: url,
      name: file.name,
      size: file.size,
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json(
      { error: err?.message ?? "Erreur upload" },
      { status: 500 }
    )
  }
}
