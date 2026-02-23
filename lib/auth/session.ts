import "server-only"

import crypto from "crypto"
import { cookies } from "next/headers"

export const SESSION_COOKIE_NAME = "miranda_session"

type SessionPayload = {
  userId: string
  exp: number // unix seconds
}

function base64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "")
}

function base64urlDecode(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4))
  const b64 = input.replaceAll("-", "+").replaceAll("_", "/") + pad
  return Buffer.from(b64, "base64")
}

function getAuthSecret() {
  // NOTE: mets AUTH_SECRET dans `.env` / variables d'environnement
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-insecure-secret"
}

function sign(data: string) {
  return base64url(crypto.createHmac("sha256", getAuthSecret()).update(data).digest())
}

export function createSessionToken(payload: SessionPayload) {
  const body = base64url(JSON.stringify(payload))
  const sig = sign(body)
  return `${body}.${sig}`
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [body, sig] = token.split(".")
  if (!body || !sig) return null
  const expected = sign(body)
  // constant-time compare
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  if (!crypto.timingSafeEqual(a, b)) return null

  try {
    const json = base64urlDecode(body).toString("utf8")
    const payload = JSON.parse(json) as SessionPayload
    if (!payload?.userId || typeof payload.exp !== "number") return null
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export async function setSessionCookie(userId: string, opts?: { days?: number }) {
  const days = opts?.days ?? 30
  const exp = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60
  const token = createSessionToken({ userId, exp })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(exp * 1000),
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  })
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  const payload = verifySessionToken(token)
  return payload?.userId ?? null
}

