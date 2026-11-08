import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram, Swords } from "lucide-react";
import { club } from "@/data/team";
import { SectionTitle } from "@/components/SectionTitle";
import { useSite } from "@/components/site-context";
import { dateParts, playerTotals, topBy } from "@/lib/site-derive";
import { matchOutcome, outcomeStyles } from "@/lib/match";
import type { Match } from "@/lib/site-schema";

const EASE = [0.16, 1, 0.3, 1] as const;
const TABS = [
  { id: "resultados", label: "Resultados" },
  { id: "tabela", label: "Tabela" },
  { id: "artilharia", label: "Artilharia" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function MatchRow({ m, i }: { m: Match; i: number }) {
  const { site } = useSite();
  const [open, setOpen] = useState(false);
  const d = dateParts(m.date);
  const o = outcomeStyles[matchOutcome(m.goalsFor, m.goalsAgainst)];
  const name = (id: string) => site.players.find((p) => p.id === id)?.name ?? "—";
  const hasDetail = m.scorers.length > 0 || !!m.motm || !!m.note;

  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.05, ease: EASE }}
      className={i > 0 ? "border-t border-border/60" : ""}
    >
      <button
        type="button"
        disabled={!hasDetail}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-3 px-4 py-3 text-left enabled:hover:bg-secondary/40 sm:grid-cols-[3.5rem_1fr_auto_auto]"
      >
        <span className="leading-none">
          <span className="block font-display text-2xl text-foreground">{d.day}</span>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
            {d.month}
          </span>
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-lg uppercase tracking-wide text-foreground">
            {m.opponent}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {m.competition}
            {hasDetail ? <span className="text-accent"> · súmula {open ? "−" : "+"}</span> : null}
          </span>
        </span>
        <span className="font-display text-2xl tabular-nums text-foreground">
          {m.goalsFor}
          <span className="mx-1 text-muted-foreground">×</span>
          {m.goalsAgainst}
        </span>
        <span
          className={`hidden h-7 w-7 items-center justify-center rounded-md text-xs font-bold sm:flex ${o.className}`}
        >
          {o.label}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
              {m.scorers.map((s) => (
                <p key={s.playerId}>
                  <span className="text-foreground">{name(s.playerId)}</span>
                  {s.goals > 0 ? ` · ${s.goals} ${s.goals > 1 ? "gols" : "gol"}` : ""}
                  {s.assists > 0 ? ` · ${s.assists} assist.` : ""}
                </p>
              ))}
              {m.motm ? (
                <p>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                    Craque do jogo
                  </span>{" "}
                  <span className="text-foreground">{name(m.motm)}</span>
                </p>
              ) : null}
              {m.note ? <p className="italic">{m.note}</p> : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.li>
  );
}

function Table() {
  const { site } = useSite();
  const rows = [...site.table].sort((a, b) => b.points - a.points || b.gd - a.gd);
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[26rem] text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <th className="w-10 py-2.5 pl-4 text-left font-semibold">#</th>
            <th className="py-2.5 text-left font-semibold">Clube</th>
            {["J", "V", "E", "D", "SG"].map((h) => (
              <th key={h} className="w-10 py-2.5 text-center font-semibold">
                {h}
              </th>
            ))}
            <th className="w-14 py-2.5 pr-4 text-right font-semibold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const us = r.team === club.name;
            return (
              <tr key={r.team} className={`border-t border-border/60 ${us ? "bg-primary/15" : ""}`}>
                <td className="py-2.5 pl-4 font-display text-lg text-muted-foreground">{i + 1}</td>
                <td className="py-2.5 font-display text-base uppercase tracking-wide text-foreground">
                  {r.team}
                </td>
                <td className="text-center tabular-nums text-muted-foreground">{r.played}</td>
                <td className="text-center tabular-nums text-muted-foreground">{r.won}</td>
                <td className="text-center tabular-nums text-muted-foreground">{r.drawn}</td>
                <td className="text-center tabular-nums text-muted-foreground">{r.lost}</td>
                <td className="text-center tabular-nums text-muted-foreground">
                  {r.gd > 0 ? `+${r.gd}` : r.gd}
                </td>
                <td className="pr-4 text-right font-display text-xl tabular-nums text-foreground">
                  {r.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Leaders() {
  const { site, players } = useSite();
  const totals = playerTotals(site);
  const photo = (id: string) => players.find((p) => p.id === id)?.photo;
  const lists = [
    { title: "Artilheiros", rows: topBy(site.players, totals, "goals"), unit: "gols" },
    { title: "Garçons", rows: topBy(site.players, totals, "assists"), unit: "assist." },
  ];
  if (lists.every((l) => l.rows.length === 0)) {
    return (
      <p className="rounded-xl border border-dashed border-border px-5 py-8 text-sm text-muted-foreground">
        A artilharia aparece aqui assim que os gols de uma partida forem registrados.
      </p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {lists.map((l) => (
        <div key={l.title} className="rounded-xl border border-border bg-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
            {l.title}
          </p>
          <ol className="mt-3 space-y-2">
            {l.rows.map((r, i) => (
              <li key={r.player.id} className="flex items-center gap-3">
                <span className="w-4 font-display text-lg text-muted-foreground">{i + 1}</span>
                <span className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-secondary">
                  {photo(r.player.id) ? (
                    <img
                      src={photo(r.player.id)}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1 truncate font-display uppercase tracking-wide">
                  {r.player.name}
                </span>
                <span className="font-display text-xl tabular-nums">{r.value}</span>
                <span className="w-12 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {l.unit}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export function MatchCenter() {
  const { matches } = useSite();
  const [tab, setTab] = useState<TabId>("resultados");

  return (
    <section id="jogos" className="relative overflow-hidden border-y border-border bg-card/30">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary/15 blur-[130px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionTitle kicker="Central de jogos" title="Placar & tabela" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div>
            <div
              role="tablist"
              aria-label="Central de jogos"
              className="flex gap-1 rounded-lg border border-border bg-background/60 p-1"
            >
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 rounded-md px-3 py-2 font-display text-sm uppercase tracking-wider transition-colors ${
                    tab === t.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-4" role="tabpanel">
              {tab === "resultados" ? (
                matches.length > 0 ? (
                  <ul className="overflow-hidden rounded-xl border border-border bg-card">
                    {matches.slice(0, 12).map((m, i) => (
                      <MatchRow key={m.id} m={m} i={i} />
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-xl border border-dashed border-border px-5 py-8 text-sm text-muted-foreground">
                    Nenhuma partida registrada ainda.
                  </p>
                )
              ) : tab === "tabela" ? (
                <Table />
              ) : (
                <Leaders />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-dashed border-border bg-card/40 p-6">
            <div>
              <Swords className="h-6 w-6 text-primary" aria-hidden />
              <p className="mt-3 font-display text-xl uppercase leading-tight tracking-wide text-foreground">
                Topa uma bola?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                O Driblou Caiu topa amistoso com qualquer clube. Manda mensagem pro Instagram e
                combina data e horário.
              </p>
            </div>
            <a
              href={club.social.instagram.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 [box-shadow:var(--shadow-red)]"
            >
              <Instagram className="h-4 w-4" />
              Chamar no Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
