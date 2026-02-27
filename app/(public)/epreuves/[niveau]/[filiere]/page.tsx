import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { withDB } from "@/lib/db"
import { auth } from "@/lib/auth"
import { EpreuveCard } from "@/components/EpreuveCard"

const TYPES_ORDER: Array<"CONCOURS" | "CC" | "SN" | "EPREUVE_SIMPLE"> = [
  "CONCOURS",
  "CC",
  "SN",
  "EPREUVE_SIMPLE",
]

const TYPE_LABELS: Record<string, string> = {
  CONCOURS: "Concours",
  CC: "CC",
  SN: "SN",
  EPREUVE_SIMPLE: "Épreuve simple",
}

export default async function EpreuvesFilierePage(props: {
  params: Promise<{ niveau: string; filiere: string }>
}) {
  const params = await props.params
  const { niveau, filiere } = params

  const niveauNum = parseInt(niveau.replace("niveau-", ""), 10)
  if (Number.isNaN(niveauNum) || (niveauNum !== 1 && niveauNum !== 2)) {
    notFound()
  }

  const filiereCode = filiere.toUpperCase()

  const session = await auth()

  const { filiereNiveau, epreuves, isAbonne } = await withDB(async (db) => {
    const fn = await db.filiereNiveau.findFirst({
      where: {
        filiere: { code: filiereCode },
        niveau: { numero: niveauNum },
      },
      include: { filiere: true, niveau: true },
    })
    if (!fn) return { filiereNiveau: null, epreuves: [], isAbonne: false }

    const epreuvesList = await db.epreuve.findMany({
      where: { filiereNiveauId: fn.id, isPublished: true },
      include: { matiere: true },
      orderBy: { createdAt: "desc" },
    })

    let abonne = false
    if (session?.user?.id) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { isSubscriptionActive: true, subscriptionEndDate: true },
      })
      abonne =
        !!user?.isSubscriptionActive &&
        !!user?.subscriptionEndDate &&
        new Date() < new Date(user.subscriptionEndDate)
    }
    return { filiereNiveau: fn, epreuves: epreuvesList, isAbonne: abonne }
  })

  if (!filiereNiveau) {
    notFound()
  }

  const isConnected = !!session?.user?.id

  const byType = TYPES_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type] ?? type,
    epreuves: epreuves.filter((e) => e.type === type),
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href={`/epreuves/${niveau}`}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux filières
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Épreuves {filiereNiveau.filiere.nom} ({filiereNiveau.filiere.code}) — Niveau {niveauNum}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{epreuves.length} épreuve(s) disponible(s)</p>
        </div>

        {epreuves.length === 0 ? (
          <p className="text-slate-400 italic py-8">Aucune épreuve publiée pour cette filière et ce niveau.</p>
        ) : (
          <div className="space-y-12">
            {byType.map(
              ({ type, label, epreuves: list }) =>
                list.length > 0 && (
                  <section key={type}>
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">{label}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {list.map((ep) => (
                        <EpreuveCard
                          key={ep.id}
                          epreuve={{
                            id: ep.id,
                            titre: ep.titre,
                            type: ep.type,
                            isGratuit: ep.isGratuit,
                            fichierEpreuve: ep.fichierEpreuve,
                            fichierCorrige: ep.fichierCorrige,
                            matiere: ep.matiere ? { nom: ep.matiere.nom } : null,
                          }}
                          isConnected={isConnected}
                          isAbonne={isAbonne}
                          filiereCouleur={filiereNiveau.filiere.couleur}
                        />
                      ))}
                    </div>
                  </section>
                )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
