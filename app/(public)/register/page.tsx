"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, Mail, User, Loader2, XCircle, ChevronRight } from "lucide-react"
import Logo from "@/components/Logo"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { registerAction } from "@/app/auth/actions"
import { isValidEmail } from "@/lib/validators"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { update } = useSession()
  const next = searchParams.get("next") || ""
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setEmail(val)
    if (val && !isValidEmail(val)) {
      setEmailError("Format invalide (ex: nom@exemple.com)")
    } else {
      setEmailError("")
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const confirm = (formData.get("confirm") as string) || ""

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    const result = await registerAction(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    await update()
    router.push(next || "/")
    router.refresh()
    setLoading(false)
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
            <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm mb-6">
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
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder:text-slate-300 transition-all duration-200 disabled:opacity-50"
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
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="vous@exemple.cm"
                  required
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm transition-all duration-200 focus:outline-none text-slate-900 placeholder:text-slate-300 disabled:opacity-50 ${
                    emailError
                      ? "ring-2 ring-red-400"
                      : "ring-1 ring-slate-200 focus:ring-2 focus:ring-slate-900"
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {emailError}
                </p>
              )}
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
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder:text-slate-300 transition-all duration-200 disabled:opacity-50"
                />
              </div>
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        password.length < 6
                          ? "w-1/3 bg-red-400"
                          : password.length < 10
                            ? "w-2/3 bg-amber-400"
                            : "w-full bg-emerald-400"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    {password.length < 6
                      ? "Trop court"
                      : password.length < 10
                        ? "Acceptable"
                        : "Fort ✓"}
                  </p>
                </div>
              )}
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
                  name="confirm"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder:text-slate-300 transition-all duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </span>
              ) : (
                <>
                  Créer mon compte
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
