import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Instagram, MessageCircle } from "lucide-react";
import crest from "@/assets/crest.webp";
import { club } from "@/data/team";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { getLenis, scrollToTarget } from "@/components/motion/SmoothScroll";
import { useSite } from "@/components/site-context";

const LINKS = [
  { href: "#sobre", label: "Clube", id: "sobre", note: "Quem somos e as regras da casa" },
  { href: "#esquema", label: "Esquema", id: "esquema", note: "A escalação no campo" },
  { href: "#elenco", label: "Elenco", id: "elenco", note: "Quem veste a camisa" },
  { href: "#jogos", label: "Jogos", id: "jogos", note: "Resultados, tabela e artilharia" },
  { href: "#redes", label: "Redes", id: "redes", note: "Instagram e TikTok" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return active;
}

/** Botão de menu: duas tiras que viram um X. */
function MenuButton({
  open,
  onClick,
  dark,
}: {
  open: boolean;
  onClick: () => void;
  dark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="menu-geral"
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      className={`relative z-[70] flex h-11 items-center gap-2.5 px-3 font-display text-lg font-black uppercase ${
        open ? "text-white" : dark ? "text-[var(--cal)]" : "text-foreground"
      }`}
    >
      <span className="hidden sm:inline">{open ? "Fechar" : "Menu"}</span>
      <span className="relative block h-3.5 w-7">
        <motion.span
          className="absolute left-0 top-0 h-[3px] w-full bg-current"
          animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        />
        <motion.span
          className="absolute bottom-0 left-0 h-[3px] w-full bg-current"
          animate={
            open ? { rotate: -45, y: -5.5, width: "100%" } : { rotate: 0, y: 0, width: "65%" }
          }
          transition={{ duration: 0.35, ease: EASE }}
        />
      </span>
    </button>
  );
}

function FullMenu({ onClose }: { onClose: () => void }) {
  const { site } = useSite();
  const next = site.nextMatch;
  const reduce = useReducedMotion();

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      id="menu-geral"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[var(--tinta)] text-white"
      initial={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 3.5rem) 2.25rem)" }}
      animate={
        reduce ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 3.5rem) 2.25rem)" }
      }
      exit={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 3.5rem) 2.25rem)" }}
      transition={{ duration: 0.7, ease: EASE }}
      data-lenis-prevent
    >
      <nav aria-label="Seções" className="mx-auto mt-24 w-full max-w-[1400px] flex-1 px-4 sm:px-6">
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.href} className="overflow-hidden border-b-2 border-white/25">
              <motion.a
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  getLenis()?.start();
                  scrollToTarget(l.href);
                }}
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-baseline justify-between gap-4 py-2 sm:py-3"
              >
                <span className="font-stencil text-[clamp(3.2rem,11vw,8rem)] font-black uppercase leading-[0.9] transition-transform duration-500 group-hover:translate-x-4">
                  {l.label}
                </span>
                <span className="hidden max-w-[16rem] text-right font-mono text-sm uppercase text-white/75 md:block">
                  {l.note}
                </span>
              </motion.a>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mx-auto flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-6 px-4 py-8 sm:px-6"
      >
        {next ? (
          <p className="font-mono text-sm uppercase">
            Próximo jogo
            <span className="block font-display text-3xl font-black">× {next.opponent}</span>
          </p>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-5">
          <a
            href={club.social.instagram.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Instagram"
            className="hover:text-[var(--cartao)]"
          >
            <Instagram className="h-7 w-7" />
          </a>
          <a
            href={club.social.tiktok.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="TikTok"
            className="hover:text-[var(--cartao)]"
          >
            <TikTokIcon className="h-7 w-7" />
          </a>
          <a
            href={club.discord}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 bg-[var(--piche)] px-5 py-3 font-display text-lg font-black uppercase"
          >
            <MessageCircle className="h-5 w-5" />
            Discord
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [floating, setFloating] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const active = useActiveSection();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setFloating(y > 80);
    setHidden(y > 240 && y > prev + 2);
    if (y < prev - 2) setHidden(false);
  });

  const dark = floating;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !open ? "-120%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <motion.div
          className="mx-auto flex items-center justify-between"
          animate={
            floating
              ? { maxWidth: 1100, marginTop: 12, paddingLeft: 10, paddingRight: 6 }
              : { maxWidth: 1400, marginTop: 0, paddingLeft: 16, paddingRight: 8 }
          }
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            backgroundColor: floating ? "var(--piche)" : "transparent",
            boxShadow: floating ? "5px 5px 0 var(--tinta)" : "none",
            transition: "background-color .35s, box-shadow .35s",
          }}
        >
          <a href="#top" className="group flex items-center gap-2.5 py-2">
            <motion.img
              src={crest}
              alt=""
              width={800}
              height={800}
              className="h-11 w-11"
              whileHover={{ rotate: -14, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
            />
            <span
              className={`font-stencil text-2xl font-black uppercase leading-none transition-colors ${
                dark ? "text-[var(--cal)]" : "text-foreground"
              }`}
            >
              Driblou <span className="text-[var(--tinta)]">Caiu</span>
            </span>
          </a>

          <ul className="hidden items-center lg:flex">
            {LINKS.map((l) => (
              <li key={l.href} className="relative">
                <a
                  href={l.href}
                  className={`relative z-10 block px-4 py-2 font-display text-lg font-black uppercase transition-colors ${
                    active === l.id
                      ? "text-[var(--piche)]"
                      : dark
                        ? "text-[var(--cal)]/80 hover:text-[var(--cal)]"
                        : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {l.label}
                </a>
                {active === l.id ? (
                  <motion.span
                    layoutId="nav-card"
                    className="absolute inset-0 -rotate-2 bg-[var(--cartao)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <a
              href={club.discord}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden items-center gap-2 bg-[var(--tinta)] px-4 py-2 font-display text-lg font-black uppercase text-white transition-transform hover:-rotate-2 md:inline-flex"
            >
              <MessageCircle className="h-4 w-4" />
              Discord
            </a>
            <span className="lg:hidden">
              <MenuButton open={open} onClick={() => setOpen((v) => !v)} dark={dark} />
            </span>
          </div>
        </motion.div>
        <motion.div
          className="fixed left-0 top-0 h-[3px] w-full origin-left bg-[var(--tinta)]"
          style={{ scaleX: scrollYProgress }}
        />
      </motion.header>

      {open ? (
        <div className="fixed right-2 top-2 z-[70] lg:hidden">
          <MenuButton open onClick={close} dark />
        </div>
      ) : null}
      <AnimatePresence>{open ? <FullMenu onClose={close} /> : null}</AnimatePresence>
    </>
  );
}
