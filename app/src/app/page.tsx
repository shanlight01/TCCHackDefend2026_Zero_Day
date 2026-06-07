"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import universitiesData from "@/data/universities.json";
import newsData from "@/data/news.json";

/* ───── Scroll-reveal hook ───── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ───── Animated counter ───── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            setCount(current);
          }, 30);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ───── Featured university ───── */
const featuredUni = universitiesData.find((u) => u.id === "uni_022") || universitiesData[0];

/* ───── Testimonials data ───── */
const testimonials = [
  {
    name: "Ama K.",
    role: "Étudiante en Informatique — ESGIS",
    quote: "Grâce à Career Guidance, j'ai découvert que ma passion pour les jeux vidéo pouvait devenir une carrière en développement logiciel. Aujourd'hui je code mes propres projets !",
    avatar: "AK",
  },
  {
    name: "Kodjo M.",
    role: "Ingénieur Agronome — Université de Kara",
    quote: "Je ne savais pas que l'agriculture moderne offrait autant d'opportunités au Togo. La feuille de route m'a donné une vision claire de mon parcours.",
    avatar: "KM",
  },
  {
    name: "Efia D.",
    role: "Infirmière — ENAM Lomé",
    quote: "Le quiz d'orientation m'a confirmé ma vocation pour la santé. Les informations sur les écoles et les salaires m'ont aidée à convaincre mes parents.",
    avatar: "ED",
  },
];

/* ───── Stats ───── */
const stats = [
  { value: 96, suffix: "", label: "Établissements répertoriés" },
  { value: 20, suffix: "+", label: "Carrières analysées" },
  { value: 8, suffix: "", label: "Filières d'études" },
  { value: 500, suffix: "+", label: "Étudiants guidés" },
];

/* ───── Profile cards ───── */
const profiles = [
  {
    title: "Lycéen(ne)",
    desc: "Tu es en 3ème, Seconde, Première ou Terminale et tu veux commencer à réfléchir à ton avenir.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Nouveau Bachelier",
    desc: "Tu viens d'avoir ton Bac et tu dois choisir ta filière et ton université. Le moment est crucial.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
  },
  {
    title: "Étudiant(e)",
    desc: "Tu es déjà à l'université mais tu envisages une réorientation ou un changement de filière.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
];

/* ───── Steps ───── */
const steps = [
  { num: "01", title: "Profiling", desc: "Réponds à quelques questions sur tes centres d'intérêt, tes loisirs et ton niveau scolaire." },
  { num: "02", title: "Recommandations", desc: "Notre IA analyse ton profil et te propose les carrières qui te correspondent le mieux." },
  { num: "03", title: "Feuille de route", desc: "Pour chaque métier, obtiens les compétences à acquérir, les matières clés et les étapes à suivre." },
  { num: "04", title: "Universités", desc: "Découvre les établissements au Togo qui proposent les formations adaptées à ton projet." },
];

export default function Home() {
  const heroRef = useReveal();
  const profilesRef = useReveal();
  const stepsRef = useReveal();
  const statsRef = useReveal();
  const testimonialsRef = useReveal();
  const uniRef = useReveal();
  const consultRef = useReveal();

  return (
    <div className="flex flex-col">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden">
        {/* Arrière-plan personnalisé (Image 1) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: "url('/bg1.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div ref={heroRef} className="reveal relative mx-auto w-full max-w-7xl px-6 py-20 md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Trouve ta voie,{" "}
                <span className="gradient-text">pas au hasard.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Quiz de carrière, vitrine universitaire, feuille de route personnalisée —
                tout ce qu&apos;il te faut pour choisir avec assurance.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
                >
                  Commencer maintenant
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/formations"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
                >
                  S'orienter
                </Link>
              </div>
            </div>
            {/* Hero illustration */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="animate-float glass-panel rounded-2xl p-8 shadow-premium">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-primary/10 p-4 text-center">
                      <p className="text-2xl font-bold text-primary">96</p>
                      <p className="text-xs text-muted-foreground">Écoles</p>
                    </div>
                    <div className="rounded-xl bg-accent/10 p-4 text-center">
                      <p className="text-2xl font-bold text-accent">20+</p>
                      <p className="text-xs text-muted-foreground">Carrières</p>
                    </div>
                    <div className="col-span-2 rounded-xl border border-border bg-surface p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Match: 92%</p>
                          <p className="text-xs text-muted-foreground">Développeur Web</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-accent/20 blur-2xl" />
                <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ═══════ QUI ES-TU ? ═══════ */}
      <section className="border-t border-border">
        <div ref={profilesRef} className="reveal mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Qui es-tu ?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Choisis ton profil pour une expérience personnalisée.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {profiles.map((p) => (
              <Link
                key={p.title}
                href="/onboarding"
                className="card-hover shadow-premium group flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {p.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <span className="mt-5 text-sm font-medium text-primary group-hover:underline">
                  C&apos;est moi →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ COMMENT ÇA MARCHE ═══════ */}
      <section id="how-it-works" className="border-t border-border bg-muted">
        <div ref={stepsRef} className="reveal mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Comment ça marche
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              4 étapes simples
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.num} className="shadow-premium relative flex flex-col items-start rounded-2xl border border-border bg-card p-6" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="font-heading text-4xl font-bold text-primary/20">{s.num}</span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="border-t border-border">
        <div ref={statsRef} className="reveal mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              La plateforme en chiffres
            </span>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="shadow-premium flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center">
                <p className="font-heading text-4xl font-bold text-foreground md:text-5xl">
                  <Counter target={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="border-t border-border bg-muted">
        <div ref={testimonialsRef} className="reveal mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Ils ont aussi réussi
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Témoignages
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card-hover shadow-premium flex flex-col rounded-2xl border border-border bg-card p-6">
                <svg className="h-8 w-8 text-primary/30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                </svg>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ UNIVERSITÉ DU MOIS ═══════ */}
      <section className="border-t border-border">
        <div ref={uniRef} className="reveal mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Université du mois
            </span>
          </div>
          <div className="mt-10 mx-auto max-w-3xl overflow-hidden rounded-2xl border-2 border-accent/30 bg-card shadow-premium">
            <div className="h-48 w-full overflow-hidden bg-muted">
              {featuredUni.header_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featuredUni.header_image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-accent/10">
                  <svg className="h-16 w-16 text-accent/30" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4">
                {featuredUni.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={featuredUni.logo} alt="" className="h-14 w-14 rounded-xl border border-border object-contain p-1 bg-white" />
                )}
                <div>
                  <h3 className="text-xl font-bold text-foreground">{featuredUni.name}</h3>
                  <p className="text-sm text-muted-foreground">📍 {featuredUni.location} · {featuredUni.type}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{featuredUni.description}</p>
              <div className="mt-6 flex gap-3">
                <Link href="/universities" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
                  En savoir plus
                </Link>
                {featuredUni.website && (
                  <a href={featuredUni.website} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover">
                    Site officiel
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ACTUALITÉS (NEWS) ═══════ */}
      <section id="actualites" className="border-t border-border bg-background">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                S'informer
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
                Actualités & Marché de l'emploi
              </h2>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                Découvrez les dernières avancées du système éducatif togolais et les tendances du marché du recrutement pour mieux orienter votre carrière.
              </p>
            </div>
            <Link
              href="#actualites"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              Voir tous les articles
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsData.map((news, i) => (
              <Link
                key={news.id}
                href={`/news/${news.id}`}
                className="card-hover shadow-premium group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <span className="absolute bottom-4 left-4 z-20 rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {news.category}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium text-muted-foreground mb-3">
                    {news.date}
                  </p>
                  <h3 className="mb-3 font-heading text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {news.excerpt}
                  </p>
                  <div className="mt-auto pt-6">
                    <span className="text-sm font-semibold text-primary">
                      Lire la suite →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CONSULT ═══════ */}
      <section className="relative border-t border-border bg-muted overflow-hidden">
        {/* Arrière-plan personnalisé (Image 2) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: "url('/bg2.jpg')" }}
        />
        <div className="absolute inset-0 bg-muted/70" />
        <div ref={consultRef} className="reveal relative mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl rounded-2xl glass-panel shadow-premium p-8 md:p-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Tu préfères parler à quelqu&apos;un ?
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground md:text-3xl">
              Consulte un conseiller d&apos;orientation
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pas toujours facile de choisir seul. Notre IA est là pour t&apos;accompagner — sans jugement, sans pression.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/chatbot"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                Lancer le chat IA
              </Link>
              <a
                href="mailto:contact@careerguide.tg"
                className="inline-flex items-center justify-center rounded-xl border border-border px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
              >
                Nous écrire
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
