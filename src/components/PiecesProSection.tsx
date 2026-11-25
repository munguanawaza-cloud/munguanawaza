import { useMemo, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  LayoutDashboard,
  MessageCircle,
  Package,
  Plus,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { Language, TranslationContent } from '../i18n/translations';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface PiecesProSectionProps {
  t: TranslationContent['piecesPro'];
  lang: Language;
  isRtl: boolean;
  onRequestTrial: () => void;
  onRequestSubscription: () => void;
}

type PreviewTab = 'dashboard' | 'inventory' | 'pos' | 'installments';
type Currency = 'USD' | 'FC' | 'EUR';

interface StockItem {
  id: string;
  name: Record<Language, string>;
  costUsd: number;
  cashUsd: number;
  creditUsd: number;
  qty: number;
}

interface InstallmentAccount {
  id: number;
  label: Record<Language, string>;
  dueDate: string;
  totalUsd: number;
  paidUsd: number;
}

const INITIAL_STOCK: StockItem[] = [
  {
    id: 'PP-101',
    name: {
      fr: 'Kit Alternateur Industriel 24V',
      en: '24V Industrial Alternator Kit',
      ar: 'طقم دينامو صناعي 24 فولت',
    },
    costUsd: 85,
    cashUsd: 140,
    creditUsd: 190,
    qty: 6,
  },
  {
    id: 'PP-204',
    name: {
      fr: 'Jeu de Filtres Hydrauliques',
      en: 'Hydraulic Filter Set',
      ar: 'مجموعة فلاتر هيدروليكية',
    },
    costUsd: 45,
    cashUsd: 80,
    creditUsd: 110,
    qty: 11,
  },
  {
    id: 'PP-309',
    name: {
      fr: 'Terminal de Vente Mobile 4G',
      en: '4G Mobile Sales Terminal',
      ar: 'جهاز نقاط بيع محمول 4G',
    },
    costUsd: 110,
    cashUsd: 185,
    creditUsd: 240,
    qty: 4,
  },
];

const INITIAL_ACCOUNTS: InstallmentAccount[] = [
  {
    id: 1,
    label: {
      fr: 'Compte Commercial · #PR-201',
      en: 'Commercial Account · #PR-201',
      ar: 'حساب تجاري · #PR-201',
    },
    dueDate: '2026-11-20',
    totalUsd: 190,
    paidUsd: 90,
  },
  {
    id: 2,
    label: {
      fr: 'Distributeur Réseau · #PR-204',
      en: 'Network Distributor · #PR-204',
      ar: 'موزع معتمد · #PR-204',
    },
    dueDate: '2026-12-05',
    totalUsd: 110,
    paidUsd: 50,
  },
  {
    id: 3,
    label: {
      fr: 'Flotte Logistique · #PR-209',
      en: 'Logistics Fleet · #PR-209',
      ar: 'أسطول لوجستي · #PR-209',
    },
    dueDate: '2026-10-15',
    totalUsd: 240,
    paidUsd: 115,
  },
];

const RATES: Record<Currency, number> = {
  USD: 1,
  FC: 2850,
  EUR: 0.92,
};

export function PiecesProSection({
  t,
  lang,
  isRtl,
  onRequestTrial,
  onRequestSubscription,
}: PiecesProSectionProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('dashboard');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);
  const [accounts, setAccounts] = useState<InstallmentAccount[]>(INITIAL_ACCOUNTS);
  const [baseCollectedUsd, setBaseCollectedUsd] = useState(1250);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosId, setSelectedPosId] = useState('PP-101');
  const [posConfirmed, setPosConfirmed] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemCash, setItemCash] = useState('');
  const [itemCredit, setItemCredit] = useState('');
  const [itemQty, setItemQty] = useState('');

  const formatMoney = (usd: number) => {
    const converted = usd * RATES[currency];
    if (currency === 'USD') {
      return `$${Math.round(converted).toLocaleString('en-US')}`;
    }
    if (currency === 'EUR') {
      return `€${Math.round(converted).toLocaleString('en-US')}`;
    }
    return `${Math.round(converted).toLocaleString('en-US')} FC`;
  };

  const getAgingStatus = (dueDate: string, remaining: number) => {
    if (remaining <= 0) {
      return {
        category: 'on_time' as const,
        text: t.preview.settledLabel,
        badgeClass: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
        icon: CheckCircle2,
      };
    }

    const referenceToday = new Date('2026-11-25T00:00:00Z');
    const due = new Date(`${dueDate}T00:00:00Z`);
    const diffDays = Math.ceil((referenceToday.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return {
        category: 'on_time' as const,
        text: t.preview.statusOnTime,
        badgeClass: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
        icon: CheckCircle2,
      };
    }
    if (diffDays <= 30) {
      return {
        category: 'late' as const,
        text: `${t.preview.statusLatePrefix} ${diffDays}${t.preview.statusDaysUnit}`,
        badgeClass: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
        icon: Clock,
      };
    }
    return {
      category: 'risk' as const,
      text: t.preview.statusRisk,
      badgeClass: 'border-red-500/40 bg-red-500/15 text-red-300',
      icon: AlertTriangle,
    };
  };

  const overdueCount = useMemo(() => {
    return accounts.filter((acc) => {
      const remaining = Math.max(0, acc.totalUsd - acc.paidUsd);
      const status = getAgingStatus(acc.dueDate, remaining);
      return status.category === 'late' || status.category === 'risk';
    }).length;
  }, [accounts, t]);

  const totalUnits = useMemo(() => stock.reduce((sum, item) => sum + item.qty, 0), [stock]);

  const totalReceivablesUsd = useMemo(
    () => accounts.reduce((sum, acc) => sum + Math.max(0, acc.totalUsd - acc.paidUsd), 0),
    [accounts]
  );

  const filteredStock = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return stock;
    return stock.filter(
      (item) =>
        item.id.toLowerCase().includes(q) || item.name[lang].toLowerCase().includes(q)
    );
  }, [stock, searchQuery, lang]);

  const handleRecordPayment = (accountId: number) => {
    const target = accounts.find((a) => a.id === accountId);
    if (!target) return;
    const remaining = Math.max(0, target.totalUsd - target.paidUsd);
    if (remaining <= 0) return;
    const payment = Math.min(25, remaining);

    setAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, paidUsd: a.paidUsd + payment } : a))
    );
    setBaseCollectedUsd((cash) => cash + payment);
  };

  const handleRecordPosSale = () => {
    const target = stock.find((item) => item.id === selectedPosId) ?? stock[0];
    if (!target || target.qty <= 0) return;

    setStock((prev) =>
      prev.map((item) =>
        item.id === target.id ? { ...item, qty: Math.max(0, item.qty - 1) } : item
      )
    );
    setBaseCollectedUsd((cash) => cash + target.cashUsd);
    setPosConfirmed(true);
    setTimeout(() => setPosConfirmed(false), 2200);
  };

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = itemName.trim();
    const cash = Number(itemCash);
    const credit = Number(itemCredit);
    const qty = Number(itemQty);
    if (!trimmed || cash <= 0 || credit <= 0 || qty < 0) return;

    const nextId = `PP-${stock.length + 401}`;
    setStock((prev) => [
      {
        id: nextId,
        name: { fr: trimmed, en: trimmed, ar: trimmed },
        costUsd: Math.round(cash * 0.65),
        cashUsd: cash,
        creditUsd: credit,
        qty,
      },
      ...prev,
    ]);
    setItemName('');
    setItemCash('');
    setItemCredit('');
    setItemQty('');
    setShowAddForm(false);
  };

  return (
    <section
      id="pieces-pro"
      aria-labelledby="pieces-pro-heading"
      className="relative bg-[#070707] py-16 sm:py-24 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          {/* Left Product Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between glass-panel rounded-3xl p-6 sm:p-10 lg:col-span-6"
          >
            <div>
              <p className="text-xs sm:text-sm font-medium tracking-wider text-[#D4AF37]">
                {t.kicker}
              </p>
              <h2
                id="pieces-pro-heading"
                className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
              >
                {t.title}
              </h2>
              <p className="mt-2 text-lg sm:text-xl font-medium text-[#D4AF37]">
                {t.subtitle}
              </p>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-300">
                {t.description}
              </p>

              <div className="mt-7 space-y-4 border-t border-white/10 pt-6">
                {t.features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">{feature.title}</div>
                      <p className="mt-0.5 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                        {feature.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/8 p-5">
                <div className="text-sm font-bold text-[#D4AF37]">
                  {t.trialHighlightTitle}
                </div>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-neutral-200">
                  {t.trialHighlightBody}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onRequestTrial}
                className="gold-pill-btn inline-flex min-h-[46px] items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <span>{t.ctaStartTrial}</span>
                <ArrowUpRight className={`h-4 w-4 ${isRtl ? '-scale-x-100' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onRequestSubscription}
                className="gold-outline-pill inline-flex min-h-[46px] items-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <span>{t.ctaSubscribe}</span>
              </button>

              <a
                href={buildWhatsAppUrl(t.whatsappTrialMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-[#D4AF37] hover:underline"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>{t.ctaWhatsappTrial}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Cloud POS & Multi-Currency Workspace Preview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between glass-panel rounded-3xl p-4 sm:p-6 lg:col-span-6"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="font-display text-base font-bold text-white">
                    {t.preview.appTitle}
                  </div>
                  <div className="text-xs text-neutral-400">{t.preview.subtitleLabel}</div>
                </div>

                {/* Multi-Currency Switcher USD / FC / EUR */}
                <div className="flex items-center rounded-full border border-[#D4AF37]/35 bg-[#111111] p-1">
                  {(['USD', 'FC', 'EUR'] as Currency[]).map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => setCurrency(unit)}
                      aria-pressed={currency === unit}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                        currency === unit
                          ? 'bg-[#D4AF37] text-black'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Interactive Tabs: Overview, Inventory, POS, Installments */}
              <div className="mt-4 grid grid-cols-4 gap-1.5 rounded-2xl bg-black/60 p-1.5 border border-white/10">
                {(
                  [
                    { id: 'dashboard', label: t.preview.tabs.dashboard, icon: LayoutDashboard },
                    { id: 'inventory', label: t.preview.tabs.inventory, icon: Package },
                    { id: 'pos', label: t.preview.tabs.pos, icon: ShoppingCart },
                    { id: 'installments', label: t.preview.tabs.installments, icon: CreditCard },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      aria-pressed={active}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1.5 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#D4AF37] text-black'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Screen */}
              <div className="mt-5 min-h-[380px] space-y-4">
                {activeTab === 'dashboard' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                        <div className="text-xs text-neutral-400">{t.preview.collectedLabel}</div>
                        <div
                          className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums"
                          dir="ltr"
                        >
                          {formatMoney(baseCollectedUsd)}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                        <div className="text-xs text-neutral-400">{t.preview.receivablesLabel}</div>
                        <div
                          className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-[#D4AF37] tabular-nums"
                          dir="ltr"
                        >
                          {formatMoney(totalReceivablesUsd)}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                        <div className="text-xs text-neutral-400">{t.preview.unitsLabel}</div>
                        <div className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-white tabular-nums">
                          {totalUnits}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                        <div className="text-xs text-neutral-400">{t.preview.overdueLabel}</div>
                        <div className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-amber-300 tabular-nums">
                          {overdueCount}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#111111] p-4 space-y-3">
                      {accounts.map((acc) => {
                        const remaining = Math.max(0, acc.totalUsd - acc.paidUsd);
                        const status = getAgingStatus(acc.dueDate, remaining);
                        const Icon = status.icon;
                        return (
                          <div
                            key={acc.id}
                            className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3 last:border-b-0 last:pb-0"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-xs sm:text-sm font-semibold text-white">
                                {acc.label[lang]}
                              </div>
                              <div className="mt-0.5 text-[11px] text-neutral-400" dir="ltr">
                                {t.preview.dueDateLabel}: {acc.dueDate}
                              </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono-tabular text-xs font-bold text-[#D4AF37]" dir="ltr">
                                {formatMoney(remaining)}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${status.badgeClass}`}
                              >
                                <Icon className="h-3 w-3" aria-hidden="true" />
                                <span>{status.text}</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {activeTab === 'inventory' && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search
                          className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400"
                          aria-hidden="true"
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={t.preview.searchPlaceholder}
                          aria-label={t.preview.searchPlaceholder}
                          className="min-h-[42px] w-full rounded-full border border-white/15 bg-[#111111] py-2 ps-10 pe-4 text-xs sm:text-sm text-white placeholder:text-neutral-400 focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddForm((prev) => !prev)}
                        className="gold-outline-pill inline-flex min-h-[42px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                        <span>{showAddForm ? t.preview.cancelBtn : t.preview.addItemBtn}</span>
                      </button>
                    </div>

                    {showAddForm && (
                      <form
                        onSubmit={handleAddItem}
                        className="rounded-2xl border border-[#D4AF37]/30 bg-[#111111] p-4 grid grid-cols-1 sm:grid-cols-4 gap-2.5"
                      >
                        <input
                          type="text"
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          placeholder={t.preview.itemNamePlaceholder}
                          required
                          className="sm:col-span-4 rounded-xl border border-white/15 bg-black px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                        />
                        <input
                          type="number"
                          min="1"
                          value={itemCash}
                          onChange={(e) => setItemCash(e.target.value)}
                          placeholder={`${t.preview.cashLabel} ($)`}
                          required
                          className="rounded-xl border border-white/15 bg-black px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                        />
                        <input
                          type="number"
                          min="1"
                          value={itemCredit}
                          onChange={(e) => setItemCredit(e.target.value)}
                          placeholder={`${t.preview.creditLabel} ($)`}
                          required
                          className="rounded-xl border border-white/15 bg-black px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                        />
                        <input
                          type="number"
                          min="0"
                          value={itemQty}
                          onChange={(e) => setItemQty(e.target.value)}
                          placeholder={t.preview.qtyLabel}
                          required
                          className="rounded-xl border border-white/15 bg-black px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="gold-pill-btn rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
                        >
                          {t.preview.saveItemBtn}
                        </button>
                      </form>
                    )}

                    {filteredStock.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 text-center text-xs text-neutral-400">
                        {t.preview.emptyInventory}
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {filteredStock.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#111111] p-4"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono-tabular text-xs font-semibold text-[#D4AF37]" dir="ltr">
                                  {item.id}
                                </span>
                                <span className="truncate text-xs sm:text-sm font-semibold text-white">
                                  {item.name[lang]}
                                </span>
                              </div>
                              <div className="mt-1 text-[11px] text-neutral-400">
                                {t.preview.qtyLabel}: <strong className="text-white">{item.qty}</strong> ·{' '}
                                {t.preview.costLabel}: <span dir="ltr">{formatMoney(item.costUsd)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-end">
                              <div>
                                <div className="text-[10px] text-neutral-400">{t.preview.cashLabel}</div>
                                <div className="font-mono-tabular text-xs font-bold text-white" dir="ltr">
                                  {formatMoney(item.cashUsd)}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-neutral-400">{t.preview.creditLabel}</div>
                                <div className="font-mono-tabular text-xs font-bold text-[#D4AF37]" dir="ltr">
                                  {formatMoney(item.creditUsd)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'pos' && (
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-300">{t.preview.posSelectPrompt}</p>
                    <div className="space-y-2">
                      {stock.map((item) => {
                        const selected = selectedPosId === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedPosId(item.id)}
                            aria-pressed={selected}
                            className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-start transition-colors cursor-pointer ${
                              selected
                                ? 'border-[#D4AF37] bg-[#D4AF37]/12'
                                : 'border-white/10 bg-[#111111] hover:border-white/25'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="truncate text-xs sm:text-sm font-semibold text-white">
                                {item.name[lang]}
                              </div>
                              <div className="mt-0.5 text-[11px] text-neutral-400">
                                {item.id} · {t.preview.qtyLabel}: {item.qty}
                              </div>
                            </div>
                            <div className="font-mono-tabular text-xs sm:text-sm font-bold text-[#D4AF37] shrink-0 ps-2" dir="ltr">
                              {formatMoney(item.cashUsd)}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleRecordPosSale}
                      className="gold-pill-btn flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs sm:text-sm font-bold cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                      <span>{t.preview.posRecordSaleBtn}</span>
                    </button>

                    <div aria-live="polite">
                      {posConfirmed && (
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t.preview.posSaleConfirmed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'installments' && (
                  <div className="space-y-3">
                    {accounts.map((acc) => {
                      const remaining = Math.max(0, acc.totalUsd - acc.paidUsd);
                      const status = getAgingStatus(acc.dueDate, remaining);
                      const Icon = status.icon;
                      return (
                        <div
                          key={acc.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#111111] p-4"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs sm:text-sm font-semibold text-white">
                                {acc.label[lang]}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${status.badgeClass}`}
                              >
                                <Icon className="h-3 w-3" aria-hidden="true" />
                                <span>{status.text}</span>
                              </span>
                            </div>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 text-[11px] text-neutral-400">
                              <span dir="ltr">
                                {t.preview.dueDateLabel}: {acc.dueDate}
                              </span>
                              <span>·</span>
                              <span>
                                {t.preview.paidLabel}:{' '}
                                <span className="text-neutral-200 font-mono-tabular" dir="ltr">
                                  {formatMoney(acc.paidUsd)} / {formatMoney(acc.totalUsd)}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-end">
                              <div className="text-[10px] text-neutral-400">{t.preview.remainingLabel}</div>
                              <div className="font-mono-tabular text-xs sm:text-sm font-bold text-[#D4AF37]" dir="ltr">
                                {formatMoney(remaining)}
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={remaining <= 0}
                              onClick={() => handleRecordPayment(acc.id)}
                              className="gold-pill-btn min-h-[38px] rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                            >
                              {remaining <= 0 ? t.preview.settledLabel : t.preview.recordPaymentBtn}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-3 text-center text-[11px] text-neutral-400">
              {t.preview.footerNote}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
