import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { club } from "@/data/team";
import { SectionTitle } from "@/components/SectionTitle";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function About() {
  return (
    <section id="sobre" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionTitle kicker="Identidade" title="Sobre o clube" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-10 grid gap-4 md:grid-cols-3"
      >
        {club.pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            variants={item}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-6"
            style={{ background: "var(--gradient-card)" }}
          >
            <span className="font-display text-4xl text-primary/40">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-display text-xl uppercase tracking-wide text-foreground">
              {pillar.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 rounded-xl border border-border bg-card/60 p-6"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
          Sala de troféus
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {club.achievements.map((a) => (
            <li key={`${a.title}-${a.year}`} className="flex items-start gap-3">
              <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="font-display text-base uppercase leading-tight tracking-wide text-foreground">
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
    </section>
  );
}
