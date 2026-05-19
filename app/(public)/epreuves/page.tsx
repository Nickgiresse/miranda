import Link from "next/link"
import { withDB } from "@/lib/db"

export default async function EpreuvesPage() {
  // Groupe les filières par leurs niveaux disponibles
  const filieres = await withDB((db) =>
    db.filiere.findMany({
      where: { isActive: true },
      include: {
        filiereNiveaux: {
          include: {
            niveau: true,
            _count: {
              select: { epreuves: true }
            }
          },
          orderBy: {
            niveau: { numero: "asc" }
          }
        }
      },
      orderBy: { code: "asc" }
    })
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Choisissez votre niveau
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xl mx-auto">
          Sélectionnez votre niveau pour accéder aux épreuves et corrigés selon votre filière.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filieres.map(f => (
          <div key={f.id} 
            className="bg-white rounded-2xl shadow-sm p-5
              hover:shadow-lg hover:-translate-y-1
              transition-all duration-200">
            
            {/* Header filière */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-10 rounded-full"
                style={{ backgroundColor: f.couleur }} />
              <div>
                <p className="font-bold text-slate-900">
                  {f.code}
                </p>
                <p className="text-xs text-slate-400">
                  {f.nom}
                </p>
              </div>
            </div>

            {/* Niveaux disponibles */}
            <div className="flex flex-wrap gap-2">
              {f.filiereNiveaux.map(fn => (
                <Link
                  key={fn.id}
                  href={`/epreuves/${fn.niveau.numero}/${f.code}`}
                  className="px-3 py-1.5 rounded-lg text-xs 
                    font-medium text-white
                    hover:opacity-80 transition"
                  style={{ backgroundColor: f.couleur }}
                >
                  {fn.niveau.label ?? 
                    `Niveau ${fn.niveau.numero}`}
                  {fn._count.epreuves > 0 && (
                    <span className="ml-1 opacity-75">
                      ({fn._count.epreuves})
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
