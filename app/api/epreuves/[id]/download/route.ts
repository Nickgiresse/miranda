import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { withDB } from "@/lib/db"
import { getWhatsAppAbonnementUrl } from "@/lib/whatsapp"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const body = await request.json().catch(() => ({}))
  const type = (body.type as string)?.toLowerCase() === "corrige" ? "corrige" : "epreuve"

  const { id } = await params

  const epreuve = await withDB((db) =>
    db.epreuve.findUnique({
      where: { id, isPublished: true },
    })
  )

  if (!epreuve) {
    return NextResponse.json(
      { error: "Épreuve introuvable" },
      { status: 404 }
    )
  }

  if (type === "corrige" && !epreuve.fichierCorrige) {
    return NextResponse.json(
      { error: "Aucun corrigé disponible" },
      { status: 404 }
    )
  }

  const url = type === "corrige" ? epreuve.fichierCorrige! : epreuve.fichierEpreuve

  if (epreuve.isGratuit) {
    return NextResponse.json({ url })
  }

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        error: "Connectez-vous pour accéder à cette épreuve",
        redirect: "/login",
      },
      { status: 401 }
    )
  }

  const user = await withDB((db) =>
    db.user.findUnique({
      where: { id: session.user.id },
      select: { isSubscriptionActive: true, subscriptionEndDate: true },
    })
  )

  const abonnementActif =
    user?.isSubscriptionActive === true &&
    user?.subscriptionEndDate !== null &&
    new Date() < new Date(user.subscriptionEndDate!)

  if (!abonnementActif) {
    return NextResponse.json(
      {
        error: "Un abonnement actif est requis",
        whatsapp: getWhatsAppAbonnementUrl(),
      },
      { status: 403 }
    )
  }

  await withDB((db) =>
    db.download.create({
      data: {
        userId: session.user.id,
        epreuveId: id,
        type: type === "corrige" ? "CORRIGE" : "EPREUVE",
      },
    })
  )

  return NextResponse.json({ url })
}
