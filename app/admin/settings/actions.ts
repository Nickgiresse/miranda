"use server"

import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { revalidatePath } from "next/cache"

export async function saveSettings(data: {
  prixAbonnement: number
  contactEmail: string
  contactTel: string
  contactAdresse: string
}) {
  await requireAdmin()

  const existing = await withDB((db) => db.systemSettings.findFirst())

  if (existing) {
    await withDB((db) =>
      db.systemSettings.update({
        where: { id: existing.id },
        data: {
          prixAbonnement: data.prixAbonnement,
          contactEmail: data.contactEmail || null,
          contactTel: data.contactTel || null,
          contactAdresse: data.contactAdresse || null,
        },
      })
    )
  } else {
    await withDB((db) =>
      db.systemSettings.create({
        data: {
          prixAbonnement: data.prixAbonnement,
          contactEmail: data.contactEmail || null,
          contactTel: data.contactTel || null,
          contactAdresse: data.contactAdresse || null,
        },
      })
    )
  }

  revalidatePath("/admin/settings")
  revalidatePath("/")
  revalidatePath("/contact")
}
