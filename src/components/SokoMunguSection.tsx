import { useState } from 'react';
import { ArrowUpRight, Info, Store } from 'lucide-react';
import { motion } from 'motion/react';
import type { TranslationContent } from '../i18n/translations';

interface SokoMunguSectionProps {
  t: TranslationContent['sokoMungu'];
  isRtl: boolean;
  onExpressInterest: () => void;
}

const SOKO_IMAGE = '/src/assets/images/service_web_engineering_1795552984879.jpg';

export function SokoMunguSection({ t, isRtl, onExpressInterest }: SokoMunguSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="soko-mungu"
      aria-labelledby="soko-mungu-heading"
      className="relative bg-black py-16 sm:py-24 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Narrative & Honest Status Notice */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between glass-panel rounded-3xl p-6 sm:p-10 lg:col-span-7"
          >
            <div>
              <p className="text-xs sm:text-sm font-medium tracking-wider text-[#D4AF37]">
                {t.kicker}
              </p>
              <h2
                id="soko-mungu-heading"
                className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
              >
                {t.title}
              </h2>
              <p className="mt-2 text-lg font-medium text-[#D4AF37]">{t.subtitle}</p>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300">
                {t.description}
              </p>

              {/* Transparent Future-Stage Disclosure */}
              <div className="mt-6 rounded-2xl border border-[#D4AF37]/35 bg-[#12100A] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-semibold text-white">{t.noticeTitle}</div>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-300">
                      {t.noticeBody}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="text-xs font-semibold tracking-wider text-neutral-400">
                {t.roadmapTitle}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {t.roadmapItems.map((item) => (
                  <div
                    key={item.number}
                    className="rounded-2xl border border-white/10 bg-[#0E0E0E] p-4"
                  >
                    <div className="font-mono-tabular text-xs font-bold text-[#D4AF37]">
                      {item.number}
                    </div>
                    <div className="mt-1.5 text-sm font-semibold text-white">{item.title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <button
                  type="button"
                  onClick={onExpressInterest}
                  className="gold-outline-pill inline-flex min-h-[46px] items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  <span>{t.ctaInterest}</span>
                  <ArrowUpRight className={`h-4 w-4 text-[#D4AF37] ${isRtl ? '-scale-x-100' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Architectural Visual */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-3xl p-2 lg:col-span-5"
          >
            <div className="relative h-full min-h-[280px] sm:min-h-[380px] overflow-hidden rounded-[20px] bg-[#111111]">
              {!imgError ? (
                <img
                  src={SOKO_IMAGE}
                  alt={t.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center bg-gradient-to-br from-[#141414] to-black p-8">
                  <Store className="h-12 w-12 text-[#D4AF37]" aria-hidden="true" />
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
        </div>
      </div>
    </section>
  );
}
