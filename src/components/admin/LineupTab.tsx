import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import { FORMATION_IDS, formations, roleNames, type FormationId } from "@/lib/formations";
import { CAPTAIN_BADGES, MAX_BENCH, type Lineup, type SiteData } from "@/lib/site-schema";
import { coversRole, duplicateNumbers, slotNumber } from "@/lib/site-derive";
import { Pitch } from "@/components/Pitch";
import { Field, btnGhost, btnPrimary, input, num, panel, type Save } from "@/components/admin/kit";

/** Troca o esquema mantendo o jogador de cada slot; só as posições mudam. */
function applyFormation(lineup: Lineup, id: FormationId): Lineup {
  return {
    ...lineup,
    formation: id,
    slots: formations[id].slots.map((s, i) => ({ ...lineup.slots[i]!, x: s.x, y: s.y })),
  };
}

export function LineupTab({ site, save }: { site: SiteData; save: Save }) {
  const { players } = site;
  const [draft, setDraft] = useState<Lineup>(site.lineup);
  const [selected, setSelected] = useState<number | null>(0);
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(site.lineup);
  const slot = selected !== null ? draft.slots[selected] : undefined;
  const role = selected !== null ? formations[draft.formation].slots[selected]?.role : undefined;
  const duplicates = duplicateNumbers(draft, players);

  const inField = new Set(draft.slots.map((s) => s.playerId).filter(Boolean));
  const onBench = new Set(draft.bench);
  const benchable = players.filter((p) => !inField.has(p.id) && !onBench.has(p.id));

  function patchSlot(i: number, patch: Partial<Lineup["slots"][number]>) {
    setDraft((d) => ({ ...d, slots: d.slots.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  }

  /** Coloca o jogador no slot; ele sai de outro slot ou do banco, se estava lá. */
  function assignPlayer(i: number, playerId: string) {
    setDraft((d) => ({
      ...d,
      bench: d.bench.filter((id) => id !== playerId),
      slots: d.slots.map((s, j) => {
        if (j === i) {
          const { playerId: _, ...rest } = s;
          return playerId ? { ...rest, playerId } : rest;
        }
        if (playerId && s.playerId === playerId) {
          const { playerId: _, ...rest } = s;
          return rest;
        }
        return s;
      }),
    }));
  }

  function addToBench(playerId: string) {
    if (!playerId) return;
    setDraft((d) => ({ ...d, bench: [...d.bench, playerId].slice(0, MAX_BENCH) }));
  }

  function moveBench(index: number, dir: -1 | 1) {
    setDraft((d) => {
      const next = [...d.bench];
      const to = index + dir;
      if (to < 0 || to >= next.length) return d;
      [next[index], next[to]] = [next[to]!, next[index]!];
      return { ...d, bench: next };
    });
  }

  async function submit() {
    setBusy(true);
    await save({ type: "saveLineup", lineup: draft }, "Escalação salva. Já está no site.");
    setBusy(false);
  }

  // Quem cobre o setor do slot vem primeiro na lista; os demais ficam logo abaixo.
  const fits = role ? players.filter((p) => coversRole(p, role)) : players;
  const others = role ? players.filter((p) => !coversRole(p, role)) : [];
  const label = (p: (typeof players)[number]) =>
    `#${p.number} ${p.name} · ${[p.position, ...p.altPositions].join("/")}${
      p.captainRank ? ` · ${CAPTAIN_BADGES[p.captainRank as 1 | 2 | 3]}` : ""
    }${inField.has(p.id) && p.id !== slot?.playerId ? " (já no campo)" : ""}${
      onBench.has(p.id) ? " (no banco)" : ""
    }`;

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

      {duplicates.length > 0 ? (
        <p className="mt-4 border-2 border-[var(--tinta)] bg-[var(--tinta)]/10 px-3 py-2 text-sm">
          Camisa repetida entre os escalados: <b>{duplicates.map((n) => `#${n}`).join(", ")}</b>.
          Ajuste o número de um deles na aba Elenco.
        </p>
      ) : null}

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
        <div>
          <Pitch
            lineup={draft}
            players={players}
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
                    {slot.playerId ? (
                      <div
                        title="A camisa vem do cadastro do jogador (aba Elenco)"
                        className={`${input} grid place-items-center bg-[var(--secondary)] text-center font-display text-2xl font-black`}
                      >
                        {slotNumber(slot, players)}
                      </div>
                    ) : (
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={slot.number}
                        onChange={(e) => patchSlot(selected, { number: num(e.target.value) })}
                        className={`${input} text-center font-display text-2xl font-black`}
                      />
                    )}
                  </Field>
                  <Field label="Jogador">
                    <select
                      value={slot.playerId ?? ""}
                      onChange={(e) => assignPlayer(selected, e.target.value)}
                      className={input}
                    >
                      <option value="">Sem jogador (só o número)</option>
                      {fits.length > 0 ? (
                        <optgroup
                          label={`Jogam de ${role ? roleNames[role].toLowerCase() : "linha"}`}
                        >
                          {fits.map((p) => (
                            <option key={p.id} value={p.id}>
                              {label(p)}
                            </option>
                          ))}
                        </optgroup>
                      ) : null}
                      {others.length > 0 ? (
                        <optgroup label="Outras posições">
                          {others.map((p) => (
                            <option key={p.id} value={p.id}>
                              {label(p)}
                            </option>
                          ))}
                        </optgroup>
                      ) : null}
                    </select>
                  </Field>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {slot.playerId
                    ? "A camisa acompanha o jogador escolhido."
                    : "Sem jogador, o slot mostra só este número."}
                </p>
                {players.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    O elenco está vazio. Cadastre jogadores na aba Elenco pra escalar aqui.
                  </p>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <ol className="border-t-2 border-[var(--piche)]">
            {draft.slots.map((s, i) => {
              const p = s.playerId ? players.find((x) => x.id === s.playerId) : undefined;
              return (
                <li key={i} className="border-b-2 border-[var(--piche)]">
                  <button
                    onClick={() => setSelected(i)}
                    className={`flex w-full items-center gap-3 px-1 py-2 text-left transition-colors ${
                      selected === i ? "bg-[var(--cartao)]" : "hover:bg-[var(--piche)]/5"
                    }`}
                  >
                    <span className="grid h-8 w-8 place-items-center bg-[var(--piche)] font-display text-base font-black text-[var(--cal)]">
                      {slotNumber(s, players)}
                    </span>
                    <span
                      className={`flex-1 truncate font-display text-xl font-black uppercase ${p ? "" : "text-foreground/35"}`}
                    >
                      {p?.name ?? "Sem jogador"}
                      {p?.captainRank ? (
                        <span className="ml-2 font-mono text-xs text-[var(--tinta)]">
                          {CAPTAIN_BADGES[p.captainRank as 1 | 2 | 3]}
                        </span>
                      ) : null}
                    </span>
                    <span className="font-mono text-xs uppercase text-muted-foreground">
                      {roleNames[formations[draft.formation].slots[i]!.role]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <section aria-label="Banco de reservas">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-2xl font-black uppercase leading-none">Banco</p>
              <span className="font-mono text-xs uppercase text-muted-foreground">
                {draft.bench.length}/{MAX_BENCH} reservas
              </span>
            </div>
            <ul className="mt-2 border-t-2 border-dashed border-[var(--piche)]">
              {draft.bench.map((id, i) => {
                const p = players.find((x) => x.id === id);
                if (!p) return null;
                return (
                  <li
                    key={id}
                    className="flex items-center gap-2 border-b-2 border-dashed border-[var(--piche)] px-1 py-1.5"
                  >
                    <span className="grid h-8 w-8 place-items-center border-2 border-[var(--piche)] font-display text-base font-black">
                      {p.number}
                    </span>
                    <span className="flex-1 truncate font-display text-xl font-black uppercase">
                      {p.name}
                    </span>
                    <span className="font-mono text-xs uppercase text-muted-foreground">
                      {[p.position, ...p.altPositions].join("/")}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveBench(i, -1)}
                      disabled={i === 0}
                      aria-label={`Subir ${p.name} na ordem do banco`}
                      className="px-1 font-mono text-sm disabled:opacity-25"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBench(i, 1)}
                      disabled={i === draft.bench.length - 1}
                      aria-label={`Descer ${p.name} na ordem do banco`}
                      className="px-1 font-mono text-sm disabled:opacity-25"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((d) => ({ ...d, bench: d.bench.filter((x) => x !== id) }))
                      }
                      aria-label={`Tirar ${p.name} do banco`}
                      className="px-1 hover:text-[var(--tinta)]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
            {draft.bench.length < MAX_BENCH ? (
              <select
                value=""
                onChange={(e) => addToBench(e.target.value)}
                disabled={benchable.length === 0}
                aria-label="Adicionar jogador ao banco"
                className={`${input} mt-3`}
              >
                <option value="">
                  {benchable.length === 0
                    ? "Todos os jogadores já estão escalados"
                    : "+ Adicionar ao banco…"}
                </option>
                {benchable.map((p) => (
                  <option key={p.id} value={p.id}>
                    {label(p)}
                  </option>
                ))}
              </select>
            ) : null}
          </section>

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
