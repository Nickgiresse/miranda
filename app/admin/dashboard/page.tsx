import Link from "next/link"
import { prisma } from "@/lib/prisma"
import {
  BookOpen,
  Users,
  FileQuestion,
  PlusCircle,
  List,
  Settings,
  Pencil,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default async function AdminDashboardPage() {
  const [
    totalEpreuvesPubliees,
    totalUsers,
    totalSansCorrige,
    epreuvesSansCorrige,
  ] = await Promise.all([
    prisma.epreuve.count({ where: { isPublished: true } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.epreuve.count({ where: { fichierCorrige: null } }),
    prisma.epreuve.findMany({
      where: { fichierCorrige: null },
      take: 5,
      include: {
        filiereNiveau: {
          include: { filiere: true, niveau: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const stats = [
    {
      label: "Épreuves publiées",
      value: totalEpreuvesPubliees,
      icon: BookOpen,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-400",
      iconColor: "text-blue-600 dark:text-blue-300",
    },
    {
      label: "Utilisateurs (USER)",
      value: totalUsers,
      icon: Users,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-400",
      iconColor: "text-green-600 dark:text-green-300",
    },
    {
      label: "Épreuves sans corrigé",
      value: totalSansCorrige,
      icon: FileQuestion,
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-700 dark:text-amber-400",
      iconColor: "text-amber-600 dark:text-amber-300",
    },
  ]

  const typeLabels: Record<string, string> = {
    CONCOURS: "Concours",
    CC: "Contrôle continu",
    SN: "Session normale",
    EPREUVE_SIMPLE: "Épreuve simple",
  }

  return (
    <div className="space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d&apos;ensemble et actions rapides.
        </p>
      </div>

      {/* 3 cartes de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, bgColor, textColor, iconColor }) => (
          <div
            key={label}
            className={cn(
              "rounded-xl border border-border p-6",
              "bg-card"
            )}
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", bgColor, iconColor)}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className={cn("text-sm mt-1", textColor)}>{label}</p>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/epreuves/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            Ajouter une épreuve
          </Link>
          <Link
            href="/admin/epreuves"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-card border border-border font-medium text-foreground hover:bg-muted transition-colors"
          >
            <List className="h-5 w-5" />
            Voir les épreuves
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-card border border-border font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="h-5 w-5" />
            Paramètres
          </Link>
        </div>
      </div>

      {/* Tableau épreuves sans corrigé */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Épreuves sans corrigé (5 dernières)
        </h2>
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          {epreuvesSansCorrige.length === 0 ? (
            <p className="p-6 text-muted-foreground text-sm">
              Aucune épreuve sans corrigé.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-medium text-foreground">Titre</th>
                    <th className="text-left p-3 font-medium text-foreground">Filière</th>
                    <th className="text-left p-3 font-medium text-foreground">Niveau</th>
                    <th className="text-left p-3 font-medium text-foreground">Type</th>
                    <th className="text-right p-3 font-medium text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {epreuvesSansCorrige.map((ep) => (
                    <tr key={ep.id} className="border-b border-border last:border-0">
                      <td className="p-3 text-foreground font-medium">{ep.titre}</td>
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
                        {typeLabels[ep.type] ?? ep.type}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/admin/epreuves/${ep.id}/edit`}
                          className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                        >
                          <Pencil className="h-4 w-4" />
                          Ajouter corrigé
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
