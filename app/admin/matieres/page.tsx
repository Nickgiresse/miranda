import { withDB } from "@/lib/db"
import { BookMarked } from "lucide-react"
import { AddMatiereForm } from "./add-matiere-form"
import { EditMatiereInline } from "./edit-matiere-inline"
import { DeleteMatiereButton } from "./delete-matiere-button"

export default async function AdminMatieresPage() {
  const [matieres, filieres] = await withDB((db) =>
    Promise.all([
      db.matiere.findMany({
        include: {
          filiere: { select: { nom: true, code: true, couleur: true } },
          _count: { select: { epreuves: true } },
        },
        orderBy: [{ filiereId: "asc" }, { nom: "asc" }],
      }),
      db.filiere.findMany({
        where: { isActive: true },
        orderBy: { code: "asc" },
        select: { id: true, nom: true, code: true, couleur: true },
      }),
    ])
  )

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookMarked className="h-7 w-7 text-slate-600" />
          Matières
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Gérer les matières par filière.
        </p>
      </div>

      <AddMatiereForm filieres={filieres} />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {matieres.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Aucune matière. Ajoutez-en une ci-dessus.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Filière
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Nb épreuves
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {matieres.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td className="px-5 py-4">
                      <EditMatiereInline id={m.id} initialNom={m.nom} />
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium text-white"
                        style={{
                          backgroundColor: m.filiere.couleur || "#64748b",
                        }}
                      >
                        {m.filiere.nom} ({m.filiere.code})
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {m._count.epreuves}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DeleteMatiereButton
                        matiereId={m.id}
                        matiereNom={m.nom}
                        epreuvesCount={m._count.epreuves}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
