import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { RotateCw } from "lucide-react";
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
  const [sweepKey, setSweepKey] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, { stiffness: 220, damping: 22 });
  const spy = useSpring(py, { stiffness: 220, damping: 22 });
  const tiltX = useTransform(spy, [0, 1], [8, -8]);
  const tiltYDelta = useTransform(spx, [0, 1], [-8, 8]);
  const glowX = useTransform(spx, (v) => `${v * 100}%`);
  const glowY = useTransform(spy, (v) => `${v * 100}%`);
  const holoBg = useTransform([spx, spy], ([x, y]: number[]) => {
    const angle = 90 + ((x ?? 0.5) - 0.5) * 140;
    const h1 = 200 + ((y ?? 0.5) - 0.5) * 120;
    const h2 = h1 + 80;
    return `linear-gradient(${angle}deg, transparent 15%, hsl(${h1} 90% 65%) 40%, hsl(${h2} 90% 65%) 55%, transparent 80%)`;
  });

  const flipTarget = useMotionValue(0);
  const flipSpring = useSpring(flipTarget, { stiffness: 260, damping: 28 });
  const rotateY = useTransform([flipSpring, tiltYDelta], ([f, t]: number[]) => (f ?? 0) + (t ?? 0));

  const tier = ratingTier(player.overall);
  const style = ratingTierStyles[tier];
  const radarData = statLabels.map(([key, label]) => ({ stat: label, value: player.stats[key] }));

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
      className="group relative h-[21rem]"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX: tiltX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full will-change-transform"
      >
        {/* FRONT */}
        <article
          style={{ backfaceVisibility: "hidden" }}
          className={`absolute inset-0 overflow-hidden rounded-xl border border-border bg-gradient-to-b p-5 ${style.card}`}
        >
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              boxShadow: style.glow,
              background: `radial-gradient(280px circle at ${glowX} ${glowY}, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)`,
            }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-[0.18]"
            style={{ background: holoBg }}
          />
          <span
            key={sweepKey}
            aria-hidden
            className="shimmer-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-6 -right-4 select-none font-display text-8xl leading-none text-white/[0.06]"
          >
            {player.number}
          </span>

          {player.captain ? (
            <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-accent/50 bg-accent/15 text-[10px] font-bold text-accent">
              C
            </span>
          ) : null}

          <button
            type="button"
            onClick={toggleFlip}
            aria-label="Ver estatísticas em radar"
            className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>

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
        </article>

        {/* BACK */}
        <article
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-border bg-gradient-to-b p-5 ${style.card}`}
        >
          <button
            type="button"
            onClick={toggleFlip}
            aria-label="Ver carta do jogador"
            className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground transition-opacity hover:text-accent"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl uppercase leading-none tracking-wide text-foreground">
                {player.name}
              </h3>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                #{player.number} · {positionNames[player.position] ?? player.position}
              </p>
            </div>
            <div className={`font-display text-2xl ${style.rating}`}>{player.overall}</div>
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
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
              Capitão de equipe
            </p>
          ) : null}
        </article>
      </motion.div>
    </div>
  );
}
