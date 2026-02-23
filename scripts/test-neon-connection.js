/**
 * Script simple pour tester la connexion à Neon
 * Utilisation: node scripts/test-neon-connection.js
 */

require("dotenv/config");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL n'est pas défini dans .env");
  process.exit(1);
}

console.log("🔍 Test de connexion à Neon...\n");

// Masquer le mot de passe dans l'URL
const safeUrl = connectionString.replace(/:[^:@]+@/, ":****@");
console.log(`📋 URL: ${safeUrl}\n`);

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 10000, // 10 secondes
  ssl: connectionString.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
});

async function testConnection() {
  try {
    console.log("⏳ Tentative de connexion (timeout: 10s)...");
    
    const client = await pool.connect();
    console.log("✅ Connexion réussie!\n");
    
    // Test simple
    const result = await client.query("SELECT NOW() as current_time, version() as pg_version");
    console.log("📊 Informations de la base:");
    console.log(`   - Heure serveur: ${result.rows[0].current_time}`);
    console.log(`   - Version PostgreSQL: ${result.rows[0].pg_version.split(" ")[0]} ${result.rows[0].pg_version.split(" ")[1]}\n`);
    
    // Test de la table User
    try {
      const userCount = await client.query("SELECT COUNT(*) as count FROM \"User\"");
      console.log(`👥 Nombre d'utilisateurs: ${userCount.rows[0].count}`);
    } catch (e) {
      console.log("ℹ️  La table User n'existe pas encore (normal si les migrations n'ont pas été appliquées)");
    }
    
    client.release();
    console.log("\n✅ Test terminé avec succès!");
    
  } catch (error) {
    console.error("\n❌ ERREUR de connexion:\n");
    
    if (error.code === "ETIMEDOUT") {
      console.error("   Code: ETIMEDOUT (Timeout de connexion)");
      console.log("\n💡 Solutions possibles:");
      console.log("   1. Vérifiez votre connexion Internet");
      console.log("   2. Vérifiez que Windows Defender / Antivirus ne bloque pas Node.js");
      console.log("   3. Essayez l'URL DIRECTE (sans pooler) depuis le dashboard Neon:");
      console.log("      - Va sur https://console.neon.tech");
      console.log("      - Sélectionne ton projet");
      console.log("      - Va dans 'Connection Details'");
      console.log("      - Copie l'URL 'Direct connection' (pas 'Pooler')");
      console.log("      - Remplace DATABASE_URL dans .env par cette URL");
      console.log("   4. Vérifiez que le projet Neon n'est pas en pause/idle");
    } else if (error.code === "ECONNREFUSED") {
      console.error("   Code: ECONNREFUSED (Connexion refusée)");
      console.log("\n💡 Le serveur refuse la connexion. Vérifiez:");
      console.log("   - Que le projet Neon est actif (pas en pause)");
      console.log("   - Que l'URL de connexion est correcte");
    } else if (error.code === "ENOTFOUND") {
      console.error("   Code: ENOTFOUND (DNS non résolu)");
      console.log("\n💡 Le nom de domaine ne peut pas être résolu.");
      console.log("   Vérifiez votre connexion Internet et votre DNS.");
    } else {
      console.error(`   Code: ${error.code || "INCONNU"}`);
      console.error(`   Message: ${error.message}`);
    }
    
    console.error("\n📝 Détails complets:");
    console.error(error);
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
