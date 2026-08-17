import crest from "@/assets/crest.png";
import { club } from "@/data/team";

export function Hero() {
  return (
    <header className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="hud-grid absolute inset-0 -z-10 opacity-40" />
      <div className="hud-scan absolute inset-0 -z-10 opacity-60" />
      <div className="animate-hud-pulse absolute -top-40 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pb-24 pt-20 text-center md:flex-row md:pb-32 md:pt-28 md:text-left">
        <img
          src={crest}
          alt="Escudo do Driblou Caiu"
          width={816}
          height={816}
          className="animate-hud-pulse h-40 w-40 shrink-0 drop-shadow-[0_20px_45px_rgba(220,38,38,0.45)] md:h-56 md:w-56"
        />

        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {club.tagline}
          </p>
          <h1 className="mt-5 font-display text-6xl uppercase leading-[0.85] tracking-tight text-foreground sm:text-8xl lg:text-9xl">
            Driblou
            <span className="block text-primary">Caiu</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">
            Clube de Pro Clubs no EA FC 26. Elenco entrosado, pressão alta e uma temporada
            construída em cima de amistosos e liga.
          </p>
          <a
            href="#elenco"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3 font-display text-lg uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 [box-shadow:var(--shadow-red)]"
          >
            Ver elenco
          </a>
        </div>
      </div>

      <div className="skew-band relative overflow-hidden border-y border-border bg-primary/90 py-2">
        <div className="animate-ticker flex w-max gap-8 whitespace-nowrap font-display text-sm uppercase tracking-[0.35em] text-primary-foreground">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              Driblou Caiu <span className="text-accent">•</span> EA FC 26 Pro Clubs
              <span className="text-accent">•</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
