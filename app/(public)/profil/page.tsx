import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import {
  User,
  Mail,
  Calendar,
  Crown,
  BookOpen,
  Download,
  Clock,
} from "lucide-react"

export default async function ProfilPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isSubscriptionActive: true,
      subscriptionEndDate: true,
      createdAt: true,
      downloads: {
        include: {
          epreuve: {
            select: {
              titre: true,
              type: true,
              filiereNiveau: {
                include: {
                  filiere: {
                    select: { code: true, couleur: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (!user) redirect("/login")

  const abonnementActif =
    user.isSubscriptionActive &&
    user.subscriptionEndDate &&
    new Date() < new Date(user.subscriptionEndDate)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Mon compte</h1>

      {/* Carte infos personnelles */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Informations personnelles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Nom complet
            </p>
            <p className="text-foreground font-medium">
              {user.fullName ?? "Non renseigné"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Email
            </p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <p className="text-foreground">{user.email}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Rôle
            </p>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                user.role === "ADMIN" || user.role === "SUPER_ADMIN"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Crown className="w-3 h-3" />
              {user.role === "SUPER_ADMIN"
                ? "Super Admin"
                : user.role === "ADMIN"
                  ? "Administrateur"
                  : "Utilisateur"}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Membre depuis
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-foreground">
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carte abonnement */}
      <div
        className={`rounded-2xl border p-6 ${
          abonnementActif
            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
            : "bg-muted/30 border-border"
        }`}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Crown
            className={`w-5 h-5 ${
              abonnementActif ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
            }`}
          />
          Abonnement
        </h2>

        {abonnementActif ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-700 dark:text-green-400 font-semibold">
                Abonnement actif
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Expire le{" "}
              {new Date(user.subscriptionEndDate!).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-2">
              ✓ Accès à toutes les épreuves et corrigés
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Vous n&apos;avez pas d&apos;abonnement actif.
            </p>
            <p className="text-sm text-muted-foreground">
              Abonnez-vous pour accéder à toutes les épreuves et leurs corrigés.
            </p>
            <Link
              href="/abonnement"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition"
            >
              <Crown className="w-4 h-4" />
              Souscrire un abonnement
            </Link>
          </div>
        )}
      </div>

      {/* Historique téléchargements */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          Mes téléchargements récents
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {user.downloads.length} fichier(s)
          </span>
        </h2>

        {user.downloads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Aucun téléchargement pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.downloads.map((dl) => (
              <div
                key={dl.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition"
              >
                <div
                  className="w-2 h-10 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      dl.epreuve.filiereNiveau.filiere.couleur,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {dl.epreuve.titre}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span
                      className="font-medium"
                      style={{
                        color: dl.epreuve.filiereNiveau.filiere.couleur,
                      }}
                    >
                      {dl.epreuve.filiereNiveau.filiere.code}
                    </span>
                    · {dl.epreuve.type}
                    · {dl.type === "CORRIGE" ? "Corrigé" : "Épreuve"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground flex-shrink-0">
                  {new Date(dl.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
