import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const niveaux = [
  { id: "niveau-1", label: "Niveau 1", description: "Première année - Accédez aux épreuves et corrigés de votre filière." },
  { id: "niveau-2", label: "Niveau 2", description: "Deuxième année - Consultez les sujets et corrections pour vos révisions." },
] as const

export default function EpreuvesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 sm:mb-4 text-foreground">
          Choisissez votre niveau
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
          Sélectionnez votre niveau pour accéder aux épreuves et corrigés selon votre filière.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
        {niveaux.map((niveau) => (
          <Link
            key={niveau.id}
            href={`/epreuves/${niveau.id}`}
            className={cn(
              "group flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8",
              "min-h-[180px] sm:min-h-[200px]",
              "hover:border-primary/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
              {niveau.label}
            </h2>
            <p className="text-sm text-muted-foreground flex-1 mb-4">
              {niveau.description}
            </p>
            <span className="inline-flex items-center font-medium text-primary gap-1">
              Voir les filières <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
