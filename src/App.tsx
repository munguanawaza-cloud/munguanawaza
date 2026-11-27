import { useEffect, useState } from 'react';
import { AgentEfficiencyCalculatorSection } from './components/AgentEfficiencyCalculatorSection';
import { AIAssistant } from './components/AIAssistant';
import { ContactSection } from './components/ContactSection';
import { EngineeringSection } from './components/EngineeringSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { MuansOperationsSection } from './components/MuansOperationsSection';
import { MunguAISection } from './components/MunguAISection';
import { Navbar } from './components/Navbar';
import { PiecesProSection } from './components/PiecesProSection';
import { OfflineStatusBanner } from './components/PWAControls';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { SocialMetaGeneratorSection } from './components/SocialMetaGeneratorSection';
import { SokoMunguSection } from './components/SokoMunguSection';
import { TarifsSection } from './components/TarifsSection';
import { TrustSection } from './components/TrustSection';
import { TRANSLATIONS, type Language, type PlanInquiryId } from './i18n/translations';
import {
  applyDocumentMetaTags,
  buildDefaultSocialMeta,
  getRuntimeOrigin,
  isValidSocialSection,
  type SocialSectionId,
} from './utils/socialMeta';

function getInitialLangFromUrl(): Language {
  if (typeof window === 'undefined') return 'fr';
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param === 'fr' || param === 'en' || param === 'ar') return param;
  return 'fr';
}

function getInitialSectionFromUrl(): SocialSectionId {
  if (typeof window === 'undefined') return 'home';
  const param = new URLSearchParams(window.location.search).get('section');
  return isValidSocialSection(param) ? param : 'home';
}

export default function App() {
  const [lang, setLang] = useState<Language>(getInitialLangFromUrl);
  const [activeSocialSection, setActiveSocialSection] = useState<SocialSectionId>(
    getInitialSectionFromUrl
  );
  const [selectedPlan, setSelectedPlan] = useState<PlanInquiryId>('trial-7d');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  const isRtl = lang === 'ar';
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = isRtl ? 'rtl' : 'ltr';
    const metaConfig = buildDefaultSocialMeta(lang, activeSocialSection, getRuntimeOrigin());
    applyDocumentMetaTags(metaConfig);
  }, [lang, isRtl, activeSocialSection]);

  const scrollToContactWithPlan = (planId: PlanInquiryId) => {
    setSelectedPlan(planId);
    const quoteEl = document.getElementById('quote-form');
    if (quoteEl) {
      quoteEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <ScrollProgressBar isRtl={isRtl} />
      <Navbar lang={lang} onChangeLang={setLang} t={t.nav} a11y={t.a11y} pwa={t.pwa} />
      <main id="main-content">
        <HeroSection
          t={t.hero}
          isRtl={isRtl}
          onStartTrial={() => scrollToContactWithPlan('trial-7d')}
        />
        <PiecesProSection
          t={t.piecesPro}
          lang={lang}
          isRtl={isRtl}
          onRequestTrial={() => scrollToContactWithPlan('trial-7d')}
          onRequestSubscription={() => {
            document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <SokoMunguSection
          t={t.sokoMungu}
          isRtl={isRtl}
          onExpressInterest={() => scrollToContactWithPlan('soko-mungu')}
        />
        <MunguAISection
          t={t.munguAi}
          whatsappGreeting={t.hero.whatsappGreeting}
          onOpenAssistant={() => setAssistantOpen(true)}
        />
        <AgentEfficiencyCalculatorSection
          t={t.agentCalculator}
          isRtl={isRtl}
          onDeployAgents={() => scrollToContactWithPlan('mungu-ai')}
          onOpenAssistant={() => setAssistantOpen(true)}
        />
        <ErrorBoundary
          fallbackTitle={t.operations.errorBoundary.fallbackTitle}
          fallbackMessage={t.operations.errorBoundary.fallbackMessage}
          retryLabel={t.operations.errorBoundary.retryLabel}
        >
          <MuansOperationsSection
            t={t.operations}
            lang={lang}
            isRtl={isRtl}
          />
        </ErrorBoundary>
        <EngineeringSection
          t={t.engineering}
          isRtl={isRtl}
          onRequestQuote={() => scrollToContactWithPlan('engineering')}
        />
        <TarifsSection
          t={t.tarifs}
          isRtl={isRtl}
          onSelectPlan={scrollToContactWithPlan}
        />
        <TrustSection
          t={t.trust}
          isRtl={isRtl}
          onStartTrial={() => scrollToContactWithPlan('trial-7d')}
        />
        <SocialMetaGeneratorSection
          t={t.socialMeta}
          lang={lang}
          isRtl={isRtl}
          activeSection={activeSocialSection}
          onSectionChange={setActiveSocialSection}
        />
        <ContactSection
          t={t.contact}
          lang={lang}
          isRtl={isRtl}
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
        />
      </main>
      <Footer lang={lang} onChangeLang={setLang} t={t} />
      <OfflineStatusBanner t={t.pwa} />
      <AIAssistant
        t={t.assistant}
        lang={lang}
        isRtl={isRtl}
        isOpen={assistantOpen}
        onToggle={setAssistantOpen}
      />
    </div>
  );
}
