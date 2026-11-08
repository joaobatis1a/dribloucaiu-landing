import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { club } from "@/data/team";
import { SectionTitle } from "@/components/SectionTitle";
import { useSite } from "@/components/site-context";
import { dateParts, playerTotals, topBy } from "@/lib/site-derive";
import { matchOutcome, type Outcome } from "@/lib/match";
import type { Match } from "@/lib/site-schema";

const TABS = [
  { id: "resultados", label: "Resultados" },
  { id: "tabela", label: "Tabela" },
  { id: "artilharia", label: "Artilharia" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const outcomeMark: Record<Outcome, { label: string; className: string }> = {
  V: { label: "Vitória", className: "bg-[var(--piche)] text-[var(--cal)]" },
  E: { label: "Empate", className: "bg-[var(--cartao)] text-[var(--piche)]" },
  D: { label: "Derrota", className: "bg-[var(--tinta)] text-white" },
};

function MatchRow({ m }: { m: Match }) {
  const { site } = useSite();
  const [open, setOpen] = useState(false);
  const d = dateParts(m.date);
  const o = matchOutcome(m.goalsFor, m.goalsAgainst);
  const name = (id: string) => site.players.find((p) => p.id === id)?.name ?? "—";
  const hasDetail = m.scorers.length > 0 || !!m.motm || !!m.note;

  return (
    <li className="border-b border-dashed border-foreground/40 last:border-b-0">
      <button
        type="button"
        disabled={!hasDetail}
        aria-expanded={hasDetail ? open : undefined}
        onClick={() => setOpen((v) => !v)}
        className="grid w-full grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 py-3 text-left enabled:hover:bg-foreground/[0.04] sm:grid-cols-[5.5rem_minmax(0,1fr)_7rem_auto]"
      >
        <span className="font-mono text-sm uppercase">
          {d.day} {d.month}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-2xl font-black uppercase leading-none">
            {m.opponent}
          </span>
          <span className="font-mono text-xs uppercase text-muted-foreground">
            {m.competition}
            {hasDetail ? (open ? " · fechar súmula" : " · ver súmula") : ""}
          </span>
        </span>
        <span
          className={`hidden justify-self-start px-2 py-0.5 font-mono text-xs font-bold uppercase sm:inline ${outcomeMark[o].className}`}
        >
          {outcomeMark[o].label}
        </span>
        <span className="font-stencil text-4xl font-black tabular-nums leading-none">
          {m.goalsFor}
          <span className="mx-1 text-muted-foreground">×</span>
          {m.goalsAgainst}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <dl className="mb-3 ml-[4.5rem] space-y-1 border-l-2 border-primary pl-4 font-mono text-sm sm:ml-[5.5rem]">
              {m.scorers.map((s) => (
                <div key={s.playerId}>
                  <dt className="inline font-bold">{name(s.playerId)}</dt>
                  <dd className="inline">
                    {s.goals > 0 ? ` · ${s.goals} ${s.goals > 1 ? "gols" : "gol"}` : ""}
                    {s.assists > 0 ? ` · ${s.assists} assist.` : ""}
                  </dd>
                </div>
              ))}
              {m.motm ? (
                <div>
                  <dt className="inline">Craque do jogo: </dt>
                  <dd className="inline font-bold">{name(m.motm)}</dd>
                </div>
              ) : null}
              {m.note ? <p className="italic">{m.note}</p> : null}
            </dl>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

function Table() {
  const { site } = useSite();
  const rows = [...site.table].sort((a, b) => b.points - a.points || b.gd - a.gd);
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[30rem] font-mono text-sm">
        <thead>
          <tr className="border-b-2 border-foreground text-xs uppercase">
            <th className="w-8 py-2 text-left font-bold">#</th>
            <th className="py-2 text-left font-bold">Clube</th>
            {["J", "V", "E", "D", "SG"].map((h) => (
              <th key={h} className="w-10 py-2 text-center font-bold">
                {h}
              </th>
            ))}
            <th className="w-14 py-2 text-right font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const us = r.team === club.name;
            return (
              <tr
                key={r.team}
                className={`border-b border-dashed border-foreground/40 ${us ? "bg-[var(--cartao)]" : ""}`}
              >
                <td className="py-2.5 pl-1">{i + 1}</td>
                <td className="py-2.5 font-display text-xl font-black uppercase leading-none">
                  {r.team}
                </td>
                <td className="text-center">{r.played}</td>
                <td className="text-center">{r.won}</td>
                <td className="text-center">{r.drawn}</td>
                <td className="text-center">{r.lost}</td>
                <td className="text-center">{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                <td className="pr-1 text-right font-stencil text-2xl font-black">{r.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Leaders() {
  const { site } = useSite();
  const totals = playerTotals(site);
  const lists = [
    { title: "Artilheiros", rows: topBy(site.players, totals, "goals"), unit: "gols" },
    { title: "Garçons", rows: topBy(site.players, totals, "assists"), unit: "assist." },
  ];
  if (lists.every((l) => l.rows.length === 0)) {
    return (
      <p className="py-8 font-mono text-sm text-muted-foreground">
        A artilharia aparece aqui assim que os gols de uma partida forem lançados na súmula.
      </p>
    );
  }
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {lists.map((l) => (
        <div key={l.title}>
          <p className="border-b-2 border-foreground pb-1 font-display text-xl font-black uppercase">
            {l.title}
          </p>
          <ol>
            {l.rows.map((r, i) => (
              <li
                key={r.player.id}
                className="flex items-baseline gap-3 border-b border-dashed border-foreground/40 py-2"
              >
                <span className="w-5 font-mono text-sm">{i + 1}.</span>
                <span className="min-w-0 flex-1 truncate font-display text-xl font-black uppercase">
                  {r.player.name}
                </span>
                <span className="font-stencil text-3xl font-black">{r.value}</span>
                <span className="w-12 font-mono text-xs uppercase text-muted-foreground">
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

/** Resultados, tabela e artilharia numa súmula datilografada. */
export function MatchCenter() {
  const { matches } = useSite();
  const [tab, setTab] = useState<TabId>("resultados");

  return (
    <section id="jogos" className="wall">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 md:py-28">
        <SectionTitle kicker="Súmula oficial" title="Jogos" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div>
            <div role="tablist" aria-label="Jogos" className="flex gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`border-2 border-b-0 border-foreground px-4 pb-1.5 pt-2 font-display text-lg font-black uppercase leading-none transition-colors ${
                    tab === t.id
                      ? "bg-[var(--papel)]"
                      : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              className="border-2 border-foreground bg-[var(--papel)] px-4 py-3 sm:px-6"
            >
              {tab === "resultados" ? (
                matches.length > 0 ? (
                  <ul>
                    {matches.slice(0, 12).map((m) => (
                      <MatchRow key={m.id} m={m} />
                    ))}
                  </ul>
                ) : (
                  <p className="py-8 font-mono text-sm text-muted-foreground">
                    Nenhuma partida lançada ainda.
                  </p>
                )
              ) : tab === "tabela" ? (
                <Table />
              ) : (
                <Leaders />
              )}
            </div>
          </div>

          <aside className="self-start bg-[var(--piche)] p-6 text-[var(--cal)] shadow-[6px_6px_0_var(--tinta)]">
            <p className="font-stencil text-5xl font-black uppercase leading-[0.85]">
              Topa uma bola?
            </p>
            <p className="mt-4 text-base leading-snug text-[var(--cal)]/80">
              O Driblou Caiu topa amistoso com qualquer clube. Chama no Instagram e combina dia e
              horário.
            </p>
            <a
              href={club.social.instagram.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[var(--tinta)] px-5 py-3 font-display text-lg font-black uppercase text-white transition-transform hover:-translate-y-0.5"
            >
              <Instagram className="h-5 w-5" />
              Marcar amistoso
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
