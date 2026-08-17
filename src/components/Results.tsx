import { motion } from "framer-motion";
import { results } from "@/data/team";
import { matchOutcome, outcomeStyles } from "@/lib/match";
import { SectionTitle } from "@/components/SectionTitle";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Results() {
  const form = results.map((m) => matchOutcome(m.goalsFor, m.goalsAgainst));

  return (
    <section id="resultados" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle kicker="Match center" title="Últimos jogos" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Forma
            </span>
            {form.map((o, i) => (
              <span
                key={i}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${outcomeStyles[o].className}`}
              >
                {outcomeStyles[o].label}
              </span>
            ))}
          </div>
        </div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10 space-y-3"
        >
          {results.map((m) => {
            const o = matchOutcome(m.goalsFor, m.goalsAgainst);
            const style = outcomeStyles[o];
            return (
              <motion.li
                key={`${m.opponent}-${m.date}`}
                variants={item}
                whileHover={{ x: 4 }}
                className="group flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-primary"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-display text-lg ${style.className}`}
                >
                  {style.label}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-xl uppercase tracking-wide text-foreground">
                    {m.opponent}
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {m.competition} · {m.date}
                  </p>
                </div>
                <span className="font-display text-3xl tabular-nums text-foreground">
                  {m.goalsFor}
                  <span className="mx-1 text-muted-foreground">×</span>
                  {m.goalsAgainst}
                </span>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
