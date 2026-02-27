"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Lock, Mail, XCircle, Loader2 } from "lucide-react"
import Logo from "@/components/Logo"
import { useSearchParams } from "next/navigation"
import { loginAction } from "@/app/auth/actions"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || ""
  const [state, formAction, pending] = useActionState(loginAction, null)

  useEffect(() => {
    if (state?.success) {
      router.push(
        state.role === "ADMIN" || state.role === "SUPER_ADMIN"
          ? "/admin/dashboard"
          : next || "/"
      )
      router.refresh()
    }
  }, [state, next, router])

  const error = state?.error

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo href="/" width={130} height={44} className="mb-8" />
          <h1 className="text-2xl font-bold text-slate-900">Bon retour 👋</h1>
          <p className="text-slate-500 text-sm mt-2">
            Connectez-vous à votre compte Miranda
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm mb-6">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="next" value={next} />

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="vous@exemple.cm"
                  required
                  disabled={pending}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Mot de passe
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-400 hover:text-slate-900 transition-colors duration-200"
                >
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  disabled={pending}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors duration-200"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
