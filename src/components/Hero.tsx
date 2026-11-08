import { motion, useReducedMotion } from "framer-motion";
import crest from "@/assets/crest.webp";
import { club } from "@/data/team";
import { Scoreboard } from "@/components/Scoreboard";

const EASE = [0.65, 0, 0.35, 1] as const;

/** Palavra pintada no muro: revela da esquerda pra direita, como uma passada de spray no estêncil. */
function Painted({
  children,
  delay,
  className,
}: {
  children: string;
  delay: number;
  className: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={`block ${className}`}
    >
      {children}
    </motion.span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <header id="top" className="wall relative overflow-hidden pt-[60px]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-x-10 gap-y-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:pb-20 lg:pt-14">
        <div>
          <p className="font-mono text-sm uppercase text-muted-foreground">
            Pro Clubs · EA FC 26 · desde {club.founded}
          </p>

          <h1 className="mt-3 font-stencil text-[clamp(5.2rem,19vw,13.5rem)] font-black uppercase leading-[0.78] tracking-[-0.01em]">
            <Painted delay={0.1} className="text-foreground">
              Driblou
            </Painted>
            <Painted delay={0.45} className="text-primary">
              Caiu
            </Painted>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-snug text-foreground/85">
            Marcação alta, saída curta e três pontas em velocidade. Bola no chão, banco por mérito e
            nenhum money team.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href="#elenco"
              className="bg-foreground px-6 py-3 font-display text-xl uppercase tracking-wide text-background shadow-[5px_5px_0_var(--tinta)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Ver o elenco
            </a>
            <a
              href={club.discord}
              target="_blank"
              rel="noreferrer noopener"
              className="font-display text-xl uppercase tracking-wide underline decoration-primary decoration-[3px] underline-offset-[6px] hover:text-primary"
            >
              Jogar com a gente
            </a>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-8 lg:items-end">
          <motion.img
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            src={crest}
            alt="Escudo do Driblou Caiu"
            width={800}
            height={800}
            className="w-56 -rotate-[4deg] drop-shadow-[0_2px_0_rgba(0,0,0,0.25)] sm:w-72 lg:mr-10 lg:w-[22rem]"
          />
          <Scoreboard className="w-full max-w-[30rem] rotate-[0.6deg]" />
        </div>
      </div>

      <div className="paint-stripes h-4" aria-hidden />
    </header>
  );
}
