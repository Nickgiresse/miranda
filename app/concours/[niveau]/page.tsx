import LevelPage from "@/app/epreuves/[niveau]/page";

// Resusing the same component logic, but Next.js needs a dedicated file for the route.
// We can just re-export or wrap. For simplicity and to allow future diverge, I'll copy the logic logic but change the title/routing context if needed.
// Actually, re-exporting the default export is the cleanest way if logic is identical.
// However, the hrefs in the FiliereCard need to point to /concours/... not /epreuves/... 

// So I will Duplicate the file content but change the href.
import { FiliereCard } from "@/components/filiere-card";
import { notFound } from "next/navigation";

const filieresData = [
    { code: "SPH", name: "Science Politique et Humanités", color: "green", description: "Droit, sociologie, histoire politique..." },
    { code: "IGC", name: "Ingénieur Génie Civil", color: "blue", description: "Construction, matériaux, structures..." },
    { code: "MF", name: "Management et Finance", color: "red", description: "Comptabilité, gestion, économie..." },
    { code: "IGEA", name: "Ingénieur Géosciences, Environnement", color: "bordeaux", description: "Géologie, agro-industrie, environnement..." },
    { code: "INGE", name: "Ingénieur Généraliste", color: "violet", description: "Maths, physique, informatique..." },
] as const;

export default async function ConcoursLevelPage(props: { params: Promise<{ niveau: string }> }) {
    const params = await props.params;

    if (!["niveau-1", "niveau-2"].includes(params.niveau)) {
        notFound();
    }

    const levelNumber = params.niveau.split("-")[1];
    const title = `Niveau ${levelNumber}`;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                    Concours - <span className="text-primary">{title}</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Préparez vos concours avec les meilleures ressources du Collège Mvong.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filieresData.map((filiere) => (
                    <FiliereCard
                        key={filiere.code}
                        code={`${filiere.code}${levelNumber}`}
                        name={filiere.name}
                        description={filiere.description}
                        color={filiere.color}
                        href={`/concours/${params.niveau}/${filiere.code.toLowerCase()}`}
                    />
                ))}
            </div>
        </div>
    );
}
