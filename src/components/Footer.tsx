import type { Language, TranslationContent } from '../i18n/translations';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  t: TranslationContent;
}

export function Footer({ lang, onChangeLang, t }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#D4AF37]/20 bg-[#070707] pt-12 pb-28 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="font-display text-lg font-bold tracking-wide text-white">
              MUNGU ANA <span className="text-[#D4AF37]">WEZA</span>
            </div>
            <p className="mt-2 max-w-md text-sm text-neutral-300">{t.footer.tagline}</p>
            <p className="mt-1 text-xs text-neutral-400">{t.footer.location}</p>
          </div>

          <nav
            aria-label={t.a11y.footerNav}
            className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-neutral-300"
          >
            <a href="#accueil" className="hover:text-[#D4AF37] transition-colors">
              {t.nav.accueil}
            </a>
            <a href="#pieces-pro" className="hover:text-[#D4AF37] transition-colors">
              {t.nav.piecesPro}
            </a>
            <a href="#soko-mungu" className="hover:text-[#D4AF37] transition-colors">
              {t.nav.sokoMungu}
            </a>
            <a href="#mungu-ai" className="hover:text-[#D4AF37] transition-colors">
              {t.nav.munguAi}
            </a>
            <a href="#operations" className="hover:text-[#D4AF37] transition-colors">
              {t.nav.operations}
            </a>
            <a href="#solutions" className="hover:text-[#D4AF37] transition-colors">
              {t.nav.solutions}
            </a>
            <a href="#tarifs" className="hover:text-[#D4AF37] transition-colors">
              {t.nav.tarifs}
            </a>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors">
              {t.nav.contact}
            </a>
            <a
              href={`mailto:${t.contact.channels.emailValue}`}
              className="hover:text-[#D4AF37] transition-colors"
              dir="ltr"
            >
              {t.contact.channels.emailValue}
            </a>
            <a
              href={buildWhatsAppUrl(t.hero.whatsappGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:underline"
              dir="ltr"
            >
              +243 891 733 969
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-400">
            © {year} {t.footer.rights}
          </p>

          <div
            role="group"
            aria-label={t.a11y.languageSelector}
            className="flex items-center gap-3 text-xs text-neutral-400"
          >
            {(['fr', 'en', 'ar'] as Language[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onChangeLang(code)}
                aria-pressed={lang === code}
                className={`cursor-pointer uppercase transition-colors px-2 py-1 rounded ${
                  lang === code ? 'font-semibold text-[#D4AF37]' : 'hover:text-white'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
