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

export function Season() {
  const position = leagueTable.findIndex((r) => r.team === club.name) + 1;
  const us = leagueTable[position - 1];
  const leader = leagueTable[0];
  if (!us || !leader) return null;
  const pointsToLeader = leader.points - us.points;
  const form = results.map((m) => matchOutcome(m.goalsFor, m.goalsAgainst));
  const maxPoints = Math.max(...leagueTable.map((r) => r.points));

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
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
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
          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
            <div className="flex items-end gap-4">
              <span className="font-display text-8xl leading-none text-accent sm:text-9xl">{position}º</span>
              <div className="pb-1.5 sm:pb-3">
                <p className="font-display text-2xl uppercase leading-none text-foreground sm:text-3xl">
                  {us.points} pts
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {position === 1 ? "Na liderança" : `${pointsToLeader} pts do líder`} · {us.played} jogos
                </p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Últimos {form.length} jogos
              </p>
              <div className="mt-3 flex items-center gap-2">
                {form.map((o, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.06, ease: EASE }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-sm shadow-lg ${outcomeStyles[o].className}`}
                  >
                    {outcomeStyles[o].label}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3">
          {results.map((m, i) => {
            const o = matchOutcome(m.goalsFor, m.goalsAgainst);
            const style = outcomeStyles[o];
            return (
              <motion.div
                key={`${m.opponent}-${m.date}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                whileHover={{ y: -4 }}
                className="relative flex w-56 shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card shadow-[0_20px_50px_-30px_rgba(0,0,0,0.85)] transition-shadow duration-300 hover:border-accent/40"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{ background: `linear-gradient(160deg, ${style.className.includes("accent") ? "var(--accent)" : style.className.includes("primary") ? "var(--primary)" : "var(--foreground)"}, transparent 60%)` }}
                />
                <span className={`relative w-1.5 shrink-0 ${style.className}`} aria-hidden />
                <div className="relative flex-1 p-4">
                  <p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {m.competition} · {m.date}
                  </p>
                  <p className="mt-1.5 truncate font-display text-lg uppercase tracking-wide text-foreground">
                    {m.opponent}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${style.className}`}
                    >
                      {style.label}
                    </span>
                    <span className="font-display text-2xl tabular-nums text-foreground">
                      {m.goalsFor}
                      <span className="mx-1 text-muted-foreground">×</span>
                      {m.goalsAgainst}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-[0_25px_60px_-35px_rgba(0,0,0,0.9)]"
        >
          <p className="dotted-rule px-4 pb-3 pt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            Tabela da liga
          </p>
          <div className="divide-y divide-border/60">
            {leagueTable.map((row, i) => {
              const isUs = row.team === club.name;
              const pos = i + 1;
              const barWidth = Math.max(6, (row.points / maxPoints) * 100);
              return (
                <div
                  key={row.team}
                  className={`relative flex items-center gap-3 px-4 py-3 ${isUs ? "bg-accent/10" : ""}`}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 opacity-[0.07]"
                    style={{ width: `${barWidth}%`, background: isUs ? "var(--accent)" : "var(--foreground)" }}
                  />
                  <span className="relative w-4 shrink-0 font-display text-sm text-muted-foreground">{pos}</span>
                  <span
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-display text-[11px] ${
                      isUs ? "border-accent/50 bg-accent/15 text-accent" : "border-border bg-secondary text-foreground"
                    }`}
                  >
                    {teamInitials(row.team)}
                  </span>
                  <span
                    className={`relative min-w-0 flex-1 truncate font-display text-sm uppercase tracking-wide sm:text-base ${
                      isUs ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {row.team}
                  </span>
                  <span className="relative hidden shrink-0 gap-3 text-xs tabular-nums text-muted-foreground sm:flex">
                    <span>{row.played}J</span>
                    <span>{row.won}V</span>
                    <span>{row.drawn}E</span>
                    <span>{row.lost}D</span>
                    <span>{row.gd > 0 ? `+${row.gd}` : row.gd}SG</span>
                  </span>
                  <span className="relative shrink-0 font-display text-lg tabular-nums text-foreground">
                    {row.points}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
