import { prisma } from "@/lib/prisma"
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
  const users = await prisma.user.findMany({
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-8 w-8" />
          Utilisateurs
        </h1>
        <p className="text-muted-foreground mt-1">
          Liste des comptes utilisateurs (rôle USER).
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {users.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Aucun utilisateur pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-foreground">Nom</th>
                  <th className="text-left p-3 font-medium text-foreground">Email</th>
                  <th className="text-left p-3 font-medium text-foreground">Abonnement</th>
                  <th className="text-left p-3 font-medium text-foreground">Date fin</th>
                  <th className="text-right p-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const abonnementActif =
                    user.isSubscriptionActive === true &&
                    user.subscriptionEndDate !== null &&
                    new Date() < new Date(user.subscriptionEndDate)
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="p-3 text-foreground font-medium">
                        {user.fullName ?? "—"}
                      </td>
                      <td className="p-3 text-foreground">{user.email}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            abonnementActif
                              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          }`}
                        >
                          {abonnementActif ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {formatDate(user.subscriptionEndDate)}
                      </td>
                      <td className="p-3 text-right">
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
