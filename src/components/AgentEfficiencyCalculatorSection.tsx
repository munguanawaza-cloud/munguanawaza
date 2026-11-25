import { useState } from 'react';
import { ArrowUpRight, Bot, Calculator, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import type { TranslationContent } from '../i18n/translations';

interface AgentEfficiencyCalculatorSectionProps {
  t: TranslationContent['agentCalculator'];
  isRtl: boolean;
  onDeployAgents: () => void;
  onOpenAssistant: () => void;
}

const DEFAULT_TASKS = '50';
const DEFAULT_TIME = '30';
const DEFAULT_RATE = '45';
const AGENT_COST_PER_MONTH = 50;

interface CalculationResult {
  weeklyHoursSaved: number;
  monthlySavings: number;
  efficiencyBoost: number;
  roi: number;
}

function computeSavings(tasksRaw: string, timeRaw: string, rateRaw: string): CalculationResult {
  const tasks = Math.max(0, parseFloat(tasksRaw) || 0);
  const timePerTask = Math.max(0, parseFloat(timeRaw) || 0);
  const hourlyRate = Math.max(0, parseFloat(rateRaw) || 0);

  const totalMinutesSaved = tasks * timePerTask;
  const weeklyHoursSaved = totalMinutesSaved / 60;
  const weeklySavings = weeklyHoursSaved * hourlyRate;
  const monthlySavings = weeklySavings * 4;

  let efficiencyBoost = 0;
  if (weeklyHoursSaved > 0) {
    efficiencyBoost = Math.min(100, Math.round((weeklyHoursSaved / 40) * 100));
  }

  const annualSavings = monthlySavings * 12;
  const annualCost = AGENT_COST_PER_MONTH * 12;

  let roi = 0;
  if (tasks > 0 && timePerTask > 0 && hourlyRate > 0 && annualCost > 0) {
    roi = Math.round(((annualSavings - annualCost) / annualCost) * 100);
  }

  return {
    weeklyHoursSaved,
    monthlySavings,
    efficiencyBoost,
    roi,
  };
}

export function AgentEfficiencyCalculatorSection({
  t,
  isRtl,
  onDeployAgents,
  onOpenAssistant,
}: AgentEfficiencyCalculatorSectionProps) {
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [timePerTask, setTimePerTask] = useState(DEFAULT_TIME);
  const [hourlyRate, setHourlyRate] = useState(DEFAULT_RATE);
  const [pulseKey, setPulseKey] = useState(0);

  const result = computeSavings(tasks, timePerTask, hourlyRate);

  const handleCalculateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPulseKey((prev) => prev + 1);
  };

  const handleReset = () => {
    setTasks(DEFAULT_TASKS);
    setTimePerTask(DEFAULT_TIME);
    setHourlyRate(DEFAULT_RATE);
    setPulseKey((prev) => prev + 1);
  };

  return (
    <section
      id="agent-calculator"
      aria-labelledby="agent-calculator-heading"
      className="relative bg-[#0A0A0A] py-16 sm:py-24 border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Inputs & Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel flex flex-col justify-between rounded-3xl p-6 sm:p-9 lg:col-span-6"
          >
            <div>
              <p className="text-xs sm:text-sm font-medium tracking-wider text-[#D4AF37]">
                {t.kicker}
              </p>
              <h2
                id="agent-calculator-heading"
                className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white [text-wrap:balance]"
              >
                {t.title}
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-300">
                {t.subtitle}
              </p>

              <form onSubmit={handleCalculateSubmit} className="mt-7 space-y-5">
                {/* Automated Tasks per Week */}
                <div>
                  <label
                    htmlFor="calc-tasks"
                    className="block text-xs sm:text-sm font-semibold text-neutral-200"
                  >
                    {t.tasksLabel}
                  </label>
                  <div className="mt-2 flex items-center rounded-xl border border-white/15 bg-[#080808] px-4 transition-colors focus-within:border-[#D4AF37]">
                    <input
                      id="calc-tasks"
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      value={tasks}
                      onChange={(e) => setTasks(e.target.value)}
                      placeholder="50"
                      dir="ltr"
                      className="min-h-[46px] w-full bg-transparent py-2.5 text-base font-medium text-white tabular-nums placeholder:text-neutral-600 focus:outline-none"
                    />
                    <span className="shrink-0 ps-3 text-xs font-medium text-neutral-400">
                      {t.tasksUnit}
                    </span>
                  </div>
                </div>

                {/* Manual Time & Hourly Labor Rate */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="calc-time"
                      className="block text-xs sm:text-sm font-semibold text-neutral-200"
                    >
                      {t.timeLabel}
                    </label>
                    <div className="mt-2 flex items-center rounded-xl border border-white/15 bg-[#080808] px-4 transition-colors focus-within:border-[#D4AF37]">
                      <input
                        id="calc-time"
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={timePerTask}
                        onChange={(e) => setTimePerTask(e.target.value)}
                        placeholder="30"
                        dir="ltr"
                        className="min-h-[46px] w-full bg-transparent py-2.5 text-base font-medium text-white tabular-nums placeholder:text-neutral-600 focus:outline-none"
                      />
                      <span className="shrink-0 ps-3 text-xs font-medium text-neutral-400">
                        {t.timeUnit}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="calc-rate"
                      className="block text-xs sm:text-sm font-semibold text-neutral-200"
                    >
                      {t.rateLabel}
                    </label>
                    <div className="mt-2 flex items-center rounded-xl border border-white/15 bg-[#080808] px-4 transition-colors focus-within:border-[#D4AF37]">
                      <input
                        id="calc-rate"
                        type="number"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="45"
                        dir="ltr"
                        className="min-h-[46px] w-full bg-transparent py-2.5 text-base font-medium text-white tabular-nums placeholder:text-neutral-600 focus:outline-none"
                      />
                      <span className="shrink-0 ps-3 text-xs font-medium text-neutral-400">
                        {t.rateUnit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA + Reset */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="gold-pill-btn inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  >
                    <Calculator className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{t.calculateBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="gold-outline-pill inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                    <span>{t.resetBtn}</span>
                  </button>
                </div>
              </form>
            </div>

            <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-neutral-400">
              {t.assumptionNote}
            </p>
          </motion.div>

          {/* Right Column: Orchestration Potential Results */}
          <motion.div
            key={pulseKey}
            initial={{ opacity: 0.92, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel flex flex-col justify-between rounded-3xl border-[#D4AF37]/40 bg-gradient-to-br from-[#141108] via-[#101010] to-[#0A0A0A] p-6 sm:p-9 lg:col-span-6"
          >
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white [text-wrap:balance]">
                {t.resultsTitle}
              </h3>

              {/* 2x2 KPI Readout */}
              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
                  <div className="text-xs font-medium text-neutral-400">
                    {t.weeklyHoursLabel}
                  </div>
                  <div
                    dir="ltr"
                    className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#D4AF37] tabular-nums"
                  >
                    {result.weeklyHoursSaved.toFixed(1)} {t.hoursShortUnit}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#D4AF37]/35 bg-black/60 p-5">
                  <div className="text-xs font-medium text-neutral-400">
                    {t.monthlySavingsLabel}
                  </div>
                  <div
                    dir="ltr"
                    className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white tabular-nums"
                  >
                    ${Math.round(result.monthlySavings).toLocaleString('en-US')}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-neutral-400">
                      {t.efficiencyBoostLabel}
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono text-sm font-bold text-[#D4AF37] tabular-nums"
                    >
                      {result.efficiencyBoost}%
                    </span>
                  </div>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      style={{
                        transform: `scaleX(${result.efficiencyBoost / 100})`,
                      }}
                      className={`h-full w-full ${
                        isRtl ? 'origin-right' : 'origin-left'
                      } bg-gradient-to-r from-[#B58E24] to-[#E5C558] transition-transform duration-300 ease-out`}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
                  <div className="text-xs font-medium text-neutral-400">
                    {t.annualRoiLabel}
                  </div>
                  <div
                    dir="ltr"
                    className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#D4AF37] tabular-nums"
                  >
                    {result.roi.toLocaleString('en-US')}%
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={onDeployAgents}
                className="gold-pill-btn inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <span>{t.deployCta}</span>
                <ArrowUpRight
                  className={`h-4 w-4 ${isRtl ? '-scale-x-100' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={onOpenAssistant}
                className="gold-outline-pill inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <Bot className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.askTeamCta}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
