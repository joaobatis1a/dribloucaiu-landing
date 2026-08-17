import { results } from "@/data/team";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";

function outcome(gf: number, ga: number) {
  if (gf > ga) return { label: "V", className: "bg-accent text-accent-foreground" };
  if (gf === ga) return { label: "E", className: "bg-secondary text-foreground" };
  return { label: "D", className: "bg-primary text-primary-foreground" };
}

export function Results() {
  return (
    <section id="resultados" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle kicker="Match center" title="Últimos jogos" />
        <ul className="mt-10 space-y-3">
          {results.map((m, i) => {
            const o = outcome(m.goalsFor, m.goalsAgainst);
            return (
              <Reveal key={`${m.opponent}-${m.date}`} delay={i * 70}>
                <li className="group flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-primary">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-display text-lg ${o.className}`}
                  >
                    {o.label}
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
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
