import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import crest from "@/assets/crest.webp";
import { club } from "@/data/team";
import { Scoreboard } from "@/components/Scoreboard";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { EASE_OUT } from "@/components/motion/Reveal";

/** Palavra carimbada em estêncil: cada letra cai do alto e assenta com mola. */
function Stamped({ word, delay, className }: { word: string; delay: number; className: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`flex ${className}`} aria-hidden>
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { y: "-60%", opacity: 0, rotate: i % 2 ? 8 : -8, scale: 1.25 }}
          animate={{ y: "0%", opacity: 1, rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 22, delay: delay + i * 0.055 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const k = reduce ? 0 : 1;
  const xTop = useTransform(p, [0, 1], [0, -120 * k]);
  const xBottom = useTransform(p, [0, 1], [0, 160 * k]);
  const crestRotate = useTransform(p, [0, 1], [-4, -4 + 40 * k]);
  const crestY = useTransform(p, [0, 1], [0, 120 * k]);
  const boardY = useTransform(p, [0, 1], [0, -60 * k]);

  return (
    <header id="top" ref={ref} className="wall relative overflow-hidden pt-[68px]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-x-10 gap-y-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:pb-20 lg:pt-12">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-mono text-sm uppercase text-muted-foreground"
          >
            Pro Clubs · EA FC 26 · desde {club.founded}
          </motion.p>

          <h1
            aria-label="Driblou Caiu"
            className="mt-3 font-stencil text-[clamp(5.2rem,19vw,13.5rem)] font-black uppercase leading-[0.78] tracking-[-0.01em]"
          >
            <motion.span className="block" style={{ x: xTop }}>
              <Stamped word="Driblou" delay={0.1} className="text-foreground" />
            </motion.span>
            <motion.span className="block" style={{ x: xBottom }}>
              <Stamped word="Caiu" delay={0.5} className="text-primary" />
            </motion.span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT }}
            className="mt-7 max-w-md text-lg leading-snug text-foreground/85"
          >
            Marcação alta, saída curta e três pontas em velocidade. Bola no chão, banco por mérito e
            nenhum money team.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: EASE_OUT }}
            className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
          >
            <a
              href="#elenco"
              className="group relative overflow-hidden bg-foreground px-6 py-3 font-display text-xl font-black uppercase text-background shadow-[5px_5px_0_var(--tinta)] transition-[transform,box-shadow] duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_var(--tinta)]"
            >
              <span className="relative z-10">Ver o elenco</span>
              <span className="absolute inset-0 origin-left scale-x-0 bg-[var(--tinta)] transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />
            </a>
            <a
              href={club.discord}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-[length:100%_3px] bg-[position:0_100%] bg-no-repeat pb-1 font-display text-xl font-black uppercase transition-[background-size] duration-500 [background-image:linear-gradient(var(--tinta),var(--tinta))] hover:bg-[length:0%_3px] hover:bg-[position:100%_100%]"
            >
              Jogar com a gente
            </a>
          </motion.div>
        </div>

        <div className="relative flex flex-col items-center gap-8 lg:items-end">
          <motion.div style={{ rotate: crestRotate, y: crestY }} className="lg:mr-10">
            <motion.img
              initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -26 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.3 }}
              src={crest}
              alt="Escudo do Driblou Caiu"
              width={800}
              height={800}
              className="w-56 drop-shadow-[0_2px_0_rgba(0,0,0,0.25)] sm:w-72 lg:w-[22rem]"
            />
          </motion.div>
          <motion.div style={{ y: boardY }} className="w-full max-w-[30rem]">
            <Scoreboard className="w-full rotate-[0.6deg]" />
          </motion.div>
        </div>
      </div>

      <div className="paint-stripes h-3" aria-hidden />
      <VelocityMarquee baseVelocity={2.2} className="bg-[var(--piche)] py-3 text-[var(--cal)]">
        {[
          "Driblou Caiu",
          "Bola no chão",
          "Pro Clubs",
          "Banco por mérito",
          "EA FC 26",
          "Sem money team",
        ].map((t) => (
          <span
            key={t}
            className="flex items-center font-stencil text-3xl font-black uppercase sm:text-4xl"
          >
            <span className="px-6">{t}</span>
            <span className="h-3 w-3 rotate-45 bg-[var(--tinta)]" />
          </span>
        ))}
      </VelocityMarquee>
    </header>
  );
}
