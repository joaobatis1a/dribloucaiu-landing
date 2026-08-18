import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { club, squad } from "@/data/team";
import { formationLayout } from "@/lib/formation";
import { positionNames, ratingTier, ratingTierStyles } from "@/lib/match";
import { SectionTitle } from "@/components/SectionTitle";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const dot = {
  hidden: { opacity: 0, scale: 0.3 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const statLabels: Array<[keyof (typeof squad)[number]["stats"], string]> = [
  ["pac", "RIT"],
  ["sho", "FIN"],
  ["pas", "PAS"],
  ["dri", "DRI"],
  ["def", "DEF"],
  ["phy", "FÍS"],
];

const lines: Array<{ label: string; codes: string[] }> = [
  { label: "Ataque", codes: ["PE", "ATA", "PD"] },
  { label: "Meio-campo", codes: ["MC", "VOL", "MEI"] },
  { label: "Defesa", codes: ["LE", "ZAG", "LD"] },
  { label: "Gol", codes: ["GOL"] },
];

type LaidOutPlayer = ReturnType<typeof formationLayout>[number];

function PlayerPopover({ player }: { player: LaidOutPlayer }) {
  const tier = ratingTier(player.overall);
  const style = ratingTierStyles[tier];
  const anchorX = player.x > 62 ? "right" : player.x < 38 ? "left" : "center";
  const anchorY = player.y < 50 ? "below" : "above";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: anchorY === "below" ? -8 : 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{
        left: `${player.x}%`,
        top: `${player.y}%`,
      }}
      className={`pointer-events-none absolute z-20 w-48 rounded-lg border border-border bg-gradient-to-b p-3.5 shadow-2xl backdrop-blur-sm ${style.card} ${
        anchorX === "right" ? "-translate-x-[calc(100%+14px)]" : anchorX === "left" ? "translate-x-[14px]" : "-translate-x-1/2"
      } ${anchorY === "below" ? "translate-y-[14px]" : "-translate-y-[calc(100%+14px)]"}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className={`font-display text-3xl leading-none ${style.rating}`}>{player.overall}</div>
          <div className="mt-0.5 text-[9px] font-medium uppercase tracking-widest text-muted-foreground/70">
            {style.label}
          </div>
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-background/40 font-display text-xs text-foreground">
          {player.number}
        </span>
      </div>
      <p className="mt-2 font-display text-lg uppercase leading-none tracking-wide text-foreground">
        {player.name}
      </p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">
        {positionNames[player.position] ?? player.position}
        {player.captain ? <span className="ml-1.5 font-bold text-accent">· CAPITÃO</span> : null}
      </p>
      <dl className="mt-2.5 grid grid-cols-3 gap-x-2 gap-y-1 border-t border-border/60 pt-2">
        {statLabels.map(([key, label]) => (
          <div key={key} className="text-center">
            <dt className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
              {label}
            </dt>
            <dd className="font-display text-sm tabular-nums text-foreground">{player.stats[key]}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}

export function Formation() {
  const players = formationLayout(squad);
  const [activeName, setActiveName] = useState<string | null>(null);
  const active = players.find((p) => p.name === activeName) ?? null;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, { stiffness: 120, damping: 20 });
  const spy = useSpring(py, { stiffness: 120, damping: 20 });
  const tiltX = useTransform(spy, [0, 1], [20, 8]);
  const tiltY = useTransform(spx, [0, 1], [-8, 8]);

  function handleTilt(e: React.PointerEvent<HTMLDivElement>) {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleTiltReset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <section id="esquema" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionTitle kicker="Como jogamos" title={`Esquema ${club.formation}`} />
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{club.about}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div
            ref={wrapperRef}
            onPointerMove={handleTilt}
            onPointerLeave={() => {
              handleTiltReset();
              setActiveName(null);
            }}
            className="[perspective:1600px]"
          >
            <div className="relative aspect-[4/5] w-full sm:aspect-[3/4]">
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
                className="absolute inset-0 origin-top"
              >
                <div
                  className="pitch-stripes absolute inset-0 overflow-hidden rounded-2xl border border-border shadow-[0_50px_90px_-30px_rgba(0,0,0,0.85)]"
                  aria-hidden
                >
                  <div
                    className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"
                    aria-hidden
                  />
                  <div
                    className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"
                    aria-hidden
                  />
                  <div
                    className="animate-float-y absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl opacity-80"
                    style={{ animationDuration: "8s" }}
                  >
                    ⚽
                  </div>

                  <div className="absolute inset-3 rounded-lg" style={{ border: "1px solid var(--pitch-line)" }}>
                    <div
                      className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ border: "1px solid var(--pitch-line)" }}
                    />
                    <div
                      className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
                      style={{ background: "var(--pitch-line)" }}
                    />
                    <div className="absolute inset-x-[22%] bottom-0 h-[14%]" style={{ border: "1px solid var(--pitch-line)" }} />
                    <div className="absolute inset-x-[22%] top-0 h-[14%]" style={{ border: "1px solid var(--pitch-line)" }} />
                  </div>
                </div>

                {players.map((p) => {
                  const isActive = activeName === p.name;
                  return (
                    <motion.button
                      key={p.name}
                      type="button"
                      variants={dot}
                      onMouseEnter={() => setActiveName(p.name)}
                      onFocus={() => setActiveName(p.name)}
                      onClick={() => setActiveName(p.name)}
                      style={{ left: `${p.x}%`, top: `${p.y}%`, x: "-50%", y: "-50%", translateZ: 30 }}
                      className="absolute z-10 outline-none"
                    >
                      <span
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full border font-display text-xs shadow-lg transition-colors sm:h-11 sm:w-11 sm:text-sm ${
                          isActive
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-white/30 bg-primary text-primary-foreground"
                        }`}
                      >
                        {p.number}
                        {p.captain ? (
                          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-background bg-accent text-[8px] font-bold text-accent-foreground">
                            C
                          </span>
                        ) : null}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>

              <AnimatePresence>{active ? <PlayerPopover player={active} /> : null}</AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {lines.map((line) => {
              const linePlayers = squad.filter((p) => line.codes.includes(p.position));
              if (linePlayers.length === 0) return null;
              return (
                <div key={line.label}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                    {line.label}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {linePlayers.map((p) => (
                      <li key={p.name}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveName(p.name)}
                          onFocus={() => setActiveName(p.name)}
                          onMouseLeave={() => setActiveName(null)}
                          onBlur={() => setActiveName(null)}
                          className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-secondary/60"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-[11px] text-foreground">
                            {p.number}
                          </span>
                          <span className="truncate text-sm text-foreground">{p.name}</span>
                          {p.captain ? (
                            <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-accent">
                              C
                            </span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div className="mt-2 rounded-lg border border-dashed border-border p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Fundado em {club.founded}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{club.platform}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
