import { motion } from "framer-motion";
import { club } from "@/data/team";
import { useCountdown } from "@/hooks/use-countdown";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 overflow-hidden rounded-md border border-border bg-background/60 py-2 text-center sm:w-20">
        <span
          key={value}
          className="block font-display text-3xl tabular-nums text-foreground sm:text-4xl"
          style={{ animation: "count-flicker 0.4s ease-out" }}
        >
          {pad(value)}
        </span>
      </div>
      <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function NextMatch() {
  const t = useCountdown(club.nextMatch.date);
  const matchDate = new Date(club.nextMatch.date);
  const formatted = matchDate.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  return (
    <section id="proximo-jogo" className="relative isolate overflow-hidden border-y border-border bg-card">
      <div className="grain absolute inset-0 -z-10 opacity-[0.04]" aria-hidden />
      <div
        className="absolute -left-16 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]"
        aria-hidden
      />
      <div
        className="absolute -right-16 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center md:flex-row md:justify-between md:text-left"
      >
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Próximo jogo
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase leading-[0.9] tracking-tight text-foreground sm:text-5xl">
            Driblou Caiu <span className="text-muted-foreground">vs</span> {club.nextMatch.opponent}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {club.nextMatch.competition} · {club.nextMatch.venue} · {formatted}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {t.done ? (
            <p className="font-display text-2xl uppercase text-accent">Bola rolando!</p>
          ) : (
            <>
              <TimeBlock value={t.days} label="Dias" />
              <TimeBlock value={t.hours} label="Horas" />
              <TimeBlock value={t.minutes} label="Min" />
              <TimeBlock value={t.seconds} label="Seg" />
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
