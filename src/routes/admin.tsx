import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { bundledPhotos } from "@/data/team";
import { adminLogin, adminLogout, adminSave, adminStatus, getSite } from "@/lib/site.functions";
import {
  COMPETITIONS,
  POSITIONS,
  type Baseline,
  type Match,
  type NextMatch,
  type Player,
  type SiteData,
  type TableRow,
} from "@/lib/site-schema";
import { dateParts, sortedMatches, teamTotals } from "@/lib/site-derive";
import { matchOutcome, outcomeStyles } from "@/lib/match";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Painel · Driblou Caiu" }, { name: "robots", content: "noindex" }],
  }),
  loader: async () => ({ status: await adminStatus(), site: await getSite() }),
  component: AdminPage,
});

const input =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus-visible:ring-2 focus-visible:ring-ring/50";
const btn =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-display text-sm uppercase tracking-wider transition-all disabled:opacity-50";
const btnPrimary = `${btn} bg-primary text-primary-foreground hover:brightness-110`;
const btnGhost = `${btn} border border-border text-foreground hover:border-accent hover:text-accent`;

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const num = (v: string) => (v === "" ? 0 : Number(v));
const uid = () => Math.random().toString(36).slice(2, 10);
const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || uid();

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Algo deu errado. Tente de novo.";
}

/* ───────────────────────── Login ───────────────────────── */

function Login({ configured, onDone }: { configured: boolean; onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await adminLogin({ data: { password: pw } });
      if (res.ok) onDone();
      else toast.error(res.error);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
        Painel do clube
      </p>
      <h1 className="mt-2 font-display text-5xl uppercase leading-none">Driblou Caiu</h1>
      {configured ? (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <Field label="Senha">
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className={input}
            />
          </Field>
          <button disabled={busy || !pw} className={`${btnPrimary} w-full`}>
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          O painel está desativado porque a variável{" "}
          <code className="text-foreground">ADMIN_PASSWORD</code> não foi definida no servidor.
          Defina-a nas configurações do projeto e faça um novo deploy.
        </p>
      )}
      <Link
        to="/"
        className="mt-8 text-xs uppercase tracking-widest text-muted-foreground hover:text-accent"
      >
        ← Voltar ao site
      </Link>
    </div>
  );
}

/* ───────────────────────── Partidas ───────────────────────── */

const emptyMatch = (): Match => ({
  id: uid(),
  opponent: "",
  goalsFor: 0,
  goalsAgainst: 0,
  competition: "Amistoso",
  date: new Date().toISOString().slice(0, 10),
  scorers: [],
});

function MatchesTab({ site, save }: { site: SiteData; save: Save }) {
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
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-2xl uppercase">
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
              className="text-xs font-semibold uppercase tracking-widest text-accent hover:underline"
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
        <h2 className="font-display text-2xl uppercase">Partidas ({site.matches.length})</h2>
        <ul className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
          {sortedMatches(site).map((m, i) => {
            const o = outcomeStyles[matchOutcome(m.goalsFor, m.goalsAgainst)];
            const d = dateParts(m.date);
            return (
              <li
                key={m.id}
                className={`flex items-center gap-3 px-4 py-3 ${i ? "border-t border-border/60" : ""}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${o.className}`}
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
                  className="text-xs uppercase tracking-widest text-accent hover:underline"
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

function NextMatchTab({ site, save }: { site: SiteData; save: Save }) {
  const [n, setN] = useState<NextMatch>(
    site.nextMatch ?? { opponent: "", competition: "Liga", date: "", venue: "Casa" },
  );
  const [local, setLocal] = useState(site.nextMatch ? toLocalInput(site.nextMatch.date) : "");

  return (
    <div className="max-w-lg space-y-4 rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-2xl uppercase">Próximo jogo</h2>
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

const STAT_KEYS: Array<[keyof Player["stats"], string]> = [
  ["pac", "RIT"],
  ["sho", "FIN"],
  ["pas", "PAS"],
  ["dri", "DRI"],
  ["def", "DEF"],
  ["phy", "FÍS"],
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
  number: 0,
  position: "ATA",
  overall: 80,
  stats: { pac: 70, sho: 70, pas: 70, dri: 70, def: 40, phy: 70 },
});

function SquadTab({ site, save }: { site: SiteData; save: Save }) {
  const [draft, setDraft] = useState<Player | null>(null);
  const [photoData, setPhotoData] = useState<string | undefined>();
  const [removePhoto, setRemovePhoto] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);
  const exists = draft ? site.players.some((p) => p.id === draft.id) : false;
  const currentPhoto =
    photoData ??
    (removePhoto ? undefined : (draft?.photo ?? (draft ? bundledPhotos[draft.id] : undefined)));

  function open(p: Player) {
    setDraft(structuredClone(p));
    setPhotoData(undefined);
    setRemovePhoto(false);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const player = { ...draft, id: exists ? draft.id : slug(draft.name) };
    if (!player.captain) delete player.captain;
    const action = {
      type: "savePlayer" as const,
      player,
      ...(photoData ? { photoData } : {}),
      ...(removePhoto ? { removePhoto: true } : {}),
    };
    if (await save(action, "Jogador salvo.")) setDraft(null);
  }

  if (draft) {
    const set = (patch: Partial<Player>) => setDraft({ ...draft, ...patch });
    return (
      <form
        onSubmit={submit}
        className="max-w-2xl space-y-5 rounded-xl border border-border bg-card p-5"
      >
        <h2 className="font-display text-2xl uppercase">{exists ? draft.name : "Novo jogador"}</h2>
        <div className="flex items-center gap-4">
          <div className="h-28 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
            {currentPhoto ? (
              <img src={currentPhoto} alt="" className="h-full w-full object-cover object-top" />
            ) : null}
          </div>
          <div className="space-y-2">
            <label className={`${btnGhost} cursor-pointer`}>
              Trocar foto
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
            {currentPhoto ? (
              <button
                type="button"
                onClick={() => {
                  setPhotoData(undefined);
                  setRemovePhoto(true);
                }}
                className="block text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
              >
                Remover foto
              </button>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Quanto maior a resolução, mais nítida (até 800 px de largura).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Nome" className="col-span-2">
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
          <Field label="Posição" className="col-span-2">
            <select
              value={draft.position}
              onChange={(e) => set({ position: e.target.value as Player["position"] })}
              className={input}
            >
              {POSITIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <label className="col-span-2 flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={!!draft.captain}
              onChange={(e) => set({ captain: e.target.checked })}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Capitão
          </label>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {STAT_KEYS.map(([k, label]) => (
            <Field key={k} label={label}>
              <input
                type="number"
                min={0}
                max={99}
                value={draft.stats[k]}
                onChange={(e) => set({ stats: { ...draft.stats, [k]: num(e.target.value) } })}
                className={input}
              />
            </Field>
          ))}
        </div>
        <div className="flex gap-2">
          <button className={btnPrimary}>Salvar jogador</button>
          <button type="button" className={btnGhost} onClick={() => setDraft(null)}>
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl uppercase">Elenco ({site.players.length})</h2>
        <button className={btnPrimary} onClick={() => open(emptyPlayer())}>
          + Novo jogador
        </button>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {site.players.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-secondary">
              {(p.photo ?? bundledPhotos[p.id]) ? (
                <img
                  src={p.photo ?? bundledPhotos[p.id]}
                  alt=""
                  className="h-full w-full object-cover object-top"
                />
              ) : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display uppercase tracking-wide">{p.name}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                #{p.number} · {p.position} · {p.overall}
              </span>
            </span>
            <button
              onClick={() => open(p)}
              className="text-xs uppercase tracking-widest text-accent hover:underline"
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
              className={`text-xs uppercase tracking-widest ${armed === p.id ? "font-bold text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              {armed === p.id ? "Confirmar?" : "Excluir"}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        Gols e assistências de cada jogador são somados automaticamente a partir das partidas.
      </p>
    </div>
  );
}

/* ───────────────────────── Tabela ───────────────────────── */

function TableTab({ site, save }: { site: SiteData; save: Save }) {
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
      <h2 className="font-display text-2xl uppercase">Tabela da liga</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        A tabela é editada à mão porque inclui jogos de outros clubes. A linha com o nome “Driblou
        Caiu” fica destacada no site.
      </p>
      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-[1fr_repeat(6,3.5rem)_1.5rem] gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
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

function BaselineTab({ site, save }: { site: SiteData; save: Save }) {
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
    <div className="max-w-lg space-y-4 rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-2xl uppercase">Histórico anterior</h2>
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
      <p className="rounded-md bg-secondary px-3 py-2 text-sm">
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

type Action = Parameters<typeof adminSave>[0]["data"];
type Save = (action: Action, success: string) => Promise<boolean>;

const TABS = [
  ["partidas", "Partidas"],
  ["proximo", "Próximo jogo"],
  ["elenco", "Elenco"],
  ["tabela", "Tabela"],
  ["historico", "Histórico"],
] as const;

function AdminPage() {
  const { status, site: initial } = Route.useLoaderData();
  const router = useRouter();
  const [authed, setAuthed] = useState(status.authed);
  const [site, setSite] = useState<SiteData>(initial);
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("partidas");

  const save: Save = async (action, success) => {
    try {
      setSite(await adminSave({ data: action }));
      toast.success(success);
      return true;
    } catch (e) {
      toast.error(errMsg(e));
      return false;
    }
  };

  if (!authed) {
    return (
      <>
        <Login
          configured={status.configured}
          onDone={async () => {
            setSite(await getSite());
            setAuthed(true);
          }}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <span className="font-display text-xl uppercase tracking-wide">
            Painel <span className="text-primary">Driblou Caiu</span>
          </span>
          <span className="flex-1" />
          <Link
            to="/"
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-accent"
          >
            Ver site
          </Link>
          <button
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            onClick={async () => {
              await adminLogout();
              setAuthed(false);
              router.invalidate();
            }}
          >
            Sair
          </button>
        </div>
        <nav
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 pb-2"
          aria-label="Seções do painel"
        >
          {TABS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              aria-current={tab === id}
              className={`shrink-0 rounded-md px-3 py-1.5 font-display text-sm uppercase tracking-wider ${tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {status.storage === "file" ? (
          <p className="mb-6 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
            Modo de desenvolvimento: as alterações ficam no arquivo local <code>.data/db.json</code>
            . Em produção, conecte um Redis (veja o README).
          </p>
        ) : null}
        {status.storage === "none" ? (
          <p className="mb-6 rounded-lg border border-primary/50 bg-primary/10 p-3 text-sm">
            Nenhum banco de dados conectado: não dá pra salvar. Conecte o Upstash Redis ao projeto
            na Vercel e faça um novo deploy.
          </p>
        ) : null}
        {tab === "partidas" ? <MatchesTab site={site} save={save} /> : null}
        {tab === "proximo" ? <NextMatchTab site={site} save={save} /> : null}
        {tab === "elenco" ? <SquadTab site={site} save={save} /> : null}
        {tab === "tabela" ? <TableTab site={site} save={save} /> : null}
        {tab === "historico" ? <BaselineTab site={site} save={save} /> : null}
      </main>
      <Toaster />
    </div>
  );
}
