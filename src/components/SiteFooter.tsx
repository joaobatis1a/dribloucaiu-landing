import { motion } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import crest from "@/assets/crest.png";
import { club } from "@/data/team";

const NAV_LINKS = [
  { href: "#sobre", label: "Clube" },
  { href: "#esquema", label: "Esquema" },
  { href: "#elenco", label: "Elenco" },
  { href: "#resultados", label: "Resultados" },
  { href: "#tabela", label: "Tabela" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/30">
      <div className="hud-grid absolute inset-0 -z-10 opacity-20" aria-hidden />

      <div className="mx-auto max-w-6xl px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl border border-border px-8 py-12 text-center [background:var(--gradient-hero)]"
        >
          <div className="hud-scan absolute inset-0 -z-10 opacity-40" aria-hidden />
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            Recrutamento aberto
          </p>
          <h2 className="max-w-xl font-display text-4xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl">
            Quer jogar com a gente?
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Peneiras toda semana, banco por mérito. Entra no Discord e chama a diretoria.
          </p>
          <a
            href={club.discord}
            className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 font-display text-lg uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 [box-shadow:var(--shadow-red)]"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            Entrar no Discord
          </a>
        </motion.div>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <img src={crest} alt="" loading="lazy" width={816} height={816} className="h-11 w-11" />
            <div>
              <p className="font-display text-lg uppercase tracking-wide text-foreground">
                {club.name}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {club.tagline}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Clube de torcedores para EA FC 26 Pro Clubs. Não afiliado à Electronic Arts.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Navegação
          </p>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Clube
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
            <li>Fundado em {club.founded}</li>
            <li>{club.platform}</li>
            <li>Esquema {club.formation}</li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Próximo jogo
          </p>
          <a href="#proximo-jogo" className="group mt-4 block text-sm text-foreground/80">
            <span className="block font-display text-base uppercase tracking-wide text-foreground transition-colors group-hover:text-accent">
              vs {club.nextMatch.opponent}
            </span>
            <span className="text-xs text-muted-foreground">
              {club.nextMatch.competition} · {club.nextMatch.venue}
            </span>
          </a>
        </div>
      </div>

      <div className="relative select-none overflow-hidden">
        <p
          aria-hidden
          className="pointer-events-none -mb-8 text-center font-display uppercase leading-none text-foreground/[0.04]"
          style={{ fontSize: "clamp(4rem, 18vw, 13rem)" }}
        >
          Driblou Caiu
        </p>
      </div>

      <div className="relative border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {club.name}. Feito por torcedores.
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-foreground/70 transition-colors hover:text-accent"
          >
            Voltar ao topo <ArrowUp className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
