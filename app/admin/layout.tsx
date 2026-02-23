import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Users,
  Settings,
} from "lucide-react"
import { requireAdmin } from "@/lib/auth/helpers"
import { LogoutButton } from "@/app/admin/logout-button"

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/epreuves", icon: BookOpen, label: "Épreuves" },
  { href: "/admin/matieres", icon: BookMarked, label: "Matières" },
  { href: "/admin/utilisateurs", icon: Users, label: "Utilisateurs" },
  { href: "/admin/settings", icon: Settings, label: "Paramètres" },
] as const

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session
  try {
    session = await requireAdmin()
  } catch (e) {
    if (e instanceof Response) redirect("/login")
    throw e
  }

  const displayName = session.user.name ?? session.user.email ?? "Admin"

  return (
    <div className="min-h-screen flex">
      {/* Sidebar fixe */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col border-r border-border bg-white dark:bg-background">
        {/* Logo + titre */}
        <div className="flex items-center gap-2 p-6 border-b border-border">
          <div className="relative h-8 w-8 flex-shrink-0">
            <Image src="/logo.png" alt="Miranda" fill className="object-contain" />
          </div>
          <span className="font-semibold text-foreground">Interface Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Utilisateur + déconnexion */}
        <div className="p-4 border-t border-border space-y-2">
          <p className="text-sm font-medium text-foreground truncate px-2" title={displayName}>
            {displayName}
          </p>
          <LogoutButton />
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
