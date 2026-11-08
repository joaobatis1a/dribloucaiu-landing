import { motion, useReducedMotion } from "framer-motion";

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
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-[3px] pb-3 ${
        invert ? "border-[var(--cal)]" : "border-foreground"
      }`}
    >
      <motion.h2
        initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        className="font-stencil text-[clamp(3.25rem,9vw,6.5rem)] font-black uppercase leading-[0.82]"
      >
        {title}
      </motion.h2>
      <p
        className={`pb-1 font-mono text-sm uppercase ${invert ? "text-[var(--cal)]/70" : "text-muted-foreground"}`}
      >
        {kicker}
      </p>
    </div>
  );
}
