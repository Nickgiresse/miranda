"use client"

export const AUTH_STORAGE_KEY = "miranda_is_authenticated"

export function isClientAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true"
}

export function setClientAuthenticated(value: boolean) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(AUTH_STORAGE_KEY, value ? "true" : "false")
}

