import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/** Título pintado em estêncil sobre uma linha grossa, com uma anotação datilografada ao lado. */
export function SectionTitle({
  kicker,
  title,
  invert = false,
}: {
  kicker: string;
  title: string;
  invert?: boolean;
}) {
  const reduce = useReducedMotion();
  // Observa o contêiner: um elemento 100% recortado por clip-path nunca conta como "visível".
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const shown = reduce || inView;

  return (
    <div
      ref={ref}
      className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-[3px] pb-3 ${
        invert ? "border-[var(--cal)]" : "border-foreground"
      }`}
    >
      <motion.h2
        key={title}
        initial={false}
        animate={{ clipPath: shown ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        className="font-stencil text-[clamp(3.25rem,9vw,6.5rem)] font-black uppercase leading-[0.82]"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={false}
        animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : 12 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`pb-1 font-mono text-sm uppercase ${invert ? "text-[var(--cal)]/70" : "text-muted-foreground"}`}
      >
        {kicker}
      </motion.p>
    </div>
  );
}
