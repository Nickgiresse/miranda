import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { withDB } from "@/lib/db"

export default async function EpreuvesNiveauPage(props: {
  params: Promise<{ niveau: string }>
}) {
  const params = await props.params

  if (!["niveau-1", "niveau-2"].includes(params.niveau)) {
    notFound()
  }

  const niveauNum = parseInt(params.niveau.split("-")[1]!, 10)

  const filiereNiveaux = await withDB((db) =>
    db.filiereNiveau.findMany({
      where: { niveau: { numero: niveauNum } },
      include: {
        filiere: { select: { code: true, nom: true, couleur: true } },
        _count: { select: { epreuves: true } },
      },
      orderBy: { filiere: { code: "asc" } },
    })
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Épreuves — Niveau {niveauNum}
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl mx-auto">
            Accédez aux épreuves et corrigés selon votre filière.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filiereNiveaux.map((fn) => (
            <Link
              key={fn.id}
              href={`/epreuves/${params.niveau}/${fn.filiere.code.toLowerCase()}`}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-3 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: fn.filiere.couleur }}
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{fn.filiere.code}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {fn.filiere.nom}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {fn._count.epreuves} épreuve(s)
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </Link>
          ))}
        </div>

        {filiereNiveaux.length === 0 && (
          <p className="text-center text-slate-400 py-12">
            Aucune filière configurée pour ce niveau.
          </p>
        )}
      </div>
    </div>
  )
}
