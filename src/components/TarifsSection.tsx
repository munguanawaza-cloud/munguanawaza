import { ArrowUpRight, Check, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import type { PlanInquiryId, TranslationContent } from '../i18n/translations';

interface TarifsSectionProps {
  t: TranslationContent['tarifs'];
  isRtl: boolean;
  onSelectPlan: (planId: PlanInquiryId) => void;
}

export function TarifsSection({ t, isRtl, onSelectPlan }: TarifsSectionProps) {
  return (
    <section
      id="tarifs"
      aria-labelledby="tarifs-heading"
      className="relative bg-black py-16 sm:py-24 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
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
            id="tarifs-heading"
            className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]"
          >
            {t.title}
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300">
            {t.subtitle}
          </p>
        </motion.div>

        {/* USD Reference & M-Pesa FC Manual Payment Clarification Banner */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-r from-[#161207] via-[#101010] to-[#0D0D0D] p-5 sm:p-7"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3.5 max-w-4xl">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-black">
                <Smartphone className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  {t.currencyNoteTitle}
                </h3>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-300">
                  {t.currencyNoteBody}
                </p>
              </div>
            </div>
            <div className="text-xs font-semibold text-[#D4AF37] shrink-0">
              {t.paymentMethodsBadge}
            </div>
          </div>
        </motion.div>

        {/* 4 Plans Grid: 7-Day Free Trial, Standard, Pro, Entreprise */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.plans.map((plan, idx) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-panel flex flex-col justify-between rounded-3xl p-6 transition-transform duration-200 hover:-translate-y-0.5 ${
                plan.highlighted
                  ? 'border-[#D4AF37]/70 shadow-[0_20px_60px_rgba(212,175,55,0.14)]'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                  {plan.highlighted && (
                    <span className="text-xs font-semibold text-[#D4AF37]">
                      {t.recommendedTag}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-baseline gap-2" dir="ltr">
                  <span className="font-display text-3xl font-bold text-[#D4AF37] tabular-nums">
                    {plan.usdPrice}
                  </span>
                  <span className="text-xs text-neutral-400">{plan.period}</span>
                </div>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-300">
                  {plan.summary}
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]"
                        aria-hidden="true"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    plan.highlighted ? 'gold-pill-btn' : 'gold-outline-pill'
                  }`}
                >
                  <span>{t.selectPlanBtn}</span>
                  <ArrowUpRight className={`h-4 w-4 ${isRtl ? '-scale-x-100' : ''}`} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* 3-Step M-Pesa FC Manual Payment Workflow */}
        <div className="mt-10 glass-panel rounded-3xl p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold text-white">{t.paymentStepsTitle}</h3>
          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.paymentSteps.map((step) => (
              <div key={step.step} className="border-t border-white/10 pt-4 md:border-t-0 md:pt-0">
                <div className="font-mono-tabular text-xs font-bold text-[#D4AF37]">
                  {step.step}
                </div>
                <div className="mt-1.5 text-sm font-semibold text-white">{step.title}</div>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-400">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
