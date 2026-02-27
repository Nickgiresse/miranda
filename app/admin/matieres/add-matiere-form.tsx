"use client"

import { useActionState } from "react"
import { PlusCircle, AlertCircle } from "lucide-react"
import { createMatiere } from "./actions"

type Filiere = { id: string; nom: string; code: string; couleur: string }

export function AddMatiereForm({ filieres }: { filieres: Filiere[] }) {
  const [state, formAction] = useActionState(createMatiere, null)

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Ajouter une matière
      </h2>
      {state?.error && (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px]">
          <label htmlFor="nom" className="block text-xs font-medium text-muted-foreground mb-1">
            Nom de la matière
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            placeholder="Ex. Algèbre"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="min-w-[180px]">
          <label htmlFor="filiereId" className="block text-xs font-medium text-muted-foreground mb-1">
            Filière
          </label>
          <select
            id="filiereId"
            name="filiereId"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Choisir une filière</option>
            {filieres.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom} ({f.code})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Ajouter
        </button>
      </form>
    </div>
  )
}
