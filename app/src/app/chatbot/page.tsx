"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  liens?: { titre: string; url: string }[];
  questionsSuivantes?: string[];
}

const QUICK_STARTS = [
  { label: "Universités pour l'informatique" },
  { label: "Métiers qui recrutent le plus au Togo" },
  { label: "Obtenir une bourse pour étudier à l'étranger" },
  { label: "Je ne sais pas quelle filière choisir, aide-moi" },
  { label: "Salaires dans la tech au Togo" },
  { label: "Comment construire mon projet professionnel ?" },
];

const IKI_EXPERTISE = [
  "Universités togolaises",
  "Filières et formations",
  "Marché de l'emploi",
  "Bourses et mobilité",
  "Orientation psychologique",
  "Projet professionnel",
];

/** Simple Markdown-like renderer (gras, italique, listes) sans dépendance externe */
function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        // Heading ##
        if (line.startsWith("## ")) {
          return (
            <p key={i} className="font-semibold text-foreground text-sm mt-2">
              {line.replace(/^## /, "")}
            </p>
          );
        }
        // Heading #
        if (line.startsWith("# ")) {
          return (
            <p key={i} className="font-bold text-foreground text-base mt-2">
              {line.replace(/^# /, "")}
            </p>
          );
        }
        // List item
        if (line.match(/^[-*•]\s/)) {
          const content = line.replace(/^[-*•]\s/, "");
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm leading-relaxed">{renderInline(content)}</span>
            </div>
          );
        }
        // Normal paragraph
        return (
          <p key={i} className="text-sm leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|_.*?_)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendQuery = async (query: string) => {
    if (!query.trim() || isTyping) return;
    setShowWelcome(false);

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query.trim(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsTyping(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) throw new Error("Erreur de communication");

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reponse || data.error || "Desolee, je n'ai pas pu repondre.",
          liens: data.liens_recommandes,
          questionsSuivantes: data.questions_suivantes,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Oups, je n'ai pas pu te repondre. Verifie ta connexion et reessaie !",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery(input);
    }
  };

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden xl:flex w-68 flex-col border-r border-border bg-card shrink-0">
        <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
          {/* Iki identity */}
          <div className="flex flex-col items-center gap-3 text-center pt-2">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success ring-2 ring-card">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
              </span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Iki</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Conseiller d'orientation IA</p>
              <p className="text-xs text-muted-foreground italic mt-1 leading-relaxed">inspire de l'Ikigai — ta raison d'etre</p>
            </div>
          </div>

          {/* Expertise tags */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
              Expertises
            </p>
            <div className="flex flex-col gap-1.5">
              {IKI_EXPERTISE.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 bg-surface border border-border"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
                  <span className="text-xs font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div className="mt-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
              La plateforme
            </p>
            <div className="flex flex-col gap-0.5">
              {[
                { href: "/formations", label: "Formations" },
                { href: "/universities", label: "Universites" },
                { href: "/recommendations", label: "Metiers" },
                { href: "/news", label: "Actualites" },
                { href: "/onboarding", label: "Mon profil" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main chat */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Iki — Conseiller d'Orientation</h1>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse"></span>
                <p className="text-xs text-muted-foreground">En ligne · Expert Togo & Afrique de l'Ouest</p>
              </div>
            </div>
          </div>
          <Link
            href="/onboarding"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-3 py-1.5 hover:border-primary/30"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Mon profil
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 scroll-smooth">
          {/* Welcome */}
          {showWelcome && (
            <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in-up max-w-2xl mx-auto text-center">
              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light border border-primary/20 mx-auto mb-5 shadow-premium">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Bonjour, je suis <span className="gradient-text">Iki</span>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                  Ton conseiller d'orientation personnel. Je connais les universites, filieres, metiers et opportunites au Togo en profondeur. Demande-moi n'importe quoi sur ton avenir !
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {QUICK_STARTS.map((qs) => (
                  <button
                    key={qs.label}
                    onClick={() => sendQuery(qs.label)}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-all hover:border-primary/40 hover:bg-primary-light hover:shadow-sm group"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-light border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-colors">
                      <svg className="h-3.5 w-3.5 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                      {qs.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {!showWelcome && (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`flex w-full animate-fade-in-up ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[88%] items-end gap-2.5 md:max-w-[78%] ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                        msg.role === "user"
                          ? "bg-foreground"
                          : "bg-primary"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <svg className="h-4 w-4 text-card" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 max-w-full">
                      {/* Bubble */}
                      <div
                        className={`rounded-2xl px-5 py-3.5 shadow-sm ${
                          msg.role === "user"
                            ? "rounded-br-none bg-primary text-white"
                            : "rounded-bl-none border border-border bg-card text-foreground"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <SimpleMarkdown text={msg.content} />
                        ) : (
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        )}
                      </div>

                      {/* Links */}
                      {msg.liens && msg.liens.length > 0 && (
                        <div className="flex flex-col gap-1.5 mt-0.5 ml-1">
                          <span className="text-xs font-semibold text-muted-foreground">Explorer sur la plateforme :</span>
                          <div className="flex flex-wrap gap-2">
                            {msg.liens.map((lien, idx) => (
                              <Link
                                key={idx}
                                href={lien.url}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary-light px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-white transition-colors"
                              >
                                {lien.titre}
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested questions */}
                      {msg.questionsSuivantes && msg.questionsSuivantes.length > 0 && i === messages.length - 1 && (
                        <div className="flex flex-col gap-1.5 mt-0.5">
                          <span className="text-xs font-semibold text-muted-foreground ml-1">Tu pourrais aussi demander :</span>
                          <div className="flex flex-col gap-1.5">
                            {msg.questionsSuivantes.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => sendQuery(q)}
                                disabled={isTyping}
                                className="text-left rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary-light hover:text-primary disabled:opacity-50"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex w-full justify-start animate-fade-in">
                  <div className="flex items-end gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary shadow-sm">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                      </svg>
                    </div>
                    <div className="flex rounded-2xl rounded-bl-none border border-border bg-card px-5 py-4 shadow-sm items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60"></span>
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 delay-200"></span>
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 delay-400"></span>
                      </div>
                      <span className="text-xs text-muted-foreground italic">Iki reflechit...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card px-4 py-4 md:px-8 shrink-0">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            <div className="flex items-end gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Pose ta question a Iki... (Entree pour envoyer, Maj+Entree pour sauter une ligne)"
                rows={1}
                id="chatbot-input"
                className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed"
                disabled={isTyping}
                style={{ maxHeight: "120px" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                id="chatbot-send-btn"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-all hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4 ml-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Iki est une IA — ses conseils sont indicatifs. Consulte aussi un conseiller humain pour les decisions importantes.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
