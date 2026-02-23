import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { EpreuveCard } from "@/components/EpreuveCard"
import { getFiliereTheme } from "@/lib/filiere-theme"
import { cn } from "@/lib/utils"

const TYPES_ORDER: Array<"CONCOURS" | "CC" | "SN" | "EPREUVE_SIMPLE"> = [
  "CONCOURS",
  "CC",
  "SN",
  "EPREUVE_SIMPLE",
]

const TYPE_LABELS: Record<string, string> = {
  CONCOURS: "Concours",
  CC: "CC",
  SN: "SN",
  EPREUVE_SIMPLE: "Épreuve simple",
}

export default async function EpreuvesFilierePage(props: {
  params: Promise<{ niveau: string; filiere: string }>
}) {
  const params = await props.params
  const { niveau, filiere } = params

  const niveauNum = parseInt(niveau.replace("niveau-", ""), 10)
  if (Number.isNaN(niveauNum) || (niveauNum !== 1 && niveauNum !== 2)) {
    notFound()
  }

  const filiereCode = filiere.toUpperCase()
  const theme = getFiliereTheme(filiere)

  const filiereNiveau = await prisma.filiereNiveau.findFirst({
    where: {
      filiere: { code: filiereCode },
      niveau: { numero: niveauNum },
    },
    include: { filiere: true, niveau: true },
  })

  if (!filiereNiveau) {
    notFound()
  }

  const epreuves = await prisma.epreuve.findMany({
    where: {
      filiereNiveauId: filiereNiveau.id,
      isPublished: true,
    },
    include: { matiere: true },
    orderBy: { createdAt: "desc" },
  })

  console.log("filiereNiveau trouvé:", filiereNiveau?.id)
  console.log("Nombre épreuves:", epreuves.length)

  const session = await auth()
  let isAbonne = false
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isSubscriptionActive: true, subscriptionEndDate: true },
    })
    isAbonne =
      !!user?.isSubscriptionActive &&
      !!user?.subscriptionEndDate &&
      new Date() < new Date(user.subscriptionEndDate)
  }

  const isConnected = !!session?.user?.id

  const byType = TYPES_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type] ?? type,
    epreuves: epreuves.filter((e) => e.type === type),
  }))

  return (
    <div className={cn("min-h-screen", theme.pageBg)}>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href={`/epreuves/${niveau}`}
            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux filières
          </Link>
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            Épreuves{" "}
            <span className={cn("font-extrabold", theme.accentText)}>
              {filiereNiveau.filiere.nom} ({filiereNiveau.filiere.code})
            </span>{" "}
            — <span className="text-primary">Niveau {niveauNum}</span>
          </h1>
          <p className="text-muted-foreground">{epreuves.length} épreuve(s) disponible(s)</p>
        </div>

        {epreuves.length === 0 ? (
          <p className="text-muted-foreground italic py-8">
            Aucune épreuve publiée pour cette filière et ce niveau.
          </p>
        ) : (
          <div className="space-y-12">
            {byType.map(
              ({ type, label, epreuves: list }) =>
                list.length > 0 && (
                  <section key={type}>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold">{label}</h2>
                      <div className="h-px bg-border flex-1" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {list.map((ep) => (
                        <EpreuveCard
                          key={ep.id}
                          epreuve={{
                            id: ep.id,
                            titre: ep.titre,
                            type: ep.type,
                            isGratuit: ep.isGratuit,
                            fichierEpreuve: ep.fichierEpreuve,
                            fichierCorrige: ep.fichierCorrige,
                            matiere: ep.matiere ? { nom: ep.matiere.nom } : null,
                          }}
                          isConnected={isConnected}
                          isAbonne={isAbonne}
                        />
                      ))}
                    </div>
                  </section>
                )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
