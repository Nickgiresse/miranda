"use client"

import { useState } from "react"
import {
  Send,
  User,
  Mail,
  MessageSquare,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { toast } from "@/components/ui/Toast"
import { isValidEmail } from "@/lib/validators"
import { WHATSAPP_ADMIN } from "@/lib/whatsapp"

export default function ContactForm() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(form.email)) {
      toast.error("Adresse email invalide. Vérifiez le format.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? "Erreur lors de l'envoi.")
        return
      }
      setSent(true)
      toast.success("Message envoyé avec succès !")
      if (data.whatsapp) {
        window.open(data.whatsapp, "_blank")
      }
    } catch {
      toast.error("Erreur lors de l'envoi. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center justify-center text-center h-full gap-5">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Message envoyé !</h3>
          <p className="text-slate-500 text-sm mt-2">
            Nous vous répondrons dans les plus brefs délais.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSent(false)
            setForm({ nom: "", email: "", sujet: "", message: "" })
          }}
          className="text-sm text-slate-400 hover:text-slate-900 transition-colors duration-200"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-lg font-bold text-slate-900 mb-6">
        Envoyer un message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Nom complet
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                required
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Jean Dupont"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-300 transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={(e) => {
                  if (e.target.value && !isValidEmail(e.target.value)) {
                    toast.error("Format email invalide")
                  }
                }}
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                title="Format: nom@domaine.com"
                placeholder="vous@exemple.cm"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-300 transition-all duration-200"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Sujet
          </label>
          <input
            type="text"
            value={form.sujet}
            onChange={(e) => setForm({ ...form, sujet: e.target.value })}
            placeholder="Objet de votre message"
            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-300 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Message
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300" />
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Décrivez votre demande..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-300 transition-all duration-200 resize-none"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Envoyer le message
            </>
          )}
        </button>
        <p className="text-xs text-center text-slate-400">
          Vous pouvez aussi nous contacter directement sur{" "}
          <a
            href={`https://wa.me/${WHATSAPP_ADMIN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline font-medium"
          >
            WhatsApp
          </a>
        </p>
      </form>
    </div>
  )
}
