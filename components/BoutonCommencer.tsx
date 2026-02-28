"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"

export default function BoutonCommencer() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  if (session?.user) {
    return (
      <Link
        href="/epreuves"
        className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-700 text-white rounded-2xl font-semibold text-sm text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-block"
      >
        Explorer les épreuves →
      </Link>
    )
  }

  return (
    <Link
      href="/register"
      className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-700 text-white rounded-2xl font-semibold text-sm text-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 inline-block"
    >
      Commencer gratuitement →
    </Link>
  )
}
