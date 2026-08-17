import type { Player } from "@/data/team";

const statLabels: Array<[keyof Player["stats"], string]> = [
  ["pac", "RIT"],
  ["sho", "FIN"],
  ["pas", "PAS"],
  ["dri", "DRI"],
  ["def", "DEF"],
  ["phy", "FÍS"],
];

export function PlayerCard({ player, index }: { player: Player; index: number }) {
  return (
    <article
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-transform duration-300 will-change-transform hover:-translate-y-2 hover:[transform:perspective(900px)_rotateX(4deg)_translateY(-8px)]"
      style={{ animationDelay: `${index * 60}ms`, background: "var(--gradient-card)" }}
    >
      <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [box-shadow:var(--shadow-glow)]" />
      <span className="pointer-events-none absolute -right-10 top-0 h-full w-24 rotate-12 bg-primary/10" />

      <header className="relative flex items-start justify-between">
        <div>
          <div className="font-display text-5xl leading-none text-accent">{player.overall}</div>
          <div className="mt-1 text-xs font-semibold tracking-[0.2em] text-muted-foreground">
            {player.position}
          </div>
        </div>
        <div className="h-8 w-1.5 rounded-full bg-primary" />
      </header>

      <h3 className="relative mt-5 font-display text-2xl uppercase tracking-wide text-foreground">
        {player.name}
      </h3>

      <dl className="relative mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
        {statLabels.map(([key, label]) => (
          <div key={key}>
            <div className="flex items-baseline justify-between text-[11px] font-semibold tracking-widest text-muted-foreground">
              <dt>{label}</dt>
              <dd className="text-foreground">{player.stats[key]}</dd>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700 group-hover:bg-accent"
                style={{ width: `${player.stats[key]}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
    </article>
  );
}
