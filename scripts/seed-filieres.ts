import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Charger .env pour DATABASE_URL (tsx ne le charge pas automatiquement)
try {
  const content = readFileSync(resolve(process.cwd(), ".env"), "utf-8")
  for (const line of content.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "")
  }
} catch {}

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL manquant. Définissez-le dans .env")

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const filieres = [
  { code: "SPH", nom: "Science Politique et Humanités", couleur: "#22c55e" },
  { code: "IGC", nom: "Ingénieur Génie Civil", couleur: "#3b82f6" },
  { code: "MF", nom: "Management et Finance", couleur: "#ef4444" },
  { code: "IGEA", nom: "Ingénieur en Géosciences, Environnement et Agro-industrie", couleur: "#800020" },
  { code: "INGE", nom: "Ingénieur Généraliste", couleur: "#9333ea" },
]

async function main() {
  // 1. Crée les niveaux
  const n1 = await prisma.niveau.upsert({
    where: { numero: 1 },
    update: {},
    create: { numero: 1, label: "Niveau 1" },
  })
  const n2 = await prisma.niveau.upsert({
    where: { numero: 2 },
    update: {},
    create: { numero: 2, label: "Niveau 2" },
  })

  // 2. Crée les filières + liens niveaux
  for (const f of filieres) {
    const filiere = await prisma.filiere.upsert({
      where: { code: f.code },
      update: {},
      create: { nom: f.nom, code: f.code, couleur: f.couleur },
    })
    for (const niveau of [n1, n2]) {
      await prisma.filiereNiveau.upsert({
        where: {
          filiereId_niveauId: {
            filiereId: filiere.id,
            niveauId: niveau.id,
          },
        },
        update: {},
        create: { filiereId: filiere.id, niveauId: niveau.id },
      })
    }
    console.log("✅ " + f.code + " créée")
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
