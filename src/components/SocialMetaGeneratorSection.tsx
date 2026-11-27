import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Link2,
  MessageCircle,
  RotateCcw,
  Share2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { Language, TranslationContent } from '../i18n/translations';
import {
  applyDocumentMetaTags,
  buildMetaTagsHtml,
  buildShareablePageUrl,
  DEFAULT_DOMAIN_ORIGIN,
  getRuntimeOrigin,
  resolveImageUrl,
  SOCIAL_PRESETS,
  type SocialImagePresetId,
  type SocialMetaConfig,
  type SocialSectionId,
  type TwitterCardType,
} from '../utils/socialMeta';

interface SocialMetaGeneratorSectionProps {
  t: TranslationContent['socialMeta'];
  lang: Language;
  isRtl: boolean;
  activeSection: SocialSectionId;
  onSectionChange: (section: SocialSectionId) => void;
}

type PreviewPlatform = 'twitter' | 'opengraph' | 'whatsapp';

const SECTION_IDS: SocialSectionId[] = [
  'home',
  'pieces-pro',
  'soko-mungu',
  'mungu-ai',
  'operations',
  'tarifs',
  'contact',
];

const IMAGE_PRESETS: SocialImagePresetId[] = [
  'dynamic-card',
  'hero',
  'mungu-ai',
  'engineering',
  'custom',
];

export function SocialMetaGeneratorSection({
  t,
  lang,
  isRtl,
  activeSection,
  onSectionChange,
}: SocialMetaGeneratorSectionProps) {
  const preset = SOCIAL_PRESETS[lang][activeSection];
  const runtimeOrigin = useMemo(() => getRuntimeOrigin(), []);

  const [title, setTitle] = useState(preset.title);
  const [description, setDescription] = useState(preset.description);
  const [shareUrl, setShareUrl] = useState(() =>
    buildShareablePageUrl(activeSection, lang, DEFAULT_DOMAIN_ORIGIN)
  );
  const [imagePreset, setImagePreset] = useState<SocialImagePresetId>(preset.defaultImagePreset);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [twitterCard, setTwitterCard] = useState<TwitterCardType>('summary_large_image');
  const [twitterHandle, setTwitterHandle] = useState('@munguanaweza');
  const [previewPlatform, setPreviewPlatform] = useState<PreviewPlatform>('twitter');

  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [appliedLive, setAppliedLive] = useState(false);

  // Sync editor defaults whenever active preset section or language switches
  useEffect(() => {
    const nextPreset = SOCIAL_PRESETS[lang][activeSection];
    setTitle(nextPreset.title);
    setDescription(nextPreset.description);
    setShareUrl(buildShareablePageUrl(activeSection, lang, DEFAULT_DOMAIN_ORIGIN));
    setImagePreset(nextPreset.defaultImagePreset);
    setAppliedLive(false);
  }, [lang, activeSection]);

  const resolvedPreviewImage = useMemo(
    () =>
      resolveImageUrl(imagePreset, customImageUrl, {
        origin: runtimeOrigin,
        title,
        subtitle: description,
        badge: preset.badge,
        lang,
      }),
    [imagePreset, customImageUrl, runtimeOrigin, title, description, preset.badge, lang]
  );

  const canonicalDomainImage = useMemo(
    () =>
      resolveImageUrl(imagePreset, customImageUrl, {
        origin: DEFAULT_DOMAIN_ORIGIN,
        title,
        subtitle: description,
        badge: preset.badge,
        lang,
      }),
    [imagePreset, customImageUrl, title, description, preset.badge, lang]
  );

  const metaConfig: SocialMetaConfig = useMemo(
    () => ({
      section: activeSection,
      lang,
      title: title.trim() || preset.title,
      description: description.trim() || preset.description,
      url: shareUrl.trim() || DEFAULT_DOMAIN_ORIGIN,
      imageUrl: canonicalDomainImage,
      imageAlt: title.trim() || preset.title,
      siteName: 'MUNGU ANA WEZA',
      twitterCard,
      twitterSite: twitterHandle.trim() || '@munguanaweza',
      ogType: activeSection === 'pieces-pro' || activeSection === 'tarifs' ? 'product' : 'website',
    }),
    [
      activeSection,
      lang,
      title,
      description,
      shareUrl,
      canonicalDomainImage,
      twitterCard,
      twitterHandle,
      preset.title,
      preset.description,
    ]
  );

  const generatedHtml = useMemo(() => buildMetaTagsHtml(metaConfig), [metaConfig]);

  const displayHost = useMemo(() => {
    try {
      return new URL(metaConfig.url).hostname.replace(/^www\./, '');
    } catch {
      return 'munguanaweza.com';
    }
  }, [metaConfig.url]);

  const titleLen = title.trim().length;
  const descLen = description.trim().length;
  const titleOptimal = titleLen >= 30 && titleLen <= 65;
  const descOptimal = descLen >= 110 && descLen <= 165;

  const handleApplyLive = () => {
    applyDocumentMetaTags({
      ...metaConfig,
      imageUrl: resolvedPreviewImage,
    });
    setAppliedLive(true);
    setTimeout(() => setAppliedLive(false), 3000);
  };

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2400);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleCopyShareLink = async () => {
    const liveShareLink = buildShareablePageUrl(activeSection, lang, runtimeOrigin);
    try {
      await navigator.clipboard.writeText(liveShareLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleReset = () => {
    const nextPreset = SOCIAL_PRESETS[lang][activeSection];
    setTitle(nextPreset.title);
    setDescription(nextPreset.description);
    setShareUrl(buildShareablePageUrl(activeSection, lang, DEFAULT_DOMAIN_ORIGIN));
    setImagePreset(nextPreset.defaultImagePreset);
    setCustomImageUrl('');
    setTwitterCard('summary_large_image');
    setTwitterHandle('@munguanaweza');
    setAppliedLive(false);
  };

  return (
    <section
      id="social-seo"
      aria-labelledby="social-seo-heading"
      className="relative bg-[#0D0D0D] py-16 sm:py-24 border-t border-[#D4AF37]/15"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wider text-[#D4AF37]">
              <Share2 className="h-4 w-4" aria-hidden="true" />
              <span>{t.kicker}</span>
            </p>
            <h2
              id="social-seo-heading"
              className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]"
            >
              {t.title}
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleApplyLive}
              className="gold-pill-btn inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              {appliedLive ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>{t.appliedLiveBadge}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span>{t.applyLiveBtn}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="gold-outline-pill inline-flex min-h-[42px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.resetBtn}</span>
            </button>
          </div>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Meta Editor Controls */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 space-y-5">
            {/* Section Presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                {t.presetLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {SECTION_IDS.map((id) => {
                  const active = activeSection === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onSectionChange(id)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                        active
                          ? 'bg-[#D4AF37] text-black'
                          : 'border border-white/15 bg-[#121212] text-neutral-300 hover:border-[#D4AF37]/50 hover:text-white'
                      }`}
                    >
                      {t.presets[id]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Title */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label
                  htmlFor="og-title-input"
                  className="text-xs font-semibold text-neutral-200"
                >
                  {t.titleLabel}
                </label>
                <span
                  className={`font-mono text-[11px] ${
                    titleOptimal ? 'text-emerald-400' : 'text-amber-300'
                  }`}
                >
                  {titleLen} {t.charCountSuffix} · {t.titleLengthIdeal}
                </span>
              </div>
              <input
                id="og-title-input"
                type="text"
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Social Description */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label
                  htmlFor="og-desc-input"
                  className="text-xs font-semibold text-neutral-200"
                >
                  {t.descriptionLabel}
                </label>
                <span
                  className={`font-mono text-[11px] ${
                    descOptimal ? 'text-emerald-400' : 'text-amber-300'
                  }`}
                >
                  {descLen} {t.charCountSuffix} · {t.descriptionLengthIdeal}
                </span>
              </div>
              <textarea
                id="og-desc-input"
                rows={3}
                maxLength={240}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none resize-none"
              />
            </div>

            {/* Canonical URL */}
            <div>
              <label
                htmlFor="og-url-input"
                className="block text-xs font-semibold text-neutral-200 mb-1.5"
              >
                {t.urlLabel}
              </label>
              <input
                id="og-url-input"
                type="url"
                dir="ltr"
                value={shareUrl}
                onChange={(e) => setShareUrl(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#0A0A0A] px-3.5 py-2.5 font-mono text-xs text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Card Image Selector */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200 mb-2">
                <ImageIcon className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.imageSourceLabel}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {IMAGE_PRESETS.map((presetId) => {
                  const active = imagePreset === presetId;
                  return (
                    <button
                      key={presetId}
                      type="button"
                      onClick={() => setImagePreset(presetId)}
                      className={`text-start rounded-xl px-3 py-2 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                        active
                          ? 'border border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]'
                          : 'border border-white/10 bg-[#121212] text-neutral-300 hover:border-white/25'
                      }`}
                    >
                      {t.imageSources[presetId]}
                    </button>
                  );
                })}
              </div>

              {imagePreset === 'custom' && (
                <input
                  type="url"
                  dir="ltr"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder={t.customImagePlaceholder}
                  className="mt-2.5 w-full rounded-xl border border-white/15 bg-[#0A0A0A] px-3.5 py-2 font-mono text-xs text-white placeholder-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
              )}
            </div>

            {/* Twitter Card Format & Handle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label
                  htmlFor="twitter-card-select"
                  className="block text-xs font-semibold text-neutral-200 mb-1.5"
                >
                  {t.twitterCardLabel}
                </label>
                <select
                  id="twitter-card-select"
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value as TwitterCardType)}
                  className="w-full rounded-xl border border-white/15 bg-[#0A0A0A] px-3 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="summary_large_image">{t.twitterCardLarge}</option>
                  <option value="summary">{t.twitterCardSummary}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="twitter-handle-input"
                  className="block text-xs font-semibold text-neutral-200 mb-1.5"
                >
                  {t.twitterHandleLabel}
                </label>
                <input
                  id="twitter-handle-input"
                  type="text"
                  dir="ltr"
                  maxLength={32}
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#0A0A0A] px-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Multi-Platform Preview + Generated HTML Code */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Card Preview Panel */}
            <div className="glass-panel rounded-3xl p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  {t.previewTitle}
                </h3>

                <div
                  role="tablist"
                  aria-label={t.previewTitle}
                  className="inline-flex rounded-full border border-white/10 bg-[#0A0A0A] p-1"
                >
                  {(['twitter', 'opengraph', 'whatsapp'] as PreviewPlatform[]).map((platform) => {
                    const active = previewPlatform === platform;
                    return (
                      <button
                        key={platform}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setPreviewPlatform(platform)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#D4AF37] text-black'
                            : 'text-neutral-300 hover:text-white'
                        }`}
                      >
                        {t.platformTabs[platform]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Platform Card Simulation */}
              <div className="mt-5">
                {previewPlatform === 'twitter' && twitterCard === 'summary_large_image' && (
                  <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0A0A0A] shadow-lg">
                    <div className="relative aspect-[1200/630] w-full overflow-hidden bg-[#111111]">
                      <img
                        src={resolvedPreviewImage}
                        alt={metaConfig.imageAlt}
                        className="h-full w-full object-cover"
                      />
                      <span
                        dir="ltr"
                        className="absolute bottom-3 start-3 rounded-md bg-black/80 px-2.5 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-sm"
                      >
                        {displayHost}
                      </span>
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="text-xs text-neutral-400" dir="ltr">
                        {metaConfig.twitterSite} · {displayHost}
                      </p>
                      <h4 className="font-display text-base font-bold text-white line-clamp-2">
                        {metaConfig.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2">
                        {metaConfig.description}
                      </p>
                    </div>
                  </div>
                )}

                {previewPlatform === 'twitter' && twitterCard === 'summary' && (
                  <div className="flex overflow-hidden rounded-2xl border border-white/15 bg-[#0A0A0A] shadow-lg">
                    <div className="w-28 sm:w-36 shrink-0 bg-[#111111]">
                      <img
                        src={resolvedPreviewImage}
                        alt={metaConfig.imageAlt}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-4 space-y-1 min-w-0">
                      <p className="text-xs text-neutral-400 truncate" dir="ltr">
                        {displayHost} · {metaConfig.twitterSite}
                      </p>
                      <h4 className="font-display text-sm sm:text-base font-bold text-white line-clamp-2">
                        {metaConfig.title}
                      </h4>
                      <p className="text-xs text-neutral-300 line-clamp-2">
                        {metaConfig.description}
                      </p>
                    </div>
                  </div>
                )}

                {previewPlatform === 'opengraph' && (
                  <div className="overflow-hidden rounded-xl border border-white/15 bg-[#16181D] shadow-lg">
                    <div className="aspect-[1200/630] w-full overflow-hidden bg-[#111111]">
                      <img
                        src={resolvedPreviewImage}
                        alt={metaConfig.imageAlt}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="border-t border-white/10 bg-[#1B1E24] p-4 space-y-1.5">
                      <p
                        className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-400"
                        dir="ltr"
                      >
                        <Globe className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
                        <span>{displayHost}</span>
                      </p>
                      <h4 className="font-display text-base font-bold text-white line-clamp-2">
                        {metaConfig.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2">
                        {metaConfig.description}
                      </p>
                    </div>
                  </div>
                )}

                {previewPlatform === 'whatsapp' && (
                  <div className="rounded-2xl border border-emerald-500/25 bg-[#0B141A] p-4 shadow-lg">
                    <div className="overflow-hidden rounded-xl bg-[#1F2C34]">
                      <div className="aspect-[1200/630] w-full overflow-hidden bg-[#111111]">
                        <img
                          src={resolvedPreviewImage}
                          alt={metaConfig.imageAlt}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-3.5 space-y-1 border-s-4 border-[#D4AF37]">
                        <h4 className="font-display text-sm sm:text-base font-bold text-white line-clamp-2">
                          {metaConfig.title}
                        </h4>
                        <p className="text-xs text-neutral-300 line-clamp-2">
                          {metaConfig.description}
                        </p>
                        <p className="font-mono text-[11px] text-neutral-400 pt-0.5" dir="ltr">
                          {displayHost}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-300" dir="ltr">
                      <span className="inline-flex items-center gap-1.5 underline decoration-emerald-400/50 truncate">
                        <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{metaConfig.url}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="gold-outline-pill inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  {copiedLink ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <Link2 className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                  )}
                  <span>{copiedLink ? t.copiedShareLinkBtn : t.copyShareLinkBtn}</span>
                </button>

                <a
                  href={resolvedPreviewImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gold-outline-pill inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  <span>{t.openOgImageBtn}</span>
                  <ExternalLink
                    className={`h-3.5 w-3.5 text-[#D4AF37] ${isRtl ? '-scale-x-100' : ''}`}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            {/* Generated HTML & JSON-LD Output */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
                  <Code2 className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  <span>{t.codeTitle}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#141414] px-3.5 py-1.5 text-xs font-semibold text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  {copiedHtml ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.copiedHtmlBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.copyHtmlBtn}</span>
                    </>
                  )}
                </button>
              </div>

              <pre
                dir="ltr"
                className="max-h-72 overflow-auto rounded-2xl border border-white/10 bg-[#070707] p-4 font-mono text-[11px] leading-relaxed text-neutral-300"
              >
                <code>{generatedHtml}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
