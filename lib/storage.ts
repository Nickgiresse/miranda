import { supabaseAdmin } from "@/lib/supabase"

const BUCKET = "miranda-pdfs"

export async function uploadToStorage(
  file: File,
  folder: "epreuves" | "corriges"
): Promise<string> {
  const timestamp = Date.now()
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const path = `${folder}/${timestamp}_${cleanName}`

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: "application/pdf", upsert: false })

  if (error) {
    console.error("Storage upload error:", error)
    throw new Error("Erreur upload : " + error.message)
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFromStorage(publicUrl: string | null): Promise<void> {
  if (!publicUrl) return
  try {
    const marker = `/object/public/${BUCKET}/`
    const idx = publicUrl.indexOf(marker)
    if (idx === -1) return
    const path = publicUrl.slice(idx + marker.length)
    await supabaseAdmin.storage.from(BUCKET).remove([path])
  } catch (err) {
    console.warn("Storage delete error:", err)
  }
}
