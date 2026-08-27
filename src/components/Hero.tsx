import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import crest from "@/assets/crest.webp";
import { club, teamStats } from "@/data/team";

const EASE = [0.16, 1, 0.3, 1] as const;

const chip1 = teamStats[0]!;
const chip2 = teamStats[4]!;

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
      <motion.div style={{ y: glowY }} className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </motion.div>
      <div className="hud-grid absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div className="hud-scan absolute inset-0 -z-10 opacity-60" aria-hidden />
      <div className="vignette absolute inset-0 -z-10" aria-hidden />
      <div
        className="animate-hud-pulse absolute -top-40 right-[-10%] -z-10 h-[620px] w-[620px] rounded-full bg-primary/30 blur-[130px] lg:right-[8%]"
        aria-hidden
      />
      <div
        className="absolute left-[6%] top-1/4 -z-10 h-64 w-64 rounded-full bg-accent/10 blur-[100px]"
        aria-hidden
      />

      <motion.div
        style={{ opacity: fade }}
        className="mx-auto grid min-h-[92svh] max-w-[1440px] items-center gap-10 px-6 pb-20 pt-28 lg:grid-cols-12 lg:gap-4 lg:px-10 lg:pb-28"
      >
        <motion.div style={{ y: textY }} className="relative z-10 text-center lg:col-span-7 lg:text-left">
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
              className="block font-display text-7xl uppercase leading-[0.82] tracking-tight text-foreground sm:text-8xl lg:text-[9rem] xl:text-[10.5rem]"
            >
              Driblou
            </motion.span>
          </h1>
          <h1 className="overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              className="block font-display text-7xl uppercase leading-[0.82] tracking-tight text-primary sm:text-8xl lg:text-[9rem] xl:text-[10.5rem]"
            >
              Caiu
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            className="mx-auto mt-6 max-w-md text-base text-muted-foreground md:text-lg lg:mx-0"
          >
            Clube de Pro Clubs no EA FC 26, fundado em {club.founded}. Marcação alta, saída curta
            e três pontas em velocidade. Bola no chão, sem money team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
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
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-md border border-border px-7 py-3 font-display text-lg uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Jogar com a gente
            </a>
          </motion.div>
        </motion.div>

        <div className="relative hidden lg:col-span-5 lg:flex lg:items-center lg:justify-end">
          <p
            aria-hidden
            className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none font-display text-[26rem] leading-none text-foreground/[0.035]"
          >
            10
          </p>

          <motion.img
            initial={{ opacity: 0, scale: 0.6, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ duration: 1, ease: EASE }}
            style={{ y: crestY }}
            src={crest}
            alt="Escudo do Driblou Caiu"
            width={816}
            height={816}
            className="animate-float-y relative h-[26rem] w-[26rem] shrink-0 drop-shadow-[0_35px_65px_rgba(220,38,38,0.5)] xl:-mr-8 xl:h-[30rem] xl:w-[30rem]"
          />

          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1, ease: EASE }}
            className="animate-float-y absolute left-0 top-10 rounded-lg border border-border bg-card/80 px-4 py-2.5 backdrop-blur-sm"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="font-display text-2xl leading-none text-foreground">{chip1.value}</div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {chip1.label}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.15, ease: EASE }}
            className="animate-float-y absolute bottom-6 right-2 rounded-lg border border-accent/40 bg-card/80 px-4 py-2.5 backdrop-blur-sm"
            style={{ animationDelay: "1.2s" }}
          >
            <div className="font-display text-2xl leading-none text-accent">
              {chip2.value}
              {chip2.suffix}
            </div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {chip2.label}
            </div>
          </motion.div>
        </div>

        <motion.img
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE }}
          src={crest}
          alt="Escudo do Driblou Caiu"
          width={816}
          height={816}
          className="animate-float-y mx-auto h-40 w-40 drop-shadow-[0_25px_55px_rgba(220,38,38,0.5)] lg:hidden"
        />
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
