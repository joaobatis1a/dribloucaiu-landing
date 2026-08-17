import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import crest from "@/assets/crest.png";
import { club } from "@/data/team";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const crestY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <header id="top" ref={ref} className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-background" />
      <motion.div
        style={{ y: glowY }}
        className="absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </motion.div>
      <div className="hud-grid absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div className="hud-scan absolute inset-0 -z-10 opacity-60" aria-hidden />
      <div className="vignette absolute inset-0 -z-10" aria-hidden />
      <div
        className="animate-hud-pulse absolute -top-40 left-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-primary/30 blur-[130px]"
        aria-hidden
      />
      <div
        className="absolute right-[8%] top-1/3 -z-10 h-64 w-64 rounded-full bg-accent/10 blur-[100px]"
        aria-hidden
      />

      <motion.div
        style={{ opacity: fade }}
        className="mx-auto flex min-h-[92svh] max-w-6xl flex-col items-center justify-center gap-10 px-6 pb-20 pt-28 text-center md:flex-row md:pb-24 md:text-left"
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.6, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: EASE }}
          style={{ y: crestY }}
          src={crest}
          alt="Escudo do Driblou Caiu"
          width={816}
          height={816}
          className="animate-float-y h-40 w-40 shrink-0 drop-shadow-[0_25px_55px_rgba(220,38,38,0.5)] md:h-60 md:w-60"
        />

        <motion.div style={{ y: textY }}>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {club.tagline}
          </motion.p>

          <h1 className="mt-5 overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="block font-display text-6xl uppercase leading-[0.85] tracking-tight text-foreground sm:text-8xl lg:text-9xl"
            >
              Driblou
            </motion.span>
          </h1>
          <h1 className="overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              className="block font-display text-6xl uppercase leading-[0.85] tracking-tight text-primary sm:text-8xl lg:text-9xl"
            >
              Caiu
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            className="mt-5 max-w-md text-base text-muted-foreground md:text-lg"
          >
            Clube de Pro Clubs no EA FC 26, fundado em {club.founded}. Marcação alta, saída curta
            e três pontas em velocidade — uma temporada inteira construída em cima de amistosos e
            liga.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start"
          >
            <a
              href="#elenco"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3 font-display text-lg uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 [box-shadow:var(--shadow-red)]"
            >
              Ver elenco
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href={club.discord}
              className="inline-flex items-center gap-2 rounded-md border border-border px-7 py-3 font-display text-lg uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Jogar com a gente
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground md:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Role</span>
        <span className="h-9 w-px animate-pulse bg-gradient-to-b from-muted-foreground to-transparent" />
      </motion.div>

      <div className="skew-band relative overflow-hidden border-y border-border bg-primary/90 py-2">
        <div className="animate-ticker flex w-max gap-8 whitespace-nowrap font-display text-sm uppercase tracking-[0.35em] text-primary-foreground">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              Driblou Caiu <span className="text-accent">•</span> EA FC 26 Pro Clubs
              <span className="text-accent">•</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
