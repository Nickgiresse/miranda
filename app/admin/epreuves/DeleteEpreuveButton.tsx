"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteEpreuve } from "@/app/admin/epreuves/actions"
import { ConfirmModal } from "@/components/ui/ConfirmModal"
import { toast } from "@/components/ui/Toast"
import { Trash2 } from "lucide-react"

export function DeleteEpreuveButton({
  id,
  titre,
}: {
  id: string
  titre: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await deleteEpreuve(id)
      toast.success(`"${titre}" supprimée avec succès`)
      router.refresh()
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
        title={`Supprimer "${titre}"`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmModal
        isOpen={open}
        title="Supprimer l'épreuve"
        message={`Voulez-vous vraiment supprimer "${titre}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        loading={loading}
        danger
      />
    </>
  )
}
