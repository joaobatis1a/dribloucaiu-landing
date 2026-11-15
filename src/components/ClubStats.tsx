import { useState } from "react";
import { useSite } from "@/components/site-context";
import { clubRecords, dateParts } from "@/lib/site-derive";

type SortKey = "ga" | "goals" | "assists" | "games" | "motm";

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "ga", label: "G+A" },
  { key: "goals", label: "Gols" },
  { key: "assists", label: "Assist." },
  { key: "games", label: "Jogos" },
  { key: "motm", label: "Craque" },
];

const KIND: Record<"V" | "E" | "D", [string, string]> = {
  V: ["vitória seguida", "vitórias seguidas"],
  E: ["empate seguido", "empates seguidos"],
  D: ["derrota seguida", "derrotas seguidas"],
};

function Figure({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="border-l-4 border-foreground pl-3">
      <p className="font-stencil text-5xl font-black leading-none tabular-nums">{value}</p>
      <p className="mt-1 font-mono text-xs uppercase text-muted-foreground">{label}</p>
      {note ? <p className="font-mono text-[11px] text-muted-foreground">{note}</p> : null}
    </div>
  );
}

/** Estatísticas do clube e de cada jogador: histórico anterior ao site + partidas lançadas. */
export function ClubStats() {
  const { site, team, players } = useSite();
  const rec = clubRecords(site);
  const [sort, setSort] = useState<SortKey>("ga");

  const value = (p: (typeof players)[number], k: SortKey) =>
    k === "ga" ? p.totals.goals + p.totals.assists : k === "games" ? p.totals.games : p.totals[k];
  const rows = [...players].sort(
    (a, b) => value(b, sort) - value(a, sort) || b.totals.games - a.totals.games,
  );
  const win = rec.biggestWin;
  const loss = rec.biggestLoss;

  return (
    <div className="space-y-10 py-3">
      <section aria-label="Clube">
        <p className="border-b-2 border-foreground pb-1 font-display text-xl font-black uppercase">
          O clube
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
          <Figure label="Jogos" value={team.played} />
          <Figure
            label="V · E · D"
            value={`${team.won}·${team.drawn}·${team.lost}`}
            note={`${team.rate}% de aproveitamento`}
          />
          <Figure
            label="Gols pró"
            value={team.gf}
            note={`${(team.gf / Math.max(team.played, 1)).toFixed(1)} por jogo`}
          />
          <Figure
            label="Gols contra"
            value={team.ga}
            note={`saldo ${team.gd > 0 ? "+" : ""}${team.gd}`}
          />
        </div>

        {rec.tracked > 0 ? (
          <dl className="mt-6 grid gap-3 font-mono text-sm sm:grid-cols-3">
            {rec.streak ? (
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Sequência atual</dt>
                <dd className="font-bold">
                  {rec.streak.count} {KIND[rec.streak.kind][rec.streak.count === 1 ? 0 : 1]}
                </dd>
              </div>
            ) : null}
            {win ? (
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Maior vitória</dt>
                <dd className="font-bold">
                  {win.goalsFor}×{win.goalsAgainst} · {win.opponent} · {dateParts(win.date).full}
                </dd>
              </div>
            ) : null}
            {loss ? (
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Pior derrota</dt>
                <dd className="font-bold">
                  {loss.goalsFor}×{loss.goalsAgainst} · {loss.opponent} ·{" "}
                  {dateParts(loss.date).full}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {rec.byCompetition.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[22rem] font-mono text-sm">
              <caption className="pb-1 text-left text-xs uppercase text-muted-foreground">
                Por competição (partidas lançadas no site)
              </caption>
              <thead>
                <tr className="border-b-2 border-foreground text-xs uppercase">
                  <th className="py-1.5 text-left font-bold">Competição</th>
                  {["J", "V", "E", "D", "GP", "GC"].map((h) => (
                    <th key={h} className="w-10 py-1.5 text-center font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rec.byCompetition.map((c) => (
                  <tr key={c.competition} className="border-b border-dashed border-foreground/40">
                    <td className="py-2 font-display text-lg font-black uppercase leading-none">
                      {c.competition}
                    </td>
                    {[c.played, c.won, c.drawn, c.lost, c.gf, c.ga].map((n, i) => (
                      <td key={i} className="text-center tabular-nums">
                        {n}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section aria-label="Jogadores">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-foreground pb-1">
          <p className="font-display text-xl font-black uppercase">Os jogadores</p>
          <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Ordenar por">
            <span className="mr-1 font-mono text-xs uppercase text-muted-foreground">Ordenar</span>
            {SORTS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSort(s.key)}
                aria-pressed={sort === s.key}
                className={`border-2 border-foreground px-2 py-0.5 font-display text-sm font-black uppercase leading-tight transition-colors ${
                  sort === s.key ? "bg-foreground text-background" : "hover:bg-foreground/10"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="py-8 font-mono text-sm text-muted-foreground">
            As estatísticas dos jogadores aparecem aqui assim que o elenco for montado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[26rem] font-mono text-sm">
              <thead>
                <tr className="text-xs uppercase text-muted-foreground">
                  <th className="w-8 py-2 text-left font-bold">#</th>
                  <th className="py-2 text-left font-bold">Jogador</th>
                  <th className="w-12 py-2 text-center font-bold">J</th>
                  <th className="w-12 py-2 text-center font-bold">G</th>
                  <th className="w-12 py-2 text-center font-bold">A</th>
                  <th className="w-14 py-2 text-center font-bold">G+A</th>
                  <th className="w-14 py-2 text-right font-bold">Craque</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-t border-dashed border-foreground/40">
                    <td className="py-2.5 text-muted-foreground">{p.number}</td>
                    <td className="py-2.5 font-display text-xl font-black uppercase leading-none">
                      {p.name}
                    </td>
                    <td className="text-center tabular-nums">{p.totals.games}</td>
                    <td className="text-center tabular-nums">{p.totals.goals}</td>
                    <td className="text-center tabular-nums">{p.totals.assists}</td>
                    <td className="text-center font-stencil text-2xl font-black tabular-nums">
                      {p.totals.goals + p.totals.assists}
                    </td>
                    <td className="text-right tabular-nums">{p.totals.motm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
