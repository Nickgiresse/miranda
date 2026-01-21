import { ExamCard } from "@/components/exam-card";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock Data for Exams
const examsData = [
    // FREE EXAMS
    { id: "1", title: "Introduction au Droit Constitutionnel", subject: "Droit", year: 2024, type: "EPREUVE_SIMPLE", isPaid: false, fileUrl: "/demo.pdf", filiere: "sph", niveau: "niveau-1" },
    { id: "2", title: "Mathématiques Générales - Algèbre", subject: "Mathématiques", year: 2023, type: "CC", isPaid: false, fileUrl: "/demo.pdf", filiere: "inge", niveau: "niveau-1" },
    { id: "3", title: "Mécanique des Fluides - Session Normale", subject: "Physique", year: 2023, type: "SN", isPaid: false, fileUrl: "/demo.pdf", correctionUrl: "/correction.pdf", filiere: "igc", niveau: "niveau-2" },

    // PAID EXAMS
    { id: "4", title: "Comptabilité Analytique - Examen Final", subject: "Gestion", year: 2024, type: "SN", isPaid: true, fileUrl: "/demo.pdf", filiere: "mf", niveau: "niveau-1" },
    { id: "5", title: "Droit Administratif", subject: "Droit", year: 2022, type: "CC", isPaid: true, fileUrl: "/demo.pdf", filiere: "sph", niveau: "niveau-2" },
];

export default async function ExamListingPage(props: { params: Promise<{ niveau: string; filiere: string }> }) {
    const params = await props.params;
    const { niveau, filiere } = params;

    // Filter exams by Level and Filiere (This would be a DB call later)
    const filteredExams = examsData.filter(exam => exam.niveau === niveau && exam.filiere === filiere);

    // Group by category (Free vs Paid or by Subject - Requirement says: "Free first, then subjects")
    const freeExams = filteredExams.filter(e => !e.isPaid);
    const paidExams = filteredExams.filter(e => e.isPaid);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <Link href={`/epreuves/${niveau}`} className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="h-4 w-4" /> Retour aux filières
                </Link>
                <h1 className="text-3xl font-bold tracking-tight uppercase">
                    {filiere} - <span className="text-primary">{niveau.replace("-", " ")}</span>
                </h1>
                <p className="text-muted-foreground"> {filteredExams.length} épreuves disponibles</p>
            </div>

            {/* SECTION: GRATUIT */}
            <section className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold">Gratuit</h2>
                    <div className="h-px bg-border flex-1" />
                </div>

                {freeExams.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freeExams.map(exam => (
                            <ExamCard
                                key={exam.id}
                                title={exam.title}
                                subject={exam.subject}
                                year={exam.year}
                                type={exam.type}
                                isPaid={exam.isPaid}
                                fileUrl={exam.fileUrl}
                                correctionUrl={exam.correctionUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">Aucune épreuve gratuite disponible pour le moment.</p>
                )}
            </section>

            {/* SECTION: TOUTES LES EPREUVES (Paid/Subject) */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold">Bibliothèque Complète</h2>
                    <div className="h-px bg-border flex-1" />
                </div>

                {paidExams.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paidExams.map(exam => (
                            <ExamCard
                                key={exam.id}
                                title={exam.title}
                                subject={exam.subject}
                                year={exam.year}
                                type={exam.type}
                                isPaid={exam.isPaid}
                                fileUrl={exam.fileUrl}
                                correctionUrl={exam.correctionUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">Aucune autre épreuve disponible.</p>
                )}
            </section>
        </div>
    );
}
