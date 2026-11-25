import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Language, TranslationContent } from '../i18n/translations';

interface NavbarProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  t: TranslationContent['nav'];
  a11y: TranslationContent['a11y'];
}

const LANGUAGES: { code: Language; label: string; nativeName: string }[] = [
  { code: 'fr', label: 'FR', nativeName: 'Français' },
  { code: 'en', label: 'EN', nativeName: 'English' },
  { code: 'ar', label: 'AR', nativeName: 'العربية' },
];

export function Navbar({ lang, onChangeLang, t, a11y }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const desktopLinks = [
    { href: '#pieces-pro', label: t.piecesPro },
    { href: '#soko-mungu', label: t.sokoMungu },
    { href: '#mungu-ai', label: t.munguAi },
    { href: '#tarifs', label: t.tarifs },
    { href: '#contact', label: t.contact },
  ];

  const mobileLinks = [
    { href: '#accueil', label: t.accueil },
    { href: '#pieces-pro', label: t.piecesPro },
    { href: '#soko-mungu', label: t.sokoMungu },
    { href: '#mungu-ai', label: t.munguAi },
    { href: '#operations', label: t.operations },
    { href: '#solutions', label: t.solutions },
    { href: '#tarifs', label: t.tarifs },
    { href: '#contact', label: t.contact },
  ];

  useEffect(() => {
    if (!mobileOpen && !langMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setLangMenuOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        langMenuOpen &&
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileOpen, langMenuOpen]);

  const activeLanguage =
    LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 border-b border-[#D4AF37]/25 bg-[#0A0A0A]/90 backdrop-blur-xl">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-4 focus:z-[60] focus:rounded-full focus:bg-[#D4AF37] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-black"
      >
        {a11y.skipToContent}
      </a>

      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#accueil"
          className="group flex items-center gap-2.5 whitespace-nowrap shrink-0 rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0 transition-transform duration-200 group-hover:scale-105"
          >
            <rect
              x="2"
              y="2"
              width="28"
              height="28"
              rx="7"
              stroke="#D4AF37"
              strokeWidth="1.5"
              fill="#111111"
            />
            <path
              d="M8.5 22V10L16 17.5L23.5 10V22"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-sm sm:text-lg font-bold tracking-wide text-white whitespace-nowrap">
            MUNGU ANA <span className="text-[#D4AF37]">WEZA</span>
          </span>
        </a>

        {/* Zone 2: 5 Clean Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label={a11y.primaryNav}>
          {desktopLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 text-sm font-medium text-neutral-300 transition-colors duration-150 hover:text-[#D4AF37] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-[#D4AF37] after:transition-transform after:duration-200 hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Switcher Dropdown + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div ref={langMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              aria-label={a11y.languageSelector}
              aria-haspopup="menu"
              aria-expanded={langMenuOpen}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#111111] px-3 sm:px-3.5 text-xs font-bold tracking-wider text-white transition-colors duration-150 hover:border-[#D4AF37] hover:text-[#D4AF37] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <Globe className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
              <span>{activeLanguage.label}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#D4AF37] transition-transform duration-200 ${
                  langMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  role="menu"
                  aria-label={a11y.languageSelector}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: -6, scale: 0.98 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -4, scale: 0.98 }
                  }
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute end-0 top-full mt-2 w-44 origin-top overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-[#111111]/95 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl z-50"
                >
                  {LANGUAGES.map((item) => {
                    const active = lang === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => {
                          onChangeLang(item.code);
                          setLangMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                          active
                            ? 'bg-[#D4AF37]/15 text-[#D4AF37]'
                            : 'text-neutral-200 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
                            {item.label}
                          </span>
                          <span>{item.nativeName}</span>
                        </span>
                        {active && (
                          <Check className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? t.menuClose : t.menuOpen}
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#111111] text-white transition-colors hover:border-[#D4AF37] lg:hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#D4AF37]/20 bg-[#0A0A0A]/98 backdrop-blur-xl lg:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col px-4 py-3 space-y-1"
            aria-label={a11y.mobileNav}
          >
            {mobileLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="min-h-[44px] flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-[#141414] hover:text-[#D4AF37]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
