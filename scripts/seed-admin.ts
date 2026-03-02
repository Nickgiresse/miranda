import "dotenv/config"
import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma"

const ADMIN_EMAIL = "mirandaawoulebe@gmail.com"
const ADMIN_PASSWORD = "miranda12"
const ADMIN_FULL_NAME = "Administrateur Miranda"

async function main() {
  console.log("🌱 Création de l'administrateur Miranda...")

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)

  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      fullName: ADMIN_FULL_NAME,
      password: passwordHash,
      role: "ADMIN",
      isSubscriptionActive: true,
    },
    update: {
      fullName: ADMIN_FULL_NAME,
      password: passwordHash,
      role: "ADMIN",
      isSubscriptionActive: true,
    },
  })

  console.log("✅ Administrateur créé ou mis à jour :", user.email)
  console.log("   Email:", ADMIN_EMAIL)
  console.log("   Mot de passe:", ADMIN_PASSWORD)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
