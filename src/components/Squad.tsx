import { squad } from "@/data/team";
import { positionBucket } from "@/lib/match";
import { roleOrder } from "@/lib/formations";
import { PlayerRow } from "@/components/PlayerRow";
import { SectionTitle } from "@/components/SectionTitle";

export function Squad() {
  let flatIndex = 0;

  return (
    <section id="elenco" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionTitle kicker="Squad" title="Elenco" />
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
        Onze titular e reservas por função. Clique num jogador pra abrir o raio-x completo.
      </p>

      <div className="mt-10">
        {roleOrder.map(({ role, label }) => {
          const players = squad.filter((p) => positionBucket(p.position) === role);
          if (players.length === 0) return null;
          return (
            <div key={role} className="mb-2">
              <p className="dotted-rule pb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                {label}
              </p>
              <div>
                {players.map((player) => {
                  const row = <PlayerRow key={player.name} player={player} index={flatIndex} />;
                  flatIndex += 1;
                  return row;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
