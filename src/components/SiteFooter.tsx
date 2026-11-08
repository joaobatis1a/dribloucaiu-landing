import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUp, Instagram, MessageCircle } from "lucide-react";
import crest from "@/assets/crest.webp";
import { club } from "@/data/team";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { SprayWall } from "@/components/SprayWall";
import { useSite } from "@/components/site-context";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { RevealWords } from "@/components/motion/Reveal";

const NAV_LINKS = [
  { href: "#sobre", label: "Clube" },
  { href: "#esquema", label: "Esquema" },
  { href: "#elenco", label: "Elenco" },
  { href: "#jogos", label: "Jogos" },
  { href: "#redes", label: "Redes" },
];

/**
 * Rodapé com um muro pichável e o nome do clube em estêncil vazado, que desliza
 * de lado conforme a rolagem. O conteúdo em si fica parado: nada é recortado.
 */
export function SiteFooter() {
  const { site } = useSite();
  const next = site.nextMatch;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["12%", "-6%"]);

  return (
    <footer ref={ref} className="relative overflow-hidden bg-[var(--piche)] text-[var(--cal)]">
      <div className="mx-auto max-w-[1400px] px-4 pb-6 pt-16 sm:px-6 md:pt-20">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-sm uppercase text-[var(--cal)]/60">Fim de jogo. Ou não.</p>
            <h2 className="mt-2 font-stencil text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-[0.85]">
              <RevealWords text="Bora jogar" />
              <br />
              <RevealWords text="junto?" delay={0.12} className="text-[var(--tinta)]" />
            </h2>
          </div>
          <a
            href={club.discord}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative inline-flex items-center gap-3 self-start overflow-hidden bg-[var(--tinta)] px-7 py-5 font-display text-2xl font-black uppercase text-white md:self-auto"
          >
            <span className="absolute inset-0 translate-y-full bg-[var(--cartao)] transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-y-0" />
            <MessageCircle className="relative h-6 w-6 transition-colors group-hover:text-[var(--piche)]" />
            <span className="relative transition-colors group-hover:text-[var(--piche)]">
              Entrar no Discord
            </span>
          </a>
        </div>

        <div className="mt-12">
          <SprayWall>
            <motion.p
              aria-hidden
              style={{ x }}
              className="text-outline pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-stencil text-[17vw] font-black uppercase leading-none [--stroke:color-mix(in_oklab,var(--piche)_22%,transparent)] min-[1400px]:text-[15rem]"
            >
              Driblou Caiu
            </motion.p>
          </SprayWall>
        </div>

        <div className="mt-14 grid gap-10 border-t-2 border-[var(--cal)]/15 pt-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div className="flex items-center gap-4">
            <motion.img
              src={crest}
              alt=""
              width={800}
              height={800}
              className="h-20 w-20"
              whileHover={reduce ? {} : { rotate: 360 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            />
            <div>
              <p className="font-stencil text-3xl font-black uppercase leading-[0.85]">
                Driblou <span className="text-[var(--tinta)]">Caiu</span>
              </p>
              <p className="mt-2 font-mono text-xs uppercase text-[var(--cal)]/60">
                Desde {club.founded} · {club.platform}
              </p>
            </div>
          </div>

          <nav aria-label="Rodapé">
            <p className="font-mono text-xs uppercase text-[var(--cal)]/50">Navegue</p>
            <ul className="mt-3 space-y-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-2 font-display text-2xl font-black uppercase leading-tight"
                  >
                    <span className="h-[3px] w-0 bg-[var(--tinta)] transition-all duration-300 group-hover:w-5" />
                    <span className="transition-colors group-hover:text-[var(--cartao)]">
                      {l.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-xs uppercase text-[var(--cal)]/50">Próximo jogo</p>
            {next ? (
              <a href="#proximo-jogo" className="mt-3 block hover:text-[var(--cartao)]">
                <span className="block font-display text-2xl font-black uppercase leading-tight">
                  × {next.opponent}
                </span>
                <span className="font-mono text-xs uppercase text-[var(--cal)]/60">
                  {new Date(next.date).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "America/Sao_Paulo",
                  })}{" "}
                  · {next.competition}
                </span>
              </a>
            ) : (
              <p className="mt-3 font-display text-2xl font-black uppercase text-[var(--cal)]/40">
                A marcar
              </p>
            )}
            <div className="mt-6 flex gap-4">
              <a
                href={club.social.instagram.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="transition-transform hover:-translate-y-1 hover:text-[var(--cartao)]"
              >
                <Instagram className="h-7 w-7" />
              </a>
              <a
                href={club.social.tiktok.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="TikTok"
                className="transition-transform hover:-translate-y-1 hover:text-[var(--cartao)]"
              >
                <TikTokIcon className="h-7 w-7" />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group grid h-24 w-24 place-items-center self-start rounded-full border-2 border-[var(--cal)]/40 transition-colors hover:border-[var(--cartao)] hover:bg-[var(--cartao)] hover:text-[var(--piche)]"
          >
            <span className="flex flex-col items-center gap-1 font-mono text-[11px] uppercase">
              <ArrowUp className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1" />
              Pro topo
            </span>
          </button>
        </div>

        <p className="mt-12 flex flex-wrap justify-between gap-2 font-mono text-xs uppercase text-[var(--cal)]/40">
          <span>
            © {new Date().getFullYear()} {club.name}
          </span>
          <span>Feito na várzea, jogado no Pro Clubs</span>
        </p>
      </div>
    </footer>
  );
}
