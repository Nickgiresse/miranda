"use server"

import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { revalidatePath } from "next/cache"
import { deleteFromStorage } from "@/lib/storage"

export async function deleteEpreuve(id: string) {
  await requireAdmin()

  const epreuve = await withDB((db) =>
    db.epreuve.findUnique({
      where: { id },
      select: {
        fichierEpreuve: true,
        fichierCorrige: true,
        titre: true,
      },
    })
  )

  if (!epreuve) throw new Error("Épreuve introuvable")

  await withDB((db) => db.epreuve.delete({ where: { id } }))

  await deleteFromStorage(epreuve.fichierEpreuve)
  await deleteFromStorage(epreuve.fichierCorrige)

  revalidatePath("/admin/epreuves")
}

export async function togglePublishEpreuve(id: string, currentStatus: boolean) {
  await requireAdmin()
  await withDB((db) =>
    db.epreuve.update({
      where: { id },
      data: { isPublished: !currentStatus },
    })
  )
  revalidatePath("/admin/epreuves")
}
