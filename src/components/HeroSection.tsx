import { useState } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import type { TranslationContent } from '../i18n/translations';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface HeroSectionProps {
  t: TranslationContent['hero'];
  isRtl: boolean;
  onStartTrial: () => void;
}

const HERO_IMAGE = '/src/assets/images/hero_tech_architecture_1795552984249.jpg';

export function HeroSection({ t, isRtl, onStartTrial }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="accueil"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#0A0A0A] pt-10 pb-16 sm:pt-16 sm:pb-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-44 left-1/2 h-[540px] w-[960px] -translate-x-1/2 rounded-full bg-[#D4AF37]/8 blur-[150px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center lg:col-span-6"
          >
            <p className="mb-3 text-xs sm:text-sm font-medium tracking-wider text-[#D4AF37]">
              {t.kicker}
            </p>

            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.15rem,4.4vw,4rem)] font-bold leading-[1.08] tracking-tight text-white [text-wrap:balance]"
            >
              {t.headline}
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-neutral-300">
              {t.subheadline}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onStartTrial}
                className="gold-pill-btn inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 sm:px-7 py-3 text-sm sm:text-base font-semibold whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <span>{t.ctaTrial}</span>
                <ArrowUpRight className={`h-4 w-4 ${isRtl ? '-scale-x-100' : ''}`} />
              </button>

              <a
                href="#contact"
                className="gold-outline-pill inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <span>{t.ctaContact}</span>
              </a>
            </div>

            <div className="mt-4">
              <a
                href={buildWhatsAppUrl(t.whatsappGreeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 text-xs sm:text-sm font-medium text-neutral-300 transition-colors hover:text-[#D4AF37] py-1"
              >
                <MessageCircle className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.ctaWhatsapp}</span>
              </a>
            </div>
          </motion.div>

          {/* Architectural Visual Carrier */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="glass-panel relative h-full min-h-[260px] sm:min-h-[380px] overflow-hidden rounded-3xl p-2">
              <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#111111]">
                {!imgError ? (
                  <img
                    src={HERO_IMAGE}
                    alt={t.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover lg:h-full"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#111111] via-[#0A0A0A] to-[#1a1506] p-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-black/70">
                      <span className="font-display text-2xl font-bold text-[#D4AF37]">M</span>
                    </div>
                    <p className="font-display text-lg font-semibold text-white">MUNGU ANA WEZA</p>
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-[#0A0A0A]/15 to-transparent"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4-Column Global Ecosystem Strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {t.pillars.map((pillar) => (
            <a
              key={pillar.title}
              href={pillar.href}
              className="glass-panel group block rounded-2xl px-5 py-5 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-base sm:text-lg font-bold text-[#D4AF37]">
                  {pillar.title}
                </span>
                <ArrowUpRight
                  className={`h-4 w-4 shrink-0 text-neutral-400 transition-colors group-hover:text-[#D4AF37] ${
                    isRtl ? '-scale-x-100' : ''
                  }`}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {pillar.description}
              </p>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
