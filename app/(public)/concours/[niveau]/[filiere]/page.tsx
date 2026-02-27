import { ExamCard } from "@/components/exam-card";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getFiliereTheme } from "@/lib/filiere-theme";

// Mock Data for Concours (Distinct from Exams potentially)
const concoursData = [
    { id: "c1", title: "Concours d'entrée 2023 - Mathématiques", subject: "Mathématiques", year: 2023, type: "CONCOURS", isPaid: false, fileUrl: "/demo.pdf", filiere: "inge", niveau: "niveau-1" },
    { id: "c2", title: "Culture Générale - Session 2022", subject: "Culture G", year: 2022, type: "CONCOURS", isPaid: true, fileUrl: "/demo.pdf", filiere: "sph", niveau: "niveau-1" },
];

export default async function ConcoursListingPage(props: { params: Promise<{ niveau: string; filiere: string }> }) {
    const params = await props.params;
    const { niveau, filiere } = params;
    const theme = getFiliereTheme(filiere);

    // Filter 
    const filteredExams = concoursData.filter(exam => exam.niveau === niveau && exam.filiere === filiere);
    const freeExams = filteredExams.filter(e => !e.isPaid);
    const paidExams = filteredExams.filter(e => e.isPaid);

    return (
        <div className={cn("min-h-screen", theme.pageBg)}>
            <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <Link href={`/concours/${niveau}`} className="text-sm font-medium text-black hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="h-4 w-4" /> Retour aux filières
                </Link>
                <h1 className="text-3xl font-bold tracking-tight uppercase text-black">
                    Concours <span className={cn("font-extrabold", theme.accentText)}>{theme.label}</span> - <span className="text-primary">{niveau.replace("-", " ")}</span>
                </h1>
                <p className="text-black"> {filteredExams.length} sujets disponibles</p>
            </div>

            <section className="mb-12 text-black">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold">Gratuit</h2>
                    <div className="h-px bg-border flex-1" />
                </div>

                {freeExams.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freeExams.map(exam => (
                            <ExamCard
                                key={exam.id}
                                id={exam.id}
                                title={exam.title}
                                subject={exam.subject}
                                year={exam.year}
                                type={exam.type}
                                isPaid={exam.isPaid}
                                fileUrl={exam.fileUrl}
                                href={`/concours/${niveau}/${filiere}/${exam.id}`}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">Aucun sujet gratuit disponible.</p>
                )}
            </section>

            <section className="text-black">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold">Premium</h2>
                    <div className="h-px bg-border flex-1" />
                </div>

                {paidExams.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paidExams.map(exam => (
                            <ExamCard
                                key={exam.id}
                                id={exam.id}
                                title={exam.title}
                                subject={exam.subject}
                                year={exam.year}
                                type={exam.type}
                                isPaid={exam.isPaid}
                                fileUrl={exam.fileUrl}
                                href={`/concours/${niveau}/${filiere}/${exam.id}`}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">Aucun sujet premium disponible.</p>
                )}
            </section>
            </div>
        </div>
    );
}
