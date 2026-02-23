"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { deleteMatiere } from "./actions"
import { ConfirmModal } from "@/components/ui/ConfirmModal"
import { toast } from "@/components/ui/Toast"

export function DeleteMatiereButton({
  matiereId,
  matiereNom,
  epreuvesCount,
}: {
  matiereId: string
  matiereNom: string
  epreuvesCount: number
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const disabled = epreuvesCount > 0

  async function handleConfirm() {
    if (disabled) return
    setLoading(true)
    try {
      await deleteMatiere(matiereId)
      toast.success(`"${matiereNom}" supprimée`)
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
        onClick={() => !disabled && setOpen(true)}
        disabled={loading || disabled}
        title={disabled ? "Impossible : épreuves associées" : undefined}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={disabled ? "Impossible : épreuves associées" : "Supprimer"}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        Supprimer
      </button>

      <ConfirmModal
        isOpen={open}
        title="Supprimer la matière"
        message={`Voulez-vous vraiment supprimer « ${matiereNom} » ?`}
        confirmLabel="Supprimer"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        loading={loading}
        danger
      />
    </>
  )
}
