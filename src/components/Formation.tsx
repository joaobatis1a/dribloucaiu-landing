import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, type PanInfo } from "framer-motion";
import { GripHorizontal, Instagram, Plus, RotateCcw, UserPlus } from "lucide-react";
import { club } from "@/data/team";
import type { Player } from "@/lib/site-schema";
import { useSite } from "@/components/site-context";
import {
  formationIds,
  formations,
  roleOrder,
  slotsToPositions,
  slotRoles,
  type FormationId,
  type LineRole,
} from "@/lib/formations";
import { positionNames, ratingTier, ratingTierStyles } from "@/lib/match";
import { SectionTitle } from "@/components/SectionTitle";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import crest from "@/assets/crest.webp";

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
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      className={`pointer-events-none absolute z-20 w-56 overflow-hidden border-2 border-[var(--piche)] bg-[var(--papel)] p-4 shadow-[4px_4px_0_var(--piche)] ${
        anchorX === "right"
          ? "-translate-x-[calc(100%+14px)]"
          : anchorX === "left"
            ? "translate-x-[14px]"
            : "-translate-x-1/2"
      } ${anchorY === "below" ? "translate-y-[14px]" : "-translate-y-[calc(100%+14px)]"}`}
    >
      <div className="relative flex items-center gap-3">
        <div className="relative shrink-0">
          <PlayerAvatar
            photo={player.photo}
            ring="var(--piche)"
            size="md"
            scale={player.photoScale ?? 1}
          />
          <span className="absolute -bottom-1 -right-1 bg-[var(--cartao)] px-1 font-display text-xs font-black leading-tight text-[var(--piche)]">
            {player.overall}
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-xl font-black uppercase leading-none">
            {player.name}
          </p>
          <p className="mt-1 font-mono text-xs uppercase text-muted-foreground">
            #{player.number} · {positionNames[player.position] ?? player.position}
          </p>
        </div>
      </div>
      {player.captain ? (
        <p className="relative mt-2 font-mono text-xs font-bold uppercase text-primary">Capitão</p>
      ) : null}
      <dl className="relative mt-3 grid grid-cols-3 gap-x-2 gap-y-1.5 border-t-2 border-[var(--piche)] pt-2.5">
        {statLabels.map(([key, label]) => (
          <div key={key} className="text-center">
            <dt className="font-mono text-[10px] uppercase text-muted-foreground">{label}</dt>
            <dd className="font-display text-lg font-black tabular-nums leading-none">
              {player.stats[key]}
            </dd>
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
  onToggle,
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
  onToggle: () => void;
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
        onClick={onToggle}
        className="block cursor-grab touch-none outline-none active:cursor-grabbing"
      >
        <span
          className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 font-display text-sm font-black shadow-[0_2px_0_rgba(0,0,0,0.4)] transition-colors sm:h-11 sm:w-11 sm:text-base ${
            isActive
              ? "border-[var(--piche)] bg-[var(--cartao)] text-[var(--piche)]"
              : "border-white bg-[var(--tinta)] text-white"
          }`}
        >
          {player.number}
          {player.captain ? (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--piche)] text-[9px] font-bold text-white">
              C
            </span>
          ) : null}
        </span>
      </motion.button>
    </div>
  );
}

function EmptySlotDot({ pos, index }: { pos: Position; index: number }) {
  return (
    <div
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
      className="absolute z-10"
    >
      <motion.a
        href={club.social.instagram.url}
        target="_blank"
        rel="noreferrer noopener"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1 + index * 0.05, ease: EASE }}
        whileHover={{ scale: 1.18 }}
        className="group/empty relative block outline-none"
        aria-label="Vaga aberta nessa posição — chamar no Instagram"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-white/80 text-white transition-colors group-hover/empty:bg-white/15 sm:h-11 sm:w-11">
          <Plus className="h-4 w-4" />
        </span>
        <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap bg-[var(--piche)] px-2 py-1 font-mono text-[10px] uppercase text-white opacity-0 transition-opacity group-hover/empty:opacity-100">
          Vaga aberta
        </span>
      </motion.a>
    </div>
  );
}

export function Formation() {
  const { players: squad } = useSite();
  const [formationId, setFormationId] = useState<FormationId>("3-4-1-2");
  const [positions, setPositions] = useState<Record<string, Position>>(() =>
    slotsToPositions(formations["3-4-1-2"].slots),
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

  function toggle(name: string) {
    if (draggingName) return;
    setActiveName((prev) => (prev === name ? null : name));
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

  const active = activeName ? (squad.find((p) => p.name === activeName) ?? null) : null;
  const activePos = activeName ? positions[activeName] : undefined;

  return (
    <section id="esquema" className="wall">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 md:py-28">
        <SectionTitle kicker="Como jogamos" title={formations[formationId].label} />
        <p className="mt-4 max-w-2xl text-lg leading-snug">{formations[formationId].blurb}</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {formationIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => selectFormation(id)}
              className={`border-2 border-foreground px-3 py-1 font-display text-lg font-black leading-none transition-colors ${
                formationId === id ? "bg-foreground text-background" : "hover:bg-foreground/10"
              }`}
            >
              {formations[id].label}
            </button>
          ))}
          <button
            type="button"
            onClick={resetLayout}
            className="ml-auto inline-flex items-center gap-1.5 px-2 py-1.5 font-mono text-xs uppercase underline underline-offset-4 hover:text-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Resetar posições
          </button>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <div
              ref={pitchRef}
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest("button, a")) deactivate();
              }}
              className="pitch-stripes relative aspect-[4/5] w-full touch-pan-y overflow-hidden shadow-[6px_6px_0_var(--piche)] sm:aspect-[3/4]"
            >
              <div className="absolute inset-3" style={{ border: "2px solid var(--pitch-line)" }}>
                <div
                  className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ border: "2px solid var(--pitch-line)" }}
                >
                  <img
                    src={crest}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full scale-90 object-contain opacity-25"
                  />
                </div>
                <div
                  className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2"
                  style={{ background: "var(--pitch-line)" }}
                />
                <div
                  className="absolute inset-x-[22%] bottom-0 h-[14%]"
                  style={{ border: "2px solid var(--pitch-line)" }}
                />
                <div
                  className="absolute inset-x-[22%] top-0 h-[14%]"
                  style={{ border: "2px solid var(--pitch-line)" }}
                />
              </div>

              <div key={formationId} className="contents">
                {formations[formationId].slots.map((slot, i) => {
                  if (!slot.name) {
                    return (
                      <EmptySlotDot key={`empty-${i}`} pos={{ x: slot.x, y: slot.y }} index={i} />
                    );
                  }
                  const player = squad.find((sp) => sp.name === slot.name);
                  if (!player) return null;
                  const pos = positions[slot.name] ?? { x: slot.x, y: slot.y };
                  const isActive = activeName === player.name;
                  const isDragging = draggingName === player.name;
                  return (
                    <PlayerDot
                      key={player.name}
                      player={player}
                      pos={pos}
                      index={i}
                      isActive={isActive}
                      isDragging={isDragging}
                      pitchRef={pitchRef}
                      onDragStart={() => setDraggingName(player.name)}
                      onDragEnd={(info, resetXY) => handleDragEnd(player.name, info, resetXY)}
                      onActivate={() => activate(player.name)}
                      onDeactivate={deactivate}
                      onToggle={() => toggle(player.name)}
                    />
                  );
                })}
              </div>

              <AnimatePresence>
                {active && activePos && !draggingName ? (
                  <PlayerPopover player={active} pos={activePos} />
                ) : null}
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
              const emptySlot = formations[formationId].slots.find(
                (s): s is { name: null; role: LineRole; x: number; y: number } =>
                  !s.name && s.role === role,
              );
              if (linePlayers.length === 0 && !emptySlot) return null;
              return (
                <div key={label}>
                  <p className="border-b-2 border-foreground pb-1 font-display text-xl font-black uppercase">
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
                          onClick={() => toggle(p.name)}
                          className="flex w-full items-center gap-3 px-1 py-1.5 text-left transition-colors hover:bg-foreground/10"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-foreground font-display text-sm font-black text-background">
                            {p.number}
                          </span>
                          <span className="truncate font-display text-lg font-bold uppercase leading-none">
                            {p.name}
                          </span>
                          {p.captain ? (
                            <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-accent">
                              C
                            </span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                    {emptySlot ? (
                      <li>
                        <a
                          href={club.social.instagram.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex w-full items-center gap-3 rounded-md border border-dashed border-border px-2 py-1.5 text-left text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-current">
                            <Plus className="h-3 w-3" />
                          </span>
                          <span className="truncate text-sm">Vaga aberta</span>
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
              );
            })}

            <div className="mt-2 border-2 border-dashed border-foreground p-4">
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
