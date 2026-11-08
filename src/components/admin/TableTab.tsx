import { useState } from "react";
import type { SiteData, TableRow } from "@/lib/site-schema";
import { btnGhost, btnPrimary, input, num, type Save } from "@/components/admin/kit";

export function TableTab({ site, save }: { site: SiteData; save: Save }) {
  const [rows, setRows] = useState<TableRow[]>(site.table);
  const upd = (i: number, patch: Partial<TableRow>) =>
    setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const cols: Array<[keyof TableRow, string]> = [
    ["played", "J"],
    ["won", "V"],
    ["drawn", "E"],
    ["lost", "D"],
    ["gd", "SG"],
    ["points", "Pts"],
  ];
  return (
    <div className="max-w-3xl">
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_repeat(6,3.5rem)_1.5rem] gap-2 font-mono text-xs font-bold uppercase text-muted-foreground">
          <span>Clube</span>
          {cols.map(([, l]) => (
            <span key={l} className="text-center">
              {l}
            </span>
          ))}
          <span />
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_repeat(6,3.5rem)_1.5rem] items-center gap-2">
            <input
              aria-label="Clube"
              value={r.team}
              onChange={(e) => upd(i, { team: e.target.value })}
              className={input}
            />
            {cols.map(([k, l]) => (
              <input
                key={k}
                aria-label={l}
                type="number"
                value={r[k] as number}
                onChange={(e) => upd(i, { [k]: num(e.target.value) })}
                className={`${input} px-1 text-center`}
              />
            ))}
            <button
              aria-label="Remover linha"
              onClick={() => setRows(rows.filter((_, j) => j !== i))}
              className="text-muted-foreground hover:text-primary"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className={btnGhost}
          onClick={() =>
            setRows([...rows, { team: "", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 }])
          }
        >
          + Clube
        </button>
        <button
          className={btnPrimary}
          disabled={rows.some((r) => !r.team.trim())}
          onClick={() => save({ type: "saveTable", table: rows }, "Tabela salva.")}
        >
          Salvar tabela
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── Histórico ───────────────────────── */
