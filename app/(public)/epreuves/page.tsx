import Link from "next/link"
import { BookOpen, ChevronRight } from "lucide-react"
import { withDB } from "@/lib/db"

export default async function EpreuvesPage() {
  const [countNiveau1, countNiveau2] = await withDB((db) =>
    Promise.all([
      db.filiereNiveau.count({ where: { niveau: { numero: 1 } } }),
      db.filiereNiveau.count({ where: { niveau: { numero: 2 } } }),
    ])
  )

  const niveaux = [
    { id: "niveau-1", numero: 1, count: countNiveau1 },
    { id: "niveau-2", numero: 2, count: countNiveau2 },
  ] as const

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {niveaux.map(({ id, numero, count }) => (
          <Link
            key={id}
            href={`/epreuves/${id}`}
            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer"
          >
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-900 transition-all duration-300">
              <BookOpen className="w-7 h-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Niveau {numero}
            </h2>
            <p className="text-sm text-slate-400">
              {count} filière{count !== 1 ? "s" : ""} disponible{count !== 1 ? "s" : ""}
            </p>
            <div className="mt-4 flex items-center justify-center gap-1 text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors duration-200">
              Explorer
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
