import { prisma } from "@/lib/prisma"
import { BookMarked } from "lucide-react"
import { AddMatiereForm } from "./add-matiere-form"
import { EditMatiereInline } from "./edit-matiere-inline"
import { DeleteMatiereButton } from "./delete-matiere-button"

export default async function AdminMatieresPage() {
  const [matieres, filieres] = await Promise.all([
    prisma.matiere.findMany({
      include: {
        filiere: { select: { nom: true, code: true, couleur: true } },
        _count: { select: { epreuves: true } },
      },
      orderBy: [{ filiereId: "asc" }, { nom: "asc" }],
    }),
    prisma.filiere.findMany({
      where: { isActive: true },
      orderBy: { code: "asc" },
      select: { id: true, nom: true, code: true, couleur: true },
    }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <BookMarked className="h-8 w-8" />
          Matières
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérer les matières par filière.
        </p>
      </div>

      <AddMatiereForm filieres={filieres} />

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {matieres.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Aucune matière. Ajoutez-en une ci-dessus.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-foreground">Nom</th>
                  <th className="text-left p-3 font-medium text-foreground">Filière</th>
                  <th className="text-left p-3 font-medium text-foreground">Nb épreuves</th>
                  <th className="text-right p-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matieres.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <EditMatiereInline id={m.id} initialNom={m.nom} />
                    </td>
                    <td className="p-3">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white shadow-sm"
                        style={{
                          backgroundColor: m.filiere.couleur || "#6b7280",
                        }}
                      >
                        {m.filiere.nom} ({m.filiere.code})
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {m._count.epreuves}
                    </td>
                    <td className="p-3 text-right">
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
