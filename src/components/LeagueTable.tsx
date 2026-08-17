import { club, leagueTable } from "@/data/team";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";

export function LeagueTable() {
  return (
    <section id="tabela" className="mx-auto max-w-6xl px-6 py-20">
      <SectionTitle kicker="Temporada" title="Tabela da liga" />
      <Reveal className="mt-10">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[560px] text-sm">
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
                return (
                  <tr
                    key={row.team}
                    className={`border-b border-border/60 last:border-0 ${
                      isUs ? "bg-primary/15" : "hover:bg-secondary/50"
                    }`}
                  >
                    <td className="px-4 py-3 font-display text-lg text-muted-foreground">{i + 1}</td>
                    <td
                      className={`px-4 py-3 font-display text-lg uppercase tracking-wide ${
                        isUs ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {row.team}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
