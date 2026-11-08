import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Instagram } from "lucide-react";
import { club } from "@/data/team";
import { formations, roleNames } from "@/lib/formations";
import { SectionTitle } from "@/components/SectionTitle";
import { Pitch } from "@/components/Pitch";
import { useSite } from "@/components/site-context";
import { EASE_OUT, RevealWords } from "@/components/motion/Reveal";

/** Escalação oficial: os 11 slots numerados definidos no painel. */
export function Formation() {
  const { site } = useSite();
  const { lineup, players } = site;
  const preset = formations[lineup.formation];
  const [selected, setSelected] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="esquema" className="wall overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 md:py-28">
        <SectionTitle kicker="Escalação" title={lineup.formation} />
        <p className="mt-5 max-w-2xl text-xl leading-snug">
          <RevealWords text={preset.blurb} />
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <Pitch
              lineup={lineup}
              players={players}
              selected={selected}
              onSelect={(i) => setSelected((s) => (s === i ? null : i))}
            />
          </div>

          <div>
            <ol className="border-t-2 border-foreground">
              {lineup.slots.map((slot, i) => {
                const player = slot.playerId
                  ? players.find((p) => p.id === slot.playerId)
                  : undefined;
                const role = preset.slots[i]?.role;
                return (
                  <motion.li
                    key={i}
                    initial={reduce ? false : { opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: i * 0.035, ease: EASE_OUT }}
                    className="border-b-2 border-foreground"
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setSelected(i)}
                      onMouseLeave={() => setSelected(null)}
                      onFocus={() => setSelected(i)}
                      onBlur={() => setSelected(null)}
                      className={`flex w-full items-center gap-3 px-1 py-2 text-left transition-colors duration-300 ${
                        selected === i ? "bg-[var(--cartao)]" : ""
                      }`}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center bg-foreground font-display text-base font-black text-background">
                        {slot.number}
                      </span>
                      <span
                        className={`min-w-0 flex-1 truncate font-display text-xl font-black uppercase leading-none ${
                          player ? "" : "text-foreground/35"
                        }`}
                      >
                        {player?.name ?? "A definir"}
                      </span>
                      <span className="font-mono text-xs uppercase text-muted-foreground">
                        {role ? roleNames[role] : ""}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ol>

            <a
              href={club.social.instagram.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-8 flex items-center justify-between gap-4 bg-foreground p-5 text-background shadow-[5px_5px_0_var(--tinta)] transition-transform duration-300 hover:-translate-y-1"
            >
              <span>
                <span className="block font-display text-2xl font-black uppercase leading-none">
                  Quer uma vaga?
                </span>
                <span className="mt-1 block font-mono text-xs uppercase text-background/70">
                  Manda tua posição no Instagram
                </span>
              </span>
              <Instagram className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
