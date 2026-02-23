import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { defineConfig, env } from "prisma/config"

try {
  const content = readFileSync(resolve(process.cwd(), ".env"), "utf-8")
  for (const line of content.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "")
  }
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
})
