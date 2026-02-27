import { NextResponse } from "next/server"
import { withDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/helpers"

// GET /api/admin/stats
export async function GET() {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  try {
    const [usersCount, filieresCount, epreuvesCount, downloadsCount, abonnementsActifs] =
      await withDB((db) =>
        Promise.all([
          db.user.count(),
          db.filiere.count(),
          db.epreuve.count({ where: { isPublished: true } }),
          db.download.count(),
          db.abonnement.count({
            where: { isActive: true, dateFin: { gte: new Date() } },
          }),
        ])
      )

    return NextResponse.json({
      users: usersCount,
      filieres: filieresCount,
      epreuves: epreuvesCount,
      downloads: downloadsCount,
      abonnementsActifs,
    })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
