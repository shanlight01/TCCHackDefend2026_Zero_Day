import Link from "next/link";
import { notFound } from "next/navigation";
import careersData from "@/data/careers.json";
import roadmapsData from "@/data/roadmaps.json";
import universitiesData from "@/data/universities.json";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const career = careersData.careers.find((c) => c.id === id);
  if (!career) return notFound();

  const roadmap = roadmapsData.roadmaps.find((r) => r.career_id === id);
  if (!roadmap) return notFound();

  const recommendedUniversities = universitiesData.filter((u) =>
    roadmap.related_universities.includes(u.id)
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/recommendations"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Retour aux recommandations
        </Link>
        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {career.secteur}
            </span>
            <h1 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              {career.nom_metier}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {career.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content: Roadmap */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Section: Aperçu du métier (Context & Salary) */}
          {(career as any).contexte_togo && (
            <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
              <h2 className="text-xl font-semibold text-foreground">Aperçu du métier au Togo</h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Demande sur le marché</p>
                  <p className="mt-1 font-medium text-foreground">{(career as any).demande_marche}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Salaire débutant estimé</p>
                  <p className="mt-1 font-medium text-foreground">{(career as any).salaire_debutant}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-4 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contexte Togolais</p>
                  <p className="mt-1 text-sm text-foreground leading-relaxed">{(career as any).contexte_togo}</p>
                </div>
              </div>
            </section>
          )}

          {/* Section: Formations requises */}
          {(career as any).formations_requises && (
            <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
              <h2 className="text-xl font-semibold text-foreground">Formations recommandées</h2>
              <ul className="mt-4 space-y-2">
                {(career as any).formations_requises.map((formation: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                    <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formation}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Section: Skills */}
          <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold text-foreground">
              Compétences clés à acquérir
            </h2>
            <ul className="mt-6 space-y-4">
              {roadmap.competences_cles.map((skill, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <span className="text-foreground">{skill}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section: Subjects */}
          <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold text-foreground">
              Matières importantes au lycée
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {roadmap.matieres_importantes.map((matiere, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground"
                >
                  {matiere}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Concentre-toi sur ces matières pour maximiser tes chances de réussite dans cette filière.
            </p>
          </section>
        </div>

        {/* Sidebar: Universities */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-muted/50 p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Où étudier au Togo ?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Établissements recommandés pour cette carrière :
            </p>

            <div className="mt-6 space-y-4">
              {recommendedUniversities.map((uni) => (
                <Link
                  key={uni.id}
                  href={`/universities?search=${encodeURIComponent(uni.name)}`}
                  className="group block rounded-xl border border-border bg-white p-4 transition-all hover:border-primary hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      {uni.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={uni.logo}
                          alt=""
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                          {uni.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
                        {uni.name}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {uni.location}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {recommendedUniversities.length === 0 && (
                <p className="text-sm italic text-muted-foreground">
                  Aucun établissement spécifique répertorié.
                </p>
              )}
            </div>

            <div className="mt-6">
              <Link
                href="/universities"
                className="inline-block w-full text-center text-sm font-medium text-primary hover:underline"
              >
                Voir tous les établissements
              </Link>
            </div>
          </div>

          {/* Need help CTA */}
          <div className="rounded-2xl border border-primary bg-primary/5 p-6 text-center">
            <h3 className="font-semibold text-foreground">Besoin d'aide ?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Discute avec notre conseiller IA pour en savoir plus sur ce métier.
            </p>
            <Link
              href="/chatbot"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Lancer le chat
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
