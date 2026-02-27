"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import {
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Search,
} from "lucide-react"
import Logo from "@/components/Logo"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const displayName = (session?.user as { name?: string })?.name ?? session?.user?.email ?? "Utilisateur"
  const isAdmin =
    (session?.user as { role?: string })?.role === "ADMIN" ||
    (session?.user as { role?: string })?.role === "SUPER_ADMIN"

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/epreuves", label: "Épreuves" },
    // { href: "/concours", label: "Concours" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo href="/" width={50} height={36} />

          {/* Nav liens — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200 group"
              >
                {label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-4 h-0.5 bg-blue-600 rounded-full transition-all duration-200" />
              </Link>
            ))}
          </nav>

          {/* Droite */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4" />
            </button>

            {status === "loading" && (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            )}

            {status === "unauthenticated" && (
              <>
                <Link
                  href="/login"
                  className="hidden md:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold bg-slate-900 hover:bg-slate-700 text-white rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  Créer un compte
                </Link>
              </>
            )}

            {status === "authenticated" && session?.user && (
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                    {(displayName || "U")[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-slate-700">
                    {displayName?.split(" ")[0] ?? "Mon compte"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 bg-slate-50">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {session.user.email}
                      </p>
                    </div>

                    <div className="py-1.5 px-1.5">
                      <Link
                        href="/profil"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Mon compte
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard Admin
                        </Link>
                      )}
                    </div>

                    <div className="px-1.5 pb-1.5 border-t border-slate-100 pt-1.5">
                      <button
                        type="button"
                        onClick={async () => {
                          await signOut({ redirect: false })
                          setUserOpen(false)
                          router.push("/login")
                          router.refresh()
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all duration-150"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Menu burger mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all duration-200"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-0.5">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all duration-150"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
