import Link from "next/link"
import { auth } from "@/lib/auth"
import { withDB } from "@/lib/db"
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
import { BoutonAbonnementWhatsApp } from "@/components/BoutonAbonnementWhatsApp"

export default async function ProfilPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await withDB((db) =>
    db.user.findUnique({
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
  )

  if (!user) redirect("/login")

  const abonnementActif =
    user.isSubscriptionActive &&
    user.subscriptionEndDate &&
    new Date() < new Date(user.subscriptionEndDate)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mon compte</h1>

      {/* Carte infos personnelles */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
          <User className="w-4 h-4" />
          Informations personnelles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              Nom complet
            </p>
            <p className="text-slate-900 font-medium">
              {user.fullName ?? "Non renseigné"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              Email
            </p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <p className="text-slate-900">{user.email}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              Rôle
            </p>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600">
              <Crown className="w-3 h-3" />
              {user.role === "SUPER_ADMIN"
                ? "Super Admin"
                : user.role === "ADMIN"
                  ? "Administrateur"
                  : "Utilisateur"}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              Membre depuis
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <p className="text-slate-900">
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
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Crown className="w-4 h-4" />
          Abonnement
        </h2>

        {abonnementActif ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 font-semibold">
                Abonnement actif
              </span>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Expire le{" "}
              {new Date(user.subscriptionEndDate!).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-emerald-700 mt-2">
              ✓ Accès à toutes les épreuves et corrigés
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-slate-500 text-sm">
              Vous n&apos;avez pas d&apos;abonnement actif.
            </p>
            <p className="text-sm text-slate-400">
              Abonnez-vous pour accéder à toutes les épreuves et leurs corrigés.
            </p>
            <BoutonAbonnementWhatsApp userName={user.fullName} />
          </div>
        )}
      </div>

      {/* Historique téléchargements */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Mes téléchargements récents
          <span className="ml-auto text-sm font-normal text-slate-400">
            {user.downloads.length} fichier(s)
          </span>
        </h2>

        {user.downloads.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Aucun téléchargement pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.downloads.map((dl) => (
              <div
                key={dl.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-150"
              >
                <div
                  className="w-2 h-10 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: dl.epreuve.filiereNiveau.filiere.couleur,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {dl.epreuve.titre}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
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
                <p className="text-xs text-slate-400 flex-shrink-0">
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
