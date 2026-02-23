/**
 * Met à jour toutes les épreuves en isPublished: true.
 * À lancer une seule fois si des épreuves ont été créées avec isPublished: false.
 *
 * npx tsx scripts/publish-all-epreuves.ts
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

try {
  const content = readFileSync(resolve(process.cwd(), ".env"), "utf-8")
  for (const line of content.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "")
  }
} catch {}

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL manquant")
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const result = await prisma.epreuve.updateMany({
    where: { isPublished: false },
    data: { isPublished: true },
  })
  console.log(`✅ ${result.count} épreuve(s) passée(s) en publiée(s).`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
