import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  nom: z.string().max(200).optional(),
  email: z.string().email(),
  sujet: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
})

// POST /api/contact - envoi message (à brancher sur email / service)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = contactSchema.parse(body)

    // TODO: envoyer email via Resend, SendGrid, etc. avec data.email, data.sujet, data.message
    // pour l'instant on simule le succès
    console.log("[Contact]", data)

    return NextResponse.json({
      success: true,
      message: "Votre message a bien été envoyé.",
    })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
