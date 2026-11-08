import { useState, type FormEvent } from "react";
import { COMPETITIONS, type Match, type SiteData } from "@/lib/site-schema";
import { dateParts, sortedMatches } from "@/lib/site-derive";
import { matchOutcome, outcomeStyles } from "@/lib/match";
import {
  Field,
  btnGhost,
  btnPrimary,
  input,
  num,
  panel,
  uid,
  type Save,
} from "@/components/admin/kit";

const emptyMatch = (): Match => ({
  id: uid(),
  opponent: "",
  goalsFor: 0,
  goalsAgainst: 0,
  competition: "Amistoso",
  date: new Date().toISOString().slice(0, 10),
  scorers: [],
});

export function MatchesTab({ site, save }: { site: SiteData; save: Save }) {
  const [draft, setDraft] = useState<Match>(emptyMatch);
  const [armed, setArmed] = useState<string | null>(null);
  const editing = site.matches.some((m) => m.id === draft.id);
  const set = (patch: Partial<Match>) => setDraft((d) => ({ ...d, ...patch }));

  const scoredBy = draft.scorers.reduce((n, s) => n + s.goals, 0);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const match: Match = {
      ...draft,
      scorers: draft.scorers.filter((s) => s.playerId && (s.goals > 0 || s.assists > 0)),
    };
    if (!match.motm) delete match.motm;
    if (!match.note) delete match.note;
    if (
      await save(
        { type: "saveMatch", match },
        editing ? "Partida atualizada." : "Partida registrada.",
      )
    ) {
      setDraft(emptyMatch());
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[26rem_1fr]">
      <form onSubmit={submit} className={`space-y-4 ${panel}`}>
        <h2 className="font-display text-2xl font-black uppercase">
          {editing ? "Editar partida" : "Nova partida"}
        </h2>
        <Field label="Adversário">
          <input
            required
            value={draft.opponent}
            onChange={(e) => set({ opponent: e.target.value })}
            className={input}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Competição">
            <select
              value={draft.competition}
              onChange={(e) => set({ competition: e.target.value as Match["competition"] })}
              className={input}
            >
              {COMPETITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Data">
            <input
              type="date"
              required
              value={draft.date}
              onChange={(e) => set({ date: e.target.value })}
              className={input}
            />
          </Field>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <Field label="Gols do Driblou">
            <input
              type="number"
              min={0}
              value={draft.goalsFor}
              onChange={(e) => set({ goalsFor: num(e.target.value) })}
              className={`${input} text-center font-display text-2xl`}
            />
          </Field>
          <span className="pb-2 font-display text-2xl text-muted-foreground">×</span>
          <Field label="Gols do adversário">
            <input
              type="number"
              min={0}
              value={draft.goalsAgainst}
              onChange={(e) => set({ goalsAgainst: num(e.target.value) })}
              className={`${input} text-center font-display text-2xl`}
            />
          </Field>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Quem fez o quê
          </legend>
          {draft.scorers.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_3.5rem_3.5rem_auto] items-center gap-2">
              <select
                aria-label="Jogador"
                value={s.playerId}
                onChange={(e) =>
                  set({
                    scorers: draft.scorers.map((x, j) =>
                      j === i ? { ...x, playerId: e.target.value } : x,
                    ),
                  })
                }
                className={input}
              >
                <option value="">Jogador…</option>
                {site.players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                aria-label="Gols"
                title="Gols"
                type="number"
                min={0}
                value={s.goals}
                onChange={(e) =>
                  set({
                    scorers: draft.scorers.map((x, j) =>
                      j === i ? { ...x, goals: num(e.target.value) } : x,
                    ),
                  })
                }
                className={`${input} px-2 text-center`}
              />
              <input
                aria-label="Assistências"
                title="Assistências"
                type="number"
                min={0}
                value={s.assists}
                onChange={(e) =>
                  set({
                    scorers: draft.scorers.map((x, j) =>
                      j === i ? { ...x, assists: num(e.target.value) } : x,
                    ),
                  })
                }
                className={`${input} px-2 text-center`}
              />
              <button
                type="button"
                aria-label="Remover"
                onClick={() => set({ scorers: draft.scorers.filter((_, j) => j !== i) })}
                className="px-2 text-muted-foreground hover:text-primary"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                set({ scorers: [...draft.scorers, { playerId: "", goals: 1, assists: 0 }] })
              }
              className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
            >
              + Adicionar jogador
            </button>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              colunas: gols · assist.
            </span>
          </div>
          {scoredBy > draft.goalsFor ? (
            <p className="text-xs text-primary">
              Os gols dos jogadores ({scoredBy}) passam do placar ({draft.goalsFor}).
            </p>
          ) : null}
        </fieldset>

        <Field label="Craque do jogo (opcional)">
          <select
            value={draft.motm ?? ""}
            onChange={(e) => set(e.target.value ? { motm: e.target.value } : { motm: "" })}
            className={input}
          >
            <option value="">—</option>
            {site.players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Observação (opcional)">
          <input
            value={draft.note ?? ""}
            onChange={(e) => set({ note: e.target.value })}
            maxLength={160}
            className={input}
            placeholder="Virada nos acréscimos"
          />
        </Field>

        <div className="flex gap-2">
          <button className={`${btnPrimary} flex-1`}>
            {editing ? "Salvar alterações" : "Registrar partida"}
          </button>
          {editing ? (
            <button type="button" onClick={() => setDraft(emptyMatch())} className={btnGhost}>
              Cancelar
            </button>
          ) : null}
        </div>
      </form>

      <div>
        <h2 className="font-display text-2xl font-black uppercase">
          Partidas ({site.matches.length})
        </h2>
        <ul className="mt-3 overflow-hidden border-2 border-[var(--piche)] bg-[var(--papel)]">
          {sortedMatches(site).map((m, i) => {
            const o = outcomeStyles[matchOutcome(m.goalsFor, m.goalsAgainst)];
            const d = dateParts(m.date);
            return (
              <li
                key={m.id}
                className={`flex items-center gap-3 px-4 py-3 ${i ? "border-t border-[var(--piche)]/15" : ""}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-bold ${o.className}`}
                >
                  {o.label}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display uppercase tracking-wide">
                    {m.opponent}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {d.day} {d.month} {d.year} · {m.competition}
                  </span>
                </span>
                <span className="font-display text-xl tabular-nums">
                  {m.goalsFor}×{m.goalsAgainst}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(structuredClone(m));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs uppercase tracking-widest text-primary hover:underline"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (armed !== m.id) return setArmed(m.id);
                    setArmed(null);
                    await save({ type: "deleteMatch", id: m.id }, "Partida excluída.");
                  }}
                  onBlur={() => setArmed(null)}
                  className={`text-xs uppercase tracking-widest ${armed === m.id ? "font-bold text-primary" : "text-muted-foreground hover:text-primary"}`}
                >
                  {armed === m.id ? "Confirmar?" : "Excluir"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── Próximo jogo ───────────────────────── */
