import type { Language } from '../i18n/translations';

export type SocialSectionId =
  | 'home'
  | 'pieces-pro'
  | 'soko-mungu'
  | 'mungu-ai'
  | 'operations'
  | 'tarifs'
  | 'contact';

export type TwitterCardType = 'summary_large_image' | 'summary';
export type SocialImagePresetId = 'dynamic-card' | 'hero' | 'mungu-ai' | 'engineering' | 'custom';

export interface SocialMetaConfig {
  section: SocialSectionId;
  lang: Language;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  imageAlt: string;
  siteName: string;
  twitterCard: TwitterCardType;
  twitterSite: string;
  ogType: 'website' | 'product';
}

export interface SocialPresetContent {
  title: string;
  description: string;
  badge: string;
  defaultImagePreset: SocialImagePresetId;
  hash: string;
}

export const DEFAULT_DOMAIN_ORIGIN = 'https://munguanaweza.com';

export const IMAGE_PRESET_PATHS: Record<Exclude<SocialImagePresetId, 'dynamic-card' | 'custom'>, string> = {
  hero: '/src/assets/images/hero_tech_architecture_1795552984249.jpg',
  'mungu-ai': '/src/assets/images/mungu_ai_backdrop.jpg',
  engineering: '/src/assets/images/service_web_engineering_1795552984879.jpg',
};

export const LOCALE_MAP: Record<Language, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  ar: 'ar_AR',
};

export const SOCIAL_PRESETS: Record<Language, Record<SocialSectionId, SocialPresetContent>> = {
  fr: {
    home: {
      title: 'MUNGU ANA WEZA — Infrastructure SaaS & IA d’Entreprise',
      description:
        'Pilotez stocks, POS, recouvrements multi-devises et automatisation IA avec MUNGU ANA WEZA. Démarrez votre essai gratuit de 7 jours sur munguanaweza.com.',
      badge: 'Global SaaS & Tech Enterprise',
      defaultImagePreset: 'dynamic-card',
      hash: '#accueil',
    },
    'pieces-pro': {
      title: 'PIECES PRO / NOVA OS — Stock, POS & Recouvrement Cloud',
      description:
        'Contrôlez votre inventaire, vos ventes POS et vos échéanciers multi-devises (USD/CDF/EUR) en temps réel avec PIECES PRO / NOVA OS. Essai gratuit 7 jours.',
      badge: 'PIECES PRO · NOVA OS',
      defaultImagePreset: 'hero',
      hash: '#pieces-pro',
    },
    'soko-mungu': {
      title: 'SOKO MUNGU — Commerce B2B/B2C Intelligent · Roadmap',
      description:
        'Découvrez SOKO MUNGU, le futur écosystème de mise en relation commerciale sécurisée par MUNGU ANA WEZA. Inscrivez votre intérêt partenaire dès aujourd’hui.',
      badge: 'SOKO MUNGU · Vision',
      defaultImagePreset: 'engineering',
      hash: '#soko-mungu',
    },
    'mungu-ai': {
      title: 'MUNGU AI — Agents Décisionnels & Rotation de Stock',
      description:
        'Optimisez la rotation des stocks, les priorités de recouvrement et le ROI opérationnel grâce aux agents intelligents MUNGU AI sous contrôle humain.',
      badge: 'MUNGU AI · Decision Engine',
      defaultImagePreset: 'mungu-ai',
      hash: '#mungu-ai',
    },
    operations: {
      title: 'MUANS & MUANS GO — Dispatch & Logistique Temps Réel',
      description:
        'Gérez la carte opérationnelle MUANS GO, les courses de livraison, la messagerie multi-rôles et l’authentification API sécurisée de MUNGU ANA WEZA.',
      badge: 'MUANS GO · Dispatch',
      defaultImagePreset: 'dynamic-card',
      hash: '#operations',
    },
    tarifs: {
      title: 'Tarifs MUNGU ANA WEZA — Standard 15 $, Pro 35 $ & Enterprise',
      description:
        'Comparez nos formules SaaS mondiales : Essai gratuit 7 jours (0 $), Standard (15 $/mois), Pro (35 $/mois) et Enterprise. Paiement M-Pesa, Airtel, Orange & Banque.',
      badge: 'Tarifs & Activation',
      defaultImagePreset: 'dynamic-card',
      hash: '#tarifs',
    },
    contact: {
      title: 'Contact & Devis — MUNGU ANA WEZA (Kolwezi & Global)',
      description:
        'Activez votre essai gratuit 7 jours ou planifiez une architecture ERP/CRM sur mesure avec nos ingénieurs via munguanaweza.com et WhatsApp +243 891 733 969.',
      badge: 'Contact & Déploiement',
      defaultImagePreset: 'engineering',
      hash: '#contact',
    },
  },
  en: {
    home: {
      title: 'MUNGU ANA WEZA — Enterprise SaaS & AI Infrastructure',
      description:
        'Unify cloud inventory, POS, multi-currency collections, and decision AI with MUNGU ANA WEZA. Start your 7-day free enterprise trial on munguanaweza.com.',
      badge: 'Global SaaS & Tech Enterprise',
      defaultImagePreset: 'dynamic-card',
      hash: '#accueil',
    },
    'pieces-pro': {
      title: 'PIECES PRO / NOVA OS — Cloud Inventory, POS & Collections',
      description:
        'Track stock, POS sales, and multi-currency installment schedules (USD/CDF/EUR) in real time with PIECES PRO / NOVA OS. Start your 7-day free trial today.',
      badge: 'PIECES PRO · NOVA OS',
      defaultImagePreset: 'hero',
      hash: '#pieces-pro',
    },
    'soko-mungu': {
      title: 'SOKO MUNGU — Intelligent B2B/B2C Trade Platform Roadmap',
      description:
        'Explore SOKO MUNGU, the upcoming smart B2B/B2C trade network built by MUNGU ANA WEZA. Register early partner interest for upcoming commercial launches.',
      badge: 'SOKO MUNGU · Roadmap',
      defaultImagePreset: 'engineering',
      hash: '#soko-mungu',
    },
    'mungu-ai': {
      title: 'MUNGU AI — Decision Agents & Smart Inventory Analytics',
      description:
        'Accelerate stock velocity, prioritize installment collections, and calculate automation ROI with MUNGU AI decision agents under human governance.',
      badge: 'MUNGU AI · Decision Engine',
      defaultImagePreset: 'mungu-ai',
      hash: '#mungu-ai',
    },
    operations: {
      title: 'MUANS & MUANS GO — Real-Time Dispatch & API Platform',
      description:
        'Coordinate MUANS GO fleet mapping, live delivery dispatch, multi-role operations messaging, and secure Bearer Token API access on munguanaweza.com.',
      badge: 'MUANS GO · Dispatch',
      defaultImagePreset: 'dynamic-card',
      hash: '#operations',
    },
    tarifs: {
      title: 'MUNGU ANA WEZA Pricing — Standard $15, Pro $35 & Enterprise',
      description:
        'Choose your global SaaS plan: 7-Day Free Trial ($0), Standard ($15/mo), Pro ($35/mo), or Enterprise ($150+/mo). Flexible Mobile Money & Bank payment.',
      badge: 'Global Pricing Plans',
      defaultImagePreset: 'dynamic-card',
      hash: '#tarifs',
    },
    contact: {
      title: 'Contact & Quotes — MUNGU ANA WEZA Enterprise Desk',
      description:
        'Launch your 7-day free trial or request custom Web, Mobile, and ERP/CRM engineering with MUNGU ANA WEZA via munguanaweza.com or WhatsApp +243 891 733 969.',
      badge: 'Contact & Onboarding',
      defaultImagePreset: 'engineering',
      hash: '#contact',
    },
  },
  ar: {
    home: {
      title: 'MUNGU ANA WEZA — بنية تحتية ذكية للأعمال والتجارة السحابية',
      description:
        'أدِر المخزون ونقاط البيع والأقساط متعددة العملات والتحليلات الذكية عبر منصة MUNGU ANA WEZA. ابدأ تجربتك المجانية لمدة 7 أيام على munguanaweza.com.',
      badge: 'منصة برمجيات سحابية عالمية',
      defaultImagePreset: 'dynamic-card',
      hash: '#accueil',
    },
    'pieces-pro': {
      title: 'PIECES PRO / NOVA OS — نظام المخزون ونقاط البيع والأقساط',
      description:
        'راقب المخزون والمبيعات وجداول الأقساط متعددة العملات لحظياً بدقة عالية عبر PIECES PRO / NOVA OS. ابدأ تجربتك المجانية لمدة 7 أيام الآن.',
      badge: 'PIECES PRO · NOVA OS',
      defaultImagePreset: 'hero',
      hash: '#pieces-pro',
    },
    'soko-mungu': {
      title: 'SOKO MUNGU — منصة التجارة الذكية B2B/B2C · خارطة الطريق',
      description:
        'تعرّف على رؤية SOKO MUNGU للتجارة الرقمية الذكية من MUNGU ANA WEZA وسجّل اهتمامك المبكر كشريك تجاري أو مورد ضمن المنظومة.',
      badge: 'SOKO MUNGU · رؤية مستقبلية',
      defaultImagePreset: 'engineering',
      hash: '#soko-mungu',
    },
    'mungu-ai': {
      title: 'MUNGU AI — وكلاء الذكاء الاصطناعي وتحليل دوران المخزون',
      description:
        'حسّن سرعة دوران المخزون وأولويات التحصيل والعائد التشغيلي مع محرك MUNGU AI للتحليلات ودعم القرار تحت الإشراف الإداري الكامل.',
      badge: 'MUNGU AI · محرك القرار',
      defaultImagePreset: 'mungu-ai',
      hash: '#mungu-ai',
    },
    operations: {
      title: 'MUANS & MUANS GO — عمليات التوصيل والخرائط وبوابة API',
      description:
        'أدِر خريطة MUANS GO الميدانية، وطلبات التوصيل المباشر، والمراسلة متعددة الأدوار، ورموز مصادقة API المحمية عبر منصة MUNGU ANA WEZA.',
      badge: 'MUANS GO · العمليات',
      defaultImagePreset: 'dynamic-card',
      hash: '#operations',
    },
    tarifs: {
      title: 'باقات MUNGU ANA WEZA — تجربة 7 أيام، Standard 15$ و Pro 35$',
      description:
        'اختر الباقة المناسبة لنشاطك: تجربة مجانية 7 أيام (0$)، Standard (15$)، Pro (35$)، أو Enterprise. دفع مرن عبر M-Pesa وAirtel وOrange والتحويل البنكي.',
      badge: 'الباقات والأسعار العالمية',
      defaultImagePreset: 'dynamic-card',
      hash: '#tarifs',
    },
    contact: {
      title: 'تواصل معنا واطلب عرض سعر — MUNGU ANA WEZA',
      description:
        'فعّل تجربتك المجانية لمدة 7 أيام أو اطلب تطوير منصة ويب وتطبيقات وأنظمة ERP/CRM مخصصة عبر munguanaweza.com أو واتساب ‎+243 891 733 969.',
      badge: 'التواصل والتفعيل',
      defaultImagePreset: 'engineering',
      hash: '#contact',
    },
  },
};

export function getRuntimeOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return DEFAULT_DOMAIN_ORIGIN;
}

export function buildDynamicOgImageUrl(params: {
  origin?: string;
  title: string;
  subtitle: string;
  badge: string;
  lang: Language;
}): string {
  const origin = params.origin || DEFAULT_DOMAIN_ORIGIN;
  const search = new URLSearchParams({
    title: params.title.slice(0, 90),
    subtitle: params.subtitle.slice(0, 150),
    badge: params.badge.slice(0, 48),
    lang: params.lang,
  });
  return `${origin}/api/og-image.svg?${search.toString()}`;
}

export function buildShareablePageUrl(
  section: SocialSectionId,
  lang: Language,
  origin: string = DEFAULT_DOMAIN_ORIGIN
): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  if (section === 'home' && lang === 'fr') {
    return `${cleanOrigin}/`;
  }
  const search = new URLSearchParams();
  if (lang !== 'fr') search.set('lang', lang);
  if (section !== 'home') search.set('section', section);
  const hash = SOCIAL_PRESETS[lang][section].hash;
  const query = search.toString();
  return `${cleanOrigin}/${query ? `?${query}` : ''}${section !== 'home' ? hash : ''}`;
}

export function resolveImageUrl(
  preset: SocialImagePresetId,
  customUrl: string,
  meta: {
    origin: string;
    title: string;
    subtitle: string;
    badge: string;
    lang: Language;
  }
): string {
  if (preset === 'custom') {
    const trimmed = customUrl.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `${meta.origin.replace(/\/+$/, '')}${IMAGE_PRESET_PATHS.hero}`;
  }
  if (preset === 'dynamic-card') {
    return buildDynamicOgImageUrl(meta);
  }
  return `${meta.origin.replace(/\/+$/, '')}${IMAGE_PRESET_PATHS[preset]}`;
}

export function buildDefaultSocialMeta(
  lang: Language,
  section: SocialSectionId = 'home',
  origin: string = DEFAULT_DOMAIN_ORIGIN
): SocialMetaConfig {
  const preset = SOCIAL_PRESETS[lang][section];
  return {
    section,
    lang,
    title: preset.title,
    description: preset.description,
    url: buildShareablePageUrl(section, lang, origin),
    imageUrl: resolveImageUrl(preset.defaultImagePreset, '', {
      origin,
      title: preset.title,
      subtitle: preset.description,
      badge: preset.badge,
      lang,
    }),
    imageAlt: preset.title,
    siteName: 'MUNGU ANA WEZA',
    twitterCard: 'summary_large_image',
    twitterSite: '@munguanaweza',
    ogType: section === 'pieces-pro' || section === 'tarifs' ? 'product' : 'website',
  };
}

export function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildMetaTagsHtml(meta: SocialMetaConfig): string {
  const locale = LOCALE_MAP[meta.lang];
  const canonicalUrl = escapeHtmlAttr(meta.url);
  const title = escapeHtmlAttr(meta.title);
  const description = escapeHtmlAttr(meta.description);
  const imageUrl = escapeHtmlAttr(meta.imageUrl);
  const imageAlt = escapeHtmlAttr(meta.imageAlt || meta.title);
  const siteName = escapeHtmlAttr(meta.siteName);
  const twitterHandle = escapeHtmlAttr(meta.twitterSite.trim());

  const jsonLd = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': meta.ogType === 'product' ? 'SoftwareApplication' : 'WebApplication',
      name: meta.siteName,
      url: meta.url,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description: meta.description,
      image: meta.imageUrl,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    null,
    2
  );

  const lines = [
    `<title>${escapeHtmlAttr(meta.title)}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    '',
    '<!-- OpenGraph / Facebook / LinkedIn / WhatsApp -->',
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:site_name" content="${siteName}" />`,
    `<meta property="og:locale" content="${locale}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    '',
    '<!-- Twitter / X Cards -->',
    `<meta name="twitter:card" content="${meta.twitterCard}" />`,
    ...(twitterHandle ? [`<meta name="twitter:site" content="${twitterHandle}" />`] : []),
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
    '',
    '<!-- Schema.org Structured Data (JSON-LD) -->',
    '<script type="application/ld+json">',
    jsonLd,
    '</script>',
  ];

  return lines.join('\n');
}

function upsertMetaTag(
  selectorAttr: 'name' | 'property',
  attrValue: string,
  content: string
): void {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${selectorAttr}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(selectorAttr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string): void {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function applyDocumentMetaTags(meta: SocialMetaConfig): void {
  if (typeof document === 'undefined') return;
  document.title = meta.title;
  upsertCanonicalLink(meta.url);

  upsertMetaTag('name', 'description', meta.description);

  upsertMetaTag('property', 'og:type', meta.ogType);
  upsertMetaTag('property', 'og:site_name', meta.siteName);
  upsertMetaTag('property', 'og:locale', LOCALE_MAP[meta.lang]);
  upsertMetaTag('property', 'og:url', meta.url);
  upsertMetaTag('property', 'og:title', meta.title);
  upsertMetaTag('property', 'og:description', meta.description);
  upsertMetaTag('property', 'og:image', meta.imageUrl);
  upsertMetaTag('property', 'og:image:width', '1200');
  upsertMetaTag('property', 'og:image:height', '630');
  upsertMetaTag('property', 'og:image:alt', meta.imageAlt || meta.title);

  upsertMetaTag('name', 'twitter:card', meta.twitterCard);
  upsertMetaTag('name', 'twitter:site', meta.twitterSite.trim());
  upsertMetaTag('name', 'twitter:title', meta.title);
  upsertMetaTag('name', 'twitter:description', meta.description);
  upsertMetaTag('name', 'twitter:image', meta.imageUrl);
  upsertMetaTag('name', 'twitter:image:alt', meta.imageAlt || meta.title);
}

export function isValidSocialSection(value: string | null): value is SocialSectionId {
  if (!value) return false;
  return (
    value === 'home' ||
    value === 'pieces-pro' ||
    value === 'soko-mungu' ||
    value === 'mungu-ai' ||
    value === 'operations' ||
    value === 'tarifs' ||
    value === 'contact'
  );
}
