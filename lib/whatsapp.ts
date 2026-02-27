export const WHATSAPP_ADMIN = "237656966582"

export function getWhatsAppAbonnementUrl(userName?: string | null) {
  const message = userName
    ? `Bonjour, je m'appelle ${userName} et je voudrais m'abonner pour avoir accès aux épreuves payantes.`
    : `Bonjour, je voudrais m'abonner pour avoir accès aux épreuves payantes.`

  return `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(message)}`
}

export function getWhatsAppCommandeUrl(info: {
  nom: string
  telephone: string
  ville: string
  adresse?: string
  prix: number
}) {
  const message = `Bonjour, je souhaite souscrire à l'abonnement Miranda.

👤 Nom : ${info.nom}
📞 Téléphone : ${info.telephone}
🏙️ Ville : ${info.ville}
📍 Adresse : ${info.adresse || "Non renseignée"}
📦 Commande : Abonnement annuel Miranda
💰 Prix : ${info.prix.toLocaleString("fr-FR")} FCFA

Merci de confirmer ma commande.`

  return `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(message)}`
}
