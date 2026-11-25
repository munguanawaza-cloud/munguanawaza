import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import {
  CheckCircle2,
  Lock,
  LogIn,
  LogOut,
  MessageSquare,
  Package,
  Send,
  ShieldCheck,
  Truck,
  XCircle,
} from 'lucide-react';
import type { Language, TranslationContent } from '../i18n/translations';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';

interface MuansOperationsSectionProps {
  t: TranslationContent['operations'];
  lang: Language;
  isRtl: boolean;
}

type SenderRole = 'Chauffeur' | 'Commerçant' | 'Employé' | 'Admin';
type OrderStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

interface DeliveryOrderRecord {
  id: string;
  creatorUid: string;
  creatorName: string;
  customer: string;
  details: string;
  status: OrderStatus;
  acceptedByUid: string;
  acceptedByName: string;
  createdAtMs: number;
}

interface ChatMessageRecord {
  id: string;
  channel: 'kolwezi-dispatch';
  senderUid: string;
  senderName: string;
  senderRole: SenderRole;
  message: string;
  createdAtMs: number;
}

const ADMIN_EMAIL = 'munguanawaza@gmail.com';
const COMMISSION_PER_ORDER_USD = 1.5;

function timestampToMs(ts: unknown): number {
  if (ts && typeof ts === 'object' && 'toMillis' in ts) {
    return (ts as Timestamp).toMillis();
  }
  return Date.now();
}

function getOperatorName(user: User): string {
  const raw =
    user.displayName?.trim() ||
    user.email?.split('@')[0]?.trim() ||
    'MUANS Operator';
  return raw.slice(0, 80);
}

function formatClock(ms: number, lang: Language): string {
  const locale = lang === 'ar' ? 'ar-EG' : lang === 'en' ? 'en-US' : 'fr-FR';
  return new Date(ms).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateTime(ms: number, lang: Language): string {
  const locale = lang === 'ar' ? 'ar-EG' : lang === 'en' ? 'en-US' : 'fr-FR';
  return new Date(ms).toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MuansOperationsSection({
  t,
  lang,
  isRtl,
}: MuansOperationsSectionProps) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdminDoc, setIsAdminDoc] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [boundaryError, setBoundaryError] = useState<Error | null>(null);

  // Delivery Orders state
  const [ordersMap, setOrdersMap] = useState<{
    pending: DeliveryOrderRecord[];
    created: DeliveryOrderRecord[];
    accepted: DeliveryOrderRecord[];
    adminAll: DeliveryOrderRecord[];
  }>({
    pending: [],
    created: [],
    accepted: [],
    adminAll: [],
  });
  const [customerInput, setCustomerInput] = useState('');
  const [detailsInput, setDetailsInput] = useState('');
  const [orderBusy, setOrderBusy] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState('');
  const [orderError, setOrderError] = useState('');

  // Internal Chat state
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [selectedRole, setSelectedRole] = useState<SenderRole>('Chauffeur');
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  if (boundaryError) {
    throw boundaryError;
  }

  const isBootstrappedAdmin = Boolean(
    user &&
      user.emailVerified &&
      user.email?.toLowerCase() === ADMIN_EMAIL
  );
  const isAdmin = isBootstrappedAdmin || isAdminDoc;

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setIsAdminDoc(false);

      if (nextUser && nextUser.emailVerified) {
        try {
          const adminSnap = await getDoc(doc(db, 'admins', nextUser.uid));
          setIsAdminDoc(adminSnap.exists());
        } catch (err) {
          // Only surface unexpected permission failures cleanly
          if (
            err instanceof Error &&
            err.message.toLowerCase().includes('permission')
          ) {
            try {
              handleFirestoreError(
                err,
                OperationType.GET,
                `admins/${nextUser.uid}`
              );
            } catch (wrapped) {
              setBoundaryError(
                wrapped instanceof Error ? wrapped : new Error(String(wrapped))
              );
            }
          }
        }
      } else {
        setOrdersMap({
          pending: [],
          created: [],
          accepted: [],
          adminAll: [],
        });
        setMessages([]);
      }

      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Reset role to Chauffeur if user is not Admin
  useEffect(() => {
    if (!isAdmin && selectedRole === 'Admin') {
      setSelectedRole('Chauffeur');
    }
  }, [isAdmin, selectedRole]);

  // Real-time Firestore listeners (attached strictly after authReady + verified user)
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) return;

    const mapSnapshotDocs = (
      docs: { id: string; data: () => Record<string, unknown> }[]
    ): DeliveryOrderRecord[] =>
      docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          creatorUid: String(data.creatorUid ?? ''),
          creatorName: String(data.creatorName ?? ''),
          customer: String(data.customer ?? ''),
          details: String(data.details ?? ''),
          status: (data.status as OrderStatus) || 'pending',
          acceptedByUid: String(data.acceptedByUid ?? ''),
          acceptedByName: String(data.acceptedByName ?? ''),
          createdAtMs: timestampToMs(data.createdAt),
        };
      });

    const unsubscribers: (() => void)[] = [];

    const handleSnapshotErr = (
      err: unknown,
      op: OperationType,
      path: string
    ) => {
      try {
        handleFirestoreError(err, op, path);
      } catch (wrapped) {
        setBoundaryError(
          wrapped instanceof Error ? wrapped : new Error(String(wrapped))
        );
      }
    };

    if (isBootstrappedAdmin) {
      unsubscribers.push(
        onSnapshot(
          query(collection(db, 'orders')),
          (snap) => {
            setOrdersMap((prev) => ({
              ...prev,
              adminAll: mapSnapshotDocs(snap.docs),
            }));
          },
          (err) => handleSnapshotErr(err, OperationType.LIST, 'orders')
        )
      );
    } else {
      unsubscribers.push(
        onSnapshot(
          query(collection(db, 'orders'), where('status', '==', 'pending')),
          (snap) => {
            setOrdersMap((prev) => ({
              ...prev,
              pending: mapSnapshotDocs(snap.docs),
            }));
          },
          (err) => handleSnapshotErr(err, OperationType.LIST, 'orders')
        )
      );
      unsubscribers.push(
        onSnapshot(
          query(collection(db, 'orders'), where('creatorUid', '==', user.uid)),
          (snap) => {
            setOrdersMap((prev) => ({
              ...prev,
              created: mapSnapshotDocs(snap.docs),
            }));
          },
          (err) => handleSnapshotErr(err, OperationType.LIST, 'orders')
        )
      );
      unsubscribers.push(
        onSnapshot(
          query(
            collection(db, 'orders'),
            where('acceptedByUid', '==', user.uid)
          ),
          (snap) => {
            setOrdersMap((prev) => ({
              ...prev,
              accepted: mapSnapshotDocs(snap.docs),
            }));
          },
          (err) => handleSnapshotErr(err, OperationType.LIST, 'orders')
        )
      );
    }

    // Internal dispatch chat listener
    unsubscribers.push(
      onSnapshot(
        query(
          collection(db, 'kolwezi_chat'),
          where('channel', '==', 'kolwezi-dispatch')
        ),
        (snap) => {
          const parsed: ChatMessageRecord[] = snap.docs
            .map((d) => {
              const data = d.data();
              return {
                id: d.id,
                channel: 'kolwezi-dispatch' as const,
                senderUid: String(data.senderUid ?? ''),
                senderName: String(data.senderName ?? ''),
                senderRole: (data.senderRole as SenderRole) || 'Chauffeur',
                message: String(data.message ?? ''),
                createdAtMs: timestampToMs(data.createdAt),
              };
            })
            .sort((a, b) => a.createdAtMs - b.createdAtMs)
            .slice(-80);
          setMessages(parsed);
        },
        (err) => handleSnapshotErr(err, OperationType.LIST, 'kolwezi_chat')
      )
    );

    return () => {
      for (const unsub of unsubscribers) unsub();
    };
  }, [authReady, user, isBootstrappedAdmin]);

  // Auto-scroll chat feed when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const allOrders = useMemo(() => {
    const dedup = new Map<string, DeliveryOrderRecord>();
    const source = isBootstrappedAdmin
      ? ordersMap.adminAll
      : [...ordersMap.pending, ...ordersMap.created, ...ordersMap.accepted];
    for (const item of source) {
      dedup.set(item.id, item);
    }
    return Array.from(dedup.values()).sort(
      (a, b) => b.createdAtMs - a.createdAtMs
    );
  }, [ordersMap, isBootstrappedAdmin]);

  const activeQueueOrders = useMemo(
    () =>
      allOrders.filter(
        (o) => o.status === 'pending' || o.status === 'accepted'
      ),
    [allOrders]
  );

  const adminMetrics = useMemo(() => {
    const activeDrivers = new Set<string>();
    let acceptedOrCompleted = 0;
    for (const order of allOrders) {
      if (order.status === 'accepted' || order.status === 'completed') {
        acceptedOrCompleted += 1;
        if (order.acceptedByUid) {
          activeDrivers.add(order.acceptedByUid);
        }
      }
    }
    for (const msg of messages) {
      if (msg.senderRole === 'Chauffeur' && msg.senderUid) {
        activeDrivers.add(msg.senderUid);
      }
    }
    return {
      totalOrders: allOrders.length,
      activeDrivers: activeDrivers.size,
      estimatedRevenue: acceptedOrCompleted * COMMISSION_PER_ORDER_USD,
    };
  }, [allOrders, messages]);

  const handleGoogleSignIn = async () => {
    setAuthBusy(true);
    setAuthError('');
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (!cred.user.emailVerified) {
        setAuthError(t.auth.unverifiedEmailError);
      }
    } catch {
      setAuthError(t.auth.authErrorGeneric);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    setAuthBusy(true);
    setAuthError('');
    try {
      await signOut(auth);
      setAdminPanelOpen(false);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleCreateOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.emailVerified || orderBusy) return;

    const customer = customerInput.trim().slice(0, 120);
    const details = detailsInput.trim().slice(0, 500);
    if (customer.length < 2 || details.length < 2) {
      setOrderError(t.orders.validationError);
      return;
    }

    setOrderBusy(true);
    setOrderError('');
    setOrderFeedback('');
    try {
      await addDoc(collection(db, 'orders'), {
        creatorUid: user.uid,
        creatorName: getOperatorName(user),
        customer,
        details,
        status: 'pending',
        acceptedByUid: '',
        acceptedByName: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setCustomerInput('');
      setDetailsInput('');
      setOrderFeedback(t.orders.createdFeedback);
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, 'orders');
      } catch (wrapped) {
        setBoundaryError(
          wrapped instanceof Error ? wrapped : new Error(String(wrapped))
        );
      }
    } finally {
      setOrderBusy(false);
    }
  };

  const handleOrderStatusChange = async (
    order: DeliveryOrderRecord,
    nextStatus: OrderStatus
  ) => {
    if (!user || !user.emailVerified) return;
    const path = `orders/${order.id}`;
    try {
      if (nextStatus === 'accepted') {
        await updateDoc(doc(db, 'orders', order.id), {
          status: 'accepted',
          acceptedByUid: user.uid,
          acceptedByName: getOperatorName(user),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, 'orders', order.id), {
          status: nextStatus,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, path);
      } catch (wrapped) {
        setBoundaryError(
          wrapped instanceof Error ? wrapped : new Error(String(wrapped))
        );
      }
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.emailVerified || chatBusy) return;

    const cleanMessage = chatInput.trim().slice(0, 1000);
    if (cleanMessage.length < 1) {
      setChatError(t.chat.validationError);
      return;
    }

    const safeRole: SenderRole =
      selectedRole === 'Admin' && !isAdmin ? 'Chauffeur' : selectedRole;

    setChatBusy(true);
    setChatError('');
    try {
      await addDoc(collection(db, 'kolwezi_chat'), {
        channel: 'kolwezi-dispatch',
        senderUid: user.uid,
        senderName: getOperatorName(user),
        senderRole: safeRole,
        message: cleanMessage,
        createdAt: serverTimestamp(),
      });
      setChatInput('');
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, 'kolwezi_chat');
      } catch (wrapped) {
        setBoundaryError(
          wrapped instanceof Error ? wrapped : new Error(String(wrapped))
        );
      }
    } finally {
      setChatBusy(false);
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return t.orders.statusPending;
      case 'accepted':
        return t.orders.statusAccepted;
      case 'completed':
        return t.orders.statusCompleted;
      case 'cancelled':
        return t.orders.statusCancelled;
    }
  };

  const roleOptions: { value: SenderRole; label: string; disabled?: boolean }[] = [
    { value: 'Chauffeur', label: t.chat.roles.driver },
    { value: 'Commerçant', label: t.chat.roles.merchant },
    { value: 'Employé', label: t.chat.roles.employee },
    { value: 'Admin', label: t.chat.roles.admin, disabled: !isAdmin },
  ];

  const isVerifiedSignedIn = Boolean(user && user.emailVerified);

  return (
    <section
      id="operations"
      aria-labelledby="operations-heading"
      className="relative bg-[#060606] py-16 sm:py-24 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + Google Auth & Admin Toggle Bar */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-medium tracking-wider text-[#D4AF37]">
              {t.kicker}
            </p>
            <h2
              id="operations-heading"
              className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white [text-wrap:balance]"
            >
              {t.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-300">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isVerifiedSignedIn && user ? (
              <>
                <div className="flex items-center gap-2.5 rounded-full border border-white/15 bg-[#111111] px-4 py-2 text-xs text-neutral-200">
                  <ShieldCheck
                    className="h-4 w-4 text-[#D4AF37] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-neutral-400">
                    {t.auth.signedInAsLabel}
                  </span>
                  <span className="font-semibold text-white">
                    {getOperatorName(user)}
                  </span>
                  {isAdmin && (
                    <span className="rounded-full bg-[#D4AF37]/20 px-2 py-0.5 text-[11px] font-semibold text-[#D4AF37]">
                      {t.auth.adminVerifiedLabel}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={authBusy}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-neutral-300 hover:border-white/30 hover:text-white transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.auth.signOutBtn}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authBusy}
                className="gold-pill-btn inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span>{authBusy ? t.auth.signingInBtn : t.auth.signInBtn}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setAdminPanelOpen((prev) => !prev)}
              aria-expanded={adminPanelOpen}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                adminPanelOpen
                  ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                  : 'border-[#D4AF37]/45 bg-[#12100A] text-[#D4AF37] hover:border-[#D4AF37]'
              }`}
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.adminToggleBtn}</span>
            </button>
          </div>
        </div>

        {authError && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-xs sm:text-sm text-amber-200"
          >
            {authError}
          </div>
        )}

        {/* Collapsible Admin Control Panel */}
        {adminPanelOpen && (
          <div className="mt-8 glass-panel rounded-3xl border-[#D4AF37]/45 bg-gradient-to-br from-[#161108] via-[#101010] to-[#0A0A0A] p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {t.adminPanel.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-neutral-300">
                  {t.adminPanel.subtitle}
                </p>
              </div>
              <span className="text-xs font-medium text-[#D4AF37]">
                {t.adminPanel.commissionNote}
              </span>
            </div>

            {!isAdmin ? (
              <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/50 p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t.adminPanel.restrictedTitle}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-300">
                    {t.adminPanel.restrictedBody}
                  </p>
                </div>
                {!isVerifiedSignedIn && (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={authBusy}
                    className="gold-pill-btn inline-flex min-h-[42px] shrink-0 items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold cursor-pointer"
                  >
                    <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.auth.signInBtn}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {/* 3 Live Admin KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
                    <div className="text-xs font-medium text-neutral-400">
                      {t.adminPanel.totalOrdersLabel}
                    </div>
                    <div
                      dir="ltr"
                      className="mt-2 font-display text-3xl font-bold text-white tabular-nums"
                    >
                      {adminMetrics.totalOrders}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
                    <div className="text-xs font-medium text-neutral-400">
                      {t.adminPanel.activeDriversLabel}
                    </div>
                    <div
                      dir="ltr"
                      className="mt-2 font-display text-3xl font-bold text-[#D4AF37] tabular-nums"
                    >
                      {adminMetrics.activeDrivers}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#D4AF37]/35 bg-black/60 p-5">
                    <div className="text-xs font-medium text-neutral-400">
                      {t.adminPanel.estimatedRevenueLabel}
                    </div>
                    <div
                      dir="ltr"
                      className="mt-2 font-display text-3xl font-bold text-emerald-400 tabular-nums"
                    >
                      ${adminMetrics.estimatedRevenue.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Live Orders Management Table */}
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                  <table className="w-full min-w-[640px] text-start text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-400">
                        <th className="px-4 py-3 font-semibold text-start">
                          {t.adminPanel.tableCustomer}
                        </th>
                        <th className="px-4 py-3 font-semibold text-start">
                          {t.adminPanel.tableDetails}
                        </th>
                        <th className="px-4 py-3 font-semibold text-start">
                          {t.adminPanel.tableStatus}
                        </th>
                        <th className="px-4 py-3 font-semibold text-start">
                          {t.adminPanel.tableDate}
                        </th>
                        <th className="px-4 py-3 font-semibold text-end">
                          {t.adminPanel.tableActions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {allOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-neutral-400"
                          >
                            {t.adminPanel.emptyTable}
                          </td>
                        </tr>
                      ) : (
                        allOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="text-neutral-200 hover:bg-white/[0.02]"
                          >
                            <td className="px-4 py-3 font-medium text-white">
                              {order.customer}
                            </td>
                            <td className="px-4 py-3 text-neutral-300 max-w-xs truncate">
                              {order.details}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  order.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : order.status === 'accepted'
                                      ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                      : order.status === 'cancelled'
                                        ? 'bg-neutral-700/50 text-neutral-400'
                                        : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {getStatusLabel(order.status)}
                              </span>
                            </td>
                            <td
                              dir="ltr"
                              className="px-4 py-3 text-neutral-400 tabular-nums whitespace-nowrap"
                            >
                              {formatDateTime(order.createdAtMs, lang)}
                            </td>
                            <td className="px-4 py-3 text-end whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                {(order.status === 'pending' ||
                                  order.status === 'accepted') && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handleOrderStatusChange(
                                        order,
                                        'completed'
                                      )
                                    }
                                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 px-2.5 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-500/15 cursor-pointer"
                                  >
                                    <CheckCircle2
                                      className="h-3 w-3"
                                      aria-hidden="true"
                                    />
                                    <span>{t.adminPanel.completeAction}</span>
                                  </button>
                                )}
                                {order.status !== 'cancelled' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handleOrderStatusChange(
                                        order,
                                        'cancelled'
                                      )
                                    }
                                    className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:border-red-400/40 hover:text-red-300 cursor-pointer"
                                  >
                                    <XCircle
                                      className="h-3 w-3"
                                      aria-hidden="true"
                                    />
                                    <span>{t.adminPanel.cancelAction}</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auth Gate or Live Two-Column Dispatch Workspace */}
        {!isVerifiedSignedIn ? (
          <div className="mt-8 glass-panel rounded-3xl p-7 sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {t.auth.signInRequiredTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                  {t.auth.signInRequiredBody}
                </p>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authBusy}
                className="gold-pill-btn inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span>{authBusy ? t.auth.signingInBtn : t.auth.signInBtn}</span>
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#0B0B0B] p-5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <Truck className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  <span>{t.orders.title}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                  {t.orders.subtitle}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0B0B0B] p-5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
                  <MessageSquare
                    className="h-4 w-4 text-[#D4AF37]"
                    aria-hidden="true"
                  />
                  <span>{t.chat.title}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-neutral-400">
                  {t.chat.subtitle}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Delivery Orders */}
            <div className="glass-panel flex flex-col rounded-3xl p-6 sm:p-8 lg:col-span-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Package className="h-4 w-4" aria-hidden="true" />
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                      {t.orders.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    {t.orders.subtitle}
                  </p>
                </div>
                <span
                  dir="ltr"
                  className="rounded-full border border-[#D4AF37]/30 bg-[#12100A] px-3 py-1 text-xs font-semibold text-[#D4AF37] tabular-nums"
                >
                  {activeQueueOrders.length}
                </span>
              </div>

              {/* Create Order Form */}
              <form onSubmit={handleCreateOrder} className="mt-6 space-y-3">
                <input
                  type="text"
                  maxLength={120}
                  value={customerInput}
                  onChange={(e) => setCustomerInput(e.target.value)}
                  placeholder={t.orders.customerPlaceholder}
                  aria-label={t.orders.customerPlaceholder}
                  className="min-h-[44px] w-full rounded-xl border border-white/15 bg-[#080808] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <input
                  type="text"
                  maxLength={500}
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  placeholder={t.orders.detailsPlaceholder}
                  aria-label={t.orders.detailsPlaceholder}
                  className="min-h-[44px] w-full rounded-xl border border-white/15 bg-[#080808] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={orderBusy}
                    className="gold-pill-btn inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer disabled:opacity-60"
                  >
                    <Truck className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {orderBusy ? t.orders.publishingBtn : t.orders.publishBtn}
                    </span>
                  </button>
                  {orderFeedback && (
                    <span className="text-xs font-medium text-emerald-400">
                      {orderFeedback}
                    </span>
                  )}
                  {orderError && (
                    <span className="text-xs font-medium text-amber-300">
                      {orderError}
                    </span>
                  )}
                </div>
              </form>

              {/* Active Orders Queue */}
              <div className="mt-6 flex-1 space-y-3 max-h-[360px] overflow-y-auto pe-1">
                {activeQueueOrders.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-[#090909] p-6 text-center text-xs sm:text-sm text-neutral-400">
                    {t.orders.emptyQueue}
                  </div>
                ) : (
                  activeQueueOrders.map((order) => {
                    const isMine = order.creatorUid === user?.uid;
                    const isAssignedToMe = order.acceptedByUid === user?.uid;
                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-4 transition-colors hover:border-[#D4AF37]/30"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-white truncate">
                              {order.customer}
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-neutral-300">
                              {order.details}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              order.status === 'accepted'
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-[11px] text-neutral-400">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>
                              {t.orders.createdByLabel} {order.creatorName}
                            </span>
                            {order.acceptedByName && (
                              <span className="text-[#D4AF37]">
                                {t.orders.assignedToLabel}{' '}
                                {order.acceptedByName}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {order.status === 'pending' && (
                              <button
                                type="button"
                                onClick={() =>
                                  void handleOrderStatusChange(
                                    order,
                                    'accepted'
                                  )
                                }
                                className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-semibold text-black hover:bg-[#e5c558] transition-colors cursor-pointer"
                              >
                                {t.orders.acceptBtn}
                              </button>
                            )}
                            {order.status === 'accepted' &&
                              (isAssignedToMe || isMine || isAdmin) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleOrderStatusChange(
                                      order,
                                      'completed'
                                    )
                                  }
                                  className="rounded-full border border-emerald-500/40 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/15 transition-colors cursor-pointer"
                                >
                                  {t.orders.completeBtn}
                                </button>
                              )}
                            {order.status === 'pending' &&
                              (isMine || isAdmin) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleOrderStatusChange(
                                      order,
                                      'cancelled'
                                    )
                                  }
                                  className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  {t.orders.cancelBtn}
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Internal Real-Time Chat */}
            <div className="glass-panel flex flex-col rounded-3xl p-6 sm:p-8 lg:col-span-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                      {t.chat.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    {t.chat.subtitle}
                  </p>
                </div>
                <span
                  dir="ltr"
                  className="rounded-full border border-white/15 bg-[#0C0C0C] px-3 py-1 text-xs font-semibold text-neutral-300 tabular-nums"
                >
                  {messages.length}
                </span>
              </div>

              {/* Message Feed */}
              <div
                ref={chatScrollRef}
                className="mt-6 flex-1 space-y-3 rounded-2xl border border-white/10 bg-[#080808] p-4 h-[320px] overflow-y-auto"
              >
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center text-xs sm:text-sm text-neutral-400">
                    {t.chat.emptyMessages}
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = msg.senderUid === user?.uid;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isSelf ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                            isSelf
                              ? 'border border-[#D4AF37]/40 bg-[#181409] text-white'
                              : 'border border-white/10 bg-[#121212] text-neutral-200'
                          }`}
                        >
                          <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px]">
                            <span
                              className={`font-semibold ${
                                msg.senderRole === 'Admin'
                                  ? 'text-amber-300'
                                  : 'text-[#D4AF37]'
                              }`}
                            >
                              {msg.senderRole}
                            </span>
                            <span className="text-neutral-400">
                              {msg.senderName}
                            </span>
                            <span
                              dir="ltr"
                              className="text-neutral-500 tabular-nums"
                            >
                              {formatClock(msg.createdAtMs, lang)}
                            </span>
                          </div>
                          <p className="leading-relaxed break-words">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Role Selector & Message Input */}
              <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="muans-chat-role"
                    className="text-xs font-medium text-neutral-300"
                  >
                    {t.chat.roleLabel}
                  </label>
                  <select
                    id="muans-chat-role"
                    value={selectedRole}
                    onChange={(e) =>
                      setSelectedRole(e.target.value as SenderRole)
                    }
                    className="min-h-[38px] rounded-xl border border-white/15 bg-[#0A0A0A] px-3 py-1.5 text-xs font-semibold text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    {roleOptions.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {!isAdmin && (
                  <p className="text-[11px] text-neutral-500">
                    {t.chat.adminRoleLockedNote}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={1000}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t.chat.messagePlaceholder}
                    aria-label={t.chat.messagePlaceholder}
                    className="min-h-[44px] flex-1 rounded-full border border-white/15 bg-[#080808] px-4 py-2 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={chatBusy}
                    className="gold-pill-btn inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold cursor-pointer disabled:opacity-60"
                  >
                    <Send
                      className={`h-3.5 w-3.5 ${isRtl ? '-scale-x-100' : ''}`}
                      aria-hidden="true"
                    />
                    <span>{chatBusy ? t.chat.sendingBtn : t.chat.sendBtn}</span>
                  </button>
                </div>

                {chatError && (
                  <p className="text-xs font-medium text-amber-300">
                    {chatError}
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
