import { motion, useReducedMotion } from "framer-motion";
import { useSite } from "@/components/site-context";
import { Block, Empty, Figure, ResultChip } from "@/components/stats/ui";
import { EASE_OUT } from "@/components/motion/Reveal";
import { cleanSheets, clubRecords, dateParts, recentForm } from "@/lib/site-derive";

const KIND: Record<"V" | "E" | "D", [string, string]> = {
  V: ["vitória seguida", "vitórias seguidas"],
  E: ["empate seguido", "empates seguidos"],
  D: ["derrota seguida", "derrotas seguidas"],
};

const per = (n: number, games: number) => (n / Math.max(games, 1)).toFixed(1).replace(".", ",");

/** Panorama do clube: campanha, forma recente, recordes e desempenho por competição. */
export function ClubOverview() {
  const { site, team } = useSite();
  const rec = clubRecords(site);
  const sheets = cleanSheets(site);
  const form = recentForm(site, 10);
  const reduce = useReducedMotion();
  const total = Math.max(team.played, 1);
  const win = rec.biggestWin;
  const loss = rec.biggestLoss;

  const split = [
    { label: "Vitórias", n: team.won, cls: "bg-[var(--piche)] text-[var(--cal)]" },
    { label: "Empates", n: team.drawn, cls: "bg-[var(--cartao)] text-[var(--piche)]" },
    { label: "Derrotas", n: team.lost, cls: "bg-[var(--tinta)] text-white" },
  ];

  return (
    <div className="space-y-10">
      <Block title="A campanha" hint="histórico + partidas lançadas">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
          <Figure label="Jogos" value={team.played} />
          <Figure label="Aproveitamento" value={`${team.rate}%`} accent />
          <Figure label="Gols pró" value={team.gf} note={`${per(team.gf, team.played)} por jogo`} />
          <Figure
            label="Gols contra"
            value={team.ga}
            note={`${per(team.ga, team.played)} por jogo · saldo ${team.gd > 0 ? "+" : ""}${team.gd}`}
          />
        </div>

        <div
          className="mt-7"
          role="img"
          aria-label={`${team.won} vitórias, ${team.drawn} empates, ${team.lost} derrotas`}
        >
          <motion.div
            className="flex h-9 w-full border-2 border-foreground"
            initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            {split.map((s) =>
              s.n > 0 ? (
                <div
                  key={s.label}
                  style={{ flexGrow: s.n, flexBasis: 0 }}
                  className={`grid min-w-0 place-items-center overflow-hidden font-display text-lg font-black ${s.cls}`}
                >
                  {s.n}
                </div>
              ) : null,
            )}
          </motion.div>
          <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs uppercase text-muted-foreground">
            {split.map((s) => (
              <span key={s.label}>
                {s.label} · {Math.round((s.n / total) * 100)}%
              </span>
            ))}
          </div>
        </div>
      </Block>

      <Block title="Fase atual" hint={`últimas ${form.length || 0} partidas lançadas`}>
        {form.length === 0 ? (
          <Empty>Lance partidas no painel pra acompanhar a forma do time.</Empty>
        ) : (
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-1.5">
              {form.map((m) => (
                <ResultChip
                  key={m.id}
                  goalsFor={m.goalsFor}
                  goalsAgainst={m.goalsAgainst}
                  title={`${m.opponent} ${m.goalsFor}×${m.goalsAgainst}`}
                />
              ))}
            </div>
            {rec.streak ? (
              <p className="font-mono text-sm">
                <span className="font-stencil text-4xl font-black leading-none">
                  {rec.streak.count}
                </span>{" "}
                {KIND[rec.streak.kind][rec.streak.count === 1 ? 0 : 1]}
              </p>
            ) : null}
          </div>
        )}
      </Block>

      {rec.tracked > 0 ? (
        <Block title="Recordes e curiosidades" hint={`${rec.tracked} partidas lançadas`}>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {win ? (
              <Record
                label="Maior vitória"
                big={`${win.goalsFor}×${win.goalsAgainst}`}
                note={`${win.opponent} · ${dateParts(win.date).full}`}
              />
            ) : null}
            {loss ? (
              <Record
                label="Pior derrota"
                big={`${loss.goalsFor}×${loss.goalsAgainst}`}
                note={`${loss.opponent} · ${dateParts(loss.date).full}`}
              />
            ) : null}
            {sheets.mostGoals ? (
              <Record
                label="Jogo com mais gols"
                big={`${sheets.mostGoals.goalsFor}×${sheets.mostGoals.goalsAgainst}`}
                note={`${sheets.mostGoals.opponent} · ${dateParts(sheets.mostGoals.date).full}`}
              />
            ) : null}
            <Record
              label="Sem sofrer gol"
              big={String(sheets.cleanSheets)}
              note={sheets.cleanSheets === 1 ? "jogo" : "jogos"}
            />
            <Record
              label="Sem marcar"
              big={String(sheets.failedToScore)}
              note={sheets.failedToScore === 1 ? "jogo" : "jogos"}
            />
          </dl>
        </Block>
      ) : null}

      {rec.byCompetition.length > 0 ? (
        <Block title="Por competição" hint="partidas lançadas">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[24rem] font-mono text-sm">
              <thead>
                <tr className="border-b-2 border-foreground text-xs uppercase">
                  <th className="py-1.5 text-left font-bold">Competição</th>
                  {["J", "V", "E", "D", "GP", "GC", "Aprov."].map((h) => (
                    <th key={h} className="w-12 py-1.5 text-center font-bold">
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
                    <td className="text-center font-bold tabular-nums">
                      {Math.round(((c.won * 3 + c.drawn) / (c.played * 3)) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
      ) : null}
    </div>
  );
}

function Record({ label, big, note }: { label: string; big: string; note: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase text-muted-foreground">{label}</dt>
      <dd>
        <span className="font-stencil text-4xl font-black leading-none tabular-nums">{big}</span>
        <span className="mt-1 block font-mono text-xs text-muted-foreground">{note}</span>
      </dd>
    </div>
  );
}
