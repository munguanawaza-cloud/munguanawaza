import { useState } from 'react';
import { Bot, Cpu, MessageCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import type { TranslationContent } from '../i18n/translations';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface MunguAISectionProps {
  t: TranslationContent['munguAi'];
  whatsappGreeting: string;
  onOpenAssistant: () => void;
}

const MUNGU_AI_IMAGE = '/src/assets/images/mungu_ai_backdrop.jpg';

export function MunguAISection({
  t,
  whatsappGreeting,
  onOpenAssistant,
}: MunguAISectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="mungu-ai"
      aria-labelledby="mungu-ai-heading"
      className="relative bg-[#060606] py-16 sm:py-24 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Visual Frame */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel order-2 lg:order-1 rounded-3xl p-2 lg:col-span-5"
          >
            <div className="relative h-full min-h-[280px] sm:min-h-[380px] overflow-hidden rounded-[20px] bg-[#111111]">
              {!imgError ? (
                <img
                  src={MUNGU_AI_IMAGE}
                  alt={t.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center bg-gradient-to-br from-[#141414] to-black p-8">
                  <Cpu className="h-12 w-12 text-[#D4AF37]" aria-hidden="true" />
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
              />
              <div className="absolute inset-x-6 bottom-6">
                <div className="font-display text-2xl font-bold text-white">{t.title}</div>
                <p className="mt-1 text-xs sm:text-sm text-neutral-300">{t.subtitle}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Narrative & Advisory Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 flex flex-col justify-between glass-panel rounded-3xl p-6 sm:p-10 lg:col-span-7"
          >
            <div>
              <p className="text-xs sm:text-sm font-medium tracking-wider text-[#D4AF37]">
                {t.kicker}
              </p>
              <h2
                id="mungu-ai-heading"
                className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
              >
                {t.title}
              </h2>
              <p className="mt-2 text-lg font-medium text-[#D4AF37]">{t.subtitle}</p>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300">
                {t.description}
              </p>

              {/* Explicit Human Control & Non-Automated Finance Disclaimer */}
              <div className="mt-6 rounded-2xl border border-[#D4AF37]/35 bg-[#12100A] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">{t.disclaimerTitle}</div>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-300">
                      {t.disclaimerBody}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {t.capabilities.map((cap) => (
                  <div
                    key={cap.number}
                    className="rounded-2xl border border-white/10 bg-[#0E0E0E] p-4"
                  >
                    <div className="font-mono-tabular text-xs font-bold text-[#D4AF37]">
                      {cap.number}
                    </div>
                    <div className="mt-1.5 text-sm font-semibold text-white">{cap.title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-400">{cap.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={onOpenAssistant}
                className="gold-pill-btn inline-flex min-h-[46px] items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <Bot className="h-4 w-4" aria-hidden="true" />
                <span>{t.ctaOpenAssistant}</span>
              </button>

              <a
                href={buildWhatsAppUrl(whatsappGreeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-outline-pill inline-flex min-h-[46px] items-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <MessageCircle className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.ctaAskWhatsapp}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
