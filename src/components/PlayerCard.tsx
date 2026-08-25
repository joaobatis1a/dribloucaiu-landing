import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { RotateCw } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
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
  const [flipped, setFlipped] = useState(false);
  const [sweepKey, setSweepKey] = useState(0);
  const tier = ratingTier(player.overall);
  const style = ratingTierStyles[tier];
  const isIcon = tier === "icon";
  const radarData = statLabels.map(([key, label]) => ({ stat: label, value: player.stats[key] }));

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, { stiffness: 220, damping: 22 });
  const spy = useSpring(py, { stiffness: 220, damping: 22 });
  const tiltX = useTransform(spy, [0, 1], [6, -6]);
  const tiltYDelta = useTransform(spx, [0, 1], [-6, 6]);
  const glowX = useTransform(spx, (v) => `${v * 100}%`);
  const glowY = useTransform(spy, (v) => `${v * 100}%`);

  const flipTarget = useMotionValue(0);
  const flipSpring = useSpring(flipTarget, { stiffness: 260, damping: 28 });
  const rotateY = useTransform([flipSpring, tiltYDelta], ([f, t]: number[]) => (f ?? 0) + (t ?? 0));

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

  function toggleFlip() {
    const next = !flipped;
    setFlipped(next);
    flipTarget.set(next ? 180 : 0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerEnter={() => setSweepKey((k) => k + 1)}
      className="relative h-[19.5rem]"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX: tiltX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full w-full will-change-transform"
      >
        {/* FRONT */}
        <article
          style={{ backfaceVisibility: "hidden" }}
          className={`absolute inset-0 overflow-hidden rounded-2xl border bg-gradient-to-b p-3.5 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.9)] ${style.card}`}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ boxShadow: style.glow }}
          />
          {isIcon ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              animate={{ boxShadow: [style.glow, `${style.glow}, 0 0 30px 4px color-mix(in oklab, var(--accent) 45%, transparent)`, style.glow] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(200px circle at ${glowX} ${glowY}, color-mix(in oklab, white 16%, transparent), transparent 70%)`,
            }}
          />
          <span
            key={sweepKey}
            aria-hidden
            className="shimmer-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent"
          />

          <button
            type="button"
            onClick={toggleFlip}
            aria-label="Ver estatísticas em radar"
            className="absolute bottom-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
          >
            <RotateCw className="h-3 w-3" />
          </button>

          <header className="relative flex items-start justify-between">
            <div className="leading-none">
              <div className={`font-display text-3xl ${style.rating}`}>{player.overall}</div>
              <div className="mt-1 text-[11px] font-semibold tracking-[0.15em] text-muted-foreground">
                {player.position}
              </div>
              <div className="mt-0.5 text-[8px] font-medium uppercase tracking-widest text-muted-foreground/70">
                {style.label}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/50 font-display text-xs text-foreground">
                {player.number}
              </span>
              {player.captain ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-accent/50 bg-accent/15 text-[8px] font-bold text-accent">
                  C
                </span>
              ) : null}
            </div>
          </header>

          <div className="relative mx-auto -mt-1 h-[6.5rem] w-full overflow-hidden rounded-xl bg-secondary/60">
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
              style={{ background: "linear-gradient(180deg, transparent 50%, var(--card) 100%)" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{ background: "linear-gradient(115deg, transparent 35%, color-mix(in oklab, white 40%, transparent) 48%, transparent 62%)" }}
            />
          </div>

          <h3 className="relative mt-2 text-center font-display text-xl uppercase leading-none tracking-wide text-foreground">
            {player.name}
          </h3>
          <p className="relative mt-1 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            {positionNames[player.position] ?? player.position}
          </p>

          <dl className="relative mt-2.5 grid grid-cols-3 gap-x-2 gap-y-1.5 border-t border-border/60 pt-2">
            {statLabels.map(([key, label]) => (
              <div key={key} className="text-center">
                <dd className="font-display text-sm tabular-nums text-foreground">{player.stats[key]}</dd>
                <dt className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </article>

        {/* BACK */}
        <article
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-b p-3.5 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.9)] ${style.card}`}
        >
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
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="68%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} />
                <Radar dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.4} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {player.captain ? (
            <p className="text-center text-[9px] font-bold uppercase tracking-[0.25em] text-accent">
              Capitão de equipe
            </p>
          ) : null}
        </article>
      </motion.div>
    </div>
  );
}
