export type FiliereSlug = "sph" | "igc" | "mf" | "igea" | "inge"

type FiliereTheme = {
  label: string
  pageBg: string
  accentText: string
}

const THEMES: Record<FiliereSlug, FiliereTheme> = {
  sph: { label: "SPH", pageBg: "bg-green-100", accentText: "text-green-700" },
  igc: { label: "IGC", pageBg: "bg-blue-100", accentText: "text-blue-700" },
  mf: { label: "MF", pageBg: "bg-red-100", accentText: "text-red-700" },
  igea: { label: "IGEA", pageBg: "bg-rose-100", accentText: "text-rose-700" },
  inge: { label: "INGE", pageBg: "bg-violet-100", accentText: "text-violet-700" },
}

export function getFiliereTheme(filiere: string): FiliereTheme {
  const key = filiere.toLowerCase() as FiliereSlug
  return THEMES[key] ?? { label: filiere.toUpperCase(), pageBg: "bg-background", accentText: "text-primary" }
}

