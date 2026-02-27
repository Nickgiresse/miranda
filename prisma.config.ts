import "dotenv/config"          // charge .env / .env.local
import { defineConfig } from "prisma/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const directUrl = process.env.DIRECT_URL
if (!directUrl) {
  throw new Error("DIRECT_URL manquant. Définis-le dans .env ou .env.local")
}

// migrate.adapter est supporté à l'exécution par Prisma CLI mais pas exposé dans le type PrismaConfig (v7)
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: directUrl,
  },
  migrate: {
    async adapter() {
      const pool = new Pool({
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false },
        max: 1,
        connectionTimeoutMillis: 20000,
      })
      return new PrismaPg(pool)
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any)