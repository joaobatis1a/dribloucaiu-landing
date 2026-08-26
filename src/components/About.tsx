import { motion } from "framer-motion";
import crest from "@/assets/crest.png";
import { club } from "@/data/team";
import { SectionTitle } from "@/components/SectionTitle";

const EASE = [0.16, 1, 0.3, 1] as const;

export function About() {
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-8 flex flex-wrap gap-2.5"
        >
          {club.rules.map((rule) => (
            <span
              key={rule}
              className="rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground"
            >
              {rule}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="relative mt-16 flex flex-wrap items-end gap-x-12 gap-y-8"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
              Criado em
            </p>
            <p className="mt-1 font-display text-6xl leading-none text-foreground">{club.founded}</p>
          </div>
          <div className="max-w-sm border-l border-border pl-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
              Lema
            </p>
            <p className="mt-1 font-display text-3xl uppercase leading-[1.05] tracking-wide text-foreground">
              {club.motto}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
