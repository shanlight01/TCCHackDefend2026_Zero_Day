"use client";

import { useState, useEffect } from "react";

type InstallState = "unknown" | "installable" | "installed" | "ios";

export function PWAInstallPrompt() {
  const [installState, setInstallState] = useState<InstallState>("unknown");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstallState("installed");
      return;
    }

    // Detect iOS Safari (no beforeinstallprompt support)
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS || isSafari) {
      setInstallState("ios");
      return;
    }

    // Chrome/Edge Android — wait for the browser prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallState("installable");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstallState("installed");
      }
      setDeferredPrompt(null);
    } else {
      setShowIOSGuide(!showIOSGuide);
    }
  };

  // Don't show anything if installed or dismissed
  if (installState === "installed" || dismissed) {
    return null;
  }

  // Determine browser/OS instructions
  const isApple = installState === "ios";

  return (
    <>
      {/* ── Desktop Navbar Button (Chrome/Edge) ── */}
      {installState === "installable" && (
        <button
          onClick={handleInstallClick}
          className="hidden lg:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors ml-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Installer l&apos;App
        </button>
      )}

      {/* ── Mobile Floating Banner (shown in browser only) ── */}
      <div className="lg:hidden fixed bottom-16 left-3 right-3 z-[60]">
        <div className="bg-card/95 backdrop-blur border border-border rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
          
          {/* Main install row */}
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-sm font-bold text-foreground">Installer l&apos;application</h4>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Pour l&apos;avoir sur ton écran d&apos;accueil sans navigateur.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setDismissed(true)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Fermer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              {installState === "installable" ? (
                <button
                  onClick={handleInstallClick}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover transition-all active:scale-95 shadow-md shadow-primary/20"
                >
                  Installer
                </button>
              ) : (
                <button
                  onClick={() => setShowIOSGuide(!showIOSGuide)}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover transition-all active:scale-95 shadow-md shadow-primary/20"
                >
                  {showIOSGuide ? "Fermer" : "Installer"}
                </button>
              )}
            </div>
          </div>

          {/* Guide collapsable pour installer (iOS ou Android) */}
          {showIOSGuide && (
            <div className="border-t border-border bg-muted/40 px-4 py-3.5">
              <p className="text-xs font-bold text-foreground mb-2">
                {isApple ? "Sur iPhone / iPad (Safari) :" : "Sur Android (Chrome / Brave) :"}
              </p>
              <ol className="space-y-2">
                {isApple ? (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">1</span>
                      <span className="text-[11px] text-muted-foreground leading-tight">Appuie sur l&apos;icône <strong>Partager</strong> (le carré avec la flèche vers le haut ⎋) en bas.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">2</span>
                      <span className="text-[11px] text-muted-foreground leading-tight">Fais défiler vers le bas et choisis <strong>« Sur l&apos;écran d&apos;accueil »</strong>.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">3</span>
                      <span className="text-[11px] text-muted-foreground leading-tight">Confirme en cliquant sur <strong>« Ajouter »</strong> en haut à droite.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">1</span>
                      <span className="text-[11px] text-muted-foreground leading-tight">Appuie sur les <strong>trois petits points (menu) `⋮`</strong> en haut à droite.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">2</span>
                      <span className="text-[11px] text-muted-foreground leading-tight">Choisis <strong>« Installer l&apos;application »</strong> ou « Ajouter à l&apos;écran d&apos;accueil ».</span>
                    </li>
                  </>
                )}
              </ol>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
