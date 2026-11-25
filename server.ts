import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const VALID_SERVICES = new Set([
  'trial-7d',
  'standard',
  'pro',
  'entreprise',
  'soko-mungu',
  'mungu-ai',
  'engineering',
  'other',
]);
const VALID_LANGS = new Set(['en', 'fr', 'ar']);

type LangCode = 'en' | 'fr' | 'ar';

interface QuoteRecord {
  referenceId: string;
  name: string;
  company: string;
  contactInfo: string;
  serviceId: string;
  brief: string;
  lang: string;
  receivedAt: string;
}

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  text: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const QUOTES_FILE = path.resolve(DATA_DIR, 'quotes.json');

const CONCIERGE_SYSTEM_PROMPT = [
  'You are the Global AI Concierge (Sales & Solutions Advisor) for MUNGU ANA WEZA (munguanaweza.com, official WhatsApp: +243 891 733 969, email: munguanawaza@gmail.com, headquarters in Kolwezi, DRC).',
  'Never invent or mention personal names.',
  'Present MUNGU ANA WEZA as a global SaaS & enterprise software and AI company.',
  'Ecosystem & Solutions:',
  '1) PIECES PRO / NOVA OS: Integrated cloud & intelligent system for inventory control, Point of Sale (POS), sales tracking, and multi-currency installments & collections management (USD, FC, EUR). Includes a 7-day free trial.',
  '2) SOKO MUNGU: Upcoming smart B2B/B2C commerce and trade connection platform within our ecosystem (clearly state it is upcoming and not yet an active checkout storefront).',
  '3) MUNGU AI: Intelligent analytics & decision-support engine helping businesses monitor stock rotation, sales momentum, and operational priorities under human governance (no automated lending or credit approvals).',
  '4) Software Engineering & Digital Transformation: Web & Mobile Platforms (iOS/Android), Custom ERP/CRM platforms, and Digital Growth systems.',
  'Global Pricing Plans:',
  '- Free Trial: $0 for 7 days (full discovery of PIECES PRO / NOVA OS).',
  '- Standard: $15 / month.',
  '- Pro: $35 / month.',
  '- Enterprise: $150+ / month (custom multi-branch & enterprise architecture).',
  'Accepted International & Local Payments: M-Pesa, Airtel Money, Orange Money, and Bank Transfer (local or international), with flexible confirmation and pro-forma invoicing.',
  'Qualification & Conversion: Ask brief qualifying questions when helpful (business type, number of branches/users, desired modules) and guide visitors ready to start a 7-day trial or subscribe to use the quote form or contact WhatsApp (+243 891 733 969).',
  'Keep responses crisp, executive-grade, accurate, and concise.',
].join(' ');

const LANG_DIRECTIVE: Record<LangCode, string> = {
  en: 'Respond strictly in crisp, executive English.',
  fr: 'Réponds uniquement en français professionnel et synthétique.',
  ar: 'أجب باللغة العربية الفصحى بأسلوب احترافي وموجز وواضح.',
};

function buildStandbyReply(lang: LangCode, userMessage: string): string {
  const lower = userMessage.toLowerCase();
  const asksPricingOrPayment =
    lower.includes('prix') ||
    lower.includes('tarif') ||
    lower.includes('mpesa') ||
    lower.includes('m-pesa') ||
    lower.includes('airtel') ||
    lower.includes('orange') ||
    lower.includes('bank') ||
    lower.includes('banque') ||
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('plan') ||
    lower.includes('سعر') ||
    lower.includes('باقة') ||
    lower.includes('دفع') ||
    lower.includes('تحويل');

  const asksTrial =
    lower.includes('essai') ||
    lower.includes('gratuit') ||
    lower.includes('7') ||
    lower.includes('trial') ||
    lower.includes('free') ||
    lower.includes('تجربة') ||
    lower.includes('مجان');

  if (lang === 'fr') {
    if (asksTrial) {
      return "Vous pouvez démarrer un essai gratuit de 7 jours sur PIECES PRO / NOVA OS pour tester la gestion de stock, le POS et le suivi multi-devises des échéances. Combien de points de vente gérez-vous ? Finalisez votre activation sur WhatsApp au +243 891 733 969.";
    }
    if (asksPricingOrPayment) {
      return "Nos formules SaaS sont : Essai gratuit 7 jours (0 $), Standard (15 $/mois), Pro (35 $/mois) et Enterprise (150 $+/mois). Nous acceptons M-Pesa, Airtel Money, Orange Money et le virement bancaire avec confirmation flexible. Quelle formule correspond à votre équipe ? Contact WhatsApp : +243 891 733 969.";
    }
    return "Bienvenue chez MUNGU ANA WEZA. Nous développons PIECES PRO / NOVA OS (gestion, POS et recouvrement multi-devises), SOKO MUNGU (plateforme commerciale à venir), MUNGU AI et des plateformes Web/Mobile & ERP/CRM sur mesure. Quel projet souhaitez-vous lancer ? WhatsApp direct : +243 891 733 969.";
  }

  if (lang === 'ar') {
    if (asksTrial) {
      return "يمكنك بدء التجربة المجانية لمدة 7 أيام لنظام PIECES PRO / NOVA OS لاختبار إدارة المخزون ونقاط البيع (POS) والأقساط متعددة العملات. كم عدد الفروع أو المستخدمين لديك؟ يمكنك التفعيل مباشرة عبر واتساب: ‎+243 891 733 969.";
    }
    if (asksPricingOrPayment) {
      return "باقاتنا العالمية هي: تجربة مجانية 7 أيام (0$)، Standard (15$/شهرياً)، Pro (35$/شهرياً)، وEnterprise (ابتداءً من 150$/شهرياً). ندعم الدفع عبر M-Pesa وAirtel Money وOrange Money والتحويل البنكي بمرونة تامة. تواصل لإتمام الطلب عبر واتساب: ‎+243 891 733 969.";
    }
    return "مرحباً بك في MUNGU ANA WEZA. نقدم نظام PIECES PRO / NOVA OS السحابي، ورؤية منصة SOKO MUNGU القادمة، ومحرك التحليلات MUNGU AI، إضافة إلى هندسة منصات الويب والتطبيقات وأنظمة ERP/CRM المخصصة. ما النشاط الذي تود تطويره؟ تواصل معنا على واتساب: ‎+243 891 733 969.";
  }

  if (asksTrial) {
    return "You can start a 7-day free trial of PIECES PRO / NOVA OS to evaluate cloud inventory, POS, and multi-currency installment tracking. How many locations or team members does your business operate? Activate directly on WhatsApp at +243 891 733 969.";
  }
  if (asksPricingOrPayment) {
    return "Our global plans are Free Trial (7 Days, $0), Standard ($15/mo), Pro ($35/mo), and Enterprise ($150+/mo). We support M-Pesa, Airtel Money, Orange Money, and Bank Transfer with flexible confirmation. Which tier fits your workflow? Reach us on WhatsApp at +243 891 733 969.";
  }
  return "Welcome to MUNGU ANA WEZA. Our ecosystem spans PIECES PRO / NOVA OS (cloud inventory, POS, and multi-currency collections), SOKO MUNGU (upcoming smart trade platform), MUNGU AI analytics, and custom Web/Mobile & ERP/CRM engineering. Which capability are you exploring? Contact WhatsApp: +243 891 733 969.";
}

function getConfiguredGeminiKey(): string | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return key;
}

async function persistQuote(record: QuoteRecord): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  let existing: QuoteRecord[] = [];
  try {
    const raw = await fs.readFile(QUOTES_FILE, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      existing = parsed as QuoteRecord[];
    }
  } catch {
    existing = [];
  }
  existing.push(record);
  await fs.writeFile(QUOTES_FILE, JSON.stringify(existing, null, 2), 'utf8');
}

function makeReferenceId(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const code = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `MAW-${y}${m}${d}-${code}`;
}

async function handleAssistantRequest(req: Request, res: Response) {
  const body = req.body as Record<string, unknown> | null;
  if (!body || typeof body !== 'object') {
    res.status(400).json({ ok: false, error: 'INVALID_BODY' });
    return;
  }

  const rawLang = typeof body.lang === 'string' ? body.lang.trim() : 'fr';
  const lang = (VALID_LANGS.has(rawLang) ? rawLang : 'fr') as LangCode;

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > 1500) {
    res.status(400).json({ ok: false, error: 'INVALID_MESSAGE' });
    return;
  }

  const historyInput = Array.isArray(body.history) ? body.history.slice(-8) : [];
  const safeHistory: ChatHistoryItem[] = [];
  for (const item of historyInput) {
    if (
      item &&
      typeof item === 'object' &&
      'role' in item &&
      'text' in item &&
      (item.role === 'user' || item.role === 'assistant') &&
      typeof item.text === 'string'
    ) {
      safeHistory.push({
        role: item.role,
        text: item.text.trim().slice(0, 1200),
      });
    }
  }

  const apiKey = getConfiguredGeminiKey();
  if (!apiKey) {
    res.json({
      ok: true,
      reply: buildStandbyReply(lang, message),
      mode: 'standby_demo',
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const contents = [
      ...safeHistory.map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    let replyText = '';
    let lastError: unknown = null;
    const candidateModels = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'] as const;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: `${CONCIERGE_SYSTEM_PROMPT} ${LANG_DIRECTIVE[lang]}`,
            ...(modelName === 'gemini-4-hydrogen'
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {}),
          },
        });
        replyText = response.text?.trim() ?? '';
        if (replyText) break;
      } catch (attemptErr) {
        lastError = attemptErr;
      }
    }

    if (!replyText) {
      if (lastError) {
        throw lastError;
      }
      res.status(502).json({ ok: false, error: 'EMPTY_RESPONSE' });
      return;
    }

    res.json({
      ok: true,
      reply: replyText,
      mode: 'gemini',
    });
  } catch (err: unknown) {
    const errObj = err as { status?: number; message?: string } | null;
    const status = typeof errObj?.status === 'number' ? errObj.status : 502;
    const detail = errObj?.message ? String(errObj.message).slice(0, 160) : 'UPSTREAM_ERROR';
    console.error('Gemini API error in /api/ai-assistant:', status, detail);
    res.status(502).json({
      ok: false,
      error: 'GEMINI_UPSTREAM_ERROR',
    });
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.get('/api/config', (_req: Request, res: Response) => {
    const rawKey = (
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      ''
    ).trim();
    const mapsApiKey = rawKey && rawKey !== 'MY_GOOGLE_MAPS_API_KEY' ? rawKey : '';
    res.json({ mapsApiKey });
  });

  app.post('/api/quotes', async (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown> | null;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ ok: false, error: 'INVALID_BODY' });
      return;
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const company = typeof body.company === 'string' ? body.company.trim().slice(0, 120) : '';
    const contactInfo = typeof body.contactInfo === 'string' ? body.contactInfo.trim() : '';
    const serviceId = typeof body.serviceId === 'string' ? body.serviceId.trim() : '';
    const brief = typeof body.brief === 'string' ? body.brief.trim() : '';
    const lang = typeof body.lang === 'string' && VALID_LANGS.has(body.lang) ? body.lang : 'fr';

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRe = /^\+?[\d\s\-()]{7,20}$/;

    if (name.length < 2 || name.length > 100) {
      res.status(400).json({ ok: false, error: 'INVALID_NAME' });
      return;
    }

    if (!emailRe.test(contactInfo) && !phoneRe.test(contactInfo)) {
      res.status(400).json({ ok: false, error: 'INVALID_CONTACT' });
      return;
    }

    if (!VALID_SERVICES.has(serviceId)) {
      res.status(400).json({ ok: false, error: 'INVALID_SERVICE' });
      return;
    }

    if (brief.length < 6 || brief.length > 2000) {
      res.status(400).json({ ok: false, error: 'INVALID_BRIEF' });
      return;
    }

    const record: QuoteRecord = {
      referenceId: makeReferenceId(),
      name,
      company,
      contactInfo,
      serviceId,
      brief,
      lang,
      receivedAt: new Date().toISOString(),
    };

    try {
      await persistQuote(record);
    } catch (err) {
      console.error('Failed to persist quote to disk:', err);
    }

    res.status(201).json({
      ok: true,
      referenceId: record.referenceId,
      receivedAt: record.receivedAt,
      deliveryMode: 'stored',
    });
  });

  app.post('/api/ai-assistant', handleAssistantRequest);
  app.post('/api/ai-team', handleAssistantRequest);

  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ ok: false, error: 'NOT_FOUND' });
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(`MUNGU ANA WEZA server listening on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
