"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowRight, Github, Lock, Mail, User } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { registerAction } from "@/app/auth/actions"
import { toast } from "@/components/ui/Toast"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || ""

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
                <h1 className="text-3xl font-extrabold tracking-tight">Créer un compte.</h1>
                <p className="mt-3 text-muted-foreground">
                  Rejoignez Miranda pour accéder aux ressources, concours et épreuves de votre niveau.
                </p>
              </div>
            </div>

            <div className="relative mt-12 rounded-2xl  bg-primary/20 p-6">
              <p className="text-sm font-bold">Astuce</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Gardez vos informations secrete pour plus de securiter et une utilisation meilleures.
              </p>
            </div>
          </div>

          {/* Right panel (form) */}
          <div className="p-6 sm:p-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Créer un compte</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Déjà un compte ?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Se connecter
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
                onClick={() => toast.info("Inscription Google (UI) : non configurée")}
              >
                Continuer avec Google
              </button>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition-colors",
                  "hover:bg-muted"
                )}
                onClick={() => toast.info("Inscription GitHub (UI) : non configurée")}
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

            <form action={registerAction} className="space-y-4">
              <input type="hidden" name="next" value={next} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Votre nom"
                    className="w-full rounded-xl bg-foreground/5  py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="exemple@email.com"
                    className="w-full rounded-xl  bg-foreground/5 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl  bg-foreground/5  py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={cn(
                  "w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  "bg-foreground text-primary hover:bg-foreground/90"
                )}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  Créer un compte
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </form>

            <p className="mt-6 text-xs text-muted-foreground">
              En créant un compte, vous acceptez nos conditions, l’utilisation acceptable et notre politique de confidentialité.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

