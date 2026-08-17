import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { club, squad } from "@/data/team";
import { formationLayout } from "@/lib/formation";
import { positionNames } from "@/lib/match";
import { SectionTitle } from "@/components/SectionTitle";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const dot = {
  hidden: { opacity: 0, scale: 0.3, y: -16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const lines: Array<{ label: string; codes: string[] }> = [
  { label: "Ataque", codes: ["PE", "ATA", "PD"] },
  { label: "Meio-campo", codes: ["MC", "VOL", "MEI"] },
  { label: "Defesa", codes: ["LE", "ZAG", "LD"] },
  { label: "Gol", codes: ["GOL"] },
];

export function Formation() {
  const players = formationLayout(squad);
  const [activeName, setActiveName] = useState<string | null>(null);
  const active = players.find((p) => p.name === activeName) ?? null;

  return (
    <section id="esquema" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionTitle kicker="Como jogamos" title={`Esquema ${club.formation}`} />
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          {club.about}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            onMouseLeave={() => setActiveName(null)}
            className="pitch-stripes relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)] sm:aspect-[3/4]"
          >
            <div
              className="absolute inset-3 rounded-lg"
              style={{ border: "1px solid var(--pitch-line)" }}
              aria-hidden
            >
              <div
                className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ border: "1px solid var(--pitch-line)" }}
              />
              <div
                className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
                style={{ background: "var(--pitch-line)" }}
              />
              <div
                className="absolute inset-x-[22%] bottom-0 h-[14%] border-b-0"
                style={{ border: "1px solid var(--pitch-line)" }}
              />
              <div
                className="absolute inset-x-[22%] top-0 h-[14%] border-t-0"
                style={{ border: "1px solid var(--pitch-line)" }}
              />
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
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
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

            <AnimatePresence>
              {active ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-3 left-3 right-3 rounded-lg border border-border bg-background/90 px-4 py-2.5 backdrop-blur-sm sm:left-auto sm:right-3 sm:w-56"
                >
                  <p className="font-display text-lg uppercase leading-none tracking-wide text-foreground">
                    {active.name}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    #{active.number} · {positionNames[active.position] ?? active.position}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>

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
