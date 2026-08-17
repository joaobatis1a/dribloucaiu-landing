import crest from "@/assets/crest.png";
import { club } from "@/data/team";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <img src={crest} alt="" loading="lazy" width={816} height={816} className="h-12 w-12" />
          <div>
            <p className="font-display text-xl uppercase tracking-wide text-foreground">{club.name}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{club.tagline}</p>
          </div>
        </div>
        <a
          href={club.discord}
          className="rounded-md border border-border px-5 py-2.5 font-display text-sm uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Discord do clube
        </a>
      </div>
    </footer>
  );
}
