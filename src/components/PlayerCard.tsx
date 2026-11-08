import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import crest from "@/assets/crest.webp";
import type { SitePlayer } from "@/components/site-context";
import type { Player } from "@/lib/site-schema";
import { positionNames } from "@/lib/match";

const statLabels: Array<[keyof Player["stats"], string]> = [
  ["pac", "Ritmo"],
  ["sho", "Finalização"],
  ["pas", "Passe"],
  ["dri", "Drible"],
  ["def", "Defesa"],
  ["phy", "Físico"],
];

/** Figurinha do álbum: foto, faixa com o nome e, no verso, a ficha do jogador. */
export function PlayerCard({ player, code }: { player: SitePlayer; code: string }) {
  const [back, setBack] = useState(false);
  const scale = player.photoScale ?? 1;

  return (
    <div className="group">
      <button
        type="button"
        onClick={() => setBack((v) => !v)}
        aria-pressed={back}
        aria-label={`${player.name}: ${back ? "ver figurinha" : "ver ficha"}`}
        className="block w-full text-left transition-transform duration-200 hover:-translate-y-1 group-odd:rotate-[-0.8deg] group-even:rotate-[0.7deg]"
      >
        <div className="relative aspect-[5/7] bg-[var(--papel)] p-2 shadow-[0_1px_0_rgba(0,0,0,0.15),0_14px_22px_-14px_rgba(0,0,0,0.55)]">
          <AnimatePresence mode="wait" initial={false}>
            {!back ? (
              <motion.div
                key="front"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                exit={{ rotateY: 90 }}
                transition={{ duration: 0.16 }}
                className="flex h-full flex-col"
              >
                <div className="relative flex-1 overflow-hidden bg-[var(--secondary)]">
                  {player.photo ? (
                    <img
                      src={player.photo}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{
                        objectPosition: "50% 0%",
                        transform: `scale(${scale})`,
                        transformOrigin: "50% 0%",
                      }}
                    />
                  ) : (
                    <svg
                      viewBox="0 0 100 100"
                      className="absolute inset-0 h-full w-full text-foreground/15"
                      fill="currentColor"
                      aria-hidden
                    >
                      <circle cx="50" cy="38" r="18" />
                      <path d="M10 104c0-26 18-40 40-40s40 14 40 40" />
                    </svg>
                  )}
                  <span className="absolute left-0 top-0 bg-[var(--cartao)] px-2 pb-1 pt-1.5 text-center leading-none text-[var(--piche)]">
                    <span className="block font-display text-3xl font-black">{player.overall}</span>
                    <span className="block font-display text-sm font-black">{player.position}</span>
                  </span>
                  <img src={crest} alt="" className="absolute right-1.5 top-1.5 h-9 w-9" />
                  {player.captain ? (
                    <span className="absolute bottom-1.5 right-1.5 bg-[var(--piche)] px-1.5 py-0.5 font-display text-sm font-black text-[var(--cal)]">
                      C
                    </span>
                  ) : null}
                </div>
                <div className="flex items-baseline justify-between gap-2 bg-[var(--tinta)] px-2 pb-1 pt-1.5 text-white">
                  <span className="truncate font-display text-xl font-black uppercase leading-none">
                    {player.name}
                  </span>
                  <span className="font-stencil text-2xl font-black leading-none">
                    {player.number}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ rotateY: -90 }}
                animate={{ rotateY: 0 }}
                exit={{ rotateY: -90 }}
                transition={{ duration: 0.16 }}
                className="flex h-full flex-col border-2 border-[var(--piche)] p-3"
              >
                <p className="font-display text-xl font-black uppercase leading-none">
                  {player.name}
                </p>
                <p className="mt-1 font-mono text-xs uppercase text-muted-foreground">
                  #{player.number} · {positionNames[player.position] ?? player.position}
                </p>
                <dl className="mt-3 flex-1 space-y-1.5">
                  {statLabels.map(([key, label]) => (
                    <div key={key}>
                      <div className="flex justify-between font-mono text-xs uppercase">
                        <dt>{label}</dt>
                        <dd className="font-bold">{player.stats[key]}</dd>
                      </div>
                      <div className="mt-0.5 h-1.5 bg-[var(--secondary)]">
                        <div
                          className="h-full bg-[var(--piche)]"
                          style={{ width: `${player.stats[key]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 border-t-2 border-[var(--piche)] pt-2 font-mono text-xs uppercase">
                  {player.totals.goals} gols · {player.totals.assists} assist.
                  {player.totals.motm ? ` · ${player.totals.motm}× craque` : ""}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
      <p className="mt-2 text-center font-mono text-xs text-muted-foreground">{code}</p>
    </div>
  );
}
