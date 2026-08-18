import { motion } from "framer-motion";
import { Flame, Sparkles, Trophy, Wind } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { club } from "@/data/team";
import { squadDna } from "@/lib/stats";
import { SectionTitle } from "@/components/SectionTitle";

const EASE = [0.16, 1, 0.3, 1] as const;

const pillarIcons = [Flame, Sparkles, Wind];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
};

export function About() {
  const dna = squadDna();

  return (
    <section id="sobre" className="relative overflow-hidden py-20 md:py-28">
      <div
        className="absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-[140px]"
        aria-hidden
      />
      <div
        className="absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle kicker="Identidade" title="Sobre o clube" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -left-4 -top-10 select-none font-display text-8xl leading-none text-primary/15"
              >
                “
              </span>
              <p className="relative text-lg leading-relaxed text-foreground/90 md:text-xl">
                {club.about}
              </p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="relative mt-10 space-y-1 border-l border-border pl-8"
            >
              {club.pillars.map((pillar, i) => {
                const Icon = pillarIcons[i % pillarIcons.length]!;
                return (
                  <motion.div
                    key={pillar.title}
                    variants={item}
                    className="group relative py-4"
                  >
                    <span className="absolute -left-[2.55rem] top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors group-hover:border-accent group-hover:text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-xl uppercase tracking-wide text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="rounded-xl border border-border bg-card/60 p-6"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                DNA do time
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Média de atributos do elenco</p>
              <div className="mt-2 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={dna} outerRadius="72%">
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis
                      dataKey="stat"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <Radar
                      dataKey="value"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="rounded-xl border border-border bg-card/60 p-6"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                Sala de troféus
              </p>
              <ul className="mt-4 space-y-3">
                {club.achievements.map((a) => (
                  <li
                    key={`${a.title}-${a.year}`}
                    className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-secondary/40"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--gold)_20%,transparent)]">
                      <Trophy className="h-4 w-4 text-[color:var(--gold)]" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-base uppercase leading-tight tracking-wide text-foreground">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.detail} · {a.year}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
