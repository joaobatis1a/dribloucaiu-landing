import { useSite, type SitePlayer } from "@/components/site-context";
import { Empty, GrowBar } from "@/components/stats/ui";

type Row = { player: SitePlayer; value: number; label: string };

function rank(
  players: SitePlayer[],
  pick: (p: SitePlayer) => number,
  fmt: (n: number) => string = String,
  eligible: (p: SitePlayer) => boolean = () => true,
): Row[] {
  return players
    .filter(eligible)
    .map((player) => ({ player, value: pick(player) }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value || b.player.totals.games - a.player.totals.games)
    .slice(0, 5)
    .map((r) => ({ ...r, label: fmt(r.value) }));
}

/** Rankings: artilharia, assistências, participações, jogos, craque do jogo e médias. */
export function Leaders() {
  const { players } = useSite();

  const perGame = (n: number, g: number) => (g > 0 ? n / g : 0);
  const fmt2 = (n: number) => n.toFixed(2).replace(".", ",");
  const minGames = 3;

  const cards: Array<{ title: string; unit: string; rows: Row[]; note?: string }> = [
    { title: "Artilharia", unit: "gols", rows: rank(players, (p) => p.totals.goals) },
    { title: "Garçons", unit: "assist.", rows: rank(players, (p) => p.totals.assists) },
    {
      title: "Participações em gols",
      unit: "G+A",
      rows: rank(players, (p) => p.totals.goals + p.totals.assists),
    },
    { title: "Mais jogos", unit: "jogos", rows: rank(players, (p) => p.totals.games) },
    { title: "Craque do jogo", unit: "vezes", rows: rank(players, (p) => p.totals.motm) },
    {
      title: "Gols por jogo",
      unit: "por jogo",
      rows: rank(
        players,
        (p) => perGame(p.totals.goals, p.totals.games),
        fmt2,
        (p) => p.totals.games >= minGames,
      ),
      note: `mínimo de ${minGames} jogos`,
    },
  ].filter((c) => c.rows.length > 0);

  if (cards.length === 0) {
    return (
      <Empty>
        Os rankings aparecem aqui assim que houver gols, assistências ou jogos registrados.
      </Empty>
    );
  }

  return (
    <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
      {cards.map((c) => {
        const max = c.rows[0]!.value;
        return (
          <section key={c.title} aria-label={c.title}>
            <div className="flex items-baseline justify-between border-b-2 border-foreground pb-1">
              <h3 className="font-display text-xl font-black uppercase leading-none">{c.title}</h3>
              {c.note ? (
                <span className="font-mono text-[11px] uppercase text-muted-foreground">
                  {c.note}
                </span>
              ) : null}
            </div>
            <ol className="mt-3 space-y-3">
              {c.rows.map((r, i) => (
                <li key={r.player.id}>
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center font-display text-sm font-black ${
                        i === 0 ? "bg-[var(--cartao)] text-[var(--piche)]" : "text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-display text-xl font-black uppercase leading-none">
                      {r.player.name}
                    </span>
                    <span className="font-stencil text-3xl font-black leading-none tabular-nums">
                      {r.label}
                    </span>
                    <span className="w-14 font-mono text-[11px] uppercase text-muted-foreground">
                      {c.unit}
                    </span>
                  </div>
                  <div className="mt-1.5 pl-9">
                    <GrowBar
                      value={r.value}
                      max={max}
                      delay={i * 0.07}
                      className={i === 0 ? "bg-[var(--tinta)]" : "bg-[var(--piche)]"}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
