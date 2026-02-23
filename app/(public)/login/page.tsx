"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ArrowRight, Lock, Mail, AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { loginAction } from "@/app/auth/actions"
import { toast } from "@/components/ui/Toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || ""
  const [state, formAction, isPending] = useActionState(loginAction, null)

  useEffect(() => {
    if (state?.success) {
      router.push(
        state.role === "ADMIN" || state.role === "SUPER_ADMIN"
          ? "/admin/dashboard"
          : "/"
      )
      // Obligatoire pour que la session soit mise à jour dans la navbar sans recharger la page
      router.refresh()
    }
  }, [state])

  return (
    <div className="relative min-h-[calc(100vh-5rem)]">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/40" />
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-foreground/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-10 sm:py-16">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl  bg-background/60 backdrop-blur-md shadow-xl lg:grid-cols-2">
          {/* Left panel (inspiration Resend) */}
          <div className="relative hidden flex-col justify-between p-10 lg:flex">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/10">
                  <img src="/logo.png" alt="Miranda" className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-lg font-bold">Miranda</p>
                  <p className="text-sm text-muted-foreground">Bibliothèque d’épreuves & concours</p>
                </div>
              </div>

              <div className="mt-10">
                <h1 className="text-3xl font-extrabold tracking-tight">Bon retour.</h1>
                <p className="mt-3 text-muted-foreground">
                  Connectez‑vous pour reprendre vos révisions, accéder à vos ressources et suivre vos téléchargements.
                </p>
              </div>
            </div>

            <div className="relative mt-12 rounded-2xl border bg-card/60 p-6">
              <p className="text-sm font-medium">Astuce</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Utilisez un email valide. Le système d’authentification n’est pas encore branché (UI uniquement).
              </p>
            </div>
          </div>

          {/* Right panel (form) */}
          <div className="p-6 sm:p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Se connecter</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* <div className="grid gap-3">
              <button
                type="button"
                className={cn(
                  "w-full rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition-colors",
                  "hover:bg-muted"
                )}
                onClick={() => toast.info("Connexion Google (UI) : non configurée")}
              >
                Continuer avec Google
              </button>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition-colors",
                  "hover:bg-muted"
                )}
                onClick={() => toast.info("Connexion GitHub (UI) : non configurée")}
              >
                <Github className="h-4 w-4" />
                Continuer avec GitHub
              </button>
            </div> */}

            {/* <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">ou</span>
              <div className="h-px flex-1 bg-border" />
            </div> */}

            <form action={formAction as any} className="space-y-4">
              <input type="hidden" name="next" value={next} />
              
              {state?.error && (
                <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{state.error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="exemple@email.com"
                    disabled={isPending}
                    className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Mot de passe</label>
                  <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    disabled={isPending}
                    className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  "w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  "bg-foreground text-primary hover:bg-foreground/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {isPending ? "Connexion..." : "Se connecter"}
                  {!isPending && <ArrowRight className="h-4 w-4" />}
                </span>
              </button>
            </form>

            <p className="mt-6 text-xs text-muted-foreground">
              En vous connectant, vous acceptez nos conditions et notre politique de confidentialité.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
