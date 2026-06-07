"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import careersData from "@/data/careers.json";

interface Career {
  id: string;
  nom_metier: string;
  secteur: string;
  description: string;
  keywords: string[];
  matchScore?: number; // Calculated for the user
}

export default function RecommendationsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Career[]>([]);
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

        // Sort by score and take top 3
        const sorted = scoredCareers.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 3);
        setRecommendations(sorted);
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
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {career.description}
              </p>
              
              <div className="mt-8">
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
