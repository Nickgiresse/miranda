"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Download, FileCheck } from "lucide-react"
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
  filiereCouleur?: string
}

const TYPE_LABELS: Record<string, string> = {
  CONCOURS: "Concours",
  CC: "CC",
  SN: "SN",
  EPREUVE_SIMPLE: "Épreuve simple",
}

export function EpreuveCard({
  epreuve,
  isConnected,
  isAbonne,
  filiereCouleur = "#64748b",
}: EpreuveCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<"voir" | "download" | "corrige" | null>(null)

  async function handleAccess(actionType: "voir" | "telecharger" | "corriger") {
    const fileType = actionType === "corriger" ? "corrige" : "epreuve"

    if (actionType === "corriger" && !epreuve.fichierCorrige) {
      toast.info("Aucun corrigé disponible pour cette épreuve.")
      return
    }

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

    if (!isConnected) {
      toast.error("Connectez-vous pour accéder à cette épreuve.")
      router.push("/login")
      return
    }

    setLoading(
      actionType === "corriger" ? "corrige" : actionType === "telecharger" ? "download" : "voir"
    )
    try {
      const res = await fetch(`/api/epreuves/${epreuve.id}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: fileType }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? "Erreur d'accès")
        if (res.status === 403 && data.whatsapp) {
          window.open(data.whatsapp, "_blank")
        } else if (data.redirect) {
          router.push(data.redirect)
        }
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
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      {/* Bande filière */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: filiereCouleur }}
      />

      <div className="p-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium">
            {TYPE_LABELS[epreuve.type] ?? epreuve.type}
          </span>
          {epreuve.isGratuit ? (
            <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-medium">
              Gratuit
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg font-medium">
              Abonnement
            </span>
          )}
        </div>

        {/* Titre */}
        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {epreuve.titre}
        </h3>

        {/* Matière */}
        <p className="text-xs text-slate-400 mb-5">
          {epreuve.matiere?.nom ?? "—"}
        </p>

        {/* Boutons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleAccess("voir")}
            disabled={!!loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-all duration-200 disabled:opacity-50"
          >
            {loading === "voir" ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Voir
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleAccess("telecharger")}
            disabled={!!loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all duration-200 disabled:opacity-50"
          >
            {loading === "download" ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => handleAccess("corriger")}
            disabled={!!loading || !hasCorrige}
            title={!hasCorrige ? "Corrigé non disponible" : "Voir le corrigé"}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl text-xs font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-100 disabled:hover:text-slate-700"
          >
            {loading === "corrige" ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
            ) : (
              <FileCheck className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
