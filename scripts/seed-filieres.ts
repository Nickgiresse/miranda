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

async function getOrCreateNiveau(
  numero: number, 
  label: string
) {
  const existing = await prisma.niveau.findFirst({
    where: { numero, label }
  })
  if (existing) return existing
  return prisma.niveau.create({
    data: { numero, label }
  })
}

async function main() {
  console.log("Seeding filières et niveaux...")

  // Niveaux standards
  const n1 = await getOrCreateNiveau(1, "Niveau 1")
  const n2 = await getOrCreateNiveau(2, "Niveau 2")

  // Filières existantes SPH, IGC, MF, IGEA, INGE
  const filieresDonnees = [
    { 
      code: "SPH", 
      nom: "Sciences Physiques", 
      couleur: "#22c55e",
      niveaux: [n1, n2]
    },
    { 
      code: "IGC", 
      nom: "Informatique de Gestion", 
      couleur: "#3b82f6",
      niveaux: [n1, n2]
    },
    { 
      code: "MF", 
      nom: "Management et Finance", 
      couleur: "#ef4444",
      niveaux: [n1, n2]
    },
    { 
      code: "IGEA", 
      nom: "Informatique de Gestion et Administration",
      couleur: "#800020",
      niveaux: [n1, n2]
    },
    { 
      code: "INGE", 
      nom: "Ingénierie", 
      couleur: "#9333ea",
      niveaux: [n1, n2]
    },
  ]

  for (const f of filieresDonnees) {
    let filiere = await prisma.filiere.findFirst({
      where: { code: f.code }
    })
    if (!filiere) {
      filiere = await prisma.filiere.create({
        data: {
          code: f.code,
          nom: f.nom,
          couleur: f.couleur,
          isActive: true,
        }
      })
      console.log(`✅ Filière ${f.code} créée`)
    }

    for (const niveau of f.niveaux) {
      const existing = await prisma.filiereNiveau
        .findFirst({
          where: { 
            filiereId: filiere.id, 
            niveauId: niveau.id 
          }
        })
      if (!existing) {
        await prisma.filiereNiveau.create({
          data: { 
            filiereId: filiere.id, 
            niveauId: niveau.id 
          }
        })
      }
    }
  }

  console.log("✅ Seed terminé !")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
