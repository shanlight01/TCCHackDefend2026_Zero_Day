"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if the user has already seen the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    // Timer to start fade out after 4 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4000);

    // Timer to completely remove the component after fade out animation (4.5 seconds total)
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("hasSeenSplash", "true");
    }, 4500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Avoid hydration mismatch by not rendering anything until mounted
  if (!isMounted || !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* Decorative elements */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[80px]" />
        
        <svg
          className="mx-auto mb-6 h-12 w-12 text-primary/50 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>

        <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold leading-tight tracking-tight text-foreground animate-fade-in-up">
          <span className="text-primary">"</span>
          Je ne suis pas un produit de circonstances, je suis un produit de mes décisions.
          <span className="text-primary">"</span>
        </h1>
        
        <p className="mt-6 text-sm md:text-base font-medium uppercase tracking-widest text-muted-foreground animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          — Stephen Covey
        </p>

        {/* Loading bar */}
        <div className="mx-auto mt-12 h-1 w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary animate-progress-bar" />
        </div>
      </div>
    </div>
  );
}
