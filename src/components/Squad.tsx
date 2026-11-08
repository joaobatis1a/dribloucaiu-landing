import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { Instagram } from "lucide-react";
import { club } from "@/data/team";
import { SectionTitle } from "@/components/SectionTitle";
import { useSite, type SitePlayer } from "@/components/site-context";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { EASE_OUT } from "@/components/motion/Reveal";
import { positionBucket, positionNames, type PositionBucket } from "@/lib/match";
import type { Player } from "@/lib/site-schema";

const GROUPS: Array<{ bucket: PositionBucket; label: string }> = [
  { bucket: "GOL", label: "Goleiros" },
  { bucket: "DEF", label: "Defesa" },
  { bucket: "MEI", label: "Meio-campo" },
  { bucket: "ATA", label: "Ataque" },
];

const STATS: Array<[keyof Player["stats"], string]> = [
  ["pac", "Ritmo"],
  ["sho", "Finalização"],
  ["pas", "Passe"],
  ["dri", "Drible"],
  ["def", "Defesa"],
  ["phy", "Físico"],
];

/* ───────────── Elenco vazio ───────────── */

function Rebuilding() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mt-12">
      <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6 lg:grid-cols-11">
        {Array.from({ length: 11 }, (_, i) => (
          <motion.span
            key={i}
            initial={reduce ? false : { opacity: 0, y: 40, rotate: i % 2 ? 6 : -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 140, damping: 14, delay: i * 0.05 }}
            className="text-outline text-center font-stencil text-[clamp(4rem,9vw,7rem)] font-black leading-none [--stroke:color-mix(in_oklab,var(--piche)_60%,transparent)]"
          >
            {i + 1}
          </motion.span>
        ))}
      </div>

      <div className="relative -mx-4 my-10 sm:-mx-6">
        <VelocityMarquee
          baseVelocity={2}
          className="-rotate-2 border-y-4 border-[var(--piche)] bg-[var(--cartao)] py-3 text-[var(--piche)]"
        >
          {["Elenco em reformulação", "Novos nomes em breve", "Peneira aberta"].map((t) => (
            <span
              key={t}
              className="flex items-center font-display text-3xl font-black uppercase sm:text-4xl"
            >
              <span className="px-6">{t}</span>
              <span className="h-6 w-10 -skew-x-[30deg] bg-[var(--piche)]" />
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <p className="max-w-xl text-xl leading-snug">
          O time está sendo remontado. As camisas de 1 a 11 estão esperando dono: se você joga sério
          e topa treinar toda semana, é a hora.
        </p>
        <a
          href={club.social.instagram.url}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-3 bg-[var(--tinta)] px-6 py-4 font-display text-2xl font-black uppercase text-white shadow-[5px_5px_0_var(--piche)] transition-transform duration-300 hover:-translate-y-1"
        >
          <Instagram className="h-6 w-6 transition-transform group-hover:rotate-12" />
          Quero jogar
        </a>
      </div>
    </div>
  );
}

/* ───────────── Lista de chamada ───────────── */

function PlayerRow({
  player,
  index,
  onHover,
}: {
  player: SitePlayer;
  index: number;
  onHover: (p: SitePlayer | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: EASE_OUT }}
      className="border-b-2 border-foreground"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => onHover(player)}
        onMouseLeave={() => onHover(null)}
        className="group relative grid w-full grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden py-3 text-left sm:grid-cols-[7rem_minmax(0,1fr)_auto_auto] sm:gap-6"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 bg-[var(--piche)] transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100"
        />
        <span className="text-outline relative font-stencil text-6xl font-black leading-none transition-colors duration-300 [--stroke:var(--piche)] group-hover:text-[var(--tinta)] group-hover:[--stroke:var(--tinta)] sm:text-8xl">
          {player.number}
        </span>
        <span className="relative min-w-0 transition-transform duration-500 group-hover:translate-x-3">
          <span className="block truncate font-display text-3xl font-black uppercase leading-none transition-colors group-hover:text-[var(--cal)] sm:text-5xl">
            {player.name}
            {player.captain ? (
              <span className="ml-2 align-middle text-base text-[var(--tinta)]">(C)</span>
            ) : null}
          </span>
          <span className="mt-1 block font-mono text-xs uppercase text-muted-foreground transition-colors group-hover:text-[var(--cal)]/60">
            {positionNames[player.position] ?? player.position} · {player.totals.goals} gols ·{" "}
            {player.totals.assists} assist.
          </span>
        </span>
        <span className="relative hidden font-mono text-xs uppercase text-muted-foreground transition-colors group-hover:text-[var(--cal)]/70 sm:block">
          {open ? "Fechar" : "Ficha"}
        </span>
        <span className="relative grid h-14 w-14 place-items-center bg-[var(--cartao)] font-display text-3xl font-black text-[var(--piche)] transition-transform duration-300 group-hover:rotate-[-6deg] sm:h-16 sm:w-16">
          {player.overall}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div
              className={`grid gap-6 pb-6 pt-2 ${player.photo ? "sm:grid-cols-[10rem_minmax(0,1fr)]" : ""}`}
            >
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  className="aspect-[4/5] w-40 object-cover object-top"
                />
              ) : null}
              <dl className="grid max-w-3xl content-start gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {STATS.map(([k, label], i) => (
                  <div key={k}>
                    <div className="flex justify-between font-mono text-sm uppercase">
                      <dt>{label}</dt>
                      <dd className="font-bold">{player.stats[k]}</dd>
                    </div>
                    <div className="mt-1 h-2 bg-[var(--secondary)]">
                      <motion.div
                        className="h-full bg-[var(--tinta)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${player.stats[k]}%` }}
                        transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease: EASE_OUT }}
                      />
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.li>
  );
}

/** Foto que segue o cursor (só em telas com mouse). */
function CursorPhoto({
  player,
  x,
  y,
}: {
  player: SitePlayer | null;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden [@media(hover:hover)]:block">
      <AnimatePresence>
        {player?.photo ? (
          <motion.img
            key={player.id}
            src={player.photo}
            alt=""
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            style={{ left: x, top: y }}
            className="absolute -ml-28 -mt-40 aspect-[4/5] w-56 border-[6px] border-[var(--papel)] object-cover object-top shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]"
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Squad() {
  const { players } = useSite();
  const [hovered, setHovered] = useState<SitePlayer | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 26 });
  const y = useSpring(my, { stiffness: 260, damping: 26 });
  let rowIndex = 0;

  return (
    <section id="elenco" className="overflow-hidden bg-[var(--papel)]">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 md:py-28">
        <SectionTitle
          kicker={players.length ? `${players.length} na chamada` : "Em reformulação"}
          title="Elenco"
        />

        {players.length === 0 ? (
          <Rebuilding />
        ) : (
          <div
            className="relative mt-10"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mx.set(e.clientX - r.left);
              my.set(e.clientY - r.top);
            }}
          >
            <CursorPhoto player={hovered} x={x} y={y} />
            {GROUPS.map((g) => {
              const list = players.filter((p) => positionBucket(p.position) === g.bucket);
              if (list.length === 0) return null;
              return (
                <div key={g.bucket} className="mt-10 first:mt-0">
                  <p className="font-mono text-sm uppercase text-muted-foreground">
                    {g.label} · {list.length}
                  </p>
                  <ul className="mt-2 border-t-2 border-foreground">
                    {list.map((p) => (
                      <PlayerRow key={p.id} player={p} index={rowIndex++} onHover={setHovered} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
