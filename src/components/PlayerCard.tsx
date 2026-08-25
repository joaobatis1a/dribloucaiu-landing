import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Player } from "@/data/team";
import { positionNames, ratingTier, ratingTierStyles } from "@/lib/match";

const statLabels: Array<[keyof Player["stats"], string]> = [
  ["pac", "RIT"],
  ["sho", "FIN"],
  ["pas", "PAS"],
  ["dri", "DRI"],
  ["def", "DEF"],
  ["phy", "FÍS"],
];

export function PlayerCard({ player }: { player: Player }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = ratingTier(player.overall);
  const style = ratingTierStyles[tier];

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, { stiffness: 220, damping: 22 });
  const spy = useSpring(py, { stiffness: 220, damping: 22 });
  const tiltX = useTransform(spy, [0, 1], [7, -7]);
  const tiltY = useTransform(spx, [0, 1], [-7, 7]);
  const glowX = useTransform(spx, (v) => `${v * 100}%`);
  const glowY = useTransform(spy, (v) => `${v * 100}%`);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave} style={{ perspective: 1200 }}>
      <motion.article
        style={{ rotateX: tiltX, rotateY: tiltY }}
        className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-b p-4 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.9)] ${style.card}`}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: style.glow }} />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(220px circle at ${glowX} ${glowY}, color-mix(in oklab, white 16%, transparent), transparent 70%)`,
          }}
        />

        <header className="relative flex items-start justify-between">
          <div className="leading-none">
            <div className={`font-display text-4xl ${style.rating}`}>{player.overall}</div>
            <div className="mt-1 text-xs font-semibold tracking-[0.15em] text-muted-foreground">
              {player.position}
            </div>
            <div className="mt-0.5 text-[9px] font-medium uppercase tracking-widest text-muted-foreground/70">
              {style.label}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/50 font-display text-sm text-foreground">
              {player.number}
            </span>
            {player.captain ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/50 bg-accent/15 text-[9px] font-bold text-accent">
                C
              </span>
            ) : null}
          </div>
        </header>

        <div className="relative mx-auto -mt-2 h-36 w-full overflow-hidden rounded-xl bg-secondary/60">
          {player.photo ? (
            <img src={player.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-x-0 bottom-0 h-full w-full text-foreground/[0.12]"
              fill="currentColor"
              aria-hidden
            >
              <circle cx="50" cy="35" r="19" />
              <path d="M8 102c0-25 18.5-38 42-38s42 13 42 38" />
            </svg>
          )}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 55%, var(--card) 100%)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ background: "linear-gradient(115deg, transparent 35%, color-mix(in oklab, white 40%, transparent) 48%, transparent 62%)" }}
          />
        </div>

        <h3 className="relative mt-3 text-center font-display text-2xl uppercase leading-none tracking-wide text-foreground">
          {player.name}
        </h3>
        <p className="relative mt-1 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
          {positionNames[player.position] ?? player.position}
        </p>

        <dl className="relative mt-4 grid grid-cols-3 gap-x-2 gap-y-2.5 border-t border-border/60 pt-3">
          {statLabels.map(([key, label]) => (
            <div key={key} className="text-center">
              <dd className="font-display text-base tabular-nums text-foreground">{player.stats[key]}</dd>
              <dt className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
              </dt>
            </div>
          ))}
        </dl>
      </motion.article>
    </div>
  );
}
