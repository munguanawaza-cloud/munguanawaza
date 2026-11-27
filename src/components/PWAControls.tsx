import { useState } from 'react';
import { CheckCircle2, Download, Share, Smartphone, Wifi, WifiOff, X } from 'lucide-react';
import type { TranslationContent } from '../i18n/translations';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWA';

interface PWAControlsProps {
  t: TranslationContent['pwa'];
}

export function PWAInstallButton({ t }: PWAControlsProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#141414] px-3 sm:px-3.5 text-xs font-semibold text-[#D4AF37] transition-colors duration-150 hover:bg-[#D4AF37] hover:text-black whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
      >
        <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">{t.installBtn}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#141414] px-3 sm:px-3.5 text-xs font-semibold text-[#D4AF37] transition-colors duration-150 hover:bg-[#D4AF37] hover:text-black whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          <Smartphone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">{t.installIosBtn}</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-pwa-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          >
            <div className="glass-panel w-full max-w-sm rounded-3xl p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <h3 id="ios-pwa-title" className="font-display text-lg font-bold text-white">
                  {t.iosModalTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={t.closeBtn}
                  className="rounded-full p-1 text-neutral-400 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-neutral-300">
                <p className="flex items-center gap-2">
                  <Share className="h-4 w-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span>{t.iosStep1}</span>
                </p>
                <p>{t.iosStep2}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="gold-pill-btn mt-6 w-full rounded-full py-2.5 text-sm font-semibold cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

export function OfflineStatusBanner({ t }: PWAControlsProps) {
  const { isOnline, justRestored, offlineReady } = useOnlineStatus();

  if (!isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 start-4 z-50 max-w-sm rounded-2xl border border-amber-500/45 bg-[#111111]/95 px-4 py-3 text-xs text-white shadow-[0_12px_32px_rgba(0,0,0,0.7)] backdrop-blur-xl"
      >
        <div className="flex items-start gap-2.5">
          <WifiOff className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-amber-300">{t.offlineBannerTitle}</p>
            <p className="mt-0.5 text-[11px] text-neutral-300">{t.offlineBannerSubtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  if (justRestored) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 start-4 z-50 flex items-center gap-2 rounded-full border border-emerald-500/45 bg-[#111111]/95 px-4 py-2 text-xs font-semibold text-emerald-300 shadow-lg backdrop-blur-xl"
      >
        <Wifi className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{t.onlineRestoredToast}</span>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 start-4 z-50 flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-[#111111]/95 px-4 py-2 text-xs font-semibold text-[#D4AF37] shadow-lg backdrop-blur-xl"
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{t.offlineReadyToast}</span>
      </div>
    );
  }

  return null;
}
