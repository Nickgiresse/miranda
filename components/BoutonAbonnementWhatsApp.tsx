"use client"

import { getWhatsAppAbonnementUrl } from "@/lib/whatsapp"
import { MessageCircle } from "lucide-react"

type BoutonAbonnementWhatsAppProps = {
  userName?: string | null
}

export function BoutonAbonnementWhatsApp({ userName }: BoutonAbonnementWhatsAppProps) {
  const displayName = userName ?? null

  return (
    <a
      href={getWhatsAppAbonnementUrl(displayName)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <MessageCircle className="w-4 h-4" />
      S&apos;abonner via WhatsApp
    </a>
  )
}
