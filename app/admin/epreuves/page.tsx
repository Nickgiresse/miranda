import Link from "next/link"
import { withDB } from "@/lib/db"
import { PlusCircle, Pencil, Check, X } from "lucide-react"
import { togglePublishEpreuve } from "@/app/admin/epreuves/actions"
import { DeleteEpreuveButton } from "@/app/admin/epreuves/DeleteEpreuveButton"

export default async function AdminEpreuvesPage() {
  const epreuves = await withDB((db) =>
    db.epreuve.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        filiereNiveau: {
          include: {
            filiere: { select: { code: true, couleur: true } },
            niveau: { select: { numero: true, label: true } },
          },
        },
        matiere: { select: { nom: true } },
      },
    })
  )

  const typeLabels: Record<string, string> = {
    CONCOURS: "Concours",
    CC: "CC",
    SN: "SN",
    EPREUVE_SIMPLE: "Épreuve simple",
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* En-tête + bouton Ajouter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Épreuves</h1>
          <p className="text-slate-400 text-sm mt-1">
            Liste de toutes les épreuves.
          </p>
        </div>
        <Link
          href="/admin/epreuves/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all duration-200 w-fit"
        >
          <PlusCircle className="h-5 w-5" />
          Ajouter une épreuve
        </Link>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {epreuves.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 mb-4">Aucune épreuve pour le moment.</p>
            <Link
              href="/admin/epreuves/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all duration-200"
            >
              <PlusCircle className="h-5 w-5" />
              Ajouter une épreuve
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Filière
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Matière
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Accès
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Corrigé
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {epreuves.map((ep) => (
                  <tr
                    key={ep.id}
                    className="hover:bg-slate-50 transition-colors duration-150"
                  >
                    <td
                      className="px-5 py-4 text-slate-900 font-medium max-w-[200px] truncate"
                      title={ep.titre}
                    >
                      {ep.titre}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${ep.filiereNiveau.filiere.couleur}18`,
                          color: ep.filiereNiveau.filiere.couleur,
                        }}
                      >
                        {ep.filiereNiveau.filiere.code}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {ep.filiereNiveau.niveau.label}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{ep.matiere.nom}</td>
                    <td className="px-5 py-4 text-slate-500">
                      {typeLabels[ep.type] ?? ep.type}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          ep.isGratuit
                            ? "text-slate-700 font-medium"
                            : "text-slate-500"
                        }
                      >
                        {ep.isGratuit ? "Gratuit" : "Payant"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {ep.fichierCorrige ? (
                        <span className="inline-flex items-center gap-1 text-slate-600" title="Corrigé disponible">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400" title="Pas de corrigé">
                          <X className="h-4 w-4" />
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 justify-end">
                        <Link
                          href={`/admin/epreuves/${ep.id}/edit`}
                          className="text-slate-400 hover:text-blue-600 transition-colors duration-200"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>

                        <form
                          action={togglePublishEpreuve.bind(null, ep.id, ep.isPublished)}
                        >
                          <button
                            type="submit"
                            title={ep.isPublished ? "Dépublier" : "Publier"}
                            className="text-xs px-2.5 py-1 rounded-lg font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200"
                          >
                            {ep.isPublished ? "Publié" : "Brouillon"}
                          </button>
                        </form>

                        <DeleteEpreuveButton id={ep.id} titre={ep.titre} />
                      </div>
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
