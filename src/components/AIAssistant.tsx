import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Language, TranslationContent } from '../i18n/translations';
import {
  sendMessageToAssistant,
  type AssistantChatMessage,
} from '../utils/aiAssistantClient';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface AIAssistantProps {
  t: TranslationContent['assistant'];
  lang: Language;
  isRtl: boolean;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export function AIAssistant({
  t,
  lang,
  isRtl,
  isOpen,
  onToggle,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<AssistantChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggle(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isSending]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 180);
    }
  }, [isOpen]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    const priorHistory = messages;
    const userMsg: AssistantChatMessage = { role: 'user', text: trimmed };

    setError('');
    setInput('');
    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const result = await sendMessageToAssistant({
        message: trimmed,
        history: priorHistory,
        lang,
      });

      const assistantMsg: AssistantChatMessage = {
        role: 'assistant',
        text: result.reply ?? '',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError(t.errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <div
      className="fixed bottom-2.5 end-2.5 sm:bottom-5 sm:end-5 z-50 flex flex-col items-end"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="assistant-panel"
            aria-label={t.panelTitle}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 flex w-[calc(100vw-1.5rem)] sm:w-[410px] max-h-[76dvh] flex-col overflow-hidden rounded-3xl border border-[#D4AF37]/45 bg-[#0A0A0A]/96 shadow-[0_24px_70px_rgba(0,0,0,0.92),0_0_32px_rgba(212,175,55,0.14)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-[#D4AF37]/25 bg-[#12100A] px-4 py-3.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/45 bg-black">
                  <Bot className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-sm font-bold text-white">
                    {t.panelTitle}
                  </h2>
                  <p className="truncate text-[11px] text-neutral-400">{t.panelSubtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggle(false)}
                aria-label={t.closeLabel}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/60 text-neutral-300 transition-colors hover:border-[#D4AF37] hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Feed */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[220px] max-h-[340px]"
              aria-live="polite"
            >
              <div className="flex justify-start">
                <div className="max-w-[92%] rounded-2xl rounded-ts-sm border border-[#D4AF37]/25 bg-[#141414] px-4 py-3 text-xs sm:text-sm leading-relaxed text-neutral-200">
                  <p>{t.welcomeMessage}</p>
                </div>
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {t.quickPrompts.map((promptText) => (
                    <button
                      key={promptText}
                      type="button"
                      onClick={() => void sendMessage(promptText)}
                      disabled={isSending}
                      className="rounded-full border border-[#D4AF37]/30 bg-[#111111] px-3 py-1.5 text-xs text-neutral-200 transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-white cursor-pointer text-start"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-te-sm bg-[#D4AF37] text-black font-medium'
                        : 'rounded-ts-sm border border-[#D4AF37]/25 bg-[#141414] text-neutral-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-[#D4AF37]/25 bg-[#141414] px-4 py-2.5 text-xs text-neutral-300">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D4AF37]" aria-hidden="true" />
                    <span>{t.thinkingLabel}</span>
                  </div>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300"
                >
                  {error}
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Direct WhatsApp Handoff Strip */}
            <div className="border-t border-white/10 bg-[#0F0E0A] px-4 py-2.5">
              <a
                href={buildWhatsAppUrl(t.whatsappHandoffMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs font-semibold text-[#D4AF37] hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{t.whatsappHandoffLabel}</span>
              </a>
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-white/10 bg-black/85 px-3.5 py-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.inputPlaceholder}
                aria-label={t.inputPlaceholder}
                disabled={isSending}
                className="min-h-[42px] flex-1 rounded-full border border-white/15 bg-[#111111] px-4 py-2 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:border-[#D4AF37] focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label={t.sendLabel}
                className="gold-pill-btn inline-flex h-[42px] items-center justify-center gap-1.5 rounded-full px-4 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <Send className={`h-3.5 w-3.5 ${isRtl ? '-scale-x-100' : ''}`} aria-hidden="true" />
                <span className="hidden sm:inline">{t.sendLabel}</span>
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Compact Mobile-Safe Floating Action Icon */}
      <button
        type="button"
        onClick={() => onToggle(!isOpen)}
        aria-expanded={isOpen}
        aria-label={t.launcherLabel}
        className="gold-pill-btn inline-flex h-11 w-11 sm:w-auto items-center justify-center sm:gap-2 rounded-full border border-[#E5C558] sm:px-4 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
        ) : (
          <Bot className="h-5 w-5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{t.launcherLabel}</span>
      </button>
    </div>
  );
}
