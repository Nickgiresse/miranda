"use client"

import { useFormState, useFormStatus } from "react-dom"
import { authenticate } from "@/lib/actions"
import { BookOpen } from "lucide-react"

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined)

    return (
        <div className="flex h-screen items-center justify-center bg-muted/40 px-4">
            <div className="w-full max-w-sm space-y-6 bg-card p-8 rounded-2xl shadow-lg border">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground mb-2">
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Bienvenue sur Miranda</h1>
                    <p className="text-sm text-muted-foreground">
                        Connectez-vous pour accéder à votre espace
                    </p>
                </div>

                <form action={dispatch} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 border rounded-md bg-background"
                            placeholder="exemple@email.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            className="w-full px-3 py-2 border rounded-md bg-background"
                            placeholder="••••••••"
                        />
                    </div>

                    <LoginButton />

                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <p className="text-sm text-red-500 w-full text-center">{errorMessage}</p>
                        )}
                    </div>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Pas encore de compte ? <a href="/register" className="text-primary hover:underline">S'inscrire</a>
                </p>
            </div>
        </div>
    )
}

function LoginButton() {
    const { pending } = useFormStatus()
    return (
        <button
            className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            aria-disabled={pending}
        >
            {pending ? "Connexion..." : "Se connecter"}
        </button>
    )
}
