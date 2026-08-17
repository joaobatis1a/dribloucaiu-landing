import { squad } from "@/data/team";
import { PlayerCard } from "@/components/PlayerCard";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";

export function Squad() {
  return (
    <section id="elenco" className="mx-auto max-w-6xl px-6 py-20">
      <SectionTitle kicker="Squad" title="Elenco" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {squad.map((player, i) => (
          <Reveal key={player.name} delay={(i % 3) * 90}>
            <PlayerCard player={player} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
