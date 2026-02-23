"use client"

import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Contactez-nous</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Une question ? Une suggestion ? N'hésitez pas à nous écrire. Notre équipe est là pour vous aider.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Contact Information */}
                <div className="space-y-8">
                    <div className="bg-card border rounded-2xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Informations</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">Email</h3>
                                    <p className="text-muted-foreground">support@miranda.com</p>
                                    <p className="text-muted-foreground">admin@miranda.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">Téléphone</h3>
                                    <p className="text-muted-foreground">+237 600 00 00 00</p>
                                    <p className="text-sm text-muted-foreground">(Lun - Ven, 8h - 18h)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">Adresse</h3>
                                    <p className="text-muted-foreground">
                                        Collège Mvong<br />
                                        Yaoundé, Cameroun
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            Support Rapide
                        </h3>
                        <p className="text-muted-foreground">
                            Pour les problèmes techniques urgents concernant les téléchargements, veuillez nous contacter directement via WhatsApp au numéro indiqué.
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-card border rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Envoyer un message</h2>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Nom complet</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Votre nom"
                                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">Sujet</label>
                            <select
                                id="subject"
                                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option>Renseignement général</option>
                                <option>Problème technique</option>
                                <option>Partenariat</option>
                                <option>Autre</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <textarea
                                id="message"
                                rows={5}
                                placeholder="Votre message..."
                                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <Send className="h-4 w-4" /> Envoyer le message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
