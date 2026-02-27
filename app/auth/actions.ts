"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { withDB } from "@/lib/db"
import { signIn, signOut } from "@/lib/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function getRedirectByRole(role: string, next: string): string {
  if (next && next.startsWith("/")) return next
  if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin/dashboard"
  return "/"
}

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? formData.get("fullName") ?? "").trim()
  const email = normalizeEmail(String(formData.get("email") || ""))
  const password = String(formData.get("password") || "")
  const next = String(formData.get("next") || "")

  if (!email || !password) {
    throw new Error("Email et mot de passe requis.")
  }
  if (password.length < 6) {
    throw new Error("Mot de passe trop court (min 6 caractères).")
  }

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    const user = await withDB((db) =>
      db.user.create({
        data: {
          email,
          password: passwordHash,
          fullName: name || null,
          role: "USER",
        },
        select: { id: true, role: true },
      })
    )

    await signIn("credentials", {
      email,
      password,
      redirectTo: getRedirectByRole(user.role, next),
    })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err?.code === "P2002") {
      throw new Error("Un compte existe déjà avec cet email.")
    }
    if (err?.code === "ETIMEDOUT" || err?.code === "ECONNREFUSED" || err?.code === "P1001") {
      throw new Error("Impossible de se connecter à la base de données. Vérifiez que PostgreSQL est démarré.")
    }
    throw e
  }

  redirect(getRedirectByRole("USER", next))
}

export type LoginResult = { success?: boolean; error?: string }

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = normalizeEmail(String(formData.get("email") || ""))
  const password = String(formData.get("password") || "")

  if (!email || !password) {
    return { error: "Email et mot de passe requis." }
  }

  try {
    const user = await withDB((db) =>
      db.user.findUnique({
        where: { email },
        select: { id: true, password: true, role: true },
      })
    )

    if (!user) {
      return { error: "Email ou mot de passe incorrect." }
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return { error: "Email ou mot de passe incorrect." }
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const err = error as { code?: string }
    if (err?.code === "ETIMEDOUT" || err?.code === "ECONNREFUSED" || err?.code === "P1001") {
      return {
        error: "Impossible de se connecter à la base de données. Vérifiez que DATABASE_URL est correct.",
      }
    }
    if (err?.code?.startsWith?.("P")) {
      return { error: "Erreur de base de données. Veuillez réessayer plus tard." }
    }
    return { error: "Email ou mot de passe incorrect." }
  }
}

export async function logoutAction() {
  await signOut({ redirect: false })
}
