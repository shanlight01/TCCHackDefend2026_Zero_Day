import Link from "next/link";
import { notFound } from "next/navigation";
import careersData from "@/data/careers.json";
import roadmapsData from "@/data/roadmaps.json";
import universitiesData from "@/data/universities.json";

// ─── Types ────────────────────────────────────────────────────────────────
interface SoftSkill { nom: string; description: string; emoji: string; }
interface EtapeCarriere { phase: string; actions: string[]; couleur: string; }
interface ChapitreDetail { chapitre: string; application: string; }
interface MatierDetail { matiere: string; priorite: string; chapitres: ChapitreDetail[]; }

interface Roadmap {
  career_id: string;
  competences_cles: string[];
  soft_skills?: SoftSkill[];
  etapes_carriere?: EtapeCarriere[];
  matieres_importantes: string[];
  matieres_details?: MatierDetail[];
  related_universities: string[];
}

const COULEUR_MAP: Record<string, string> = {
  primary: "bg-primary/10 border-primary/30 text-primary",
  success: "bg-success/10 border-success/30 text-success",
  warning: "bg-warning/10 border-warning/30 text-warning",
  info: "bg-info/10 border-info/30 text-info",
};

const DOT_MAP: Record<string, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
};

const PRIORITE_COLOR: Record<string, string> = {
  "Indispensable": "bg-primary text-white",
  "Très important": "bg-warning/80 text-white",
  "Important": "bg-muted text-foreground",
};

// ─── Page ─────────────────────────────────────────────────────────────────
export default async function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const career = careersData.careers.find((c) => c.id === id);
  if (!career) return notFound();

  const roadmap = roadmapsData.roadmaps.find((r) => r.career_id === id) as Roadmap | undefined;
  if (!roadmap) return notFound();

  const recommendedUniversities = universitiesData.filter((u) =>
    roadmap.related_universities.includes(u.id)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-primary px-6 py-14 text-white md:px-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white mb-6 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour aux recommandations
          </Link>
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-4">
            {career.secteur}
          </span>
          <h1 className="text-3xl font-bold md:text-5xl leading-tight">{career.nom_metier}</h1>
          <p className="mt-4 text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">
            {career.description}
          </p>
          {/* Quick stats */}
          <div className="mt-8 flex flex-wrap gap-4">
            {(career as any).demande_marche && (
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 border border-white/20">
                <p className="text-xs text-white/60 uppercase tracking-wide">Demande marché</p>
                <p className="font-semibold mt-0.5">{(career as any).demande_marche}</p>
              </div>
            )}
            {(career as any).salaire_debutant && (
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 border border-white/20">
                <p className="text-xs text-white/60 uppercase tracking-wide">Salaire débutant</p>
                <p className="font-semibold mt-0.5">{(career as any).salaire_debutant}</p>
              </div>
            )}
            {(career as any).salaire_senior && (
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 border border-white/20">
                <p className="text-xs text-white/60 uppercase tracking-wide">Salaire senior</p>
                <p className="font-semibold mt-0.5">{(career as any).salaire_senior}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-12 space-y-12">

        {/* ── 1. SCHÉMA VISUEL DU PARCOURS ─────────────────────────────────── */}
        {roadmap.etapes_carriere && roadmap.etapes_carriere.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">🗺️ Ton parcours, étape par étape</h2>
              <p className="text-sm text-muted-foreground mt-1">De la classe de Terminale jusqu'au sommet de ta carrière</p>
            </div>
            <div className="relative">
              {/* Ligne de connexion horizontale (desktop) */}
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-success via-warning to-info z-0" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                {roadmap.etapes_carriere.map((etape, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center md:items-center">
                    {/* Dot */}
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg text-2xl ${
                      idx === 0 ? "bg-primary text-white" :
                      idx === 1 ? "bg-success text-white" :
                      idx === 2 ? "bg-amber-400 text-white" :
                      "bg-blue-500 text-white"
                    }`}>
                      {idx === 0 ? "📚" : idx === 1 ? "🎓" : idx === 2 ? "💼" : "🏆"}
                    </div>
                    {/* Phase */}
                    <h3 className="mt-4 text-sm font-bold text-foreground">{etape.phase}</h3>
                    {/* Actions */}
                    <ul className="mt-3 space-y-1.5 w-full">
                      {etape.actions.map((action, i) => (
                        <li key={i} className={`rounded-lg px-3 py-2 text-xs text-left border ${COULEUR_MAP[etape.couleur] ?? "bg-muted border-border text-foreground"}`}>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 2. SOFT SKILLS ──────────────────────────────────────────────── */}
        {roadmap.soft_skills && roadmap.soft_skills.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">🧠 Soft Skills indispensables</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Les compétences humaines et comportementales qui font la différence dans ce métier. Elles ne s'apprennent pas dans les livres — elles se cultivent au quotidien.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmap.soft_skills.map((skill, idx) => (
                <div key={idx} className="group rounded-2xl border border-border bg-card p-5 hover:border-primary hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{skill.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{skill.nom}</h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{skill.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 3. COMPÉTENCES TECHNIQUES ──────────────────────────────────── */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">🎯 Compétences techniques à maîtriser</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ce que tu devras savoir faire concrètement dans ce métier.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roadmap.competences_cles.map((skill, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-primary font-bold text-xs">{idx + 1}</span>
                </div>
                <span className="text-sm text-foreground leading-relaxed">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. MATIÈRES PRIORITAIRES AU LYCÉE ──────────────────────────── */}
        {roadmap.matieres_details && roadmap.matieres_details.length > 0 ? (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">📚 Matières prioritaires au lycée</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pour chaque matière : des <strong>exemples de chapitres</strong> et comment ils s'appliquent <strong>directement dans ce métier</strong>. Pour que tu comprennes pourquoi travailler cette matière maintenant.
              </p>
            </div>
            <div className="space-y-6">
              {roadmap.matieres_details.map((matiere, mIdx) => (
                <div key={mIdx} className="rounded-2xl border border-border bg-card overflow-hidden">
                  {/* Header matière */}
                  <div className="flex items-center justify-between gap-4 border-b border-border bg-surface px-6 py-4">
                    <h3 className="font-bold text-foreground text-base">{matiere.matiere}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${PRIORITE_COLOR[matiere.priorite] ?? "bg-muted text-foreground"}`}>
                      {matiere.priorite}
                    </span>
                  </div>
                  {/* Chapitres */}
                  <div className="divide-y divide-border">
                    {matiere.chapitres.map((ch, cIdx) => (
                      <div key={cIdx} className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Chapitre */}
                        <div className="flex items-start gap-3 px-6 py-4 md:border-r border-border">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Chapitre</p>
                            <p className="text-sm font-medium text-foreground">{ch.chapitre}</p>
                          </div>
                        </div>
                        {/* Application dans le métier */}
                        <div className="flex items-start gap-3 px-6 py-4 bg-success/5">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-success/20">
                            <svg className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-success/80 uppercase tracking-wide mb-1">Dans le métier</p>
                            <p className="text-sm text-foreground leading-relaxed">{ch.application}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* Fallback si pas de matieres_details */
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">📚 Matières importantes au lycée</h2>
            <div className="flex flex-wrap gap-3">
              {roadmap.matieres_importantes.map((matiere, index) => (
                <div key={index} className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground">
                  {matiere}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 5. FORMATIONS REQUISES ──────────────────────────────────────── */}
        {(career as any).formations_requises && (
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-4">🎓 Formations recommandées</h2>
            <ul className="space-y-2">
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

        {/* ── 6. CONTEXTE TOGO ────────────────────────────────────────────── */}
        {(career as any).contexte_togo && (
          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🇹🇬</span>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Contexte au Togo</h2>
                <p className="text-sm text-foreground leading-relaxed">{(career as any).contexte_togo}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── 7. UNIVERSITÉS ──────────────────────────────────────────────── */}
        {recommendedUniversities.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">🏛️ Où étudier au Togo ?</h2>
              <p className="text-sm text-muted-foreground mt-1">Établissements recommandés pour cette carrière</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recommendedUniversities.map((uni) => (
                <Link
                  key={uni.id}
                  href={`/universities?search=${encodeURIComponent(uni.name)}`}
                  className="group block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      {uni.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={uni.logo} alt="" className="h-full w-full object-contain p-1" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                          {uni.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {uni.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">{uni.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/universities" className="text-sm font-medium text-primary hover:underline">
                Voir tous les établissements →
              </Link>
            </div>
          </section>
        )}

        {/* ── 8. CTA CHATBOT ──────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-primary px-8 py-10 text-white text-center">
          <div className="mx-auto max-w-md">
            <p className="text-3xl mb-4">✨</p>
            <h2 className="text-xl font-bold mb-2">Des questions sur ce parcours ?</h2>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Iki, ton conseiller IA, peut t'expliquer plus en détail chaque étape, te donner des conseils personnalisés et répondre à tes questions spécifiques.
            </p>
            <Link
              href="/chatbot"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-primary hover:bg-white/90 transition-colors shadow-lg"
            >
              Parler à Iki maintenant
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
