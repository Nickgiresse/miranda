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
        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200 disabled:opacity-50"
      >
        {loading ? "..." : isActive ? "Désactiver" : "Activer"}
      </button>

      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
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
