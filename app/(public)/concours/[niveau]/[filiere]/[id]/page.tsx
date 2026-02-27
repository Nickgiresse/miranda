import { notFound } from "next/navigation"
import { ArrowLeft, Download, FileCheck, Eye } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getFiliereTheme } from "@/lib/filiere-theme"

// Mock Data for Concours
const concoursData = [
    { id: "c1", title: "Concours d'entrée 2023 - Mathématiques", subject: "Mathématiques", year: 2023, type: "CONCOURS", isPaid: false, fileUrl: "/demo.pdf", filiere: "inge", niveau: "niveau-1" },
    { id: "c2", title: "Culture Générale - Session 2022", subject: "Culture G", year: 2022, type: "CONCOURS", isPaid: true, fileUrl: "/demo.pdf", filiere: "sph", niveau: "niveau-1" },
]

export default async function ConcoursDetailPage(props: { params: Promise<{ niveau: string; filiere: string; id: string }> }) {
    const params = await props.params
    const { niveau, filiere, id } = params
    const theme = getFiliereTheme(filiere)

    const exam = concoursData.find(e => e.id === id && e.niveau === niveau && e.filiere === filiere)
    if (!exam) {
        notFound()
    }

    return (
        <div className={cn("min-h-screen", theme.pageBg)}>
            <div className="container mx-auto px-4 py-12">
                <Link href={`/concours/${niveau}/${filiere}`} className="text-sm font-medium text-black hover:text-primary flex items-center gap-1 mb-6">
                    <ArrowLeft className="h-4 w-4" /> Retour aux concours
                </Link>

                <div className="max-w-3xl mx-auto">
                    <div className="bg-card border rounded-2xl p-8 shadow-lg">
                        <div className="mb-6">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                                {exam.type}
                            </span>
                            <h1 className="text-3xl font-extrabold tracking-tight mt-4 mb-2 text-black">{exam.title}</h1>
                            <div className="flex items-center gap-4 text-black">
                                <span className="font-medium">{exam.subject}</span>
                                <span>•</span>
                                <span>{exam.year}</span>
                            </div>
                        </div>

                        <div className="border-t pt-6 space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={exam.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors",
                                        "bg-foreground text-primary hover:bg-foreground/90"
                                    )}
                                >
                                    <Eye className="h-5 w-5" />
                                    Voir le sujet
                                </a>
                                <a
                                    href={exam.fileUrl}
                                    download
                                    className={cn(
                                        "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors border",
                                        "bg-background hover:bg-muted"
                                    )}
                                >
                                    <Download className="h-5 w-5" />
                                    Télécharger
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}