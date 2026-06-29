"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Accueil",
    icon: (active: boolean) => (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L12 3l9 9" strokeWidth="1.8"/>
        <path d={active ? "M9 21V12h6v9" : "M9 21V12h6v9"} strokeWidth="1.8"/>
        <rect x="3" y="12" width="18" height="9" rx="1" style={{ display: 'none' }}/>
        <path d="M5 12v8a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-8" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    href: "/recommendations",
    label: "Métiers",
    icon: (active: boolean) => (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        {active ? (
          <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 010-7.136A4.5 4.5 0 0121 12zM3.75 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 000 6.136A4.5 4.5 0 013.75 12zm7.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0-4.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 9a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        ) : (
          <>
            <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </>
        )}
      </svg>
    ),
  },
  {
    href: "/onboarding",
    label: "Quiz",
    icon: (active: boolean) => (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        {active ? (
          <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2v-2zm1-10a5 5 0 00-5 5h2a3 3 0 016 0c0 2-3 2.5-3 5h2c0-1.5 3-2 3-5a5 5 0 00-5-5z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
          </>
        )}
      </svg>
    ),
  },
  {
    href: "/universities",
    label: "Écoles",
    icon: (active: boolean) => (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        {active ? (
          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805zM13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.711 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
        ) : (
          <>
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </>
        )}
      </svg>
    ),
  },
  {
    href: "/chatbot",
    label: "Conseil",
    icon: (active: boolean) => (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        {active ? (
          <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
        ) : (
          <>
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </>
        )}
      </svg>
    ),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on chatbot full-screen (optional, remove if you want it everywhere)
  const hideOn = ["/auth", "/onboarding"];
  if (hideOn.includes(pathname)) return null;

  return (
    <>
      {/* Spacer so content doesn't get hidden behind nav */}
      <div className="lg:hidden h-24" />

      {/* Floating Glass Bottom Nav */}
      <nav className="mobile-bottom-nav lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
        <div className="mobile-nav-glass flex items-center justify-around px-2 py-2 rounded-[28px]">
          {tabs.map((tab) => {
            const isActive = tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(tab.href + "/");

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`mobile-nav-item flex flex-col items-center gap-1 px-3 py-2 rounded-[20px] transition-all duration-300 ${
                  isActive
                    ? "mobile-nav-active text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Icon with active indicator */}
                <div className={`relative flex items-center justify-center transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}>
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-primary/15 scale-150 blur-sm" />
                  )}
                  <div className={`relative z-10 ${isActive ? "text-primary drop-shadow-sm" : ""}`}>
                    {tab.icon(isActive)}
                  </div>
                </div>
                {/* Label */}
                <span className={`text-[10px] font-semibold leading-none tracking-wide transition-all duration-300 ${
                  isActive ? "text-primary opacity-100" : "opacity-60"
                }`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
