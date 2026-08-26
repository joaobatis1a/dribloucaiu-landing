import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, type PanInfo } from "framer-motion";
import { GripHorizontal, Instagram, RotateCcw, UserPlus } from "lucide-react";
import { club, squad, type Player } from "@/data/team";
import {
  formationIds,
  formations,
  roleOrder,
  slotsToPositions,
  slotRoles,
  type FormationId,
} from "@/lib/formations";
import { positionNames, ratingTier, ratingTierStyles } from "@/lib/match";
import { SectionTitle } from "@/components/SectionTitle";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import crest from "@/assets/crest.png";

const EASE = [0.16, 1, 0.3, 1] as const;

const statLabels: Array<[keyof Player["stats"], string]> = [
  ["pac", "RIT"],
  ["sho", "FIN"],
  ["pas", "PAS"],
  ["dri", "DRI"],
  ["def", "DEF"],
  ["phy", "FÍS"],
];

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

type Position = { x: number; y: number };

function PlayerPopover({ player, pos }: { player: Player; pos: Position }) {
  const tier = ratingTier(player.overall);
  const style = ratingTierStyles[tier];
  const anchorX = pos.x > 62 ? "right" : pos.x < 38 ? "left" : "center";
  const anchorY = pos.y < 50 ? "below" : "above";
  const rotateFrom = anchorX === "right" ? 6 : anchorX === "left" ? -6 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, rotate: rotateFrom, y: anchorY === "below" ? -10 : 10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, boxShadow: `${style.glow}, 0 20px 45px -20px rgba(0,0,0,0.8)` }}
      className={`pointer-events-none absolute z-20 w-56 overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-4 backdrop-blur-md ${
        anchorX === "right" ? "-translate-x-[calc(100%+14px)]" : anchorX === "left" ? "translate-x-[14px]" : "-translate-x-1/2"
      } ${anchorY === "below" ? "translate-y-[14px]" : "-translate-y-[calc(100%+14px)]"}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{ background: style.ring }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-25 blur-2xl"
        style={{ background: style.ring }}
      />
      <div className="relative flex items-center gap-3">
        <div className="relative shrink-0">
          <PlayerAvatar photo={player.photo} ring={style.ring} size="sm" />
          <span
            className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border-2 border-card bg-gradient-to-b font-display text-[9px] leading-none ${style.card} ${style.rating}`}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: "linear-gradient(115deg, transparent 30%, color-mix(in oklab, white 55%, transparent) 48%, transparent 62%)" }}
            />
            <span className="relative">{player.overall}</span>
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg uppercase leading-none tracking-wide text-foreground">
            {player.name}
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">
            {style.label} · {positionNames[player.position] ?? player.position}
          </p>
        </div>
      </div>
      {player.captain ? (
        <p className="relative mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
          · Capitão ·
        </p>
      ) : null}
      <dl className="relative mt-3 grid grid-cols-3 gap-x-2 gap-y-1.5 border-t border-border/60 pt-2.5">
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

function PlayerDot({
  player,
  pos,
  index,
  isActive,
  isDragging,
  pitchRef,
  onDragStart,
  onDragEnd,
  onActivate,
  onDeactivate,
}: {
  player: Player;
  pos: Position;
  index: number;
  isActive: boolean;
  isDragging: boolean;
  pitchRef: React.RefObject<HTMLDivElement | null>;
  onDragStart: () => void;
  onDragEnd: (info: PanInfo, resetXY: () => void) => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function resetXY() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
      className={`absolute z-10 ${isDragging ? "z-30" : ""}`}
    >
      <motion.button
        type="button"
        style={{ x, y }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1 + index * 0.05, ease: EASE }}
        drag
        dragConstraints={pitchRef}
        dragElastic={0.08}
        dragMomentum={false}
        whileHover={{ scale: 1.18 }}
        whileDrag={{ scale: 1.15, zIndex: 30 }}
        onDragStart={onDragStart}
        onDragEnd={(_e, info) => onDragEnd(info, resetXY)}
        onMouseEnter={() => !isDragging && onActivate()}
        onMouseLeave={onDeactivate}
        onFocus={onActivate}
        onBlur={onDeactivate}
        onClick={onActivate}
        className="block cursor-grab touch-none outline-none active:cursor-grabbing"
      >
        <span
          className={`relative flex h-9 w-9 items-center justify-center rounded-full border font-display text-xs shadow-lg transition-colors sm:h-11 sm:w-11 sm:text-sm ${
            isActive
              ? "border-accent bg-accent text-accent-foreground"
              : "border-white/30 bg-primary text-primary-foreground"
          }`}
        >
          {isActive ? (
            <span className="animate-pulse-dot absolute inset-0 rounded-full" aria-hidden />
          ) : null}
          {player.number}
          {player.captain ? (
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-background bg-accent text-[8px] font-bold text-accent-foreground">
              C
            </span>
          ) : null}
        </span>
      </motion.button>
    </div>
  );
}

export function Formation() {
  const [formationId, setFormationId] = useState<FormationId>("4-3-3");
  const [positions, setPositions] = useState<Record<string, Position>>(() =>
    slotsToPositions(formations["4-3-3"].slots),
  );
  const roles = slotRoles(formations[formationId].slots);
  const [activeName, setActiveName] = useState<string | null>(null);
  const [draggingName, setDraggingName] = useState<string | null>(null);

  const pitchRef = useRef<HTMLDivElement>(null);

  function selectFormation(id: FormationId) {
    setFormationId(id);
    setPositions(slotsToPositions(formations[id].slots));
    setActiveName(null);
  }

  function resetLayout() {
    setPositions(slotsToPositions(formations[formationId].slots));
  }

  function activate(name: string) {
    if (!draggingName) setActiveName(name);
  }

  function deactivate() {
    setActiveName(null);
  }

  function handleDragEnd(name: string, info: PanInfo, resetXY: () => void) {
    const rect = pitchRef.current?.getBoundingClientRect();
    setDraggingName(null);
    if (rect) {
      const dxPct = (info.offset.x / rect.width) * 100;
      const dyPct = (info.offset.y / rect.height) * 100;
      setPositions((prev) => {
        const current = prev[name];
        if (!current) return prev;
        return {
          ...prev,
          [name]: { x: clamp(current.x + dxPct, 4, 96), y: clamp(current.y + dyPct, 4, 96) },
        };
      });
    }
    resetXY();
  }

  const active = activeName ? squad.find((p) => p.name === activeName) ?? null : null;
  const activePos = activeName ? positions[activeName] : undefined;

  return (
    <section id="esquema" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionTitle kicker="Como jogamos" title={`Esquema ${formations[formationId].label}`} />
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          {formations[formationId].blurb}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {formationIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => selectFormation(id)}
              className={`rounded-full border px-4 py-1.5 font-display text-sm uppercase tracking-wide transition-colors ${
                formationId === id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {formations[id].label}
            </button>
          ))}
          <button
            type="button"
            onClick={resetLayout}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Resetar posições
          </button>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <div
              ref={pitchRef}
              className="pitch-stripes relative aspect-[4/5] w-full touch-none overflow-hidden rounded-2xl border border-border shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)] sm:aspect-[3/4]"
            >
              <div
                className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-primary/25 blur-3xl"
                aria-hidden
              />
              <div
                className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
                aria-hidden
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
                style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--primary) 22%, transparent), transparent)" }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
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
                >
                  <img
                    src={crest}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full scale-90 object-contain opacity-[0.14]"
                  />
                </div>
                <div
                  className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
                  style={{ background: "var(--pitch-line)" }}
                />
                <div className="absolute inset-x-[22%] bottom-0 h-[14%]" style={{ border: "1px solid var(--pitch-line)" }} />
                <div className="absolute inset-x-[22%] top-0 h-[14%]" style={{ border: "1px solid var(--pitch-line)" }} />
              </div>

              <div key={formationId} className="contents">
                {squad.map((p, i) => {
                  const pos = positions[p.name];
                  if (!pos) return null;
                  const isActive = activeName === p.name;
                  const isDragging = draggingName === p.name;
                  return (
                    <PlayerDot
                      key={p.name}
                      player={p}
                      pos={pos}
                      index={i}
                      isActive={isActive}
                      isDragging={isDragging}
                      pitchRef={pitchRef}
                      onDragStart={() => setDraggingName(p.name)}
                      onDragEnd={(info, resetXY) => handleDragEnd(p.name, info, resetXY)}
                      onActivate={() => activate(p.name)}
                      onDeactivate={deactivate}
                    />
                  );
                })}
              </div>

              <AnimatePresence>
                {active && activePos && !draggingName ? <PlayerPopover player={active} pos={activePos} /> : null}
              </AnimatePresence>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <GripHorizontal className="h-3.5 w-3.5" />
              Arraste os jogadores pra reorganizar o time do seu jeito.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {roleOrder.map(({ role, label }) => {
              const linePlayers = squad.filter((p) => roles[p.name] === role);
              if (linePlayers.length === 0) return null;
              return (
                <div key={label}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                    {label}
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
              <UserPlus className="h-5 w-5 text-primary" aria-hidden />
              <p className="mt-2 font-display text-sm uppercase tracking-wide text-foreground">
                Quer fazer parte do time?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Manda sua posição pra análise no Instagram do Driblou Caiu.
              </p>
              <a
                href={club.social.instagram.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:text-foreground"
              >
                <Instagram className="h-3.5 w-3.5" />
                Chamar no Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
