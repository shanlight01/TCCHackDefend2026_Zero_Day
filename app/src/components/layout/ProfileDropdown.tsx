"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserProfile {
  niveau?: string;
  interets?: string[];
  loisirs?: string[];
}

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Charger les infos du profil depuis le localStorage
    try {
      const raw = localStorage.getItem("careerProfile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, [pathname]);

  useEffect(() => {
    // Fermer le menu si on clique à l'extérieur
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative ml-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors"
        aria-label="Profil utilisateur"
      >
        <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xl">
              👤
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Mon profil</p>
              <p className="text-xs text-muted-foreground">Donnees locales</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {profile ? (
              <>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Niveau scolaire</p>
                  <p className="text-sm font-medium text-foreground">{profile.niveau || "Non specifie"}</p>
                </div>
                
                {(profile.interets && profile.interets.length > 0) && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Centres d'interet</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.interets.map((i) => (
                        <span key={i} className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 mt-2">Raccourcis</p>
                  <div className="flex flex-col gap-1">
                    <Link href="/recommendations" onClick={() => setIsOpen(false)} className="text-sm text-foreground hover:text-primary transition-colors py-1 flex items-center gap-2">
                      <span>💼</span> Mes metiers recommandes
                    </Link>
                    <Link href="/universities" onClick={() => setIsOpen(false)} className="text-sm text-foreground hover:text-primary transition-colors py-1 flex items-center gap-2">
                      <span>🏛️</span> Les universites
                    </Link>
                    <Link href="/onboarding" onClick={() => setIsOpen(false)} className="text-sm text-primary hover:underline transition-colors py-1 flex items-center gap-2 mt-1">
                      <span>⚙️</span> Modifier mon profil
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  Tu n'as pas encore cree de profil. C'est optionnel, mais utile !
                </p>
                <Link
                  href="/onboarding"
                  onClick={() => setIsOpen(false)}
                  className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors w-full"
                >
                  Creer mon profil
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
