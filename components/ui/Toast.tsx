"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastData {
  id: string
  message: string
  type: ToastType
}

type Listener = (toasts: ToastData[]) => void
let toasts: ToastData[] = []
const listeners: Listener[] = []

function notify() {
  listeners.forEach((l) => l([...toasts]))
}

export const toast = {
  success: (message: string) => addToast(message, "success"),
  error: (message: string) => addToast(message, "error"),
  info: (message: string) => addToast(message, "info"),
  warning: (message: string) => addToast(message, "warning"),
}

function addToast(message: string, type: ToastType) {
  const id = Math.random().toString(36).slice(2)
  toasts = [...toasts, { id, message, type }]
  notify()
  setTimeout(() => removeToast(id), 4000)
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  notify()
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  warning: <AlertCircle className="w-5 h-5 text-orange-500" />,
}

const styles = {
  success: "border-green-200 bg-green-50 dark:bg-green-950/50 dark:border-green-800",
  error: "border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800",
  info: "border-blue-200 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-800",
  warning: "border-orange-200 bg-orange-50 dark:bg-orange-950/50 dark:border-orange-800",
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<ToastData[]>([])

  useEffect(() => {
    listeners.push(setCurrentToasts)
    return () => {
      const idx = listeners.indexOf(setCurrentToasts)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])

  if (currentToasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right-5 ${styles[t.type]}`}
        >
          {icons[t.type]}
          <p className="flex-1 text-sm text-gray-800 dark:text-gray-200 font-medium">
            {t.message}
          </p>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
