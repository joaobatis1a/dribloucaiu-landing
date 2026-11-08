import { useRef } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, type PanInfo } from "framer-motion";
import crest from "@/assets/crest.webp";
import type { Lineup, Player } from "@/lib/site-schema";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function Slot({
  index,
  x,
  y,
  number,
  name,
  shown,
  selected,
  editable,
  pitchRef,
  onSelect,
  onMove,
}: {
  index: number;
  x: number;
  y: number;
  number: number;
  name: string | undefined;
  shown: boolean;
  selected: boolean;
  editable: boolean;
  pitchRef: React.RefObject<HTMLDivElement | null>;
  onSelect?: ((index: number) => void) | undefined;
  onMove?: ((index: number, x: number, y: number) => void) | undefined;
}) {
  const reduce = useReducedMotion();
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);
  const dragged = useRef(false);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const rect = pitchRef.current?.getBoundingClientRect();
    if (rect && onMove) {
      const nx = clamp(((info.point.x - rect.left) / rect.width) * 100, 4, 96);
      const ny = clamp(((info.point.y - rect.top) / rect.height) * 100, 4, 96);
      onMove(index, Math.round(nx * 10) / 10, Math.round(ny * 10) / 10);
    }
    dx.set(0);
    dy.set(0);
    setTimeout(() => (dragged.current = false), 0);
  }

  return (
    <motion.div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      initial={false}
      animate={
        shown || reduce
          ? { left: `${x}%`, top: `${y}%`, scale: 1, opacity: 1 }
          : { left: "50%", top: "50%", scale: 0.3, opacity: 0 }
      }
      transition={{ type: "spring", stiffness: 140, damping: 17, delay: shown ? index * 0.045 : 0 }}
    >
      <motion.button
        type="button"
        drag={editable}
        dragMomentum={false}
        dragElastic={0}
        style={{ x: dx, y: dy }}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={handleDragEnd}
        onClick={() => !dragged.current && onSelect?.(index)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Camisa ${number}${name ? `, ${name}` : ""}`}
        aria-pressed={selected}
        className={`relative flex flex-col items-center ${editable ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-pointer"}`}
      >
        <span
          className={`grid h-10 w-10 place-items-center rounded-full border-[3px] font-display text-lg font-black shadow-[0_3px_0_rgba(0,0,0,0.35)] transition-colors sm:h-12 sm:w-12 sm:text-xl ${
            selected
              ? "border-[var(--piche)] bg-[var(--cartao)] text-[var(--piche)]"
              : "border-white bg-[var(--tinta)] text-white"
          }`}
        >
          {number}
        </span>
        {name ? (
          <span className="pointer-events-none mt-1 max-w-[6.5rem] truncate bg-[var(--piche)] px-1.5 py-0.5 font-display text-xs font-black uppercase leading-none text-white sm:text-sm">
            {name}
          </span>
        ) : null}
      </motion.button>
    </motion.div>
  );
}

/** Campo com os 11 slots da escalação. No painel (`editable`) os slots podem ser arrastados. */
export function Pitch({
  lineup,
  players,
  selected = null,
  editable = false,
  onSelect,
  onMove,
}: {
  lineup: Lineup;
  players: Player[];
  selected?: number | null;
  editable?: boolean;
  onSelect?: (index: number) => void;
  onMove?: (index: number, x: number, y: number) => void;
}) {
  const pitchRef = useRef<HTMLDivElement>(null);
  const inView = useInView(pitchRef, { once: true, amount: 0.35 });
  const shown = editable || inView;

  return (
    <div
      ref={pitchRef}
      className="pitch-stripes relative aspect-[4/5] w-full select-none overflow-hidden shadow-[6px_6px_0_var(--piche)] sm:aspect-[3/4]"
    >
      <div
        className="pointer-events-none absolute inset-3 border-2 border-[var(--pitch-line)]"
        aria-hidden
      >
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-[var(--pitch-line)]" />
        <div className="absolute left-1/2 top-1/2 h-[24%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--pitch-line)]">
          <img src={crest} alt="" className="h-full w-full scale-90 object-contain opacity-20" />
        </div>
        <div className="absolute inset-x-[22%] top-0 h-[14%] border-2 border-t-0 border-[var(--pitch-line)]" />
        <div className="absolute inset-x-[36%] top-0 h-[5.5%] border-2 border-t-0 border-[var(--pitch-line)]" />
        <div className="absolute inset-x-[22%] bottom-0 h-[14%] border-2 border-b-0 border-[var(--pitch-line)]" />
        <div className="absolute inset-x-[36%] bottom-0 h-[5.5%] border-2 border-b-0 border-[var(--pitch-line)]" />
      </div>

      {lineup.slots.map((slot, i) => (
        <Slot
          key={i}
          index={i}
          x={slot.x}
          y={slot.y}
          number={slot.number}
          name={slot.playerId ? players.find((p) => p.id === slot.playerId)?.name : undefined}
          shown={shown}
          selected={selected === i}
          editable={editable}
          pitchRef={pitchRef}
          onSelect={onSelect}
          onMove={onMove}
        />
      ))}
    </div>
  );
}
