import { lazy, Suspense, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { RotateCw } from "lucide-react";
import type { Player } from "@/data/team";
import { positionNames, ratingTier, ratingTierStyles } from "@/lib/match";

// Recharts is a hefty dependency; only fetch it once someone actually flips a card.
const PlayerRadar = lazy(() => import("@/components/PlayerRadar"));

const statLabels: Array<[keyof Player["stats"], string]> = [
  ["pac", "RIT"],
  ["sho", "FIN"],
  ["pas", "PAS"],
  ["dri", "DRI"],
  ["def", "DEF"],
  ["phy", "FÍS"],
];

export function PlayerCard({ player }: { player: Player }) {
  const [flipped, setFlipped] = useState(false);
  // 3D perspective + preserve-3d create a GPU compositing layer per card; with a full grid of
  // cards mounted at once this is a known Safari/iOS jank source, so only pay that cost once a
  // card is actually flipped instead of for every card up front.
  const [everFlipped, setEverFlipped] = useState(false);
  const tier = ratingTier(player.overall);
  const style = ratingTierStyles[tier];
  const radarData = statLabels.map(([key, label]) => ({ stat: label, value: player.stats[key] }));

  const flipTarget = useMotionValue(0);
  const flipSpring = useSpring(flipTarget, { stiffness: 260, damping: 28 });
  const rotateY = useTransform(flipSpring, (v) => v);

  function toggleFlip() {
    const next = !flipped;
    setFlipped(next);
    if (next) setEverFlipped(true);
    flipTarget.set(next ? 180 : 0);
  }

  return (
    <div className="relative h-[23rem]" style={everFlipped ? { perspective: 1200 } : undefined}>
      <motion.div
        style={{ rotateY, ...(everFlipped ? { transformStyle: "preserve-3d" as const } : {}) }}
        className="group relative h-full w-full transition-transform duration-300 hover:-translate-y-1"
      >
        {/* FRONT */}
        <article
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_45px_-30px_rgba(0,0,0,0.85)]"
        >
          <button
            type="button"
            onClick={toggleFlip}
            aria-label="Ver estatísticas em radar"
            className="absolute bottom-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-accent group-hover:opacity-100"
          >
            <RotateCw className="h-3 w-3" />
          </button>

          <div
            className="relative h-[60%] w-full overflow-hidden"
            style={{ background: `color-mix(in oklab, ${style.ring} 14%, var(--secondary))` }}
          >
            {player.photo ? (
              <img
                src={player.photo}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  objectPosition: "50% 14%",
                  transform: `scale(${player.photoScale ?? 1})`,
                  transformOrigin: "50% 0%",
                }}
              />
            ) : (
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-x-0 bottom-0 h-full w-full text-foreground/[0.14]"
                fill="currentColor"
                aria-hidden
              >
                <circle cx="50" cy="35" r="19" />
                <path d="M8 102c0-25 18.5-38 42-38s42 13 42 38" />
              </svg>
            )}

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
              style={{ background: "linear-gradient(to bottom, transparent, var(--card))" }}
              aria-hidden
            />

            <header className="relative flex items-start justify-between p-3">
              <div className="rounded-lg bg-background/70 px-2 py-1.5 leading-none backdrop-blur-sm">
                <div className={`font-display text-2xl ${style.rating}`}>{player.overall}</div>
                <span
                  className="mt-1.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold tracking-[0.1em] text-accent-foreground"
                  style={{ background: "var(--accent)" }}
                >
                  {player.position}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/70 font-display text-xs text-foreground backdrop-blur-sm">
                  {player.number}
                </span>
                {player.captain ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-accent/50 bg-accent/85 text-[8px] font-bold text-accent-foreground backdrop-blur-sm">
                    C
                  </span>
                ) : null}
              </div>
            </header>
          </div>

          <h3 className="relative mt-1.5 text-center font-display text-lg uppercase leading-none tracking-wide text-foreground">
            {player.name}
          </h3>
          <p className="relative mt-1 text-center text-[9px] uppercase tracking-widest text-muted-foreground">
            {positionNames[player.position] ?? player.position}
          </p>

          <dl className="relative mt-2 grid grid-cols-3 gap-x-3 gap-y-1.5 px-3.5 pb-3">
            {statLabels.map(([key, label]) => (
              <div key={key}>
                <div className="flex items-baseline justify-between text-[9px] font-semibold tracking-widest text-muted-foreground">
                  <dt>{label}</dt>
                  <dd className="tabular-nums text-foreground">{player.stats[key]}</dd>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${player.stats[key]}%`, background: style.ring }}
                  />
                </div>
              </div>
            ))}
          </dl>
        </article>

        {/* BACK */}
        {everFlipped ? (
          <article
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-3.5 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.85)]"
          >
            <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: style.ring }} aria-hidden />

            <button
              type="button"
              onClick={toggleFlip}
              aria-label="Ver carta do jogador"
              className="absolute bottom-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground transition-opacity hover:text-accent"
            >
              <RotateCw className="h-3 w-3" />
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg uppercase leading-none tracking-wide text-foreground">
                  {player.name}
                </h3>
                <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  #{player.number} · {positionNames[player.position] ?? player.position}
                </p>
              </div>
              <div className={`font-display text-xl ${style.rating}`}>{player.overall}</div>
            </div>

            <div className="mt-1 flex-1">
              <Suspense fallback={null}>
                <PlayerRadar data={radarData} />
              </Suspense>
            </div>

            {player.captain ? (
              <p className="text-center text-[9px] font-bold uppercase tracking-[0.25em] text-accent">
                Capitão de equipe
              </p>
            ) : null}
          </article>
        ) : null}
      </motion.div>
    </div>
  );
}
