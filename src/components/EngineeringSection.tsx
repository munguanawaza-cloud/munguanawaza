import { ArrowUpRight, Globe, Layers, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import type { TranslationContent } from '../i18n/translations';

interface EngineeringSectionProps {
  t: TranslationContent['engineering'];
  isRtl: boolean;
  onRequestQuote: () => void;
}

const ICONS = {
  web_mobile: Globe,
  erp_crm: Layers,
  digital_growth: TrendingUp,
} as const;

export function EngineeringSection({
  t,
  isRtl,
  onRequestQuote,
}: EngineeringSectionProps) {
  return (
    <section
      id="solutions"
      aria-labelledby="engineering-heading"
      className="relative bg-[#0A0A0A] py-16 sm:py-24 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="text-xs sm:text-sm font-medium tracking-wider text-[#D4AF37]">
            {t.kicker}
          </p>
          <h2
            id="engineering-heading"
            className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]"
          >
            {t.title}
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {t.services.map((service, idx) => {
            const Icon = ICONS[service.id];
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular text-xs font-bold text-[#D4AF37]">
                      {service.number}
                    </span>
                    <Icon className="h-5 w-5 text-[#D4AF37]/85" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                    {service.summary}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                    {service.deliverables.map((item, dIdx) => (
                      <span key={item} className="inline-flex items-center gap-2">
                        <span>{item}</span>
                        {dIdx < service.deliverables.length - 1 && (
                          <span aria-hidden="true" className="text-[#D4AF37]">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={onRequestQuote}
                      className="gold-outline-pill inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    >
                      <span>{t.selectAction}</span>
                      <ArrowUpRight className={`h-4 w-4 text-[#D4AF37] ${isRtl ? '-scale-x-100' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
