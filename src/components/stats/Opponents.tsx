import { useSite } from "@/components/site-context";
import { Block, Empty } from "@/components/stats/ui";
import { dateParts, opponents } from "@/lib/site-derive";

/** Histórico contra cada adversário, com o "freguês" e o "carrasco" do clube. */
export function Opponents() {
  const { site } = useSite();
  const rows = opponents(site);

  if (rows.length === 0) {
    return <Empty>Os confrontos aparecem aqui assim que houver partidas lançadas.</Empty>;
  }

  const balance = (r: (typeof rows)[number]) => r.won - r.lost;
  const fregues = [...rows]
    .filter((r) => r.won > 0 && balance(r) > 0)
    .sort((a, b) => balance(b) - balance(a) || b.gf - a.gf)[0];
  const carrasco = [...rows]
    .filter((r) => r.lost > 0 && balance(r) < 0)
    .sort((a, b) => balance(a) - balance(b) || b.ga - a.ga)[0];

  return (
    <div className="space-y-9">
      {fregues || carrasco ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {fregues ? (
            <Highlight tag="Freguês" tone="bg-[var(--piche)] text-[var(--cal)]" row={fregues} />
          ) : null}
          {carrasco ? (
            <Highlight tag="Carrasco" tone="bg-[var(--tinta)] text-white" row={carrasco} />
          ) : null}
        </div>
      ) : null}

      <Block
        title="Todos os adversários"
        hint={`${rows.length} ${rows.length === 1 ? "clube" : "clubes"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-foreground text-xs uppercase text-muted-foreground">
                <th className="py-2 text-left font-bold">Adversário</th>
                {["J", "V", "E", "D"].map((h) => (
                  <th key={h} className="w-10 py-2 text-center font-bold">
                    {h}
                  </th>
                ))}
                <th className="w-20 py-2 text-center font-bold">Gols</th>
                <th className="w-24 py-2 text-right font-bold">Último</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-dashed border-foreground/40">
                  <td className="py-2.5 font-display text-xl font-black uppercase leading-none">
                    {r.name}
                  </td>
                  <td className="text-center tabular-nums">{r.played}</td>
                  <td className="text-center tabular-nums">{r.won}</td>
                  <td className="text-center tabular-nums">{r.drawn}</td>
                  <td className="text-center tabular-nums">{r.lost}</td>
                  <td className="text-center tabular-nums">
                    {r.gf}×{r.ga}
                  </td>
                  <td className="text-right text-xs text-muted-foreground">
                    {dateParts(r.last).full}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>
    </div>
  );
}

function Highlight({
  tag,
  tone,
  row,
}: {
  tag: string;
  tone: string;
  row: ReturnType<typeof opponents>[number];
}) {
  return (
    <div className={`p-4 ${tone}`}>
      <p className="font-mono text-xs uppercase opacity-70">{tag}</p>
      <p className="mt-1 font-stencil text-4xl font-black uppercase leading-[0.9]">{row.name}</p>
      <p className="mt-2 font-mono text-sm">
        {row.won}V · {row.drawn}E · {row.lost}D · gols {row.gf}×{row.ga}
      </p>
    </div>
  );
}
