"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/helpers"
import { revalidatePath } from "next/cache"
import { unlink } from "node:fs/promises"
import path from "node:path"

export async function deleteEpreuve(id: string) {
  await requireAdmin()

  const epreuve = await prisma.epreuve.findUnique({
    where: { id },
    select: {
      fichierEpreuve: true,
      fichierCorrige: true,
      titre: true,
    },
  })

  if (!epreuve) throw new Error("Épreuve introuvable")

  await prisma.epreuve.delete({ where: { id } })

  const deleteFile = async (filePath: string | null) => {
    if (!filePath) return
    try {
      const relative = filePath.startsWith("/") ? filePath.slice(1) : filePath
      const fullPath = path.join(process.cwd(), "public", relative)
      await unlink(fullPath)
    } catch {
      console.warn("Fichier non trouvé:", filePath)
    }
  }

  await deleteFile(epreuve.fichierEpreuve)
  await deleteFile(epreuve.fichierCorrige)

  revalidatePath("/admin/epreuves")
}

export async function togglePublishEpreuve(id: string, currentStatus: boolean) {
  await requireAdmin()
  await prisma.epreuve.update({
    where: { id },
    data: { isPublished: !currentStatus },
  })
  revalidatePath("/admin/epreuves")
}
