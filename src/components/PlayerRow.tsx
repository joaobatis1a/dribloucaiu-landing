import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { Player } from "@/data/team";
import { positionNames, ratingTier, ratingTierStyles } from "@/lib/match";

const EASE = [0.16, 1, 0.3, 1] as const;

const statLabels: Array<[keyof Player["stats"], string]> = [
  ["pac", "RIT"],
  ["sho", "FIN"],
  ["pas", "PAS"],
  ["dri", "DRI"],
  ["def", "DEF"],
  ["phy", "FÍS"],
];

export function PlayerRow({ player, index }: { player: Player; index: number }) {
  const [open, setOpen] = useState(false);
  const tier = ratingTier(player.overall);
  const style = ratingTierStyles[tier];
  const radarData = statLabels.map(([key, label]) => ({ stat: label, value: player.stats[key] }));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: EASE }}
      className="group relative border-b border-border last:border-0"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex w-full items-center gap-4 py-4 text-left sm:gap-6 sm:py-5"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -top-2 left-16 select-none font-display text-6xl leading-none text-white/[0.04] sm:left-20 sm:text-7xl"
        >
          {String(player.number).padStart(2, "0")}
        </span>

        <div className={`relative flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border bg-gradient-to-b sm:h-14 sm:w-14 ${style.card}`}>
          <span className={`font-display text-lg leading-none sm:text-xl ${style.rating}`}>{player.overall}</span>
          <span className="mt-0.5 text-[7px] font-semibold uppercase tracking-widest text-muted-foreground/80">
            {style.label}
          </span>
        </div>

        <div className="relative min-w-0 flex-1">
          <p className="flex items-center gap-2 truncate font-display text-xl uppercase tracking-wide text-foreground sm:text-2xl">
            {player.name}
            {player.captain ? (
              <span className="rounded-sm border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-accent">
                C
              </span>
            ) : null}
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            #{player.number} · {positionNames[player.position] ?? player.position}
          </p>
        </div>

        <div className="hidden items-end gap-1 sm:flex" aria-hidden>
          {statLabels.map(([key]) => (
            <span
              key={key}
              className="w-1.5 rounded-full bg-primary/70 transition-colors group-hover:bg-accent"
              style={{ height: `${6 + player.stats[key] * 0.28}px` }}
            />
          ))}
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180 text-accent" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 pb-6 sm:grid-cols-[1fr_14rem]">
              <dl className="grid grid-cols-3 gap-x-4 gap-y-3 content-start sm:grid-cols-6">
                {statLabels.map(([key, label]) => (
                  <div key={key}>
                    <div className="flex items-baseline justify-between text-[10px] font-semibold tracking-widest text-muted-foreground">
                      <dt>{label}</dt>
                      <dd className="tabular-nums text-foreground">{player.stats[key]}</dd>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${player.stats[key]}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full bg-primary group-hover:bg-accent"
                      />
                    </div>
                  </div>
                ))}
              </dl>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="72%">
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="stat" tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} />
                    <Radar dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.35} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
