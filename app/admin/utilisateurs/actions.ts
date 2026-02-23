"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/helpers"
import { revalidatePath } from "next/cache"

export async function activerAbonnement(userId: string) {
  await requireAdmin()

  const dateFin = new Date()
  dateFin.setFullYear(dateFin.getFullYear() + 1)

  await prisma.user.update({
    where: { id: userId },
    data: {
      isSubscriptionActive: true,
      subscriptionEndDate: dateFin,
    },
  })
  revalidatePath("/admin/utilisateurs")
}

export async function desactiverAbonnement(userId: string) {
  await requireAdmin()
  await prisma.user.update({
    where: { id: userId },
    data: {
      isSubscriptionActive: false,
      subscriptionEndDate: null,
    },
  })
  revalidatePath("/admin/utilisateurs")
}

export async function deleteUser(userId: string) {
  await requireAdmin()
  await prisma.user.delete({ where: { id: userId } })
  revalidatePath("/admin/utilisateurs")
}
