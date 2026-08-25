import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Instagram, Menu, MessageCircle } from "lucide-react";
import crest from "@/assets/crest.png";
import { club } from "@/data/team";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LINKS = [
  { href: "#sobre", label: "Clube", id: "sobre" },
  { href: "#esquema", label: "Esquema", id: "esquema" },
  { href: "#elenco", label: "Elenco", id: "elenco" },
  { href: "#amistosos", label: "Amistosos", id: "amistosos" },
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
  const [solid, setSolid] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const active = useActiveSection();
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <motion.div
        className="h-[2px] origin-left bg-gradient-to-r from-primary via-accent to-primary"
        style={{ scaleX: progress }}
      />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="group flex items-center gap-3">
          <img
            src={crest}
            alt=""
            width={800}
            height={800}
            className="h-11 w-11 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 sm:h-12 sm:w-12"
          />
          <div className="leading-none">
            <span className="font-display text-xl uppercase tracking-wide text-foreground sm:text-2xl">
              {club.name}
            </span>
            <span className="mt-1 block h-[3px] w-8 bg-primary" />
          </div>
        </a>

        <ul ref={navRef} className="relative hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href} className="relative">
              <a
                href={link.href}
                className={`relative z-10 block px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                  active === link.id
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
              {active === link.id ? (
                <motion.span
                  layoutId="nav-active-tick"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-x-2 -bottom-0.5 h-[3px] -skew-x-12 bg-accent"
                />
              ) : null}
            </li>
          ))}
        </ul>

        <a
          href={club.discord}
          target="_blank"
          rel="noreferrer noopener"
          className="relative hidden items-center gap-2 overflow-hidden rounded-full bg-primary px-5 py-2.5 font-display text-sm uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 [box-shadow:var(--shadow-red)] md:inline-flex"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ background: "linear-gradient(115deg, transparent 35%, color-mix(in oklab, white 55%, transparent) 50%, transparent 65%)" }}
          />
          <MessageCircle className="relative h-4 w-4" />
          <span className="relative">Discord</span>
        </a>

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Abrir menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col border-border bg-background">
            <div className="flex items-center gap-2.5">
              <img src={crest} alt="" width={800} height={800} className="h-11 w-11" />
              <SheetTitle className="font-display uppercase tracking-wide">{club.name}</SheetTitle>
            </div>
            <ul className="mt-6 flex flex-col gap-1">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <SheetClose asChild>
                    <a
                      href={link.href}
                      className="block rounded-md px-3 py-3 font-display text-2xl uppercase tracking-wide text-foreground transition-colors hover:bg-secondary hover:text-accent"
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
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Entrar no Discord
            </a>
            <div className="mt-auto flex items-center justify-center gap-6 border-t border-border pt-6">
              <a
                href={club.social.instagram.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={club.social.tiktok.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="TikTok"
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
