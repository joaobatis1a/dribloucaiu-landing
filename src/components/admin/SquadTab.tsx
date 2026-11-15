import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { CAPTAIN_LABELS, POSITIONS, type Player, type SiteData } from "@/lib/site-schema";
import { positionNames } from "@/lib/match";
import { playerTotals } from "@/lib/site-derive";
import {
  Field,
  btnGhost,
  btnPrimary,
  errMsg,
  input,
  num,
  slug,
  uid,
  type Save,
} from "@/components/admin/kit";

const STAT_KEYS: Array<[keyof Player["stats"], string]> = [
  ["pac", "Ritmo"],
  ["sho", "Finalização"],
  ["pas", "Passe"],
  ["dri", "Drible"],
  ["def", "Defesa"],
  ["phy", "Físico"],
];

async function resizeToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 800 / bitmap.width, 1000 / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  for (const q of [0.88, 0.8, 0.7, 0.6]) {
    const url = canvas.toDataURL("image/webp", q);
    if (url.length < 440_000) return url;
  }
  throw new Error("Foto muito pesada. Use uma imagem menor.");
}

const emptyPlayer = (): Player => ({
  id: uid(),
  name: "",
  number: 10,
  position: "ATA",
  altPositions: [],
  overall: 80,
  stats: { pac: 70, sho: 70, pas: 70, dri: 70, def: 40, phy: 70 },
  history: { games: 0, goals: 0, assists: 0 },
});

/** Painel lateral com o formulário do jogador. */
function PlayerDrawer({
  siteForRank,
  initial,
  exists,
  onClose,
  save,
}: {
  siteForRank: Player[];
  initial: Player;
  exists: boolean;
  onClose: () => void;
  save: Save;
}) {
  const [draft, setDraft] = useState<Player>(initial);
  const [photoData, setPhotoData] = useState<string | undefined>();
  const [removePhoto, setRemovePhoto] = useState(false);
  const [busy, setBusy] = useState(false);
  const currentPhoto = photoData ?? (removePhoto ? undefined : draft.photo);
  const set = (patch: Partial<Player>) => setDraft((d) => ({ ...d, ...patch }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const player = { ...draft, id: exists ? draft.id : slug(draft.name) };
    const ok = await save(
      {
        type: "savePlayer",
        player,
        ...(photoData ? { photoData } : {}),
        ...(removePhoto ? { removePhoto: true } : {}),
      },
      exists ? "Jogador atualizado." : "Jogador adicionado ao elenco.",
    );
    setBusy(false);
    if (ok) onClose();
  }

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-[var(--piche)]/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={exists ? `Editar ${draft.name}` : "Novo jogador"}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto border-l-4 border-[var(--piche)] bg-[var(--cal)]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
      >
        <form onSubmit={submit} className="space-y-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-stencil text-5xl font-black uppercase leading-[0.85]">
              {exists ? draft.name || "Jogador" : "Novo jogador"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="p-1 hover:text-[var(--tinta)]"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <div className="flex items-center gap-5">
            <label className="group relative grid aspect-[4/5] w-32 shrink-0 cursor-pointer place-items-center overflow-hidden border-2 border-dashed border-[var(--piche)] bg-[var(--papel)]">
              {currentPhoto ? (
                <img
                  src={currentPhoto}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              ) : (
                <span className="flex flex-col items-center gap-1 font-mono text-xs uppercase text-muted-foreground">
                  <Camera className="h-6 w-6" />
                  Foto
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-[var(--piche)] py-1 text-center font-mono text-[11px] uppercase text-[var(--cal)] transition-transform group-hover:translate-y-0">
                Trocar
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    setPhotoData(await resizeToDataUrl(f));
                    setRemovePhoto(false);
                  } catch (err) {
                    toast.error(errMsg(err));
                  }
                }}
              />
            </label>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Foto em pé, do peito pra cima, fica melhor. Até 800 px de largura.</p>
              {currentPhoto ? (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoData(undefined);
                    setRemovePhoto(true);
                  }}
                  className="font-mono text-xs uppercase underline underline-offset-4 hover:text-[var(--tinta)]"
                >
                  Remover foto
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Nome" className="col-span-2 sm:col-span-4">
              <input
                required
                value={draft.name}
                onChange={(e) => set({ name: e.target.value })}
                className={input}
              />
            </Field>
            <Field label="Camisa">
              <input
                type="number"
                min={0}
                max={99}
                value={draft.number}
                onChange={(e) => set({ number: num(e.target.value) })}
                className={input}
              />
            </Field>
            <Field label="Geral">
              <input
                type="number"
                min={1}
                max={99}
                value={draft.overall}
                onChange={(e) => set({ overall: num(e.target.value) })}
                className={input}
              />
            </Field>
            <Field label="Posição principal" className="col-span-2">
              <select
                value={draft.position}
                onChange={(e) =>
                  set({
                    position: e.target.value as Player["position"],
                    altPositions: draft.altPositions.filter((p) => p !== e.target.value),
                  })
                }
                className={input}
              >
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p} · {positionNames[p]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <fieldset>
            <legend className="mb-2 font-mono text-xs font-bold uppercase text-muted-foreground">
              Também joga de (até 3)
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {POSITIONS.filter((p) => p !== draft.position).map((p) => {
                const on = draft.altPositions.includes(p);
                const full = !on && draft.altPositions.length >= 3;
                return (
                  <button
                    key={p}
                    type="button"
                    disabled={full}
                    aria-pressed={on}
                    title={positionNames[p]}
                    onClick={() =>
                      set({
                        altPositions: on
                          ? draft.altPositions.filter((x) => x !== p)
                          : [...draft.altPositions, p],
                      })
                    }
                    className={`border-2 border-[var(--piche)] px-2.5 py-1 font-display text-base font-black leading-none transition-colors disabled:opacity-30 ${
                      on ? "bg-[var(--piche)] text-[var(--cal)]" : "hover:bg-[var(--piche)]/10"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Field label="Capitania">
            <select
              value={draft.captainRank ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                const next = { ...draft };
                if (v) next.captainRank = Number(v);
                else delete next.captainRank;
                setDraft(next);
              }}
              className={input}
            >
              <option value="">Não é capitão</option>
              {([1, 2, 3] as const).map((r) => {
                const holder = siteForRank.find((p) => p.captainRank === r && p.id !== draft.id);
                return (
                  <option key={r} value={r}>
                    {CAPTAIN_LABELS[r]}
                    {holder ? ` (hoje: ${holder.name})` : ""}
                  </option>
                );
              })}
            </select>
            {draft.captainRank &&
            siteForRank.some((p) => p.captainRank === draft.captainRank && p.id !== draft.id) ? (
              <span className="mt-1 block text-xs text-[var(--tinta)]">
                Quem já tem esse degrau perde a capitania ao salvar.
              </span>
            ) : null}
          </Field>

          <fieldset>
            <legend className="mb-3 font-mono text-xs font-bold uppercase text-muted-foreground">
              Atributos
            </legend>
            <div className="space-y-3">
              {STAT_KEYS.map(([k, label]) => (
                <div
                  key={k}
                  className="grid grid-cols-[7rem_minmax(0,1fr)_3rem] items-center gap-3"
                >
                  <span className="font-mono text-sm uppercase">{label}</span>
                  <input
                    type="range"
                    min={0}
                    max={99}
                    value={draft.stats[k]}
                    onChange={(e) => set({ stats: { ...draft.stats, [k]: num(e.target.value) } })}
                    className="accent-[var(--tinta)]"
                    aria-label={label}
                  />
                  <span className="text-right font-display text-2xl font-black tabular-nums">
                    {draft.stats[k]}
                  </span>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="sticky bottom-0 -mx-6 flex gap-3 border-t-2 border-[var(--piche)] bg-[var(--cal)] px-6 py-4">
            <button disabled={busy} className={`${btnPrimary} flex-1`}>
              {busy ? "Salvando…" : exists ? "Salvar jogador" : "Adicionar ao elenco"}
            </button>
            <button type="button" className={btnGhost} onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </motion.aside>
    </>
  );
}

export function SquadTab({ site, save }: { site: SiteData; save: Save }) {
  const [editing, setEditing] = useState<Player | null>(null);
  const [armed, setArmed] = useState<string | null>(null);
  const totals = playerTotals(site);
  const exists = editing ? site.players.some((p) => p.id === editing.id) : false;

  return (
    <div>
      <button className={btnPrimary} onClick={() => setEditing(emptyPlayer())}>
        <Plus className="h-5 w-5" />
        Novo jogador
      </button>

      {site.players.length === 0 ? (
        <div className="mt-8 grid place-items-center border-2 border-dashed border-[var(--piche)] px-6 py-16 text-center">
          <p className="font-stencil text-5xl font-black uppercase leading-[0.85]">Elenco vazio</p>
          <p className="mt-3 max-w-md text-muted-foreground">
            O site mostra “elenco em reformulação” até o primeiro jogador entrar. Adicione os
            jogadores e depois escale cada um na aba Escalação.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {site.players.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex border-2 border-[var(--piche)] bg-[var(--papel)] shadow-[4px_4px_0_var(--piche)]"
              >
                <div className="relative w-24 shrink-0 bg-[var(--secondary)]">
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  ) : (
                    <span className="text-outline absolute inset-0 grid place-items-center font-stencil text-5xl font-black">
                      {p.number}
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-display text-2xl font-black uppercase leading-none">
                      {p.name}
                    </p>
                    <span className="bg-[var(--cartao)] px-1.5 font-display text-lg font-black">
                      {p.overall}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs uppercase text-muted-foreground">
                    #{p.number} · {[p.position, ...p.altPositions].join(" / ")}
                    {p.captainRank
                      ? ` · ${CAPTAIN_LABELS[p.captainRank as 1 | 2 | 3].toLowerCase()}`
                      : ""}
                  </p>
                  <p className="font-mono text-xs uppercase text-muted-foreground">
                    {totals[p.id]?.games ?? 0} jogos · {totals[p.id]?.goals ?? 0} gols ·{" "}
                    {totals[p.id]?.assists ?? 0} assist.
                  </p>
                  <div className="mt-auto flex gap-4 pt-2">
                    <button
                      onClick={() => setEditing(structuredClone(p))}
                      className="font-mono text-xs font-bold uppercase underline underline-offset-4 hover:text-[var(--tinta)]"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (armed !== p.id) return setArmed(p.id);
                        setArmed(null);
                        await save({ type: "deletePlayer", id: p.id }, "Jogador removido.");
                      }}
                      onBlur={() => setArmed(null)}
                      className={`font-mono text-xs font-bold uppercase underline underline-offset-4 ${
                        armed === p.id
                          ? "text-[var(--tinta)]"
                          : "text-muted-foreground hover:text-[var(--tinta)]"
                      }`}
                    >
                      {armed === p.id ? "Confirmar remoção?" : "Remover"}
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <AnimatePresence>
        {editing ? (
          <PlayerDrawer
            key={editing.id}
            siteForRank={site.players}
            initial={editing}
            exists={exists}
            onClose={() => setEditing(null)}
            save={save}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
