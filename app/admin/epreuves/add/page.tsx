"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

type Filiere = {
  id: string
  code: string
  nom: string
  filiereNiveaux: Array<{
    id: string
    filiereId: string
    niveauId: number
    niveau: { id: number; numero: number; label: string }
  }>
}

type Matiere = { id: string; nom: string; filiereId: string }

const NIVEAUX = [
  { value: 1, label: "Niveau 1" },
  { value: 2, label: "Niveau 2" },
] as const

const TYPES_EPREUVE = [
  { value: "EPREUVE_SIMPLE", label: "Épreuve simple" },
  { value: "CONCOURS", label: "Concours" },
  { value: "CC", label: "CC" },
  { value: "SN", label: "SN" },
] as const

export default function AdminEpreuvesAddPage() {
  const router = useRouter()
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [matieres, setMatieres] = useState<Matiere[]>([])
  const [loadingFilieres, setLoadingFilieres] = useState(true)
  const [loadingMatieres, setLoadingMatieres] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [titre, setTitre] = useState("")
  const [niveau, setNiveau] = useState<1 | 2>(1)
  const [filiereCode, setFiliereCode] = useState("")
  const [matiereId, setMatiereId] = useState("")
  const [type, setType] = useState<(typeof TYPES_EPREUVE)[number]["value"]>("EPREUVE_SIMPLE")
  const [annee, setAnnee] = useState<number>(new Date().getFullYear())
  const [fileEpreuve, setFileEpreuve] = useState<File | null>(null)
  const [fileCorrige, setFileCorrige] = useState<File | null>(null)
  const [isGratuit, setIsGratuit] = useState(false)

  // Charger les filières au montage
  useEffect(() => {
    let cancelled = false
    async function fetchFilieres() {
      setLoadingFilieres(true)
      try {
        const res = await fetch("/api/filieres")
        if (!res.ok) throw new Error("Impossible de charger les filières")
        const data = await res.json()
        console.log("Filières reçues:", data)
        if (!cancelled) {
          setFilieres(Array.isArray(data) ? data : [])
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur filières")
      } finally {
        if (!cancelled) setLoadingFilieres(false)
      }
    }
    fetchFilieres()
    return () => {
      cancelled = true
    }
  }, [])

  // Charger les matières quand la filière change (par code)
  useEffect(() => {
    if (!filiereCode) {
      setMatieres([])
      setMatiereId("")
      return
    }
    setLoadingMatieres(true)
    setMatiereId("")
    fetch(`/api/matieres?filiere=${encodeURIComponent(filiereCode)}`)
      .then((r) => r.json())
      .then((data) => setMatieres(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoadingMatieres(false))
  }, [filiereCode])

  // Déduire filiereId et filiereNiveauId à partir du code filière et du niveau
  const selectedFiliere = filiereCode ? filieres.find((f) => f.code === filiereCode) : null
  const filiereId = selectedFiliere?.id ?? ""
  const filiereNiveauId =
    selectedFiliere?.filiereNiveaux?.find((fn) => fn.niveau?.numero === niveau)?.id ?? ""

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    if (!fileEpreuve) {
      setFieldErrors((prev) => ({ ...prev, fileEpreuve: "Le fichier épreuve PDF est obligatoire." }))
      return
    }
    if (!filiereNiveauId) {
      setFieldErrors((prev) => ({ ...prev, filiere: "Veuillez sélectionner une filière et un niveau valides." }))
      return
    }
    if (!matiereId) {
      setFieldErrors((prev) => ({ ...prev, matiere: "Veuillez sélectionner une matière." }))
      return
    }
    if (!titre.trim()) {
      setFieldErrors((prev) => ({ ...prev, titre: "Le titre est obligatoire." }))
      return
    }

    setSubmitLoading(true)
    try {
      // 1. Upload PDF épreuve
      const formEpreuve = new FormData()
      formEpreuve.set("file", fileEpreuve)
      formEpreuve.set("type", "epreuve")
      const uploadEpreuve = await fetch("/api/upload", {
        method: "POST",
        body: formEpreuve,
      })
      const bodyEpreuve = await uploadEpreuve.json()
      if (!uploadEpreuve.ok) {
        throw new Error(bodyEpreuve?.error ?? "Échec de l'upload de l'épreuve")
      }
      const urlEpreuve = bodyEpreuve?.url
      if (!urlEpreuve) throw new Error("Réponse upload invalide (épreuve)")

      let urlCorrige: string | null = null
      if (fileCorrige) {
        const formCorrige = new FormData()
        formCorrige.set("file", fileCorrige)
        formCorrige.set("type", "corrige")
        const uploadCorrige = await fetch("/api/upload", {
          method: "POST",
          body: formCorrige,
        })
        const bodyCorrige = await uploadCorrige.json()
        if (!uploadCorrige.ok) {
          throw new Error(bodyCorrige?.error ?? "Échec de l'upload du corrigé")
        }
        urlCorrige = bodyCorrige?.url ?? null
      }

      const payload = {
        titre: titre.trim(),
        type,
        fichierEpreuve: urlEpreuve,
        fichierCorrige: urlCorrige,
        isGratuit: isGratuit,
        isPublished: true,
        filiereNiveauId,
        matiereId,
      }

      const createRes = await fetch("/api/epreuves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const createData = await createRes.json()
      if (!createRes.ok) {
        const errMsg = createData?.error?.formErrors?.[0] ?? createData?.error ?? "Erreur lors de la création"
        throw new Error(typeof errMsg === "string" ? errMsg : "Erreur création épreuve")
      }

      setSuccess(true)
      setTimeout(() => router.push("/admin/epreuves"), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/epreuves"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux épreuves
        </Link>
      </div>

      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <FileText className="h-6 w-6" />
        Ajouter une épreuve
      </h1>

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800 p-4 text-green-800 dark:text-green-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Épreuve créée. Redirection…</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 p-4 text-red-800 dark:text-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Titre *</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Ex. Mathématiques – Algèbre"
          />
          {fieldErrors.titre && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.titre}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Niveau *</label>
            <select
              value={niveau}
              onChange={(e) => setNiveau(Number(e.target.value) as 1 | 2)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {NIVEAUX.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Filière *</label>
            <select
              value={filiereCode}
              onChange={(e) => setFiliereCode(e.target.value)}
              disabled={loadingFilieres}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
            >
              <option value="">Choisir une filière</option>
              {filieres.map((f) => (
                <option key={f.id} value={f.code}>
                  {f.code} — {f.nom}
                </option>
              ))}
            </select>
            {!loadingFilieres && filieres.length === 0 && (
              <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                Aucune filière. Exécutez le script : npx tsx scripts/seed-filieres.ts
              </p>
            )}
            {fieldErrors.filiere && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.filiere}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Matière *</label>
          <select
            value={matiereId}
            onChange={(e) => setMatiereId(e.target.value)}
            disabled={!filiereCode || loadingMatieres}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="">Choisir une matière</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nom}
              </option>
            ))}
          </select>
          {fieldErrors.matiere && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.matiere}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as (typeof TYPES_EPREUVE)[number]["value"])}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {TYPES_EPREUVE.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Année</label>
            <input
              type="number"
              value={annee}
              onChange={(e) => setAnnee(Number(e.target.value) || new Date().getFullYear())}
              min={2000}
              max={2100}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fichier épreuve PDF *</label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFileEpreuve(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded file:border file:px-3 file:py-1.5 file:text-sm file:font-medium"
            />
            <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
          {fieldErrors.fileEpreuve && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.fileEpreuve}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fichier corrigé PDF (optionnel)</label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFileCorrige(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded file:border file:px-3 file:py-1.5 file:text-sm file:font-medium"
            />
            <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isGratuit"
            checked={isGratuit}
            onChange={(e) => setIsGratuit(e.target.checked)}
            className="rounded border-input"
          />
          <label htmlFor="isGratuit" className="text-sm font-medium">
            Épreuve gratuite
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitLoading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enregistrement…
              </>
            ) : (
              "Enregistrer l'épreuve"
            )}
          </button>
          <Link
            href="/admin/epreuves"
            className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
