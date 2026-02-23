import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PlusCircle, Pencil, Check, X } from "lucide-react"
import { togglePublishEpreuve } from "@/app/admin/epreuves/actions"
import { DeleteEpreuveButton } from "@/app/admin/epreuves/DeleteEpreuveButton"

export default async function AdminEpreuvesPage() {
  const epreuves = await prisma.epreuve.findMany({
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

  const typeLabels: Record<string, string> = {
    CONCOURS: "Concours",
    CC: "CC",
    SN: "SN",
    EPREUVE_SIMPLE: "Épreuve simple",
  }

  return (
    <div className="space-y-6">
      {/* En-tête + bouton Ajouter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Épreuves
          </h1>
          <p className="text-muted-foreground mt-1">
            Liste de toutes les épreuves.
          </p>
        </div>
        <Link
          href="/admin/epreuves/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors w-fit"
        >
          <PlusCircle className="h-5 w-5" />
          Ajouter une épreuve
        </Link>
      </div>

      {/* Tableau */}
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {epreuves.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Aucune épreuve pour le moment.</p>
            <Link
              href="/admin/epreuves/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Ajouter une épreuve
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-foreground">Titre</th>
                  <th className="text-left p-3 font-medium text-foreground">Filière</th>
                  <th className="text-left p-3 font-medium text-foreground">Niveau</th>
                  <th className="text-left p-3 font-medium text-foreground">Matière</th>
                  <th className="text-left p-3 font-medium text-foreground">Type</th>
                  <th className="text-left p-3 font-medium text-foreground">Accès</th>
                  <th className="text-left p-3 font-medium text-foreground">Corrigé</th>
                  <th className="text-right p-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {epreuves.map((ep) => (
                  <tr key={ep.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-3 text-foreground font-medium max-w-[200px] truncate" title={ep.titre}>
                      {ep.titre}
                    </td>
                    <td className="p-3">
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border"
                        style={{
                          backgroundColor: `${ep.filiereNiveau.filiere.couleur}20`,
                          borderColor: ep.filiereNiveau.filiere.couleur,
                          color: ep.filiereNiveau.filiere.couleur,
                        }}
                      >
                        {ep.filiereNiveau.filiere.code}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {ep.filiereNiveau.niveau.label}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {ep.matiere.nom}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {typeLabels[ep.type] ?? ep.type}
                    </td>
                    <td className="p-3">
                      <span
                        className={ep.isGratuit
                          ? "text-green-600 dark:text-green-400 font-medium"
                          : "text-muted-foreground"
                        }
                      >
                        {ep.isGratuit ? "Gratuit" : "Payant"}
                      </span>
                    </td>
                    <td className="p-3">
                      {ep.fichierCorrige ? (
                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400" title="Corrigé disponible">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground" title="Pas de corrigé">
                          <X className="h-4 w-4" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 justify-end">
                        <Link
                          href={`/admin/epreuves/${ep.id}/edit`}
                          className="text-blue-600 hover:text-blue-800"
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
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              ep.isPublished
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
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
