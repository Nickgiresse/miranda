import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/helpers"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const MAX_SIZE = 10 * 1024 * 1024 // 10 Mo
const ALLOWED_TYPE = "application/pdf"

function sanitizeFileName(name: string): string {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "")
}

// POST /api/upload - PDF uniquement, max 10 Mo, admin seulement
// FormData: file (File), type ("epreuve" | "corrige")
export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const type = (formData.get("type") as string) || "epreuve"
    const folder = type === "corrige" ? "corriges" : "epreuves"

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }
    if (file.type !== ALLOWED_TYPE) {
      return NextResponse.json({ error: "Seuls les PDF sont acceptés" }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10 Mo)" },
        { status: 400 }
      )
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
    await mkdir(uploadDir, { recursive: true })

    const baseName = sanitizeFileName(file.name) || "document"
    const fileName = baseName.toLowerCase().endsWith(".pdf")
      ? `${Date.now()}-${baseName}`
      : `${Date.now()}-${baseName}.pdf`
    const filePath = path.join(uploadDir, fileName)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    const publicPath = `/uploads/${folder}/${fileName}`
    return NextResponse.json({
      url: publicPath,
      name: file.name,
      size: file.size,
    })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
