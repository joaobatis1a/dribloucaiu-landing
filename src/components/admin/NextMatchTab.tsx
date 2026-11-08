import { useState } from "react";
import { COMPETITIONS, type NextMatch, type SiteData } from "@/lib/site-schema";
import { Field, btnGhost, btnPrimary, input, panel, type Save } from "@/components/admin/kit";

function toLocalInput(iso: string) {
  // mostra a hora como em Brasília, independente do fuso do navegador
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return parts.replace(" ", "T");
}

export function NextMatchTab({ site, save }: { site: SiteData; save: Save }) {
  const [n, setN] = useState<NextMatch>(
    site.nextMatch ?? { opponent: "", competition: "Liga", date: "", venue: "Casa" },
  );
  const [local, setLocal] = useState(site.nextMatch ? toLocalInput(site.nextMatch.date) : "");

  return (
    <div className={`max-w-lg space-y-4 ${panel}`}>
      <Field label="Adversário">
        <input
          value={n.opponent}
          onChange={(e) => setN({ ...n, opponent: e.target.value })}
          className={input}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Competição">
          <select
            value={n.competition}
            onChange={(e) =>
              setN({ ...n, competition: e.target.value as NextMatch["competition"] })
            }
            className={input}
          >
            {COMPETITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Mando">
          <input
            value={n.venue}
            onChange={(e) => setN({ ...n, venue: e.target.value })}
            className={input}
            placeholder="Casa"
          />
        </Field>
      </div>
      <Field label="Data e hora (horário de Brasília)">
        <input
          type="datetime-local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          className={input}
        />
      </Field>
      {local && new Date(`${local}:00-03:00`).getTime() < Date.now() ? (
        <p className="border-2 border-[var(--tinta)] bg-[var(--tinta)]/10 px-3 py-2 text-sm">
          Essa data já passou: no site o cartaz vai mostrar “Jogo começou. Placar em breve.”
          Confira o dia e a hora antes de salvar.
        </p>
      ) : null}
      <div className="flex gap-2">
        <button
          className={`${btnPrimary} flex-1`}
          disabled={!n.opponent || !local}
          onClick={() =>
            save(
              { type: "saveNextMatch", nextMatch: { ...n, date: `${local}:00-03:00` } },
              "Próximo jogo salvo.",
            )
          }
        >
          Salvar
        </button>
        <button
          className={btnGhost}
          onClick={() =>
            save({ type: "saveNextMatch", nextMatch: null }, "Próximo jogo removido do site.")
          }
        >
          Sem jogo marcado
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── Elenco ───────────────────────── */
