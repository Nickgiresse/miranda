"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, Users, FolderOpen } from "lucide-react";
import { getWhatsAppAbonnementUrl } from "@/lib/whatsapp";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const viewportOnce = { once: true, amount: 0.2 };

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        -------------------------------------------
        SECTION 1: HERO (Image + Message + CTA) 
        -------------------------------------------
      */}
      <section className="relative p-20 md:py-30  flex flex-rows items-center justify-center text-white overflow-hidden  md:flex-cols flex-row">
        {/* Background Overlay */}
        {/* <div className="absolute inset-0 z-0">
          <Image
            src="/hero-education.png"
            alt="Étudiants apprenant ensemble"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div> */}

        {/* Content */}
        <motion.div
          className="relative  px-4 text-center md:text-left"
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="inline-block px-4 py-1.5 rounded-full  bg-foreground/10  backdrop-blur-md  text-primary font-medium text-sm mb-4"
          >
            🎓 Votre succès commence ici
          </motion.div>
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl text-foreground"
          >
            Accédez aux meilleures <span className="text-foreground">épreuves et corrections</span> pour exceller
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl "
          >
            La plateforme de référence pour les étudiants du Collège Mvong. Téléchargez des concours, devoirs et sujets d'examen pour préparer votre avenir.
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4  pt-4"
          >
            <Link
              href="/register"
              className="px-8 py-3.5 bg-foreground text-primary font-semibold rounded-lg hover:bg-foreground/90 transition-all flex items-center justify-center gap-2  "
            >
              Commencer maintenant <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/epreuves"
              className="px-8 py-3.5 bg-foreground/10 backdrop-blur-md text-foreground font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Explorer les épreuves
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className=""
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <Image src="/hero.jpg" alt="Étudiants apprenant ensemble" width={540} height={240} className="rounded-2xl w-100 md:w-150" />
        </motion.div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 2: COLLEGE MVONG (About) 
        -------------------------------------------
      */}
      <section className="py-20 bg-gray-900 flex flex-row items-center p-20 md:p-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white">À propos de Miranda & Collège Vogt</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Née de l'excellence académique du <strong>Collège Mvong</strong>, cette application a été conçue pour offrir aux élèves un accès illimité aux ressources pédagogiques.
                Que vous soyez en Niveau 1 ou Niveau 2, nous centralisons toutes les épreuves passées pour faciliter vos révisions.
              </p>
              <ul className="space-y-3 text-white">
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
              <div className="pt-4 flex gap-4 ">
                <Link href="/concours" className="relative font-medium flex hover:scale-105 items-center gap-1 text-white hover:after:w-full hover:after:scale-100 after:origin-center after:transition-all after:duration-900 after:scale-0 after:h-0.5 after:bg-white after:absolute after:bottom-0 after:left-0 rounded-[50px]  transition-all duration-300">
                  Voir les Concours <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-muted"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Placeholder for College Image or Abstract Graphic */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-transparent flex items-center justify-center">
                <GraduationCap className="h-32 w-32 text-foreground" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 3: PRICING (Subscription) 
        -------------------------------------------
      */}
      <section className="py-20  flex flex-row items-center justify-center  p-20 md:p-50">
        <div className="container mx-auto  text-center">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight mb-4"
          >
            Investissez dans votre réussite
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Un abonnement unique et abordable pour accéder à l'intégralité de notre bibliothèque numérique pendant toute l'année scolaire.
          </motion.p>

          <motion.div
            className="max-w-md mx-auto bg-background rounded-2xl shadow-xl overflow-hidden shadow-foreground/10 transition-transform hover:-translate-y-1 duration-300"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="p-8">
              <div className="text-sm font-medium text-primary mb-2 uppercase tracking-wide pb-[10%]">Accès Premium</div>
              <div className="flex items-baseline justify-center gap-1 mb-6 py-[15%] text-center bg-foreground/10 rounded-2xl p-4">
                <span className="text-5xl font-extrabold ">1 000</span>
                <span className="text-xl text-muted-foreground">FCFA / an</span>
              </div>

              <a
                href={getWhatsAppAbonnementUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-1.5 px-4 text-center bg-primary text-white font-bold rounded-[10px] hover:bg-primary/90 transition-colors bg-foreground/10 border-primary"
              >
                Je m&apos;abonne maintenant
              </a>
              <ul className="space-y-4 text-left mb-8 p-[5%]">
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

              <p className="text-xs text-muted-foreground mt-4">
                Paiement sécurisé via Mobile Money. Annulable à tout moment.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 4: CATEGORIES (Selection) 
        -------------------------------------------
      */}
      <section className="py-20 bg-background  flex flex-row items-center justify-center p-20 md:p-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">Explorez par Niveau</h2>
            <p className="text-muted-foreground">Choisissez votre niveau pour accéder aux matières et épreuves correspondantes.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Niveau 1 */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Link href="/epreuves/niveau-1" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all shadow-foreground/10 block">
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
            </motion.div>

            {/* Niveau 2 */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            >
              <Link href="/epreuves/niveau-2" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all shadow-foreground/10 block">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 5: BONUS (Why Us) 
        -------------------------------------------
      */}
      <section className="py-20 bg-gray-800 text-white p-20 md:p-50 ">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-2xl font-bold mb-12"
          >
            Pourquoi des milliers d'étudiants nous font confiance ?
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
            <motion.div
              className="flex flex-col items-center gap-2 bg-background text-foreground rounded-2xl p-4  hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Users className="h-10 w-10 text-primary mb-2" />
              <span className="text-3xl font-bold">500+</span>
              <span className="text-sm text-muted-foreground">Étudiants actifs</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-2 bg-background text-foreground rounded-2xl p-4  hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            >
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <span className="text-3xl font-bold">1000+</span>
              <span className="text-sm text-muted-foreground">Épreuves disponibles</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-2 bg-background text-foreground rounded-2xl p-4  hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              <CheckCircle className="h-10 w-10 text-primary mb-2" />
              <span className="text-3xl font-bold">100%</span>
              <span className="text-sm text-muted-foreground">Fiabilité</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-2 bg-background text-foreground rounded-2xl p-4  hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            >
              <GraduationCap className="h-10 w-10 text-primary mb-2" />
              <span className="text-3xl font-bold">24/7</span>
              <span className="text-sm text-muted-foreground">Accès illimité</span>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
