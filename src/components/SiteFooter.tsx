import { motion } from "framer-motion";
import { Instagram, MessageCircle } from "lucide-react";
import crest from "@/assets/crest.png";
import { club } from "@/data/team";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

const NAV_LINKS = [
  { href: "#sobre", label: "Clube" },
  { href: "#esquema", label: "Esquema" },
  { href: "#elenco", label: "Elenco" },
  { href: "#temporada", label: "Temporada" },
  { href: "#redes", label: "Redes" },
];

const FACTS = [
  `Fundado em ${club.founded}`,
  club.platform,
  `Esquema ${club.formation}`,
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/30">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-40 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]"
        aria-hidden
      />

      <a
        href={club.discord}
        target="_blank"
        rel="noreferrer noopener"
        className="skew-band group relative block overflow-hidden border-y border-border bg-primary py-3"
      >
        <div className="animate-ticker flex w-max gap-10 whitespace-nowrap font-display text-lg uppercase tracking-[0.3em] text-primary-foreground transition-[gap] group-hover:[animation-play-state:paused]">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Quer jogar com a gente? Entra no Discord
              <span className="text-primary-foreground/50">·</span>
            </span>
          ))}
        </div>
      </a>

      <div className="relative mx-auto grid max-w-6xl gap-0 px-6 py-16 lg:grid-cols-[1.1fr_auto_1fr] lg:gap-10">
        <div>
          <div className="flex items-center gap-3.5">
            <img src={crest} alt="" loading="lazy" width={816} height={816} className="h-14 w-14" />
            <div>
              <p className="font-display text-3xl uppercase leading-none tracking-wide text-foreground">
                {club.name}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {club.tagline}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Clube de torcedores para EA FC 26 Pro Clubs. Não afiliado à Electronic Arts — feito
            por quem joga, pra quem acompanha.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={club.social.instagram.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={club.social.tiktok.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div
          className="my-10 hidden w-px lg:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, var(--border) 0, var(--border) 6px, transparent 6px, transparent 14px)",
          }}
          aria-hidden
        />

        <div className="mt-10 lg:mt-0">
          <a
            href="#proximo-jogo"
            className="group block rounded-xl border border-dashed border-border bg-card/40 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.85)] backdrop-blur-sm transition-colors hover:border-accent"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
              Próximo jogo
            </p>
            <p className="mt-2 font-display text-2xl uppercase leading-none tracking-wide text-foreground transition-colors group-hover:text-accent">
              vs {club.nextMatch.opponent}
            </p>
            <p className="mt-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              {club.nextMatch.competition} · {club.nextMatch.venue}
            </p>
          </a>

          <div className="mt-6 flex flex-wrap gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {FACTS.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative select-none overflow-hidden">
        <motion.p
          aria-hidden
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none -mb-8 text-center font-display uppercase leading-none text-foreground/[0.035]"
          style={{ fontSize: "clamp(4rem, 18vw, 13rem)" }}
        >
          Driblou Caiu
        </motion.p>
      </div>

      <div className="relative border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {club.name}. Feito por torcedores.
          </p>
          <p className="text-foreground/50">EA FC 26 · Pro Clubs</p>
        </div>
      </div>
    </footer>
  );
}
