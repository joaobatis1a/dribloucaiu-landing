import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import crest from "@/assets/crest.webp";
import { club } from "@/data/team";
import { SectionTitle } from "@/components/SectionTitle";
import { RevealWords, ScrollLitText } from "@/components/motion/Reveal";

/** Placas pintadas no muro, cada uma com uma pegada diferente. */
const SIGN_STYLES = [
  { box: "bg-[var(--tinta)] text-white", tilt: -3 },
  {
    box: "bg-[var(--papel)] text-[var(--tinta)] outline outline-4 -outline-offset-[10px] outline-[var(--tinta)]",
    tilt: 2.5,
  },
  { box: "bg-[var(--cartao)] text-[var(--piche)]", tilt: -1.5 },
  { box: "bg-[var(--piche)] text-[var(--cal)]", tilt: 3 },
];

function Sign({ text, index }: { text: string; index: number }) {
  const reduce = useReducedMotion();
  const style = SIGN_STYLES[index % SIGN_STYLES.length]!;
  return (
    <motion.li
      initial={reduce ? false : { y: -80, rotate: style.tilt * 4, opacity: 0 }}
      whileInView={{ y: 0, rotate: style.tilt, opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 160, damping: 11, delay: index * 0.1 }}
      whileHover={
        reduce ? {} : { rotate: [style.tilt, -style.tilt * 1.6, style.tilt * 0.8, style.tilt] }
      }
      style={{ transformOrigin: "50% 0%" }}
      className="relative pt-5"
    >
      {/* prego e barbante */}
      <span
        className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[var(--piche)]"
        aria-hidden
      />
      <span
        className="absolute left-1/2 top-1 h-5 w-[2px] -translate-x-1/2 bg-[var(--piche)]/60"
        aria-hidden
      />
      <div
        className={`grid min-h-[9.5rem] place-items-center px-5 py-6 text-center shadow-[0_14px_20px_-14px_rgba(0,0,0,0.6)] ${style.box}`}
      >
        <span className="font-stencil text-[2.4rem] font-black uppercase leading-[0.88] sm:text-5xl">
          {text}
        </span>
      </div>
    </motion.li>
  );
}

/** Selo circular que gira com a rolagem, com o escudo no meio. */
function Stamp() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 280]);
  const label = `Desde ${club.founded} • Várzea digital • Pro Clubs • ${club.platform} • `;
  return (
    <div ref={ref} className="relative mx-auto aspect-square w-60 sm:w-72">
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        style={{ rotate }}
        aria-hidden
      >
        <defs>
          <path id="stamp-circle" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="var(--piche)" />
        <text className="fill-[var(--cal)] font-display text-[15.5px] font-black uppercase tracking-[0.12em]">
          <textPath href="#stamp-circle">{label}</textPath>
        </text>
      </motion.svg>
      <img src={crest} alt="" className="absolute inset-[22%] h-[56%] w-[56%]" />
    </div>
  );
}

export function About() {
  return (
    <section id="sobre" className="wall overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6 md:pt-28">
        <SectionTitle kicker="Quem somos" title="O clube" />

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <ScrollLitText
            text={club.about}
            className="font-display text-[clamp(1.9rem,3.6vw,3.25rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.005em]"
          />
          <Stamp />
        </div>

        <p className="mt-20 font-mono text-sm uppercase text-muted-foreground">Regras da casa</p>
        <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 pb-20 sm:grid-cols-2 lg:grid-cols-4 md:pb-28">
          {club.rules.map((rule, i) => (
            <Sign key={rule} text={rule} index={i} />
          ))}
        </ul>
      </div>

      {/* O lema pintado de ponta a ponta numa faixa vermelha. */}
      <div className="bg-[var(--tinta)] text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-4 py-8 sm:px-6 md:py-10">
          <p className="font-stencil text-[clamp(2.8rem,8vw,6.5rem)] font-black uppercase leading-[0.85]">
            <RevealWords text={club.motto} stagger={0.08} />
          </p>
          <img src={crest} alt="" className="hidden h-24 w-24 shrink-0 sm:block md:h-32 md:w-32" />
        </div>
      </div>
    </section>
  );
}
