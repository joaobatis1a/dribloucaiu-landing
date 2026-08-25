import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

const RADIUS = 19;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Voltar ao topo"
          className="group fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-xl backdrop-blur-md transition-colors hover:border-accent hover:text-accent sm:bottom-8 sm:right-8"
        >
          <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
            <circle cx="22" cy="22" r={RADIUS} className="stroke-border" strokeWidth="2" fill="none" />
            <motion.circle
              cx="22"
              cy="22"
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
          <ArrowUp className="h-4.5 w-4.5 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
