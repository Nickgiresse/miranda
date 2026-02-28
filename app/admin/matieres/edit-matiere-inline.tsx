"use client"

import { useState, useTransition, useEffect } from "react"
import { Pencil, Check, Loader2, X } from "lucide-react"
import { updateMatiere } from "./actions"

export function EditMatiereInline({
  id,
  initialNom,
}: {
  id: string
  initialNom: string
}) {
  const [editing, setEditing] = useState(false)
  const [nom, setNom] = useState(initialNom)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setNom(initialNom)
  }, [initialNom])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData()
    formData.set("nom", nom.trim())
    if (!nom.trim()) return
    startTransition(() => {
      updateMatiere(id, formData).then(() => setEditing(false))
    })
  }

  if (editing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          disabled={isPending}
          className="rounded-md border border-input bg-background px-2 py-1 text-sm w-40"
          autoFocus
        />
        <button
          type="submit"
          disabled={isPending || !nom.trim()}
          className="p-1.5 rounded-md text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 disabled:opacity-50"
          aria-label="Enregistrer"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => { setEditing(false); setNom(initialNom) }}
          disabled={isPending}
          className="p-1.5 rounded-md text-slate-600 hover:bg-muted disabled:opacity-50"
          aria-label="Annuler"
        >
          <X className="h-4 w-4" />
        </button>
      </form>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-foreground font-medium">{initialNom}</span>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-muted hover:text-slate-900"
        aria-label="Modifier"
      >
        <Pencil className="h-4 w-4" />
        Modifier
      </button>
    </div>
  )
}
