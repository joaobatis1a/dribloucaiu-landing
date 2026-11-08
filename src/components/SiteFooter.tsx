import crest from "@/assets/crest.webp";
import { club } from "@/data/team";

const NAV_LINKS = [
  { href: "#sobre", label: "Clube" },
  { href: "#esquema", label: "Esquema" },
  { href: "#elenco", label: "Elenco" },
  { href: "#jogos", label: "Jogos" },
  { href: "#redes", label: "Redes" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[var(--piche)] text-[var(--cal)]">
      <div className="paint-stripes h-4" aria-hidden />
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <img src={crest} alt="" width={800} height={800} className="h-20 w-20" />
          <div>
            <p className="font-stencil text-4xl font-black uppercase leading-[0.85]">
              Driblou <span className="text-[var(--tinta)]">Caiu</span>
            </p>
            <p className="mt-2 font-mono text-xs uppercase text-[var(--cal)]/60">
              Desde {club.founded} · {club.platform} · {club.formation}
            </p>
          </div>
        </div>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-display text-xl font-black uppercase hover:text-[var(--cartao)]"
            >
              {l.label}
            </a>
          ))}
          <a
            href={club.discord}
            target="_blank"
            rel="noreferrer noopener"
            className="font-display text-xl font-black uppercase text-[var(--tinta)] hover:text-[var(--cartao)]"
          >
            Discord
          </a>
        </nav>
      </div>
      <p className="mx-auto max-w-[1400px] border-t border-[var(--cal)]/15 px-4 py-5 font-mono text-xs text-[var(--cal)]/50 sm:px-6">
        © {new Date().getFullYear()} {club.name}. Feito pela torcida.
      </p>
    </footer>
  );
}
