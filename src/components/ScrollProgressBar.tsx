import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

interface ScrollProgressBarProps {
  isRtl: boolean;
}

export function ScrollProgressBar({ isRtl }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-white/[0.04]"
    >
      <motion.div
        style={{
          scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress,
        }}
        className={`h-full w-full ${
          isRtl ? 'origin-right' : 'origin-left'
        } bg-gradient-to-r from-[#B58E24] via-[#D4AF37] to-[#E5C558] shadow-[0_0_12px_rgba(212,175,55,0.55)]`}
      />
    </div>
  );
}
