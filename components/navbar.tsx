"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Monitor, Moon, Sun, Search, User, Menu, X, ChevronDown, BookOpen, GraduationCap } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

// Minimal auth check placeholder until we have session provider in client wrapper
// For full implementation, wrap app with SessionProvider and useSession()
const useAuth = () => {
    return { isAuthenticated: false }
}

export function Navbar() {
    const pathname = usePathname()
    const { setTheme, theme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

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
            "sticky top-0 z-50 w-full border-b transition-all duration-200",
            pathname.includes("/admin") ? "hidden" : "", // Hide on admin pages if we use same layout, but layouts should separate.
            isScrolled ? "bg-background/80 backdrop-blur-md border-border" : "bg-transparent border-transparent"
        )}>
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Block 1: Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <span>Miranda</span>
                    </Link>
                </div>

                {/* Block 2: Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavLink href="/" active={pathname === "/"}>Accueil</NavLink>

                    <DropdownLink
                        title="Epreuve Concours"
                        items={[
                            { label: "Niveau 1", href: "/concours/niveau-1" },
                            { label: "Niveau 2", href: "/concours/niveau-2" }
                        ]}
                    />

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
                        {/* For now static. Real auth needs Session check */}
                        <Link href="/login" className="text-sm font-medium px-4 py-2 hover:bg-accent rounded-md transition-colors">
                            Se connecter
                        </Link>
                        <Link href="/register" className="text-sm font-medium px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                            Créer un compte
                        </Link>
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
                        <div className="flex flex-col gap-2 pl-4">
                            <span className="text-sm text-muted-foreground font-semibold">Concours</span>
                            <Link href="/concours/niveau-1" className="text-sm pl-2" onClick={toggleMenu}>Niveau 1</Link>
                            <Link href="/concours/niveau-2" className="text-sm pl-2" onClick={toggleMenu}>Niveau 2</Link>
                        </div>
                        <div className="flex flex-col gap-2 pl-4">
                            <span className="text-sm text-muted-foreground font-semibold">Épreuves</span>
                            <Link href="/epreuves/niveau-1" className="text-sm pl-2" onClick={toggleMenu}>Niveau 1</Link>
                            <Link href="/epreuves/niveau-2" className="text-sm pl-2" onClick={toggleMenu}>Niveau 2</Link>
                        </div>
                        <Link href="/contact" className="font-medium" onClick={toggleMenu}>Contact</Link>

                        <div className="border-t pt-4 flex flex-col gap-3">
                            <Link href="/login" className="text-center w-full py-2 border rounded-md" onClick={toggleMenu}>
                                Se connecter
                            </Link>
                            <Link href="/register" className="text-center w-full py-2 bg-primary text-primary-foreground rounded-md" onClick={toggleMenu}>
                                Créer un compte
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
