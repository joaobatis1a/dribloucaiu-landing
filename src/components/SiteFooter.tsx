import { motion } from "framer-motion";
import { Instagram, MessageCircle } from "lucide-react";
import crest from "@/assets/crest.png";
import { club } from "@/data/team";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

const NAV_LINKS = [
  { href: "#sobre", label: "Clube" },
  { href: "#esquema", label: "Esquema" },
  { href: "#elenco", label: "Elenco" },
  { href: "#resultados", label: "Resultados" },
  { href: "#tabela", label: "Tabela" },
  { href: "#redes", label: "Redes" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/30">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden />

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

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
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
          <div className="mt-5 flex items-center gap-3">
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

        <div>
          <p className="dotted-rule pb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
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
          <p className="dotted-rule pb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Clube
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
            <li>Fundado em {club.founded}</li>
            <li>{club.platform}</li>
            <li>Esquema {club.formation}</li>
          </ul>
        </div>

        <div>
          <p className="dotted-rule pb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
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
