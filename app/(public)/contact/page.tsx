import { withDB } from "@/lib/db"
import { Mail, MapPin, MessageCircle, Clock } from "lucide-react"
import ContactForm from "@/components/ContactForm"

export default async function ContactPage() {
  const settings = await withDB((db) => db.systemSettings.findFirst())

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
            Contact
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Nous contacter
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Une question ? Un problème ? Notre équipe vous répond rapidement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <a
              href="https://wa.me/237690021434"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 transition-all duration-200">
                <MessageCircle className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">WhatsApp</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  +237 690 021 434
                </p>
                <p className="text-xs text-slate-400 mt-1">Réponse rapide</p>
              </div>
            </a>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Email</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {settings?.contactEmail ?? "contact@miranda.cm"}
                </p>
                <p className="text-xs text-slate-400 mt-1">Réponse sous 24h</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Adresse</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {settings?.contactAdresse ?? "Collège Mvong, Cameroun"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Horaires</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Lun – Ven : 08h – 17h
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Heure de Yaoundé (WAT)
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
