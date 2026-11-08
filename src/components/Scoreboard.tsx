import { motion, useReducedMotion } from "framer-motion";
import { useSite } from "@/components/site-context";
import { dateParts } from "@/lib/site-derive";
import { matchOutcome, type Outcome } from "@/lib/match";

/** Cores das plaquinhas de forma, pensadas para o fundo preto do placar. */
const formColors: Record<Outcome, string> = {
  V: "bg-[var(--cal)] text-[var(--piche)]",
  E: "bg-[var(--cartao)] text-[var(--piche)]",
  D: "bg-[var(--tinta)] text-white",
};

function Plate({ value, delay }: { value: number; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      initial={reduce ? false : { rotate: -16, y: -6 }}
      animate={{ rotate: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 7, delay }}
      style={{ transformOrigin: "50% 6px" }}
      className="plate relative grid h-[4.75rem] w-[3.75rem] place-items-center pt-1 font-display text-[3.4rem] font-black leading-none tabular-nums sm:h-24 sm:w-[4.5rem] sm:text-[4.25rem]"
    >
      <span className="absolute left-1/2 top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--piche)]/70" />
      {value}
    </motion.span>
  );
}

/**
 * Placar de chapa, como os de campo de várzea: plaquinhas de lata penduradas num prego.
 * Mostra o último resultado e a forma recente do time.
 */
export function Scoreboard({ className = "" }: { className?: string }) {
  const { matches } = useSite();
  const last = matches[0];
  if (!last) return null;
  const d = dateParts(last.date);
  const form = matches.slice(0, 5).reverse();

  return (
    <figure
      className={`relative bg-[var(--piche)] px-4 pb-4 pt-3 text-[var(--cal)] shadow-[6px_6px_0_var(--tinta)] sm:px-5 ${className}`}
    >
      <span
        className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--cal)]/40"
        aria-hidden
      />
      <span
        className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--cal)]/40"
        aria-hidden
      />
      <figcaption className="flex items-baseline justify-between gap-3 border-b border-[var(--cal)]/20 pb-2">
        <span className="font-display text-lg uppercase tracking-wide">Último jogo</span>
        <span className="font-mono text-xs uppercase text-[var(--cal)]/70">
          {d.day}/{last.date.slice(5, 7)} · {last.competition}
        </span>
      </figcaption>

      <div className="mt-3 grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-2 sm:gap-3">
        <span className="text-right font-stencil text-2xl uppercase leading-[0.9] sm:text-3xl">
          Driblou Caiu
        </span>
        <Plate value={last.goalsFor} delay={0.9} />
        <span className="font-display text-2xl text-[var(--cal)]/50">×</span>
        <Plate value={last.goalsAgainst} delay={1.05} />
        <span className="line-clamp-2 font-stencil text-2xl uppercase leading-[0.9] text-[var(--cal)]/80 sm:text-3xl">
          {last.opponent}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <span className="mr-1 font-mono text-xs uppercase text-[var(--cal)]/70">
          Últimos {form.length}
        </span>
        {form.map((m) => {
          const o = matchOutcome(m.goalsFor, m.goalsAgainst);
          return (
            <span
              key={m.id}
              title={`${m.opponent} ${m.goalsFor}×${m.goalsAgainst}`}
              className={`grid h-6 w-6 place-items-center font-display text-sm font-black ${formColors[o]}`}
            >
              {o}
            </span>
          );
        })}
      </div>
    </figure>
  );
}
