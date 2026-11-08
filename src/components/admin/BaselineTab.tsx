import { useState } from "react";
import type { Baseline, SiteData } from "@/lib/site-schema";
import { teamTotals } from "@/lib/site-derive";
import { Field, btnPrimary, input, num, panel, type Save } from "@/components/admin/kit";

export function BaselineTab({ site, save }: { site: SiteData; save: Save }) {
  const [b, setB] = useState<Baseline>(site.baseline);
  const total = teamTotals({ ...site, baseline: b });
  const fields: Array<[keyof Baseline, string]> = [
    ["played", "Jogos"],
    ["won", "Vitórias"],
    ["drawn", "Empates"],
    ["lost", "Derrotas"],
    ["gf", "Gols marcados"],
    ["ga", "Gols sofridos"],
  ];
  return (
    <div className={`max-w-lg space-y-4 ${panel}`}>
      <p className="text-sm text-muted-foreground">
        Números dos jogos que <b>não</b> estão cadastrados como partida. Os números do site = este
        histórico + todas as partidas registradas.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fields.map(([k, l]) => (
          <Field key={k} label={l}>
            <input
              type="number"
              min={0}
              value={b[k]}
              onChange={(e) => setB({ ...b, [k]: num(e.target.value) })}
              className={input}
            />
          </Field>
        ))}
      </div>
      <p className="bg-[var(--cartao)] px-3 py-2 text-sm">
        No site: <b>{total.played}</b> jogos · <b>{total.won}</b> vitórias · <b>{total.gf}</b> gols
        · saldo <b>{total.gd}</b> · <b>{total.rate}%</b>
      </p>
      <button
        className={btnPrimary}
        onClick={() => save({ type: "saveBaseline", baseline: b }, "Histórico salvo.")}
      >
        Salvar histórico
      </button>
    </div>
  );
}

/* ───────────────────────── Página ───────────────────────── */
