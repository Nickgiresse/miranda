import Link from "next/link"
import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"
import {
  BookOpen,
  Users,
  AlertCircle,
  PlusCircle,
  List,
  Settings,
} from "lucide-react"

export default async function AdminDashboardPage() {
  await requireAdmin()

  const [totalEpreuves, totalUsers, epreuvesSansCorrige] = await withDB((db) =>
    Promise.all([
      db.epreuve.count({ where: { isPublished: true } }),
      db.user.count({ where: { role: "USER" } }),
      db.epreuve.findMany({
        where: { isPublished: true, fichierCorrige: null },
        select: {
          id: true,
          titre: true,
          type: true,
          filiereNiveau: {
            include: {
              filiere: { select: { code: true, couleur: true } },
              niveau: { select: { numero: true, label: true } },
            },
          },
        },
        take: 5,
      }),
    ])
  )

  const stats = [
    {
      label: "Épreuves publiées",
      value: totalEpreuves,
      icon: BookOpen,
      sub: "épreuves en ligne",
    },
    {
      label: "Utilisateurs",
      value: totalUsers,
      icon: Users,
      sub: "comptes inscrits",
    },
    {
      label: "Sans corrigé",
      value: epreuvesSansCorrige.length,
      icon: AlertCircle,
      sub: "en attente",
    },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-400 text-sm mt-1">
          Bienvenue sur l&apos;interface Miranda
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map(({ label, value, icon: Icon, sub }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-slate-100 rounded-xl p-2.5">
                <Icon className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-xs text-slate-300 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              href: "/admin/epreuves/add",
              icon: PlusCircle,
              label: "Ajouter une épreuve",
              sub: "Publier un nouveau PDF",
            },
            {
              href: "/admin/epreuves",
              icon: List,
              label: "Toutes les épreuves",
              sub: "Gérer le contenu",
            },
            {
              href: "/admin/settings",
              icon: Settings,
              label: "Paramètres",
              sub: "Prix, contact...",
            },
          ].map(({ href, icon: Icon, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4"
            >
              <div className="bg-slate-100 rounded-xl p-2.5 group-hover:bg-slate-900 transition-all duration-200">
                <Icon className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors duration-200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tableau épreuves sans corrigé */}
      {epreuvesSansCorrige.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Épreuves sans corrigé
          </h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto min-w-0">
              <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Filière
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {epreuvesSansCorrige.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-slate-50 transition-colors duration-150 group"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {e.titre}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
                        style={{
                          backgroundColor: e.filiereNiveau.filiere.couleur,
                        }}
                      >
                        {e.filiereNiveau.filiere.code}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {e.type}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/epreuves/${e.id}/edit`}
                        className="text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        Ajouter corrigé →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
