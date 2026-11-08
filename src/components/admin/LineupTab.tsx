import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { FORMATION_IDS, formations, roleNames, type FormationId } from "@/lib/formations";
import type { Lineup, SiteData } from "@/lib/site-schema";
import { Pitch } from "@/components/Pitch";
import { Field, btnGhost, btnPrimary, input, num, panel, type Save } from "@/components/admin/kit";

/** Troca o esquema mantendo número e jogador de cada slot; só as posições mudam. */
function applyFormation(lineup: Lineup, id: FormationId): Lineup {
  return {
    formation: id,
    slots: formations[id].slots.map((s, i) => ({ ...lineup.slots[i]!, x: s.x, y: s.y })),
  };
}

export function LineupTab({ site, save }: { site: SiteData; save: Save }) {
  const [draft, setDraft] = useState<Lineup>(site.lineup);
  const [selected, setSelected] = useState<number | null>(0);
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(site.lineup);
  const slot = selected !== null ? draft.slots[selected] : undefined;
  const role = selected !== null ? formations[draft.formation].slots[selected]?.role : undefined;

  function patchSlot(i: number, patch: Partial<Lineup["slots"][number]>) {
    setDraft((d) => ({ ...d, slots: d.slots.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  }

  function assignPlayer(i: number, playerId: string) {
    setDraft((d) => ({
      ...d,
      slots: d.slots.map((s, j) => {
        if (j === i) {
          const { playerId: _, ...rest } = s;
          return playerId ? { ...rest, playerId } : rest;
        }
        // o mesmo jogador não pode estar em dois slots
        if (playerId && s.playerId === playerId) {
          const { playerId: _, ...rest } = s;
          return rest;
        }
        return s;
      }),
    }));
  }

  async function submit() {
    setBusy(true);
    await save({ type: "saveLineup", lineup: draft }, "Escalação salva. Já está no site.");
    setBusy(false);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {FORMATION_IDS.map((id) => (
          <button
            key={id}
            onClick={() => setDraft((d) => applyFormation(d, id))}
            aria-pressed={draft.formation === id}
            className={`border-2 border-[var(--piche)] px-3 py-1.5 font-display text-lg font-black leading-none transition-colors ${
              draft.formation === id
                ? "bg-[var(--piche)] text-[var(--cal)]"
                : "hover:bg-[var(--piche)]/10"
            }`}
          >
            {id}
          </button>
        ))}
        <button
          onClick={() => setDraft((d) => applyFormation(d, d.formation))}
          className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase underline underline-offset-4 hover:text-[var(--tinta)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Posições padrão
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
        <div>
          <Pitch
            lineup={draft}
            players={site.players}
            selected={selected}
            editable
            onSelect={setSelected}
            onMove={(i, x, y) => patchSlot(i, { x, y })}
          />
          <p className="mt-3 font-mono text-xs uppercase text-muted-foreground">
            Clique num slot pra editar · arraste pra mudar a posição
          </p>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {slot && selected !== null ? (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className={panel}
              >
                <p className="font-mono text-xs font-bold uppercase text-muted-foreground">
                  Slot {selected + 1} · {role ? roleNames[role] : ""}
                </p>
                <div className="mt-3 grid grid-cols-[6rem_minmax(0,1fr)] gap-4">
                  <Field label="Camisa">
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={slot.number}
                      onChange={(e) => patchSlot(selected, { number: num(e.target.value) })}
                      className={`${input} text-center font-display text-2xl font-black`}
                    />
                  </Field>
                  <Field label="Jogador">
                    <select
                      value={slot.playerId ?? ""}
                      onChange={(e) => assignPlayer(selected, e.target.value)}
                      className={input}
                    >
                      <option value="">Sem jogador (só o número)</option>
                      {site.players.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} · {p.position}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                {site.players.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    O elenco está vazio. Cadastre jogadores na aba Elenco pra escalar aqui.
                  </p>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <ol className="border-t-2 border-[var(--piche)]">
            {draft.slots.map((s, i) => {
              const name = s.playerId
                ? site.players.find((p) => p.id === s.playerId)?.name
                : undefined;
              return (
                <li key={i} className="border-b-2 border-[var(--piche)]">
                  <button
                    onClick={() => setSelected(i)}
                    className={`flex w-full items-center gap-3 px-1 py-2 text-left transition-colors ${
                      selected === i ? "bg-[var(--cartao)]" : "hover:bg-[var(--piche)]/5"
                    }`}
                  >
                    <span className="grid h-8 w-8 place-items-center bg-[var(--piche)] font-display text-base font-black text-[var(--cal)]">
                      {s.number}
                    </span>
                    <span
                      className={`flex-1 truncate font-display text-xl font-black uppercase ${name ? "" : "text-foreground/35"}`}
                    >
                      {name ?? "Sem jogador"}
                    </span>
                    <span className="font-mono text-xs uppercase text-muted-foreground">
                      {roleNames[formations[draft.formation].slots[i]!.role]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="flex gap-3">
            <button className={`${btnPrimary} flex-1`} disabled={!dirty || busy} onClick={submit}>
              {busy ? "Salvando…" : dirty ? "Salvar escalação" : "Escalação salva"}
            </button>
            <button className={btnGhost} disabled={!dirty} onClick={() => setDraft(site.lineup)}>
              Descartar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
