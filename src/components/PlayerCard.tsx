import { useRef, useState } from "react";
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
  const ref = useRef<HTMLElement>(null);
  const [sweepKey, setSweepKey] = useState(0);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, { stiffness: 220, damping: 22 });
  const spy = useSpring(py, { stiffness: 220, damping: 22 });
  const rotateX = useTransform(spy, [0, 1], [8, -8]);
  const rotateY = useTransform(spx, [0, 1], [-8, 8]);
  const glowX = useTransform(spx, (v) => `${v * 100}%`);
  const glowY = useTransform(spy, (v) => `${v * 100}%`);

  const tier = ratingTier(player.overall);
  const style = ratingTierStyles[tier];

  function handleMove(e: React.PointerEvent<HTMLElement>) {
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
    <motion.article
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerEnter={() => setSweepKey((k) => k + 1)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`group relative overflow-hidden rounded-xl border border-border bg-gradient-to-b p-5 will-change-transform ${style.card}`}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: style.glow,
          background: `radial-gradient(280px circle at ${glowX} ${glowY}, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)`,
        }}
      />
      <span
        key={sweepKey}
        aria-hidden
        className="shimmer-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <span className="pointer-events-none absolute -right-10 top-0 h-full w-24 rotate-12 bg-primary/10" />

      {player.captain ? (
        <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-accent/50 bg-accent/15 text-[10px] font-bold text-accent">
          C
        </span>
      ) : null}

      <header className="relative flex items-start justify-between">
        <div>
          <div className={`font-display text-5xl leading-none ${style.rating}`}>{player.overall}</div>
          <div className="mt-1 text-xs font-semibold tracking-[0.2em] text-muted-foreground">
            {player.position}
          </div>
          <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
            {style.label}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/40 font-display text-sm text-foreground">
            {player.number}
          </span>
          <span className="h-8 w-1.5 rounded-full bg-primary" />
        </div>
      </header>

      <h3 className="relative mt-5 font-display text-2xl uppercase tracking-wide text-foreground">
        {player.name}
      </h3>
      <p className="relative -mt-0.5 text-[11px] text-muted-foreground">
        {positionNames[player.position] ?? player.position}
      </p>

      <dl className="relative mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
        {statLabels.map(([key, label]) => (
          <div key={key}>
            <div className="flex items-baseline justify-between text-[11px] font-semibold tracking-widest text-muted-foreground">
              <dt>{label}</dt>
              <dd className="tabular-nums text-foreground">{player.stats[key]}</dd>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${player.stats[key]}%` }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-primary group-hover:bg-accent"
              />
            </div>
          </div>
        ))}
      </dl>
    </motion.article>
  );
}
