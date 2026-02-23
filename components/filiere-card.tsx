import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface FiliereCardProps {
    code: string
    name: string
    description: string
    color: "green" | "blue" | "red" | "bordeaux" | "violet"
    // (Optionnel) Permet de forcer les couleurs via Tailwind classes
    // Ex: bgColor="bg-green-100" textColor="text-green-700"
    bgColor?: string
    textColor?: string
    href: string
}

const colorMap = {
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900",
    bordeaux: "bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-900",
}

export function FiliereCard({ code, name, description, color, bgColor, textColor, href }: FiliereCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group flex flex-col rounded-2xl hover:border transform hover:translate-x-[-100px] transition-all hover:shadow-lg hover:scale-[1.01] duration-500",
                // Responsive sizing
                "p-4 sm:p-6",
                "min-h-[220px] sm:min-h-[260px] lg:min-h-[300px]",
                // keep square-ish on large screens only
                "lg:aspect-square",
                // Colors (fallback to default card colors)
                bgColor ? bgColor : "bg-card",
                textColor ? textColor : "text-foreground",
                "border-border hover:border-primary/50"
            )}
        >
            <div
                className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold mb-4 border",
                    bgColor && textColor ? cn(bgColor, textColor) : colorMap[color]
                )}
            >
                {code.substring(0, 2)}
            </div>

            <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 transition-colors group-hover:text-primary">
                {code}{" "}
                <span className={cn("font-normal", textColor ? textColor : "text-muted-foreground", "text-sm sm:text-base")}>
                    - {name}
                </span>
            </h3>

            <p className={cn("text-xs sm:text-sm flex-1 mb-6", textColor ? "opacity-80" : "text-muted-foreground")}>
                {description}
            </p>

            <div
                className={cn(
                    "flex items-center w-max relative font-medium gap-1 rounded-[50px] transition-all duration-300",
                    // keep underline effect
                    "hover:after:w-full hover:after:scale-100 after:origin-left after:transition-all after:duration-700 after:scale-0 after:h-0.5 after:absolute after:bottom-0 after:left-0",
                    textColor ? textColor : "text-primary",
                    textColor ? "after:bg-current" : "after:bg-primary"
                )}
            >
                Voir les épreuves <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    )
}
