"use client"

import { useState } from "react"
import { Eye, Download, FileCheck, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/Toast"

interface ExamCardProps {
    id?: string
    title: string
    subject: string
    year: number
    type: string
    isPaid?: boolean
    fileUrl: string
    correctionUrl?: string
    href?: string // URL pour la page de détail
}

export function ExamCard({ id, title, subject, year, type, isPaid = false, fileUrl, correctionUrl, href }: ExamCardProps) {
    const router = useRouter()
    const [showAuthMessage, setShowAuthMessage] = useState(false)

    const isAuthed = async () => {
        const res = await fetch("/api/me", { method: "GET" })
        return res.ok
    }

    const handleProtectedAction = async (action: () => void) => {
        const ok = await isAuthed()
        if (!ok) {
            setShowAuthMessage(true)
            const next = window.location.pathname
            router.push("/login?next=" + encodeURIComponent(next))
            return
        }
        action()
    }

    const handleView = () => {
        window.open(fileUrl, "_blank")
    }

    const handleCardClick = (e: React.MouseEvent) => {
        // Ne pas rediriger si on clique sur un bouton
        if ((e.target as HTMLElement).closest("button")) {
            return
        }
        if (href) {
            ;(async () => {
                const ok = await isAuthed()
                if (!ok) {
                    router.push("/login?next=" + encodeURIComponent(href))
                    return
                }
                router.push(href)
            })()
        }
    }

    return (
        <div 
            onClick={handleCardClick}
            className={cn(
                "bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                href && "cursor-pointer"
            )}
        >
            <div className="p-4 border-b bg-muted/40 flex justify-between items-start">
                <div className="space-y-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                        {type}
                    </span>
                    <h3 className="font-bold text-lg leading-tight line-clamp-2">{title}</h3>
                </div>
                <div className="text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded border">
                    {year}
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{subject}</span>
                    {isPaid && (
                        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded text-xs">
                            <Lock className="h-3 w-3" /> Premium
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                    {/* Action 1: Viewing (Always allowed for Free? Or always allowed? Spec says "View opens PDF in browser") */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            void handleProtectedAction(handleView)
                        }}
                        className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-xs font-medium"
                    >
                        <Eye className="h-5 w-5 mb-1" />
                        Voir
                    </button>

                    {/* Action 2: Download */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            void handleProtectedAction(() => window.open(fileUrl, "_blank"))
                        }}
                        className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-xs font-medium text-primary"
                    >
                        <Download className="h-5 w-5 mb-1" />
                        Télécharger
                    </button>

                    {/* Action 3: Correction */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            if (!correctionUrl) {
                                toast.info("Pas de correction disponible pour cette épreuve.")
                                return
                            }
                            void handleProtectedAction(() => window.open(correctionUrl, "_blank"))
                        }}
                        className={
                            `flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors text-xs font-medium ${correctionUrl
                                ? "hover:bg-accent hover:text-accent-foreground text-green-600"
                                : "opacity-50 cursor-not-allowed text-muted-foreground"
                            }`
                        }
                    >
                        <FileCheck className="h-5 w-5 mb-1" />
                        Corrigé
                    </button>
                </div>
            </div>
        </div>
    )
}
