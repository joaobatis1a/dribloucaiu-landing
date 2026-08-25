import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useState } from "react";

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function SoccerBall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="18" fill="white" stroke="#111" strokeWidth="1.4" />
      <g stroke="#111" strokeWidth="1.2" fill="none" strokeLinejoin="round">
        <path d="M20 10 25.5 14 23.5 20.3 16.5 20.3 14.5 14Z" fill="#111" />
        <path d="M20 10 15 4.5" />
        <path d="M20 10 25 4.5" />
        <path d="M14.5 14 6.5 13" />
        <path d="M23.5 20.3 26 28" />
        <path d="M16.5 20.3 14 28" />
        <path d="M25.5 14 33.5 13" />
      </g>
    </svg>
  );
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setVisible(v > 0.08);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Voltar ao topo"
          className="group fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card/90 shadow-xl backdrop-blur-md [box-shadow:var(--shadow-red)] sm:bottom-8 sm:right-8"
        >
          <svg viewBox="0 0 50 50" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
            <circle cx="25" cy="25" r={RADIUS} className="stroke-border" strokeWidth="2" fill="none" />
            <motion.circle
              cx="25"
              cy="25"
              r={RADIUS}
              stroke="var(--accent)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              style={{
                pathLength: progress,
                strokeDasharray: CIRCUMFERENCE,
              }}
            />
          </svg>
          <SoccerBall className="h-7 w-7 transition-transform duration-500 group-hover:rotate-[220deg]" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
