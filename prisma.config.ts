import "dotenv/config"          // charge .env / .env.local
import { defineConfig } from "prisma/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const directUrl = process.env.DIRECT_URL
if (!directUrl) {
  throw new Error("DIRECT_URL manquant. Définis-le dans .env ou .env.local")
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: directUrl,             // plus de env("...")
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
})