"use client"

import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

type LogoutButtonProps = {
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const router = useRouter()

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ??
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 text-xs font-medium"
      }
    >
      {children ?? (
        <>
          <LogOut className="w-3.5 h-3.5" />
          Déconnexion
        </>
      )}
    </button>
  )
}
