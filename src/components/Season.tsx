import { motion } from "framer-motion";
import crest from "@/assets/crest.png";
import { club, leagueTable, results } from "@/data/team";
import { matchOutcome, outcomeStyles } from "@/lib/match";
import { SectionTitle } from "@/components/SectionTitle";

const EASE = [0.16, 1, 0.3, 1] as const;

function teamInitials(name: string) {
  const words = name.split(" ").filter((w) => w.length > 2 || w === w.toUpperCase());
  const pick = words.length >= 2 ? words.slice(0, 2) : [name];
  return pick
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-5xl leading-none text-accent sm:text-6xl">{value}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </div>
  );
}

export function Season() {
  const position = leagueTable.findIndex((r) => r.team === club.name) + 1;
  const us = leagueTable[position - 1];
  const leader = leagueTable[0];
  if (!us || !leader) return null;
  const pointsToLeader = leader.points - us.points;
  const form = results.map((m) => matchOutcome(m.goalsFor, m.goalsAgainst));

  let unbeaten = 0;
  for (const o of form) {
    if (o === "D") break;
    unbeaten += 1;
  }

  const top3 = leagueTable.slice(0, 3);
  const standing = top3.some((r) => r.team === club.name) ? top3 : [...top3.slice(0, 2), us];

  return (
    <section id="temporada" className="relative overflow-hidden border-y border-border bg-card/30">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary/15 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-[130px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionTitle kicker="Campanha" title="Onde a gente está" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mt-10 overflow-hidden rounded-2xl border border-border bg-card/60 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.9)] backdrop-blur-sm"
        >
          <img
            src={crest}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 select-none opacity-[0.05]"
          />
          <div className="relative grid grid-cols-3 gap-6 p-6 sm:gap-10 sm:p-10">
            <StatBlock value={`${position}º`} label={`de ${leagueTable.length} times`} />
            <StatBlock value={`${us.points}`} label={position === 1 ? "pts · líder" : `pts · -${pointsToLeader} do líder`} />
            <StatBlock value={`${unbeaten}`} label={unbeaten === 1 ? "jogo sem perder" : "jogos sem perder"} />
          </div>

          <div className="relative flex items-center gap-2 border-t border-border/60 px-6 py-4 sm:px-10">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Forma
            </span>
            {form.map((o, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: EASE }}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${outcomeStyles[o].className}`}
              >
                {outcomeStyles[o].label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mt-6 overflow-hidden rounded-xl border border-border bg-card"
        >
          {standing.map((row, i) => {
            const isUs = row.team === club.name;
            const pos = leagueTable.findIndex((r) => r.team === row.team) + 1;
            return (
              <div
                key={row.team}
                className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border/60" : ""} ${
                  isUs ? "bg-accent/10" : ""
                }`}
              >
                <span className="w-4 shrink-0 font-display text-sm text-muted-foreground">{pos}</span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-display text-[11px] ${
                    isUs ? "border-accent/50 bg-accent/15 text-accent" : "border-border bg-secondary text-foreground"
                  }`}
                >
                  {teamInitials(row.team)}
                </span>
                <span
                  className={`min-w-0 flex-1 truncate font-display text-sm uppercase tracking-wide sm:text-base ${
                    isUs ? "text-accent" : "text-foreground"
                  }`}
                >
                  {row.team}
                </span>
                <span className="shrink-0 font-display text-lg tabular-nums text-foreground">{row.points}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
