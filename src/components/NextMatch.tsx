import { motion, useReducedMotion } from "framer-motion";
import { useSite } from "@/components/site-context";
import { useCountdown } from "@/hooks/use-countdown";

const TZ = "America/Sao_Paulo";
const pad = (n: number) => n.toString().padStart(2, "0");

/** Próximo jogo como um lambe-lambe amarelo colado no muro. */
export function NextMatch() {
  const { site } = useSite();
  const next = site.nextMatch;
  const t = useCountdown(next?.date ?? "2000-01-01T00:00:00Z");
  const reduce = useReducedMotion();
  if (!next) return null;

  const date = new Date(next.date);
  const weekday = date
    .toLocaleDateString("pt-BR", { weekday: "long", timeZone: TZ })
    .replace("-feira", "");
  const day = date
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: TZ })
    .replace("/", ".");
  const time = date
    .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: TZ })
    .replace(":", "H");

  return (
    <section
      id="proximo-jogo"
      className="overflow-hidden bg-[var(--piche)] px-4 py-20 text-[var(--piche)] sm:px-6 md:py-28"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40, rotate: -4 }}
        whileInView={{ opacity: 1, y: 0, rotate: -1.2 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
        className="relative mx-auto max-w-3xl"
      >
        <span className="tape absolute -top-3 left-8 z-10 h-7 w-28 -rotate-6" aria-hidden />
        <span className="tape absolute -top-3 right-10 z-10 h-7 w-24 rotate-[8deg]" aria-hidden />

        <article className="torn bg-[var(--cartao)] px-6 pb-10 pt-12 text-center sm:px-12">
          <p className="font-mono text-sm uppercase sm:text-base">
            Próximo jogo · {next.competition} · {next.venue}
          </p>
          <p className="mt-4 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
            {weekday}
          </p>
          <p className="font-stencil text-[clamp(5rem,18vw,10rem)] font-black leading-[0.82]">
            {day}
          </p>
          <p className="font-stencil text-[clamp(3rem,10vw,5.5rem)] font-black leading-[0.9]">
            {time}
          </p>
          <div className="mx-auto my-6 h-[3px] w-24 bg-[var(--piche)]" />
          <p className="font-stencil text-[clamp(2.6rem,8vw,5rem)] font-black uppercase leading-[0.85]">
            Driblou Caiu
          </p>
          <p className="my-1 font-display text-3xl font-black">×</p>
          <p className="font-stencil text-[clamp(2.6rem,8vw,5rem)] font-black uppercase leading-[0.85] text-[var(--tinta)]">
            {next.opponent}
          </p>

          <p className="mt-8 font-mono text-base uppercase sm:text-lg" aria-live="polite">
            {t.done
              ? "Jogo começou. Placar em breve."
              : `Faltam ${t.days}d ${pad(t.hours)}h ${pad(t.minutes)}m ${pad(t.seconds)}s`}
          </p>
        </article>
      </motion.div>
    </section>
  );
}
