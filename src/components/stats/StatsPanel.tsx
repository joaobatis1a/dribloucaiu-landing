import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Shield, Swords, TrendingUp, Trophy, Users, type LucideIcon } from "lucide-react";
import { ClubOverview } from "@/components/stats/ClubOverview";
import { PlayersTable } from "@/components/stats/PlayersTable";
import { Leaders } from "@/components/stats/Leaders";
import { Evolution } from "@/components/stats/Evolution";
import { Opponents } from "@/components/stats/Opponents";
import { EASE_OUT } from "@/components/motion/Reveal";

const SECTIONS: Array<{
  id: string;
  label: string;
  Icon: LucideIcon;
  View: () => React.JSX.Element;
}> = [
  { id: "clube", label: "Clube", Icon: Shield, View: ClubOverview },
  { id: "jogadores", label: "Jogadores", Icon: Users, View: PlayersTable },
  { id: "lideres", label: "Líderes", Icon: Trophy, View: Leaders },
  { id: "evolucao", label: "Evolução", Icon: TrendingUp, View: Evolution },
  { id: "confrontos", label: "Confrontos", Icon: Swords, View: Opponents },
];

/** Estatísticas divididas em subtópicos. */
export function StatsPanel() {
  const [active, setActive] = useState(SECTIONS[0]!.id);
  const reduce = useReducedMotion();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = SECTIONS.find((s) => s.id === active)!;

  // Setas do teclado trocam de subtópico, como numa lista de abas.
  function onKeyDown(e: KeyboardEvent, index: number) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (index + dir + SECTIONS.length) % SECTIONS.length;
    setActive(SECTIONS[next]!.id);
    refs.current[next]?.focus();
  }

  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        <div
          role="tablist"
          aria-label="Estatísticas"
          className="flex w-max min-w-full gap-2 border-b-2 border-foreground pb-3"
        >
          {SECTIONS.map(({ id, label, Icon }, i) => {
            const on = id === active;
            return (
              <button
                key={id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`stats-tab-${id}`}
                aria-selected={on}
                aria-controls={`stats-panel-${id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 font-display text-lg font-black uppercase leading-none transition-colors ${
                  on ? "text-[var(--piche)]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {on ? (
                  <motion.span
                    layoutId="stats-pill"
                    className="absolute inset-0 bg-[var(--cartao)]"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                ) : null}
                <Icon className="relative h-4 w-4" aria-hidden />
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          role="tabpanel"
          id={`stats-panel-${active}`}
          aria-labelledby={`stats-tab-${active}`}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="pt-6"
        >
          <current.View />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
