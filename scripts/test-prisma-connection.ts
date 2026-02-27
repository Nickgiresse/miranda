/**
 * Script pour tester la connexion Prisma à Neon
 * Utilisation: npx tsx scripts/test-prisma-connection.ts
 */

import "dotenv/config";
import { prisma } from "../lib/prisma";

async function testPrismaConnection() {
  console.log("🔍 Test de connexion Prisma à Neon...\n");

  try {
    console.log("⏳ Tentative de connexion avec Prisma...");
    
    // Test simple: compter les utilisateurs
    const userCount = await prisma.user.count();
    
    console.log("✅ Connexion Prisma réussie!");
    console.log(`📊 Nombre d'utilisateurs: ${userCount}\n`);
    
    // Test de lecture
    const users = await prisma.user.findMany({
      take: 5,
      select: { id: true, email: true, fullName: true, role: true },
    });
    
    if (users.length > 0) {
      console.log("👥 Utilisateurs trouvés:");
      users.forEach((user) => {
        console.log(`   - ${user.email} (${user.fullName || "Sans nom"}) [${user.role}]`);
      });
    } else {
      console.log("ℹ️  Aucun utilisateur dans la base de données.");
    }
    
  } catch (error: any) {
    console.error("❌ ERREUR de connexion Prisma:\n");
    
    if (error.code === "ETIMEDOUT" || error.code === "P1001") {
      console.error("   Code: " + error.code + " (Timeout de connexion)");
      console.log("\n💡 Solutions:");
      console.log("   1. Vérifiez que votre connexion Internet fonctionne");
      console.log("   2. Vérifiez que Windows Defender ne bloque pas Node.js");
      console.log("   3. Redémarrez le serveur Next.js (npm run dev)");
    } else {
      console.error(`   Code: ${error.code || "INCONNU"}`);
      console.error(`   Message: ${error.message}`);
    }
    
    console.error("\n📝 Détails complets:");
    console.error(error);
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("\n✅ Déconnexion de Prisma");
  }
}

testPrismaConnection();
