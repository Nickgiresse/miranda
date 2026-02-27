// Resusing the same component logic, but Next.js needs a dedicated file for the route.
// We can just re-export or wrap. For simplicity and to allow future diverge, I'll copy the logic logic but change the title/routing context if needed.
// Actually, re-exporting the default export is the cleanest way if logic is identical.
// However, the hrefs in the FiliereCard need to point to /concours/... not /epreuves/... 

// So I will Duplicate the file content but change the href.
import { FiliereCard } from "@/components/filiere-card";
import { notFound } from "next/navigation";

const filieresData = [
    { code: "SPH", name: "Science Politique et Humanités", color: "green",bgColor: "bg-green-100", textColor: "text-green-700",  description: "Droit, sociologie, histoire politique..." },
    { code: "IGC", name: "Ingénieur Génie Civil", color: "blue",bgColor: "bg-blue-100", textColor: "text-blue-700", description: "Construction, matériaux, structures..." },
    { code: "MF", name: "Management et Finance", color: "red",bgColor: "bg-red-100", textColor: "text-red-700", description: "Comptabilité, gestion, économie..." },
    { code: "IGEA", name: "Ingénieur Géosciences, Environnement", color: "bordeaux",bgColor: "bg-rose-100", textColor: "text-rose-700", description: "Géologie, agro-industrie, environnement..." },
    { code: "INGE", name: "Ingénieur Généraliste", color: "violet",bgColor: "bg-violet-100", textColor: "text-violet-700", description: "Maths, physique, informatique..." },
] as const;

export default async function ConcoursLevelPage(props: { params: Promise<{ niveau: string }> }) {
    const params = await props.params;

    if (!["niveau-1", "niveau-2"].includes(params.niveau)) {
        notFound();
    }

    const levelNumber = params.niveau.split("-")[1];
    const title = `Niveau ${levelNumber}`;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="mb-8 sm:mb-12 text-center">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 sm:mb-4">
                    Concours - <span className="text-primary">{title}</span>
                </h1>
                <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
                    Préparez vos concours avec les meilleures ressources du Collège Vogt.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 p-4 sm:p-6">
                {filieresData.map((filiere) => (
                    <FiliereCard
                        key={filiere.code}
                        code={`${filiere.code}${levelNumber}`}
                        name={filiere.name}
                        description={filiere.description}
                        color={filiere.color}
                        bgColor={filiere.bgColor}
                        textColor={filiere.textColor}
                        href={`/concours/${params.niveau}/${filiere.code.toLowerCase()}`}
                    />
                ))}
            </div>
        </div>
    );
}
