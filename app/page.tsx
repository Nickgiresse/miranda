import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, Users, FolderOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        -------------------------------------------
        SECTION 1: HERO (Image + Message + CTA) 
        -------------------------------------------
      */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-education.png"
            alt="Étudiants apprenant ensemble"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground font-medium text-sm mb-4">
            🎓 Votre succès commence ici
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Accédez aux meilleures <span className="text-primary">épreuves et corrections</span> pour exceller
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            La plateforme de référence pour les étudiants du Collège Mvong. Téléchargez des concours, devoirs et sujets d'examen pour préparer votre avenir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              Commencer maintenant <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/epreuves"
              className="px-8 py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Explorer les épreuves
            </Link>
          </div>
        </div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 2: COLLEGE MVONG (About) 
        -------------------------------------------
      */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">À propos de Miranda & Collège Mvong</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Née de l'excellence académique du <strong>Collège Mvong</strong>, cette application a été conçue pour offrir aux élèves un accès illimité aux ressources pédagogiques.
                Que vous soyez en Niveau 1 ou Niveau 2, nous centralisons toutes les épreuves passées pour faciliter vos révisions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span>Archives complètes de toutes les filières</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span>Corrections détaillées par des experts</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span>Accessible 24h/24 et 7j/7</span>
                </li>
              </ul>
              <div className="pt-4 flex gap-4">
                <Link href="/concours" className="text-primary font-medium hover:underline flex items-center gap-1">
                  Voir les Concours <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-muted">
              {/* Placeholder for College Image or Abstract Graphic */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
                <GraduationCap className="h-32 w-32 text-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 3: PRICING (Subscription) 
        -------------------------------------------
      */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Investissez dans votre réussite</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Un abonnement unique et abordable pour accéder à l'intégralité de notre bibliothèque numérique pendant toute l'année scolaire.
          </p>

          <div className="max-w-md mx-auto bg-background rounded-2xl shadow-xl overflow-hidden border transition-transform hover:-translate-y-1 duration-300">
            <div className="p-8">
              <div className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Accès Premium</div>
              <div className="flex items-baseline justify-center gap-1 mb-6">
                <span className="text-5xl font-extrabold">1 000</span>
                <span className="text-xl text-muted-foreground">FCFA / an</span>
              </div>

              <ul className="space-y-4 text-left mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Téléchargements illimités</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Accès à toutes les filières</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Sujets de Concours & Examens</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Mises à jour quotidiennes</span>
                </li>
              </ul>

              <Link href="/subscribe" className="block w-full py-3 px-6 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors">
                Je m'abonne maintenant
              </Link>
              <p className="text-xs text-muted-foreground mt-4">
                Paiement sécurisé via Mobile Money. Annulable à tout moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 4: CATEGORIES (Selection) 
        -------------------------------------------
      */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Explorez par Niveau</h2>
            <p className="text-muted-foreground">Choisissez votre niveau pour accéder aux matières et épreuves correspondantes.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Niveau 1 */}
            <Link href="/epreuves/niveau-1" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all border block">
              <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors" />
              <div className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FolderOpen className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">Niveau 1</h3>
                <p className="text-muted-foreground">
                  Accédez aux filières  SPH1, IGC1, MF1, IGEA1, INGE1
                </p>
                <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explorer <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* Niveau 2 */}
            <Link href="/epreuves/niveau-2" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all border block">
              <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors" />
              <div className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FolderOpen className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">Niveau 2</h3>
                <p className="text-muted-foreground">
                  Accédez aux filières SPH2, IGC2, MF2, IGEA2, INGE2
                </p>
                <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explorer <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 5: BONUS (Why Us) 
        -------------------------------------------
      */}
      <section className="py-20 bg-muted/30 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-12">Pourquoi des milliers d'étudiants nous font confiance ?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-10 w-10 text-primary mb-2" />
              <span className="text-3xl font-bold">500+</span>
              <span className="text-sm text-muted-foreground">Étudiants actifs</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <span className="text-3xl font-bold">1000+</span>
              <span className="text-sm text-muted-foreground">Épreuves disponibles</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-10 w-10 text-primary mb-2" />
              <span className="text-3xl font-bold">100%</span>
              <span className="text-sm text-muted-foreground">Fiabilité</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <GraduationCap className="h-10 w-10 text-primary mb-2" />
              <span className="text-3xl font-bold">24/7</span>
              <span className="text-sm text-muted-foreground">Accès illimité</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
