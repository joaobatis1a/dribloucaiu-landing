import { motion } from "framer-motion";
import { MessageCircle, Swords } from "lucide-react";
import crest from "@/assets/crest.png";
import { club, results } from "@/data/team";
import { matchOutcome, outcomeStyles } from "@/lib/match";
import { SectionTitle } from "@/components/SectionTitle";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Friendlies() {
  const friendlies = results.filter((m) => m.competition === "Amistoso");
  const last = friendlies[0];

  return (
    <section id="amistosos" className="relative overflow-hidden border-y border-border bg-card/30">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary/15 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-[130px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionTitle kicker="Amistosos" title="Topa uma bola?" />
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          O Driblou Caiu também joga fora da liga — se seu clube quer trocar uma bola, é só chamar.
        </p>

        {last ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative mt-10 overflow-hidden rounded-2xl border border-border bg-card/60 p-6 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-8"
          >
            <img
              src={crest}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 select-none opacity-[0.05]"
            />
            <p className="relative text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              Último amistoso
            </p>
            <div className="relative mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-display text-3xl uppercase leading-none tracking-tight text-foreground sm:text-4xl">
                  Driblou Caiu <span className="text-muted-foreground">vs</span> {last.opponent}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {last.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${outcomeStyles[matchOutcome(last.goalsFor, last.goalsAgainst)].className}`}
                >
                  {outcomeStyles[matchOutcome(last.goalsFor, last.goalsAgainst)].label}
                </span>
                <span className="font-display text-4xl tabular-nums text-foreground">
                  {last.goalsFor}
                  <span className="mx-1.5 text-muted-foreground">×</span>
                  {last.goalsAgainst}
                </span>
              </div>
            </div>
          </motion.div>
        ) : null}

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Histórico de amistosos
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
              {friendlies.length > 0 ? (
                friendlies.map((m, i) => {
                  const o = matchOutcome(m.goalsFor, m.goalsAgainst);
                  const style = outcomeStyles[o];
                  return (
                    <motion.div
                      key={`${m.opponent}-${m.date}`}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                      className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border/60" : ""}`}
                    >
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${style.className}`}>
                        {style.label}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-display text-sm uppercase tracking-wide text-foreground sm:text-base">
                        {m.opponent}
                      </span>
                      <span className="shrink-0 text-xs uppercase tracking-widest text-muted-foreground">
                        {m.date}
                      </span>
                      <span className="w-14 shrink-0 text-right font-display text-lg tabular-nums text-foreground">
                        {m.goalsFor}×{m.goalsAgainst}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <p className="px-4 py-6 text-sm text-muted-foreground">Nenhum amistoso registrado ainda.</p>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="flex flex-col justify-between rounded-xl border border-dashed border-border bg-card/40 p-6"
          >
            <div>
              <Swords className="h-6 w-6 text-primary" aria-hidden />
              <p className="mt-3 font-display text-xl uppercase leading-tight tracking-wide text-foreground">
                Venha jogar contra a gente
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Seu clube topa marcar um amistoso? Chama a diretoria no Discord e combina data e
                horário.
              </p>
            </div>
            <a
              href={club.discord}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 [box-shadow:var(--shadow-red)]"
            >
              <MessageCircle className="h-4 w-4" />
              Marcar no Discord
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
