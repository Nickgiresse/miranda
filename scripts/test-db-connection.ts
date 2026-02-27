/**
 * Script pour tester la connexion à la base de données PostgreSQL
 * 
 * Utilisation: npx tsx scripts/test-db-connection.ts
 * ou: node --loader tsx scripts/test-db-connection.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

async function testConnection() {
  console.log("🔍 Test de connexion à la base de données...\n");

  // Vérifier DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ ERREUR: DATABASE_URL n'est pas défini dans .env");
    console.log("\n💡 Solution:");
    console.log("   1. Créez un fichier .env à la racine du projet");
    console.log("   2. Ajoutez: DATABASE_URL=\"postgresql://user:password@localhost:5432/dbname\"");
    process.exit(1);
  }

  // Masquer le mot de passe dans l'URL pour l'affichage
  const safeUrl = dbUrl.replace(/:[^:@]+@/, ":****@");
  console.log(`📋 DATABASE_URL: ${safeUrl}\n`);

  const prisma = new PrismaClient({
    log: ["error", "warn"],
  });

  try {
    console.log("⏳ Tentative de connexion...");
    
    // Test simple: compter les utilisateurs
    const userCount = await prisma.user.count();
    
    console.log("✅ Connexion réussie!");
    console.log(`📊 Nombre d'utilisateurs dans la base: ${userCount}\n`);
    
    // Test de lecture
    const users = await prisma.user.findMany({
      take: 5,
      select: { id: true, email: true, fullName: true },
    });
    
    if (users.length > 0) {
      console.log("👥 Utilisateurs trouvés:");
      users.forEach((user) => {
        console.log(`   - ${user.email} (${user.fullName || "Sans nom"})`);
      });
    } else {
      console.log("ℹ️  Aucun utilisateur dans la base de données.");
    }
    
  } catch (error: any) {
    console.error("❌ ERREUR de connexion:\n");
    
    if (error.code === "ETIMEDOUT") {
      console.error("   Code: ETIMEDOUT (Timeout de connexion)");
      console.log("\n💡 Solutions possibles:");
      console.log("   1. Vérifiez que PostgreSQL est démarré:");
      console.log("      - Windows: Vérifiez dans les services");
      console.log("      - Linux/Mac: sudo systemctl start postgresql");
      console.log("   2. Vérifiez que le port dans DATABASE_URL est correct (par défaut: 5432)");
      console.log("   3. Vérifiez que le host est correct (localhost ou l'IP du serveur)");
    } else if (error.code === "ECONNREFUSED") {
      console.error("   Code: ECONNREFUSED (Connexion refusée)");
      console.log("\n💡 Solutions possibles:");
      console.log("   1. PostgreSQL n'est pas démarré");
      console.log("   2. Le port est incorrect");
      console.log("   3. Le firewall bloque la connexion");
    } else if (error.code === "P1001") {
      console.error("   Code: P1001 (Impossible d'atteindre le serveur)");
      console.log("\n💡 Vérifiez que PostgreSQL est accessible et que DATABASE_URL est correct");
    } else if (error.code === "P1000") {
      console.error("   Code: P1000 (Échec d'authentification)");
      console.log("\n💡 Vérifiez le nom d'utilisateur et le mot de passe dans DATABASE_URL");
    } else if (error.code === "3D000") {
      console.error("   Code: 3D000 (Base de données n'existe pas)");
      console.log("\n💡 Solutions:");
      console.log("   1. Créez la base de données:");
      console.log("      psql -U postgres");
      console.log("      CREATE DATABASE nom_de_ta_base;");
      console.log("   2. Ou exécutez: npx prisma migrate dev");
    } else {
      console.error(`   Code: ${error.code || "INCONNU"}`);
      console.error(`   Message: ${error.message}`);
    }
    
    console.error("\n📝 Détails de l'erreur:");
    console.error(error);
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("\n✅ Déconnexion de Prisma");
  }
}

testConnection();
