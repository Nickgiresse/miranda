import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface FiliereCardProps {
    code: string
    name: string
    description: string
    color: "green" | "blue" | "red" | "bordeaux" | "violet"
    href: string
}

const colorMap = {
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900",
    bordeaux: "bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-900",
}

export function FiliereCard({ code, name, description, color, href }: FiliereCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group flex flex-col p-6 rounded-2xl border transition-all hover:shadow-lg hover:scale-[1.02]",
                "bg-card", // Default background
                "hover:border-primary/50"
            )}
        >
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mb-4", colorMap[color])}>
                {code.substring(0, 2)}
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {code} <span className="text-muted-foreground font-normal text-base">- {name}</span>
            </h3>

            <p className="text-muted-foreground text-sm flex-1 mb-6">
                {description}
            </p>

            <div className="flex items-center text-sm font-medium text-primary mt-auto">
                Voir les épreuves <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    )
}
