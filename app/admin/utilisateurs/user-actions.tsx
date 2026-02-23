"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  activerAbonnement,
  desactiverAbonnement,
  deleteUser,
} from "@/app/admin/utilisateurs/actions"
import { toast } from "@/components/ui/Toast"
import { ConfirmModal } from "@/components/ui/ConfirmModal"

export function UserActions({
  userId,
  isActive,
  fullName,
}: {
  userId: string
  isActive: boolean
  fullName: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={async () => {
          setLoading(true)
          try {
            if (isActive) {
              await desactiverAbonnement(userId)
            } else {
              await activerAbonnement(userId)
            }
            router.refresh()
          } catch (err) {
            console.error(err)
            toast.error("Erreur lors de la mise à jour.")
          } finally {
            setLoading(false)
          }
        }}
        disabled={loading}
        className={`text-xs px-3 py-1.5 rounded-full font-medium transition disabled:opacity-50 ${
          isActive
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }`}
      >
        {loading ? "..." : isActive ? "Désactiver" : "Activer"}
      </button>

      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition"
      >
        Supprimer
      </button>

      <ConfirmModal
        isOpen={confirming}
        title="Supprimer l'utilisateur"
        message={`Voulez-vous vraiment supprimer "${fullName}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        onConfirm={async () => {
          setLoading(true)
          try {
            await deleteUser(userId)
            toast.success("Utilisateur supprimé")
            router.refresh()
          } catch (err) {
            console.error(err)
            toast.error("Erreur lors de la suppression.")
          } finally {
            setLoading(false)
            setConfirming(false)
          }
        }}
        onCancel={() => setConfirming(false)}
        loading={loading}
        danger
      />
    </div>
  )
}
