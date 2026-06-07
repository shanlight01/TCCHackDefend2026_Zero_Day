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

const SUGGESTIONS = [
  "Quelles universités pour l'informatique ?",
  "Quel est le salaire d'un ingénieur agronome ?",
  "Filières courtes avec beaucoup de débouchés ?",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg_1",
      role: "assistant",
      content: "Bonjour ! Je suis ton conseiller d'orientation virtuel. As-tu des questions sur une filière, un métier, ou sur ton choix d'université au Togo ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendQuery = async (query: string) => {
    if (!query.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query.trim(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error("Erreur de communication");
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reponse,
          liens: data.liens_recommandes,
          questionsSuivantes: data.questions_suivantes,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Oups, je n'ai pas pu joindre mon cerveau. Vérifie ta connexion ou la clé API Groq !",
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

  return (
    <div className="mx-auto flex h-[calc(100vh-73px)] w-full max-w-4xl flex-col bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Conseiller IA</h1>
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-xs text-muted-foreground">En ligne</p>
            </div>
          </div>
        </div>
        <Link
          href="/onboarding"
          className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors hover:underline"
        >
          Mettre à jour mon profil
        </Link>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="flex flex-col gap-6">
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`flex w-full animate-fade-in-up ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[85%] items-end gap-3 md:max-w-[75%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold shadow-sm ${
                    msg.role === "user"
                      ? "bg-foreground text-card"
                      : "bg-primary text-white"
                  }`}
                >
                  {msg.role === "user" ? "VOUS" : "IA"}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-2 max-w-full">
                  <div
                    className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "rounded-br-none bg-foreground text-card"
                        : "rounded-bl-none border border-border bg-card text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                  
                  {/* Liens recommandés */}
                  {msg.liens && msg.liens.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-1 ml-1">
                      <span className="text-xs font-semibold text-muted-foreground">Liens utiles :</span>
                      {msg.liens.map((lien, idx) => (
                        <Link 
                          key={idx} 
                          href={lien.url}
                          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                          </svg>
                          {lien.titre}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Questions suggérées (chips) */}
                  {msg.questionsSuivantes && msg.questionsSuivantes.length > 0 && i === messages.length - 1 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.questionsSuivantes.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendQuery(q)}
                          disabled={isTyping}
                          className="rounded-full border border-primary/20 bg-primary-light px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex w-full justify-start animate-fade-in">
              <div className="flex items-end gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                  IA
                </div>
                <div className="flex rounded-2xl rounded-bl-none border border-border bg-card px-5 py-4 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0.2s" }}></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card p-4">
        {/* Suggestions chips */}
        {messages.length < 3 && !isTyping && (
          <div className="mb-4 flex flex-wrap gap-2 animate-fade-in">
            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => sendQuery(sug)}
                className="rounded-full border border-primary/20 bg-primary-light px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-4xl items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pose ta question ici..."
            className="flex-1 rounded-xl border border-border bg-surface px-5 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-all hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5 ml-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
