"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Moon, Sun, Search, Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function Navbar() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const user = session?.user
    const fullName = (user as { name?: string })?.name ?? null
    const email = user?.email ?? null
    const isLoggedIn = status === "authenticated" && !!user
    const pathname = usePathname()
    const { setTheme, theme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close user menu when clicking outside
    React.useEffect(() => {
        if (!isUserMenuOpen) return
        
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.closest('[data-user-menu]')) {
                setIsUserMenuOpen(false)
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isUserMenuOpen])

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    const initials = React.useMemo(() => {
        const name = fullName?.toString?.()?.trim()
        if (!name) return "U"
        const parts = String(name).split(/\s+/).filter(Boolean)
        const first = parts[0]?.[0] ?? "U"
        const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ""
        return (first + last).toUpperCase()
    }, [fullName])

    const NavLink = ({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) => (
        <Link
            href={href}
            className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                active ? "text-primary" : "text-muted-foreground"
            )}
        >
            {children}
        </Link>
    )

    const DropdownLink = ({ title, items }: { title: string; items: { label: string; href: string }[] }) => {
        const [isOpen, setIsOpen] = React.useState(false)

        return (
            <div
                className="relative group"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    {title}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 pt-2 w-48 z-50">
                        <div className="bg-background/95 backdrop-blur-md border rounded-md shadow-lg p-2 flex flex-col gap-1">
                            {items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full h-20  transition-all duration-200",
            isScrolled ? "bg-background/80 backdrop-blur-md border-border" : "bg-transparent border-transparent"
        )}>
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Block 1: Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-primary-foreground">
                            <img src="/logo.png" alt=""  />
                        </div>
                        <span>Miranda</span>
                    </Link>
                </div>

                {/* Block 2: Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavLink href="/" active={pathname === "/"}>Accueil</NavLink>

                    {/* <DropdownLink
                        title="Epreuve Concours"
                        items={[
                            { label: "Niveau 1", href: "/concours/niveau-1" },
                            { label: "Niveau 2", href: "/concours/niveau-2" }
                        ]}
                    /> */}

                    <DropdownLink
                        title="Epreuve"
                        items={[
                            { label: "Niveau 1", href: "/epreuves/niveau-1" },
                            { label: "Niveau 2", href: "/epreuves/niveau-2" },
                            { label: "Toutes les épreuves", href: "/epreuves" }
                        ]}
                    />

                    <NavLink href="/contact" active={pathname === "/contact"}>Contact</NavLink>
                </nav>

                {/* Block 3: Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors" aria-label="Search">
                        <Search className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        {status === "loading" ? (
                            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                        ) : isLoggedIn ? (
                            <div className="relative" data-user-menu>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="h-10 w-10 rounded-full bg-foreground/10 border flex items-center justify-center font-bold text-sm hover:bg-foreground/20 transition-colors cursor-pointer"
                                    aria-label="Menu utilisateur"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    {initials}
                                </button>
                                
                                {isUserMenuOpen && (
                                    <div className="absolute top-12 right-0 z-50 w-56 bg-background/95 backdrop-blur-md border rounded-lg shadow-lg overflow-hidden">
                                        <div className="px-3 py-2 border-b border-border bg-muted/40">
                                            <p className="text-sm font-semibold truncate">{fullName || email || "Utilisateur"}</p>
                                            {email && (
                                                <p className="text-xs text-muted-foreground truncate">{email}</p>
                                            )}
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href="/profil"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                Mon compte
                                            </Link>
                                            {((user as { role?: string })?.role === "ADMIN" || (user as { role?: string })?.role === "SUPER_ADMIN") && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                                                    Dashboard Admin
                                                </Link>
                                            )}
                                        </div>
                                        <div className="border-t border-border py-1">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    await signOut({ redirect: false })
                                                    setIsUserMenuOpen(false)
                                                    router.push("/")
                                                    router.refresh()
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-none transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Se déconnecter
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                                    Connexion
                                </Link>
                                <Link href="/register" className="text-sm px-4 py-2 bg-foreground/10 text-primary font-bold hover:bg-foreground/20 transition-colors shadow-sm px-8 py-3 rounded-[60px]">
                                    Créer un compte
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-md hover:bg-accent transition-colors"
                        aria-label="Toggle theme"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 bg-background">
                    <nav className="flex flex-col gap-4">
                        <Link href="/" className="font-medium" onClick={toggleMenu}>Accueil</Link>
                        {/* <div className="flex flex-col gap-2 pl-4">
                            <span className="text-sm text-muted-foreground font-semibold">Concours</span>
                            <Link href="/concours/niveau-1" className="text-sm pl-2" onClick={toggleMenu}>Niveau 1</Link>
                            <Link href="/concours/niveau-2" className="text-sm pl-2" onClick={toggleMenu}>Niveau 2</Link>
                        </div> */}
                        <div className="flex flex-col gap-2 pl-4">
                            <span className="text-sm text-muted-foreground font-semibold">Épreuves</span>
                            <Link href="/epreuves/niveau-1" className="text-sm pl-2" onClick={toggleMenu}>Niveau 1</Link>
                            <Link href="/epreuves/niveau-2" className="text-sm pl-2" onClick={toggleMenu}>Niveau 2</Link>
                        </div>
                        <Link href="/contact" className="font-medium" onClick={toggleMenu}>Contact</Link>

                        <div className="border-t pt-4 flex flex-col gap-3">
                            {status === "loading" ? (
                                <div className="h-14 rounded-md bg-muted animate-pulse" />
                            ) : isLoggedIn ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-foreground/10 border flex items-center justify-center font-bold text-sm">
                                            {initials}
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-semibold leading-tight">{fullName || email || "Utilisateur"}</p>
                                            {email && <p className="text-xs text-muted-foreground">{email}</p>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Link
                                            href="/profil"
                                            onClick={toggleMenu}
                                            className="flex items-center gap-2 py-2 text-sm font-medium"
                                        >
                                            <User className="w-4 h-4" />
                                            Mon compte
                                        </Link>
                                        {((user as { role?: string })?.role === "ADMIN" || (user as { role?: string })?.role === "SUPER_ADMIN") && (
                                            <Link
                                                href="/admin/dashboard"
                                                onClick={toggleMenu}
                                                className="flex items-center gap-2 py-2 text-sm font-medium"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard Admin
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                await signOut({ redirect: false })
                                                setIsMenuOpen(false)
                                                router.push("/")
                                                router.refresh()
                                            }}
                                            className="flex items-center gap-2 py-2 text-sm text-destructive"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Se déconnecter
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link href="/login" className="text-center w-full py-2 border rounded-md" onClick={toggleMenu}>
                                        Connexion
                                    </Link>
                                    <Link href="/register" className="text-center w-full py-2 bg-primary text-primary-foreground rounded-md" onClick={toggleMenu}>
                                        Créer un compte
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
