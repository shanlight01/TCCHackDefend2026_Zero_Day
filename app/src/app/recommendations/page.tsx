"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import careersData from "@/data/careers.json";
import roadmapsData from "@/data/roadmaps.json";
import universitiesData from "@/data/universities.json";
interface Career {
  id: string;
  nom_metier: string;
  secteur: string;
  description: string;
  keywords: string[];
  matchScore?: number; // Calculated for the user
  demande_marche?: string;
  salaire_debutant?: string;
  competences?: string[];
  formations_requises?: string[];
}

export default function RecommendationsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Career[]>([]);
  const [recommendedFormations, setRecommendedFormations] = useState<any[]>([]);
  const [recommendedUniversities, setRecommendedUniversities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem("careerProfile");
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      
      // Simple Mock Recommendation Logic
      // In a real app, this would be an API call to Gemini
      setTimeout(() => {
        const userKeywords = [
          ...(parsedProfile.interets || []),
          ...(parsedProfile.loisirs || [])
        ].map(k => k.toLowerCase());

        const scoredCareers = careersData.careers.map((career: Career) => {
          let score = 50; // Base score
          career.keywords.forEach(keyword => {
            // Very naive matching
            if (userKeywords.some(userKw => userKw.includes(keyword) || keyword.includes(userKw))) {
              score += 15;
            }
          });
          // Cap at 98%
          return { ...career, matchScore: Math.min(score, 98) };
        });

        // Sort by score and take top 6
        const sorted = scoredCareers.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 6);
        setRecommendations(sorted);

        // Aggregate recommended formations (filières) and universities
        const allFormations = new Set<string>();
        const uniIds = new Set<string>();

        sorted.forEach(career => {
          // Add formations from career
          if ((career as any).formations_requises) {
            (career as any).formations_requises.forEach((f: string) => allFormations.add(f));
          }
          // Add universities from roadmap
          const roadmap = roadmapsData.roadmaps.find(r => r.career_id === career.id);
          if (roadmap && roadmap.related_universities) {
            roadmap.related_universities.forEach(uid => uniIds.add(uid));
          }
        });

        // Convert formations set to array of objects for display
        const formationsList = Array.from(allFormations).map(f => {
          // Assign pseudo-levels for visual variety based on string content
          let niveau = "Moyenne";
          if (f.toLowerCase().includes("licence") || f.toLowerCase().includes("master") || f.toLowerCase().includes("ingénieur")) niveau = "Haute";
          if (f.toLowerCase().includes("bts") || f.toLowerCase().includes("dut")) niveau = "Moyenne";
          return { nom: f, niveau };
        });

        const universitiesList = universitiesData.filter(u => uniIds.has(u.id));

        setRecommendedFormations(formationsList);
        setRecommendedUniversities(universitiesList);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <svg
          className="h-10 w-10 animate-spin text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          Notre IA analyse ton profil...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Aucun profil trouvé
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tu dois d&apos;abord remplir le formulaire d&apos;orientation pour obtenir des recommandations.
        </p>
        <Link
          href="/onboarding"
          className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Commencer l&apos;orientation
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Tes recommandations de carrières
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
          Basé sur ton profil (Niveau : {profile.niveau}), voici les métiers qui correspondent le mieux à tes passions et aux besoins du marché togolais.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((career, index) => (
          <div
            key={career.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {career.secteur}
              </span>
              <div className="flex items-center gap-1 font-bold text-foreground">
                <span className="text-xl">{career.matchScore}%</span>
                <span className="text-xs text-muted-foreground font-normal">match</span>
              </div>
            </div>
            
            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-xl font-bold text-foreground">
                {career.nom_metier}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {career.description}
              </p>
              
              {/* Infos additionnelles */}
              <div className="mt-5 space-y-2.5 border-t border-border/60 pt-5">
                {career.demande_marche && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Demande au Togo :</span>
                    <span className="font-semibold text-primary">{career.demande_marche}</span>
                  </div>
                )}
                {career.salaire_debutant && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Salaire débutant :</span>
                    <span className="font-medium text-foreground">{career.salaire_debutant}</span>
                  </div>
                )}
                {career.competences && career.competences.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {career.competences.slice(0, 3).map((comp, i) => (
                      <span key={i} className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                        {comp}
                      </span>
                    ))}
                    {career.competences.length > 3 && (
                      <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                        +{career.competences.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link
                  href={`/roadmap/${career.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#383838]"
                >
                  Voir la feuille de route
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── FILIÈRES / FORMATIONS ── */}
      {recommendedFormations.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Filières qui te correspondent
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedFormations.map((form, idx) => (
              <div key={idx} className="group flex flex-col justify-between rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary hover:shadow-md">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-foreground text-lg">{form.nom}</h3>
                    <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      form.niveau === "Haute" ? "bg-success/10 text-success" : 
                      form.niveau === "Moyenne" ? "bg-warning/10 text-warning" : 
                      "bg-muted text-muted-foreground"
                    }`}>
                      {form.niveau}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <span className="rounded-full bg-muted px-2.5 py-1">Supérieur</span>
                    <span>3 à 5 ans</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/formations" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                    Voir la fiche
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── UNIVERSITÉS ── */}
      {recommendedUniversities.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Universités qui proposent ces formations
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedUniversities.map((uni) => (
              <div key={uni.id} className="group flex flex-col justify-between rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:border-primary hover:shadow-md">
                <div>
                  <div className="mb-4 h-12 w-12 overflow-hidden rounded-lg border border-border bg-muted">
                    {uni.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={uni.logo} alt="" className="h-full w-full object-contain p-1" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                        {uni.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-foreground text-base line-clamp-2">{uni.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{uni.location}</p>
                  
                  {uni.domains && uni.domains.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground line-clamp-1">
                        {uni.domains[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Link href={`/universities?search=${encodeURIComponent(uni.name)}`} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                    Voir la vitrine
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* ── FALLBACK / CTA ── */}
      <div className="mt-16 rounded-xl border border-border bg-muted p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          Ces résultats ne te conviennent pas ?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          L&apos;IA base ses recommandations sur tes réponses. Tu peux modifier ton profil pour affiner les résultats ou discuter avec un conseiller.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
          >
            Refaire le test
          </Link>
          <Link
            href="/chatbot"
            className="inline-flex items-center justify-center rounded-lg border border-primary text-primary px-6 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5"
          >
            Parler au Chatbot
          </Link>
        </div>
      </div>
    </div>
  );
}
