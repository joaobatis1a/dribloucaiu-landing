import { motion } from "framer-motion";
import { useSite } from "@/components/site-context";
import { dateParts } from "@/lib/site-derive";
import { matchOutcome, outcomeStyles } from "@/lib/match";

export const abbr = (name: string) =>
  name
    .replace(/\b(FC|SC|United)\b/gi, "")
    .trim()
    .replace(/[^\p{L}\p{N}]/gu, "")
    .slice(0, 3)
    .toUpperCase();

/** Placar de estádio em matriz de pontos: o último resultado do clube + a sequência dos últimos jogos. */
export function Scoreboard() {
  const { matches } = useSite();
  const last = matches[0];
  if (!last) return null;
  const d = dateParts(last.date);
  const form = matches.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-9 w-full max-w-md overflow-hidden rounded-xl border border-border bg-[oklch(0.1_0.01_20)] p-4 text-left shadow-[var(--shadow-red)] lg:mx-0"
    >
      <div className="led-dots pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Último jogo · {last.competition}
        </span>
        <span>
          {d.day} {d.month}
        </span>
      </div>

      <div className="relative mt-3 flex items-center justify-between gap-2 font-led font-extrabold leading-none">
        <span className="text-4xl text-foreground sm:text-5xl">DRI</span>
        <span
          className="flex items-center gap-3 text-6xl tabular-nums sm:text-7xl"
          style={{
            color: "var(--led)",
            textShadow: "0 0 18px color-mix(in oklab, var(--led) 55%, transparent)",
          }}
        >
          {last.goalsFor}
          <span className="text-4xl opacity-60">-</span>
          {last.goalsAgainst}
        </span>
        <span className="text-4xl text-foreground sm:text-5xl">{abbr(last.opponent)}</span>
      </div>

      <div className="relative mt-4 flex items-center gap-1.5 border-t border-border/70 pt-3">
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Forma
        </span>
        {form
          .slice()
          .reverse()
          .map((m) => {
            const o = outcomeStyles[matchOutcome(m.goalsFor, m.goalsAgainst)];
            return (
              <span
                key={m.id}
                title={`${m.opponent} ${m.goalsFor}×${m.goalsAgainst}`}
                className={`flex h-6 w-6 items-center justify-center rounded-[5px] text-[11px] font-bold ${o.className}`}
              >
                {o.label}
              </span>
            );
          })}
      </div>
    </motion.div>
  );
}
