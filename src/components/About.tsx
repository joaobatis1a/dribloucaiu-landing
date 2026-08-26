import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import crest from "@/assets/crest.png";
import { club } from "@/data/team";
import { squadDna } from "@/lib/stats";
import { SectionTitle } from "@/components/SectionTitle";

const EASE = [0.16, 1, 0.3, 1] as const;

export function About() {
  const dna = squadDna();

  return (
    <section id="sobre" className="relative overflow-hidden border-y border-border py-20 md:py-28">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.035]" aria-hidden />
      <motion.img
        aria-hidden
        src={crest}
        alt=""
        initial={{ opacity: 0, rotate: -8 }}
        whileInView={{ opacity: 0.06, rotate: [-14, -11, -14] }}
        viewport={{ once: true }}
        transition={{
          opacity: { duration: 1.4, ease: EASE },
          rotate: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
        }}
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[36rem] w-[36rem] -translate-y-1/2 select-none lg:block"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionTitle kicker="Identidade" title="Sobre o clube" />

        <div className="relative mt-10 max-w-3xl">
          <motion.span
            aria-hidden
            animate={{ opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -left-4 -top-10 select-none font-display text-8xl leading-none text-accent"
          >
            “
          </motion.span>
          <p className="relative text-lg leading-relaxed text-foreground/90 md:text-xl">
            {club.about}
          </p>
        </div>

        <div className="mt-14 grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {club.pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -4 }}
              className="relative py-6 sm:px-8 sm:py-0"
            >
              <span className="font-display text-6xl leading-none text-transparent sm:text-7xl" style={{ WebkitTextStroke: "1.5px color-mix(in oklab, var(--accent) 55%, transparent)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-xl uppercase tracking-wide text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-[1.1fr_1fr]"
        >
          <div className="relative bg-card p-6 sm:p-8">
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
          </div>

          <div className="relative bg-card p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
              Sala de troféus
            </p>
            <div className="mt-5 flex flex-col gap-4">
              {club.achievements.map((a) => (
                <motion.div
                  key={`${a.title}-${a.year}`}
                  whileHover={{ x: 4 }}
                  className="group flex items-center gap-4"
                >
                  <motion.span
                    whileHover={{ rotate: -14, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--gold)]/40 bg-[color-mix(in_oklab,var(--gold)_16%,transparent)]"
                  >
                    <Trophy className="h-5 w-5 text-[color:var(--gold)]" aria-hidden />
                  </motion.span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg uppercase leading-tight tracking-wide text-foreground">
                      {a.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.detail} · {a.year}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
