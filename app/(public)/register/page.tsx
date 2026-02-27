"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, Mail, User, Loader2, XCircle, ChevronRight } from "lucide-react"
import Logo from "@/components/Logo"
import { useSearchParams } from "next/navigation"
import { registerAction } from "@/app/auth/actions"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.")
      return
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.")
      return
    }
    setPending(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set("password", password)
    try {
      await registerAction(formData)
      router.push(next || "/")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo href="/" width={130} height={44} className="mb-8" />
          <h1 className="text-2xl font-bold text-slate-900">
            Créer un compte
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Rejoignez Miranda et accédez aux épreuves
          </p>
        </div>

        {/* Card formulaire */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm mb-6">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="next" value={next} />

            {/* Nom complet */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Jean Dupont"
                  disabled={pending}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={pending}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="mt-2 space-y-1">
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      password.length === 0
                        ? "w-0"
                        : password.length < 6
                          ? "w-1/3 bg-red-400"
                          : password.length < 10
                            ? "w-2/3 bg-amber-400"
                            : "w-full bg-emerald-400"
                    }`}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {password.length === 0
                    ? ""
                    : password.length < 6
                      ? "Trop court"
                      : password.length < 10
                        ? "Acceptable"
                        : "Fort ✓"}
                </p>
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={pending}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création du compte...
                </>
              ) : (
                <>
                  Créer un compte
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lien connexion */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors duration-200"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

function RegisterFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo href="/" width={130} height={44} className="mb-8" />
          <h1 className="text-2xl font-bold text-slate-900">Créer un compte</h1>
          <p className="text-slate-500 text-sm mt-2">
            Rejoignez Miranda et accédez aux épreuves
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center justify-center min-h-[320px]">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  )
}
