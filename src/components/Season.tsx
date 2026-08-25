import { motion } from "framer-motion";
import { club, leagueTable, results } from "@/data/team";
import { matchOutcome, outcomeStyles } from "@/lib/match";
import { SectionTitle } from "@/components/SectionTitle";

const EASE = [0.16, 1, 0.3, 1] as const;

function zoneStyle(position: number, total: number) {
  if (position === 1) return "border-l-2 border-l-[color:var(--gold)]";
  if (position === total) return "border-l-2 border-l-destructive";
  return "border-l-2 border-l-transparent";
}

export function Season() {
  const position = leagueTable.findIndex((r) => r.team === club.name) + 1;
  const us = leagueTable[position - 1];
  const leader = leagueTable[0];
  if (!us || !leader) return null;
  const pointsToLeader = leader.points - us.points;
  const form = results.map((m) => matchOutcome(m.goalsFor, m.goalsAgainst));

  return (
    <section id="temporada" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionTitle kicker="Campanha" title="Onde a gente está" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-end gap-4"
          >
            <span className="font-display text-8xl leading-none text-accent sm:text-9xl">{position}º</span>
            <div className="pb-1.5 sm:pb-3">
              <p className="font-display text-2xl uppercase leading-none text-foreground sm:text-3xl">
                {us.points} pts
              </p>
              <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {position === 1 ? "Na liderança" : `${pointsToLeader} pts do líder`} · {us.played} jogos
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Últimos {form.length} jogos
            </p>
            <div className="mt-3 flex items-center gap-2">
              {form.map((o, i) => (
                <span
                  key={i}
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-sm ${outcomeStyles[o].className}`}
                >
                  {outcomeStyles[o].label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-14 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3">
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
                whileHover={{ y: -3 }}
                className="relative flex w-56 shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card"
              >
                <span className={`w-1.5 shrink-0 ${style.className}`} aria-hidden />
                <div className="flex-1 p-4">
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
          className="mt-14 overflow-hidden rounded-xl border border-border bg-card"
        >
          <p className="dotted-rule px-4 pb-3 pt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            Tabela da liga
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="px-4 py-2.5 text-left font-semibold">#</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Time</th>
                  <th className="px-4 py-2.5 text-right font-semibold">J</th>
                  <th className="px-4 py-2.5 text-right font-semibold">V</th>
                  <th className="px-4 py-2.5 text-right font-semibold">E</th>
                  <th className="px-4 py-2.5 text-right font-semibold">D</th>
                  <th className="px-4 py-2.5 text-right font-semibold">SG</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {leagueTable.map((row, i) => {
                  const isUs = row.team === club.name;
                  const pos = i + 1;
                  return (
                    <tr
                      key={row.team}
                      className={`border-b border-border/60 last:border-0 ${zoneStyle(pos, leagueTable.length)} ${
                        isUs ? "bg-accent/10" : "hover:bg-secondary/50"
                      }`}
                    >
                      <td className="px-4 py-2.5 font-display text-base text-muted-foreground">{pos}</td>
                      <td
                        className={`px-4 py-2.5 font-display text-base uppercase tracking-wide ${
                          isUs ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {row.team}
                        {isUs ? (
                          <span className="ml-2 rounded-sm bg-accent/20 px-1.5 py-0.5 align-middle text-[9px] tracking-widest text-accent">
                            NÓS
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{row.played}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-foreground">{row.won}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{row.drawn}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{row.lost}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>
                      <td className="px-4 py-2.5 text-right font-display text-lg tabular-nums text-foreground">
                        {row.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
