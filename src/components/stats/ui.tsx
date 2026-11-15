import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/components/motion/Reveal";
import { matchOutcome, type Outcome } from "@/lib/match";

export const outcomeBg: Record<Outcome, string> = {
  V: "bg-[var(--piche)] text-[var(--cal)]",
  E: "bg-[var(--cartao)] text-[var(--piche)]",
  D: "bg-[var(--tinta)] text-white",
};

/** Número grande com legenda, no estilo do muro. */
export function Figure({
  label,
  value,
  note,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={`border-l-4 pl-3 ${accent ? "border-[var(--tinta)]" : "border-foreground"}`}>
      <p className="font-stencil text-5xl font-black leading-none tabular-nums">{value}</p>
      <p className="mt-1 font-mono text-xs uppercase text-muted-foreground">{label}</p>
      {note ? <p className="font-mono text-[11px] text-muted-foreground">{note}</p> : null}
    </div>
  );
}

/** Título de bloco: texto forte sobre linha grossa. */
export function Block({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-foreground pb-1">
        <h3 className="font-display text-xl font-black uppercase leading-none">{title}</h3>
        {hint ? (
          <p className="font-mono text-[11px] uppercase text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-8 font-mono text-sm text-muted-foreground">{children}</p>;
}

/** Barra horizontal que cresce quando entra na tela. */
export function GrowBar({
  value,
  max,
  className = "bg-[var(--piche)]",
  delay = 0,
}: {
  value: number;
  max: number;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 3 : 0) : 0;
  return (
    <div className="h-3 w-full bg-[var(--secondary)]">
      <motion.div
        className={`h-full ${className}`}
        initial={reduce ? false : { width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, delay, ease: EASE_OUT }}
      />
    </div>
  );
}

/** Plaquinha V/E/D de uma partida. */
export function ResultChip({
  goalsFor,
  goalsAgainst,
  title,
}: {
  goalsFor: number;
  goalsAgainst: number;
  title?: string;
}) {
  const o = matchOutcome(goalsFor, goalsAgainst);
  return (
    <span
      title={title}
      className={`grid h-7 w-7 place-items-center font-display text-sm font-black ${outcomeBg[o]}`}
    >
      {o}
    </span>
  );
}
