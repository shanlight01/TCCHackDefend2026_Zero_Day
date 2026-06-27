"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/layout/ThemeProvider";

interface UserProfile {
  niveau?: string;
  interets?: string[];
  loisirs?: string[];
}

interface ChatSession {
  id: string;
  titre: string;
  messages: any[];
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    try {
      const rawProfile = localStorage.getItem("careerProfile");
      if (rawProfile) setProfile(JSON.parse(rawProfile));

      const rawSessions = localStorage.getItem("iki_chat_sessions");
      if (rawSessions) setSessions(JSON.parse(rawSessions));
    } catch {}
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── HEADER ── */}
      <div className="relative overflow-hidden bg-primary px-6 py-16 text-white md:px-12 md:py-24">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white/20 text-4xl shadow-lg backdrop-blur-md">
              👤
            </div>
            <div>
              <h1 className="text-3xl font-bold md:text-5xl">Mon Espace Personnel</h1>
              <p className="mt-2 text-primary-100 text-sm md:text-base max-w-xl">
                Ici, tu retrouves toutes tes donnees locales (sans IA). C'est ton tableau de bord pour gerer ton orientation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="mx-auto mt-8 max-w-5xl px-6 md:-mt-12 md:px-12 relative z-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* ── COLONNE GAUCHE (Profil) ── */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Informations</h2>
                <Link
                  href="/onboarding"
                  className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  Modifier
                </Link>
              </div>

              {profile ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Niveau Scolaire</p>
                    <p className="text-sm font-medium text-foreground">{profile.niveau || "Non precise"}</p>
                  </div>
                  
                  {profile.interets && profile.interets.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Centres d'interet</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.interets.map((i) => (
                          <span key={i} className="rounded-lg border border-primary/20 bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.loisirs && profile.loisirs.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Loisirs & Passions</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.loisirs.map((l) => (
                          <span key={l} className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface">
                    <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tu n'as pas encore enregistre tes informations.
                  </p>
                  <Link
                    href="/onboarding"
                    className="inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all"
                  >
                    Creer mon profil
                  </Link>
                </div>
              )}
            </div>

            {/* Aide et Inscription */}
            <div className="rounded-2xl border border-primary/20 bg-primary-light/40 p-6">
              <h3 className="text-sm font-bold text-primary mb-2">Sauvegarde cloud</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Tes donnees sont actuellement sauvegardees sur cet appareil. Connecte-toi pour les retrouver partout et debloquer les roadmaps avancees.
              </p>
              <button className="w-full rounded-xl bg-white border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface transition-colors shadow-sm">
                Se connecter (Bientot)
              </button>
            </div>
          </div>

          {/* ── COLONNE DROITE (Activité) ── */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Raccourcis / Roadmaps */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-foreground">Explorer mes pistes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/recommendations"
                  className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 hover:border-primary hover:bg-primary-light transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary">Metiers recommandes</p>
                    <p className="text-xs text-muted-foreground mt-1">Decouvre les carriere qui correspondent a ton profil.</p>
                  </div>
                </Link>
                <Link
                  href="/universities"
                  className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 hover:border-primary hover:bg-primary-light transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary">Ecoles & Universites</p>
                    <p className="text-xs text-muted-foreground mt-1">Trouve les meilleures formations pres de chez toi.</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Historique IA */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Historique avec Iki</h2>
                <Link
                  href="/chatbot"
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow-sm"
                >
                  Nouveau Chat
                </Link>
              </div>

              {sessions.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {sessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/40 transition-colors">
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{s.titre}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{s.messages?.length || 0} messages</span>
                          <span>&bull;</span>
                          <span>{new Date(s.createdAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                      <Link
                        href="/chatbot"
                        onClick={() => localStorage.setItem("iki_active_session", s.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary hover:bg-primary hover:text-white transition-colors"
                        title="Reprendre la conversation"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Tu n'as pas encore discute avec ton conseiller virtuel.</p>
                  <p className="text-xs text-muted-foreground">
                    Iki peut t'aider a y voir plus clair sur ton orientation !
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
