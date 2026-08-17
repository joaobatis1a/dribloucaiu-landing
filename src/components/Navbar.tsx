import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu } from "lucide-react";
import crest from "@/assets/crest.png";
import { club } from "@/data/team";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LINKS = [
  { href: "#sobre", label: "Clube" },
  { href: "#esquema", label: "Esquema" },
  { href: "#elenco", label: "Elenco" },
  { href: "#resultados", label: "Resultados" },
  { href: "#tabela", label: "Tabela" },
];

export function Navbar() {
  const [solid, setSolid] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

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
        <a href="#top" className="flex items-center gap-2.5">
          <img src={crest} alt="" width={816} height={816} className="h-8 w-8" />
          <span className="font-display text-lg uppercase tracking-wide text-foreground">
            {club.name}
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={club.discord}
          className="hidden rounded-md bg-primary px-5 py-2 font-display text-sm uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 md:inline-flex"
        >
          Discord
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
          <SheetContent side="right" className="border-border bg-background">
            <SheetTitle className="font-display uppercase tracking-wide">{club.name}</SheetTitle>
            <ul className="mt-8 flex flex-col gap-1">
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
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground"
            >
              Entrar no Discord
            </a>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
