import { motion } from "framer-motion";
import { club, leagueTable } from "@/data/team";
import { SectionTitle } from "@/components/SectionTitle";

function zoneStyle(position: number, total: number) {
  if (position === 1) return "border-l-2 border-l-[color:var(--gold)]";
  if (position === total) return "border-l-2 border-l-destructive";
  return "border-l-2 border-l-transparent";
}

export function LeagueTable() {
  return (
    <section id="tabela" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionTitle kicker="Temporada" title="Tabela da liga" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Time</th>
                <th className="px-4 py-3 text-right font-semibold">J</th>
                <th className="px-4 py-3 text-right font-semibold">V</th>
                <th className="px-4 py-3 text-right font-semibold">E</th>
                <th className="px-4 py-3 text-right font-semibold">D</th>
                <th className="px-4 py-3 text-right font-semibold">SG</th>
                <th className="px-4 py-3 text-right font-semibold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {leagueTable.map((row, i) => {
                const isUs = row.team === club.name;
                const position = i + 1;
                return (
                  <motion.tr
                    key={row.team}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className={`border-b border-border/60 last:border-0 ${zoneStyle(position, leagueTable.length)} ${
                      isUs ? "bg-primary/15" : "hover:bg-secondary/50"
                    }`}
                  >
                    <td className="px-4 py-3 font-display text-lg text-muted-foreground">{position}</td>
                    <td
                      className={`px-4 py-3 font-display text-lg uppercase tracking-wide ${
                        isUs ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {row.team}
                      {isUs ? (
                        <span className="ml-2 rounded-sm bg-primary/20 px-1.5 py-0.5 align-middle text-[9px] tracking-widest text-primary">
                          NÓS
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.played}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">{row.won}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.drawn}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{row.lost}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {row.gd > 0 ? `+${row.gd}` : row.gd}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-display text-xl tabular-nums ${
                        isUs ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {row.points}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[color:var(--gold)]" /> Líder
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-destructive" /> Zona de rebaixamento
          </span>
        </div>
      </motion.div>
    </section>
  );
}
