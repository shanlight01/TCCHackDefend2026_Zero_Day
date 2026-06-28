"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ACADEMIC_LEVELS } from "@/lib/constants";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { saveProfile } from "@/lib/supabase/auth";

const INTERESTS = [
  "Technologie & Informatique",
  "Santé & Médecine",
  "Arts & Design",
  "Commerce & Gestion",
  "Sciences & Recherche",
  "Ingénierie",
  "Environnement & Agriculture",
  "Droit & Politique",
  "Enseignement & Éducation",
  "Communication & Médias",
];

const HOBBIES = [
  "Jeux vidéo",
  "Lecture",
  "Sport",
  "Bricolage",
  "Musique",
  "Dessin & Peinture",
  "Bénévolat",
  "Voyages",
  "Écriture",
  "Photographie",
  "Programmation",
  "Cuisine",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [niveau, setNiveau] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const profile = { niveau, interets: selectedInterests, loisirs: selectedHobbies };
    // Always save to localStorage
    localStorage.setItem("careerProfile", JSON.stringify(profile));
    // If user is logged in, also save to Supabase
    if (user) {
      await saveProfile(user.id, {
        niveau,
        interets: selectedInterests,
        hobbies: selectedHobbies,
      });
    }
    setTimeout(() => {
      router.push("/recommendations");
    }, 500);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-12 md:py-20">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          <span className={step >= 1 ? "text-primary" : ""}>Niveau</span>
          <span className={step >= 2 ? "text-primary" : ""}>Intérêts</span>
          <span className={step >= 3 ? "text-primary" : ""}>Loisirs</span>
        </div>
        <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Niveau */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-semibold text-foreground">
            Quel est ton niveau scolaire ?
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Cela nous aidera à adapter les parcours et les universités
            recommandées.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {ACADEMIC_LEVELS.map((level) => (
              <label
                key={level}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:border-primary ${
                  niveau === level
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card"
                }`}
              >
                <span className="font-medium text-foreground">{level}</span>
                <input
                  type="radio"
                  name="niveau"
                  value={level}
                  checked={niveau === level}
                  onChange={() => setNiveau(level)}
                  className="h-5 w-5 border-border text-primary focus:ring-primary accent-primary"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Intérêts */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-semibold text-foreground">
            Quels sont tes centres d&apos;intérêt ?
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Sélectionne les domaines qui t&apos;attirent le plus (plusieurs choix
            possibles).
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-white shadow-md"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Loisirs */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-semibold text-foreground">
            Quels sont tes loisirs ?
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Ce que tu aimes faire pendant ton temps libre en dit long sur tes
            aptitudes naturelles.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {HOBBIES.map((hobby) => {
              const isSelected = selectedHobbies.includes(hobby);
              return (
                <button
                  key={hobby}
                  onClick={() => toggleHobby(hobby)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-white shadow-md"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  {hobby}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
        <button
          onClick={handleBack}
          disabled={step === 1 || isLoading}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            step === 1
              ? "text-muted-foreground opacity-50 cursor-not-allowed"
              : "text-foreground hover:text-primary"
          }`}
        >
          Retour
        </button>

        {step < 3 ? (
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !niveau) ||
              (step === 2 && selectedInterests.length === 0)
            }
            className="rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedHobbies.length === 0 || isLoading}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyse en cours...
              </>
            ) : (
              "Découvrir mes carrières"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
