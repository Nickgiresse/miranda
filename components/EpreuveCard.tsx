"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Download, FileCheck, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/Toast"

type EpreuveCardProps = {
  epreuve: {
    id: string
    titre: string
    type: string
    isGratuit: boolean
    fichierEpreuve: string | null
    fichierCorrige: string | null
    matiere: { nom: string } | null
  }
  isConnected: boolean
  isAbonne: boolean
}

const TYPE_LABELS: Record<string, string> = {
  CONCOURS: "Concours",
  CC: "CC",
  SN: "SN",
  EPREUVE_SIMPLE: "Épreuve simple",
}

export function EpreuveCard({ epreuve, isConnected, isAbonne }: EpreuveCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<"voir" | "download" | "corrige" | null>(null)

  async function handleAccess(actionType: "voir" | "telecharger" | "corriger") {
    const fileType = actionType === "corriger" ? "corrige" : "epreuve"

    if (actionType === "corriger" && !epreuve.fichierCorrige) {
      toast.info("Aucun corrigé disponible pour cette épreuve.")
      return
    }

    // Épreuve gratuite → accès direct sans API (URL servie depuis public/)
    if (epreuve.isGratuit) {
      const url =
        actionType === "corriger" ? epreuve.fichierCorrige : epreuve.fichierEpreuve
      if (!url) {
        toast.error("Fichier indisponible. Contactez l'administrateur.")
        return
      }
      if (actionType === "telecharger") {
        const link = document.createElement("a")
        link.href = url
        link.download = `${epreuve.titre.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        window.open(url, "_blank")
      }
      return
    }

    // Épreuve payante → passage par l'API
    if (!isConnected) {
      toast.error("Connectez-vous pour accéder à cette épreuve.")
      router.push("/login")
      return
    }

    setLoading(actionType === "corriger" ? "corrige" : actionType === "telecharger" ? "download" : "voir")
    try {
      const res = await fetch(`/api/epreuves/${epreuve.id}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: fileType }),
      })
      const data = await res.json()
      console.log("Réponse API download:", data)

      if (!res.ok) {
        toast.error(data.error ?? "Erreur d'accès")
        if (data.redirect) router.push(data.redirect)
        return
      }

      if (!data.url) {
        toast.error("Fichier indisponible. Contactez l'administrateur.")
        return
      }

      if (actionType === "telecharger") {
        const link = document.createElement("a")
        link.href = data.url
        link.download = `${epreuve.titre.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        window.open(data.url, "_blank")
      }
    } catch (err) {
      console.error(err)
      toast.error("Une erreur est survenue.")
    } finally {
      setLoading(null)
    }
  }

  const hasCorrige = !!epreuve.fichierCorrige

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-border bg-muted/40 flex justify-between items-start gap-2">
        <div className="space-y-1 min-w-0">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
            {TYPE_LABELS[epreuve.type] ?? epreuve.type}
          </span>
          <h3 className="font-bold text-lg leading-tight line-clamp-2">{epreuve.titre}</h3>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {epreuve.isGratuit ? (
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
              Gratuit
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              <Lock className="h-3 w-3" /> Abonnement requis
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{epreuve.matiere?.nom ?? "—"}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            type="button"
            onClick={() => handleAccess("voir")}
            disabled={!!loading}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-xs font-medium disabled:opacity-50"
          >
            {loading === "voir" ? (
              <span className="h-5 w-5 animate-pulse" />
            ) : (
              <Eye className="h-5 w-5 mb-1" />
            )}
            Voir
          </button>

          <button
            type="button"
            onClick={() => handleAccess("telecharger")}
            disabled={!!loading}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-xs font-medium text-primary disabled:opacity-50"
          >
            {loading === "download" ? (
              <span className="h-5 w-5 animate-pulse" />
            ) : (
              <Download className="h-5 w-5 mb-1" />
            )}
            Télécharger
          </button>

          <button
            type="button"
            onClick={() => handleAccess("corriger")}
            disabled={!!loading || !hasCorrige}
            title={!hasCorrige ? "Corrigé non disponible" : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors text-xs font-medium disabled:opacity-50",
              hasCorrige
                ? "hover:bg-accent hover:text-accent-foreground text-green-600 dark:text-green-400"
                : "cursor-not-allowed text-muted-foreground"
            )}
          >
            {loading === "corrige" ? (
              <span className="h-5 w-5 animate-pulse" />
            ) : (
              <FileCheck className="h-5 w-5 mb-1" />
            )}
            Corriger
          </button>
        </div>
      </div>
    </div>
  )
}
