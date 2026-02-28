"use server"

import bcrypt from "bcryptjs"
import { withDB } from "@/lib/db"
import { signIn, signOut } from "@/lib/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export type RegisterResult = { success?: boolean; error?: string }

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const fullName = String(formData.get("fullName") ?? formData.get("name") ?? "").trim()
  const email = normalizeEmail(String(formData.get("email") || ""))
  const password = String(formData.get("password") || "")

  if (!email || !password) {
    return { error: "Email et mot de passe requis." }
  }
  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." }
  }

  try {
    const existing = await withDB((db) =>
      db.user.findUnique({ where: { email } })
    )
    if (existing) {
      return { error: "Cet email est déjà utilisé." }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await withDB((db) =>
      db.user.create({
        data: {
          email,
          password: passwordHash,
          fullName: fullName || null,
          role: "USER",
        },
      })
    )

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (e: unknown) {
    if (isRedirectError(e)) throw e
    const err = e as { code?: string }
    if (err?.code === "P2002") {
      return { error: "Cet email est déjà utilisé." }
    }
    if (err?.code === "ETIMEDOUT" || err?.code === "ECONNREFUSED" || err?.code === "P1001") {
      return { error: "Impossible de se connecter à la base de données." }
    }
    console.error("Register error:", err)
    return { error: "Erreur lors de la création du compte." }
  }
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
