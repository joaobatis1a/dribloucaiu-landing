import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();

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
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Voltar ao topo"
          className="group fixed bottom-6 right-5 z-40 flex h-11 w-11 flex-col items-center justify-center gap-0.5 rounded-xl border border-border bg-card/90 shadow-xl backdrop-blur-md transition-colors hover:border-accent/50 sm:bottom-8 sm:right-8"
        >
          <ChevronUp className="h-4 w-4 text-accent transition-transform duration-300 group-hover:-translate-y-0.5" />
          <span className="h-[3px] w-4 rounded-full bg-gradient-to-r from-primary to-accent" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
