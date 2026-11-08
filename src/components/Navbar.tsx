import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Instagram, Menu, MessageCircle } from "lucide-react";
import crest from "@/assets/crest.webp";
import { club } from "@/data/team";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const LINKS = [
  { href: "#sobre", label: "Clube", id: "sobre" },
  { href: "#esquema", label: "Esquema", id: "esquema" },
  { href: "#elenco", label: "Elenco", id: "elenco" },
  { href: "#jogos", label: "Jogos", id: "jogos" },
  { href: "#redes", label: "Redes", id: "redes" },
];

function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return active;
}

export function Navbar() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const active = useActiveSection();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[var(--piche)] text-[var(--cal)]">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <a href="#top" className="group flex items-center gap-2.5">
          <img
            src={crest}
            alt=""
            width={800}
            height={800}
            className="h-10 w-10 transition-transform duration-300 group-hover:-rotate-12"
          />
          <span className="font-stencil text-2xl uppercase leading-none tracking-tight">
            Driblou<span className="text-[var(--tinta)]"> Caiu</span>
          </span>
        </a>

        <ul className="hidden items-center md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`relative block px-3.5 py-2 font-display text-base uppercase tracking-wide transition-colors ${
                  active === link.id
                    ? "text-[var(--cartao)]"
                    : "text-[var(--cal)]/75 hover:text-[var(--cal)]"
                }`}
              >
                {link.label}
                {active === link.id ? (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-x-3.5 bottom-0.5 h-[3px] bg-[var(--cartao)]"
                  />
                ) : null}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={club.discord}
          target="_blank"
          rel="noreferrer noopener"
          className="hidden items-center gap-2 bg-[var(--tinta)] px-4 py-2 font-display text-base uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 md:inline-flex"
        >
          <MessageCircle className="h-4 w-4" />
          Discord
        </a>

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Abrir menu"
              className="inline-flex h-10 w-10 items-center justify-center text-[var(--cal)] md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="wall flex flex-col border-0">
            <div className="flex items-center gap-2.5">
              <img src={crest} alt="" width={800} height={800} className="h-11 w-11" />
              <SheetTitle className="font-stencil text-2xl uppercase">{club.name}</SheetTitle>
            </div>
            <ul className="mt-8 flex flex-col">
              {LINKS.map((link) => (
                <li key={link.href} className="border-b-2 border-foreground/80">
                  <SheetClose asChild>
                    <a
                      href={link.href}
                      className="block py-3 font-stencil text-4xl uppercase leading-none text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                </li>
              ))}
            </ul>
            <a
              href={club.discord}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 font-display text-lg uppercase text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Entrar no Discord
            </a>
            <div className="mt-auto flex items-center gap-6 pt-6">
              <a
                href={club.social.instagram.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="text-foreground hover:text-primary"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href={club.social.tiktok.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="TikTok"
                className="text-foreground hover:text-primary"
              >
                <TikTokIcon className="h-6 w-6" />
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      <motion.div className="h-[3px] origin-left bg-[var(--tinta)]" style={{ scaleX: progress }} />
    </header>
  );
}
