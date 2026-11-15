import { useState } from "react";
import type { Baseline, SiteData } from "@/lib/site-schema";
import { playerTotals, teamTotals } from "@/lib/site-derive";
import { Field, btnPrimary, input, num, panel, type Save } from "@/components/admin/kit";

const CLUB_FIELDS: Array<[keyof Baseline, string]> = [
  ["played", "Jogos"],
  ["won", "Vitórias"],
  ["drawn", "Empates"],
  ["lost", "Derrotas"],
  ["gf", "Gols marcados"],
  ["ga", "Gols sofridos"],
];

type History = { games: number; goals: number; assists: number };

/**
 * Histórico de antes do site: do clube e de cada jogador. Tudo que for lançado em Partidas
 * soma por cima disso, então aqui só vão os números "antigos".
 */
export function StatsTab({ site, save }: { site: SiteData; save: Save }) {
  const [club, setClub] = useState<Baseline>(site.baseline);
  const [hist, setHist] = useState<Record<string, History>>(() =>
    Object.fromEntries(site.players.map((p) => [p.id, p.history])),
  );
  const [busy, setBusy] = useState<"club" | "players" | null>(null);

  const total = teamTotals({ ...site, baseline: club });
  const totals = playerTotals({
    ...site,
    players: site.players.map((p) => ({ ...p, history: hist[p.id] ?? p.history })),
  });
  const clubDirty = JSON.stringify(club) !== JSON.stringify(site.baseline);
  const playersDirty = site.players.some(
    (p) => JSON.stringify(hist[p.id]) !== JSON.stringify(p.history),
  );

  const setH = (id: string, patch: Partial<History>) =>
    setHist((h) => ({ ...h, [id]: { ...h[id]!, ...patch } }));

  return (
    <div className="space-y-10">
      <section className={`max-w-3xl space-y-4 ${panel}`}>
        <div>
          <h2 className="font-display text-2xl font-black uppercase leading-none">O clube</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Números dos jogos que <b>não</b> estão cadastrados como partida. O que aparece no site é
            este histórico mais todas as partidas lançadas.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CLUB_FIELDS.map(([k, l]) => (
            <Field key={k} label={l}>
              <input
                type="number"
                min={0}
                value={club[k]}
                onChange={(e) => setClub({ ...club, [k]: num(e.target.value) })}
                className={input}
              />
            </Field>
          ))}
        </div>
        {club.won + club.drawn + club.lost !== club.played ? (
          <p className="text-sm text-[var(--tinta)]">
            V + E + D ({club.won + club.drawn + club.lost}) não bate com o total de jogos (
            {club.played}).
          </p>
        ) : null}
        <p className="bg-[var(--cartao)] px-3 py-2 text-sm">
          No site: <b>{total.played}</b> jogos · <b>{total.won}</b> vitórias · <b>{total.gf}</b>{" "}
          gols · saldo <b>{total.gd}</b> · <b>{total.rate}%</b>
        </p>
        <button
          className={btnPrimary}
          disabled={!clubDirty || busy !== null}
          onClick={async () => {
            setBusy("club");
            await save({ type: "saveBaseline", baseline: club }, "Histórico do clube salvo.");
            setBusy(null);
          }}
        >
          {busy === "club" ? "Salvando…" : "Salvar histórico do clube"}
        </button>
      </section>

      <section className={`space-y-4 ${panel}`}>
        <div>
          <h2 className="font-display text-2xl font-black uppercase leading-none">Os jogadores</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Preencha só o que cada um já tinha <b>antes</b> do site. Os jogos, gols e assistências
            das partidas lançadas são somados sozinhos (coluna “No site”).
          </p>
        </div>

        {site.players.length === 0 ? (
          <p className="py-6 font-mono text-sm text-muted-foreground">
            Cadastre os jogadores na aba Elenco pra editar o histórico deles aqui.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] font-mono text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--piche)] text-xs uppercase">
                  <th className="py-2 text-left font-bold">Jogador</th>
                  <th className="w-24 py-2 text-center font-bold">Jogos antes</th>
                  <th className="w-24 py-2 text-center font-bold">Gols antes</th>
                  <th className="w-24 py-2 text-center font-bold">Assist. antes</th>
                  <th className="w-40 py-2 pl-4 text-left font-bold">Total no site</th>
                </tr>
              </thead>
              <tbody>
                {site.players.map((p) => {
                  const h = hist[p.id]!;
                  const t = totals[p.id]!;
                  return (
                    <tr key={p.id} className="border-b border-dashed border-[var(--piche)]/40">
                      <td className="py-2 pr-2">
                        <span className="font-display text-lg font-black uppercase leading-none">
                          {p.name}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">#{p.number}</span>
                      </td>
                      {(["games", "goals", "assists"] as const).map((k) => (
                        <td key={k} className="px-1 py-1.5">
                          <input
                            type="number"
                            min={0}
                            aria-label={`${p.name}: ${k}`}
                            value={h[k]}
                            onChange={(e) => setH(p.id, { [k]: num(e.target.value) })}
                            className={`${input} px-1 py-1.5 text-center`}
                          />
                        </td>
                      ))}
                      <td className="py-2 pl-4 text-xs">
                        <b>{t.games}</b> j · <b>{t.goals}</b> g · <b>{t.assists}</b> a
                        <span className="block text-muted-foreground">
                          (+{t.tracked.games} j · +{t.tracked.goals} g · +{t.tracked.assists} a
                          lançados)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {site.players.length > 0 ? (
          <button
            className={btnPrimary}
            disabled={!playersDirty || busy !== null}
            onClick={async () => {
              setBusy("players");
              await save(
                {
                  type: "savePlayerHistories",
                  histories: site.players.map((p) => ({ id: p.id, history: hist[p.id]! })),
                },
                "Histórico dos jogadores salvo.",
              );
              setBusy(null);
            }}
          >
            {busy === "players" ? "Salvando…" : "Salvar histórico dos jogadores"}
          </button>
        ) : null}
      </section>
    </div>
  );
}
