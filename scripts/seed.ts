import "dotenv/config"
import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma"

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
  console.log("🌱 Seed Miranda...")

  // Niveaux
  const n1 = await getOrCreateNiveau(1, "Niveau 1")
  const n2 = await getOrCreateNiveau(2, "Niveau 2")
  console.log("  Niveaux OK")

  // Filieres: SPH vert, IGC bleu, MF rouge, IGEA bordeaux, INGE violet
  const filieresData = [
    { code: "SPH", nom: "Sciences de la Santé Publique et Humaine", couleur: "#22c55e", description: "Filière SPH" },
    { code: "IGC", nom: "Ingénieur Génie Civil", couleur: "#3b82f6", description: "Filière IGC" },
    { code: "MF", nom: "Mathématiques et Finances", couleur: "#ef4444", description: "Filière MF" },
    { code: "IGEA", nom: "Informatique et Gestion des Entreprises", couleur: "#7f1d1d", description: "Filière IGEA" },
    { code: "INGE", nom: "Ingénierie Générale", couleur: "#7c3aed", description: "Filière INGE" },
  ]

  for (const f of filieresData) {
    await prisma.filiere.upsert({
      where: { code: f.code },
      create: { ...f, isActive: true },
      update: { nom: f.nom, couleur: f.couleur, description: f.description },
    })
  }
  console.log("  Filieres OK")

  const filieres = await prisma.filiere.findMany()
  for (const filiere of filieres) {
    for (const niveau of [n1, n2]) {
      await prisma.filiereNiveau.upsert({
        where: {
          filiereId_niveauId: { filiereId: filiere.id, niveauId: niveau.id },
        },
        create: { filiereId: filiere.id, niveauId: niveau.id },
        update: {},
      })
    }
  }
  console.log("  FiliereNiveaux OK")

  // Admins: 2 comptes
  const adminPassword = await bcrypt.hash("admin123", 10)
  await prisma.user.upsert({
    where: { email: "admin@miranda.com" },
    create: {
      email: "admin@miranda.com",
      fullName: "Admin Miranda",
      password: adminPassword,
      role: "ADMIN",
    },
    update: {},
  })
  await prisma.user.upsert({
    where: { email: "superadmin@miranda.com" },
    create: {
      email: "superadmin@miranda.com",
      fullName: "Super Admin Miranda",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
    update: {},
  })
  console.log("  Admins OK (admin@miranda.com / superadmin@miranda.com, mot de passe: admin123)")

  // SystemSettings
  await prisma.systemSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      prixAbonnement: 1000,
      contactEmail: "mirandaawoulebe@gmail.com",
      contactTel: "+228 90 00 00 00",
      contactAdresse: "Lomé, Togo",
    },
    update: {},
  })
  console.log("  SystemSettings OK")

  console.log("✅ Seed terminé.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
