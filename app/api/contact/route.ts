import { NextRequest, NextResponse } from "next/server"
import { isValidEmail } from "@/lib/validators"
import { WHATSAPP_ADMIN } from "@/lib/whatsapp"

export async function POST(req: NextRequest) {
  let body: { nom?: string; email?: string; sujet?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 })
  }

  const nom = body.nom?.trim()
  const email = (body.email as string)?.trim()
  const sujet = body.sujet?.trim()
  const message = body.message?.trim()

  if (!nom) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 })
  }

  if (!message) {
    return NextResponse.json({ error: "Message requis" }, { status: 400 })
  }

  const whatsappMsg =
    `Nouveau message de contact Miranda:\n\n` +
    `👤 Nom: ${nom}\n` +
    `📧 Email: ${email}\n` +
    `📌 Sujet: ${sujet || "Non précisé"}\n\n` +
    `💬 Message:\n${message}`

  return NextResponse.json({
    success: true,
    whatsapp: `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(whatsappMsg)}`,
  })
}
