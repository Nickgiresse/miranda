"use server"

import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import { revalidatePath } from "next/cache"

export async function activerAbonnement(userId: string) {
  await requireAdmin()

  const dateFin = new Date()
  dateFin.setFullYear(dateFin.getFullYear() + 1)

  await withDB((db) =>
    db.user.update({
      where: { id: userId },
      data: {
        isSubscriptionActive: true,
        subscriptionEndDate: dateFin,
      },
    })
  )
  revalidatePath("/admin/utilisateurs")
}

export async function desactiverAbonnement(userId: string) {
  await requireAdmin()
  await withDB((db) =>
    db.user.update({
      where: { id: userId },
      data: {
        isSubscriptionActive: false,
        subscriptionEndDate: null,
      },
    })
  )
  revalidatePath("/admin/utilisateurs")
}

export async function deleteUser(userId: string) {
  await requireAdmin()
  await withDB((db) => db.user.delete({ where: { id: userId } }))
  revalidatePath("/admin/utilisateurs")
}
