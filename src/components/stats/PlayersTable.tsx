import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSite } from "@/components/site-context";
import { Empty } from "@/components/stats/ui";
import { positionNames } from "@/lib/match";
import { CAPTAIN_BADGES } from "@/lib/site-schema";

type SortKey = "ga" | "goals" | "assists" | "games" | "motm";

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "ga", label: "G+A" },
  { key: "goals", label: "Gols" },
  { key: "assists", label: "Assist." },
  { key: "games", label: "Jogos" },
  { key: "motm", label: "Craque" },
];

const avg = (n: number, games: number) =>
  games > 0 ? (n / games).toFixed(2).replace(".", ",") : "—";

/** Tabela de todos os jogadores; clicar numa linha abre a ficha com médias e participação. */
export function PlayersTable() {
  const { site, players } = useSite();
  const [sort, setSort] = useState<SortKey>("ga");
  const [open, setOpen] = useState<string | null>(null);

  const val = (p: (typeof players)[number], k: SortKey) =>
    k === "ga" ? p.totals.goals + p.totals.assists : k === "games" ? p.totals.games : p.totals[k];
  const rows = [...players].sort(
    (a, b) =>
      val(b, sort) - val(a, sort) ||
      b.totals.games - a.totals.games ||
      a.name.localeCompare(b.name),
  );

  // Gols do time nas partidas lançadas, pra calcular a participação de cada um.
  const teamGoals = site.matches.reduce((n, m) => n + m.goalsFor, 0);

  if (rows.length === 0) {
    return (
      <Empty>As estatísticas dos jogadores aparecem aqui assim que o elenco for montado.</Empty>
    );
  }

  return (
    <div>
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

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[30rem] font-mono text-sm">
          <thead>
            <tr className="border-b-2 border-foreground text-xs uppercase text-muted-foreground">
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
            {rows.map((p) => {
              const isOpen = open === p.id;
              const ga = p.totals.goals + p.totals.assists;
              const share =
                teamGoals > 0 ? Math.round((p.totals.tracked.goals / teamGoals) * 100) : 0;
              return (
                <Fragment key={p.id}>
                  <tr
                    className={`cursor-pointer border-t border-dashed border-foreground/40 transition-colors hover:bg-foreground/[0.04] ${
                      isOpen ? "bg-[var(--cartao)]/40" : ""
                    }`}
                    onClick={() => setOpen(isOpen ? null : p.id)}
                  >
                    <td className="py-2.5 text-muted-foreground">{p.number}</td>
                    <td className="py-2.5">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(isOpen ? null : p.id);
                        }}
                        className="text-left font-display text-xl font-black uppercase leading-none"
                      >
                        {p.name}
                        {p.captainRank ? (
                          <span className="ml-2 font-mono text-xs text-[var(--tinta)]">
                            {CAPTAIN_BADGES[p.captainRank as 1 | 2 | 3]}
                          </span>
                        ) : null}
                      </button>
                    </td>
                    <td className="text-center tabular-nums">{p.totals.games}</td>
                    <td className="text-center tabular-nums">{p.totals.goals}</td>
                    <td className="text-center tabular-nums">{p.totals.assists}</td>
                    <td className="text-center font-stencil text-2xl font-black tabular-nums">
                      {ga}
                    </td>
                    <td className="text-right tabular-nums">{p.totals.motm}</td>
                  </tr>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <tr>
                        <td colSpan={7} className="p-0">
                          <motion.dl
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-2 gap-x-6 gap-y-3 overflow-hidden bg-[var(--cartao)]/30 px-3 sm:grid-cols-4"
                          >
                            <Detail
                              label="Posições"
                              value={[p.position, ...p.altPositions]
                                .map((x) => positionNames[x] ?? x)
                                .join(" / ")}
                              wide
                            />
                            <Detail
                              label="Gols por jogo"
                              value={avg(p.totals.goals, p.totals.games)}
                            />
                            <Detail
                              label="Assist. por jogo"
                              value={avg(p.totals.assists, p.totals.games)}
                            />
                            <Detail label="G+A por jogo" value={avg(ga, p.totals.games)} />
                            <Detail
                              label="Dos gols do time"
                              value={teamGoals > 0 ? `${share}%` : "—"}
                              note="partidas lançadas"
                            />
                            <Detail
                              label="Antes do site"
                              value={`${p.history.games} j · ${p.history.goals} g · ${p.history.assists} a`}
                              wide
                            />
                          </motion.dl>
                        </td>
                      </tr>
                    ) : null}
                  </AnimatePresence>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase text-muted-foreground">
        Toque num jogador pra ver a ficha. Totais = histórico anterior + partidas lançadas.
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
  note,
  wide = false,
}: {
  label: string;
  value: string;
  note?: string;
  wide?: boolean;
}) {
  return (
    <div className={`py-2 ${wide ? "col-span-2" : ""}`}>
      <dt className="font-mono text-[11px] uppercase text-muted-foreground">{label}</dt>
      <dd className="font-display text-xl font-black leading-tight">{value}</dd>
      {note ? <p className="font-mono text-[10px] text-muted-foreground">{note}</p> : null}
    </div>
  );
}
