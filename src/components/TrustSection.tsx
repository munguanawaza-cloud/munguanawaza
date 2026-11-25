import { ArrowUpRight, CheckCircle2, Cpu, Headphones, Receipt, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import type { TranslationContent } from '../i18n/translations';

interface TrustSectionProps {
  t: TranslationContent['trust'];
  isRtl: boolean;
  onStartTrial: () => void;
}

const ICONS = {
  shield: ShieldCheck,
  cpu: Cpu,
  receipt: Receipt,
  headphones: Headphones,
} as const;

export function TrustSection({ t, isRtl, onStartTrial }: TrustSectionProps) {
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
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
            id="trust-heading"
            className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]"
          >
            {t.title}
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300">
            {t.subtitle}
          </p>
        </motion.div>

        {/* 4 Verifiable Enterprise Trust Pillars */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.pillars.map((pillar, idx) => {
            const Icon = ICONS[pillar.iconKey];
            return (
              <motion.article
                key={pillar.index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel flex flex-col justify-between rounded-3xl p-6 transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/45"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/10">
                      <Icon className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#D4AF37] tabular-nums">
                      {pillar.index}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-neutral-300">
                    {pillar.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Verified Enterprise Assurance Strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#141108] via-[#111111] to-[#0D0D0D] p-6 sm:p-7"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                {t.assuranceStripTitle}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:gap-x-7 lg:gap-y-2">
                {t.assuranceItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs sm:text-sm text-neutral-200"
                  >
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-[#D4AF37]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onStartTrial}
              className="btn-gold inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <span>{t.ctaLabel}</span>
              <ArrowUpRight
                className={`h-4 w-4 ${isRtl ? '-scale-x-100' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
