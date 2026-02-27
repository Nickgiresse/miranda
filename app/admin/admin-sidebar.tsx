"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "@/components/Logo"

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/epreuves", label: "Épreuves", icon: BookOpen },
  { href: "/admin/matieres", label: "Matières", icon: BookMarked },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
] as const

export function AdminSidebar({
  displayName,
  email,
}: {
  displayName: string
  email: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  const initial = (displayName || email || "A")[0].toUpperCase()

  return (
    <aside className="w-64 bg-white shadow-xl fixed h-full flex flex-col z-10">
      {/* Logo */}
      <div className="px-6 py-5">
        <div className="flex flex-col gap-1">
          <Logo href="/" width={100} height={32} />
          <p className="text-xs text-slate-400 pl-1">Administration</p>
        </div>
      </div>

      {/* Séparateur */}
      <div className="mx-4 h-px bg-slate-100 mb-4" />

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/admin/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-blue-600 bg-[#eff6ff]"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:translate-x-0.5"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-blue-600" : "group-hover:text-blue-600"
                )}
              />
              <span>{label}</span>
              <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-300" />
            </Link>
          )
        })}
      </nav>

      {/* Footer sidebar */}
      <div className="p-3 mt-auto">
        <div className="bg-slate-50 rounded-xl p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {displayName || "Admin"}
              </p>
              <p className="text-xs text-slate-400 truncate">{email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await signOut({ redirect: false })
              router.push("/login")
              router.refresh()
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 text-xs font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>
      </div>
    </aside>
  )
}
