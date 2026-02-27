"use server"

import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { revalidatePath } from "next/cache"

export async function createMatiere(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await requireAdmin()
    const nom = String(formData.get("nom") ?? "").trim()
    const filiereId = String(formData.get("filiereId") ?? "")
    if (!nom || !filiereId) return { error: "Champs manquants" }

    const existing = await prisma.matiere.findFirst({
      where: {
        nom: { equals: nom, mode: "insensitive" },
        filiereId,
      },
    })
    if (existing) return { error: "Cette matière existe déjà pour cette filière" }

    await prisma.matiere.create({ data: { nom, filiereId } })
    revalidatePath("/admin/matieres")
    return {}
  } catch (e) {
    if (e instanceof Response) throw e
    return { error: e instanceof Error ? e.message : "Erreur lors de la création" }
  }
}

export async function updateMatiere(id: string, formData: FormData) {
  await requireAdmin()
  const nom = String(formData.get("nom") ?? "").trim()
  if (!nom) throw new Error("Nom requis")
  await withDB((db) => db.matiere.update({ where: { id }, data: { nom } }))
  revalidatePath("/admin/matieres")
}

export async function deleteMatiere(id: string) {
  await requireAdmin()
  await withDB((db) => db.matiere.delete({ where: { id } }))
  revalidatePath("/admin/matieres")
}
