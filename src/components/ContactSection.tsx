import { useEffect, useState, type FormEvent } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { Language, PlanInquiryId, TranslationContent } from '../i18n/translations';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { KolweziHeadquartersMap } from './KolweziHeadquartersMap';

interface ContactSectionProps {
  t: TranslationContent['contact'];
  lang: Language;
  isRtl: boolean;
  selectedPlan: PlanInquiryId;
  onSelectPlan: (planId: PlanInquiryId) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/;

export function ContactSection({
  t,
  lang,
  isRtl,
  selectedPlan,
  onSelectPlan,
}: ContactSectionProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [brief, setBrief] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    setError('');
  }, [name, contactInfo, brief, selectedPlan, lang]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(t.channels.emailValue);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  const buildWhatsAppSummary = (refCode?: string) => {
    const selectedLabel =
      t.form.planOptions.find((o) => o.id === selectedPlan)?.label ?? selectedPlan;
    return [
      t.form.whatsappHeader,
      refCode ? `${t.form.successReferenceLabel}: ${refCode}` : '',
      `${t.form.planLabel}: ${selectedLabel}`,
      name.trim() ? `${t.form.nameLabel.replace(' *', '')}: ${name.trim()}` : '',
      company.trim() ? `${t.form.companyLabel}: ${company.trim()}` : '',
      contactInfo.trim() ? `${t.form.contactLabel.replace(' *', '')}: ${contactInfo.trim()}` : '',
      brief.trim() ? `${t.form.briefLabel.replace(' *', '')}: ${brief.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedContact = contactInfo.trim();
    const trimmedBrief = brief.trim();

    if (!trimmedName || !trimmedContact || !trimmedBrief) {
      setError(t.form.validationEmptyError);
      return;
    }

    if (!EMAIL_RE.test(trimmedContact) && !PHONE_RE.test(trimmedContact)) {
      setError(t.form.validationContactError);
      return;
    }

    if (trimmedBrief.length < 6) {
      setError(t.form.validationBriefError);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          company: company.trim(),
          contactInfo: trimmedContact,
          serviceId: selectedPlan,
          brief: trimmedBrief,
          lang,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; referenceId?: string };
      if (response.ok && data.ok) {
        setReferenceId(data.referenceId ?? '');
      } else {
        setReferenceId(`WA-${Date.now().toString().slice(-6)}`);
      }
      setSubmitted(true);
    } catch {
      // Static-hosting fallback: still generate clean WhatsApp summary without blocking user
      setReferenceId(`WA-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setCompany('');
    setContactInfo('');
    setBrief('');
    setReferenceId('');
    setSubmitted(false);
    setError('');
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative bg-[#060606] py-16 sm:py-24 border-t border-white/5"
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
            id="contact-heading"
            className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]"
          >
            {t.title}
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          {/* Direct Channels */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between gap-5 lg:col-span-5"
          >
            {/* WhatsApp */}
            <div className="glass-panel rounded-3xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wider text-[#D4AF37]">
                    {t.channels.whatsappTitle}
                  </span>
                  <MessageCircle className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
                </div>
                <div
                  className="mt-3 font-display text-xl sm:text-2xl font-bold text-white tabular-nums"
                  dir="ltr"
                >
                  {t.channels.whatsappValue}
                </div>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {t.channels.whatsappNote}
                </p>
              </div>
              <div className="mt-5">
                <a
                  href={buildWhatsAppUrl(buildWhatsAppSummary())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-pill-btn inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>{t.channels.whatsappAction}</span>
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="glass-panel rounded-3xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wider text-[#D4AF37]">
                    {t.channels.emailTitle}
                  </span>
                  <Mail className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
                </div>
                <a
                  href={`mailto:${t.channels.emailValue}`}
                  className="mt-3 block font-display text-lg sm:text-xl font-bold text-white hover:text-[#D4AF37] transition-colors break-all"
                  dir="ltr"
                >
                  {t.channels.emailValue}
                </a>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="gold-outline-pill inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  {copiedEmail ? (
                    <Check className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  )}
                  <span>{copiedEmail ? t.channels.emailCopied : t.channels.emailCopy}</span>
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="glass-panel rounded-3xl p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wider text-[#D4AF37]">
                    {t.channels.locationTitle}
                  </span>
                  <MapPin className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
                </div>
                <div className="mt-3 font-display text-xl font-bold text-white">
                  {t.channels.locationValue}
                </div>
                <p className="mt-1 text-xs sm:text-sm text-neutral-300" dir="ltr">
                  {t.channels.locationDetail}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Trial & Contact Form with WhatsApp Summary Output */}
          <motion.div
            id="quote-form"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-3xl p-6 sm:p-9 lg:col-span-7 flex flex-col justify-center"
          >
            {submitted ? (
              <div className="py-4 max-w-xl mx-auto w-full" aria-live="polite">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
                    <CheckCircle2 className="h-7 w-7 text-[#D4AF37]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-white">
                    {t.form.successTitle}
                  </h3>
                  {referenceId && (
                    <p className="mt-2 font-mono-tabular text-sm font-semibold text-[#D4AF37]" dir="ltr">
                      {t.form.successReferenceLabel}: {referenceId}
                    </p>
                  )}
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-300">
                    {t.form.successMessage}
                  </p>
                </div>

                {/* Clear Formatted WhatsApp Summary Preview */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#111111] p-4">
                  <div className="text-xs font-semibold text-[#D4AF37]">
                    {t.form.summaryHeading}
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-neutral-200">
                    {buildWhatsAppSummary(referenceId)}
                  </pre>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
                  <a
                    href={buildWhatsAppUrl(buildWhatsAppSummary(referenceId))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-pill-btn inline-flex min-h-[46px] items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>{t.form.sendSummaryWhatsappBtn}</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="gold-outline-pill inline-flex min-h-[46px] items-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer"
                  >
                    <span>{t.form.resetBtn}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">{t.form.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-400">{t.form.subtitle}</p>
                </div>

                <div>
                  <label
                    htmlFor="plan-select"
                    className="block text-xs font-medium text-neutral-300 mb-2"
                  >
                    {t.form.planLabel}
                  </label>
                  <select
                    id="plan-select"
                    value={selectedPlan}
                    onChange={(e) => onSelectPlan(e.target.value as PlanInquiryId)}
                    className="min-h-[44px] w-full rounded-2xl border border-white/15 bg-[#111111] px-4 py-3 text-xs sm:text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    {t.form.planOptions.map((option) => (
                      <option key={option.id} value={option.id} className="bg-[#111111] text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="quote-name"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      {t.form.nameLabel}
                    </label>
                    <input
                      id="quote-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.form.namePlaceholder}
                      required
                      className="min-h-[44px] w-full rounded-2xl border border-white/15 bg-[#111111] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quote-company"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      {t.form.companyLabel}
                    </label>
                    <input
                      id="quote-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={t.form.companyPlaceholder}
                      className="min-h-[44px] w-full rounded-2xl border border-white/15 bg-[#111111] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quote-contact"
                    className="block text-xs font-medium text-neutral-300 mb-1.5"
                  >
                    {t.form.contactLabel}
                  </label>
                  <input
                    id="quote-contact"
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder={t.form.contactPlaceholder}
                    required
                    className="min-h-[44px] w-full rounded-2xl border border-white/15 bg-[#111111] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quote-brief"
                    className="block text-xs font-medium text-neutral-300 mb-1.5"
                  >
                    {t.form.briefLabel}
                  </label>
                  <textarea
                    id="quote-brief"
                    rows={3}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder={t.form.briefPlaceholder}
                    required
                    className="w-full resize-none rounded-2xl border border-white/15 bg-[#111111] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div aria-live="polite">
                  {error && (
                    <p role="alert" className="text-xs sm:text-sm text-amber-400">
                      {error}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="gold-pill-btn inline-flex min-h-[46px] items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{isSubmitting ? t.form.submittingBtn : t.form.submitBtn}</span>
                  </button>

                  <a
                    href={buildWhatsAppUrl(buildWhatsAppSummary())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-outline-pill inline-flex min-h-[46px] items-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                    <span>{t.form.directWhatsappBtn}</span>
                  </a>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        <KolweziHeadquartersMap t={t.map} lang={lang} isRtl={isRtl} />
      </div>
    </section>
  );
}
