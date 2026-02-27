import { prisma } from "@/lib/prisma"

export async function withDB<T>(
  fn: (db: typeof prisma) => Promise<T>,
  retries = 5,          // au lieu de 3
  delay = 1000          // 1s de base
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn(prisma)
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }

      const msg = error?.message ?? ""
      const shouldRetry =
        msg.includes("timeout") ||
        msg.includes("terminated") ||           // couvre "Connection terminated unexpectedly"
        msg.includes("Connection terminated unexpectedly") ||
        msg.includes("ECONNRESET") ||
        error?.code === "ETIMEDOUT" ||
        error?.code === "P1001" ||
        error?.code === "P1002"

      if (shouldRetry && i < retries - 1) {
        console.warn(`[withDB] Retry ${i + 1}/${retries} after ${delay}ms: ${msg}`)
        await new Promise((r) => setTimeout(r, delay))
        delay *= 2
        continue
      }

      throw err
    }
  }
  throw new Error("DB unreachable after retries")
}