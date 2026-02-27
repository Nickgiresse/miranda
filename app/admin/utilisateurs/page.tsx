import { withDB } from "@/lib/db"
import { Users } from "lucide-react"
import { UserActions } from "./user-actions"

function formatDate(date: Date | null): string {
  if (!date) return "—"
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export default async function AdminUtilisateursPage() {
  const users = await withDB((db) =>
    db.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        fullName: true,
        email: true,
        isSubscriptionActive: true,
        subscriptionEndDate: true,
      },
      orderBy: { createdAt: "desc" },
    })
  )

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="h-7 w-7 text-slate-600" />
          Utilisateurs
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Liste des comptes utilisateurs (rôle USER).
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Aucun utilisateur pour le moment.
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
                    Email
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Abonnement
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Date fin
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => {
                  const abonnementActif =
                    user.isSubscriptionActive === true &&
                    user.subscriptionEndDate !== null &&
                    new Date() < new Date(user.subscriptionEndDate)
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 transition-colors duration-150"
                    >
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {user.fullName ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{user.email}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${
                            abonnementActif
                              ? "bg-slate-100 text-slate-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {abonnementActif ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(user.subscriptionEndDate)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <UserActions
                          userId={user.id}
                          isActive={abonnementActif}
                          fullName={user.fullName ?? user.email}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
