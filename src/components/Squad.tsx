import { PlayerCard } from "@/components/PlayerCard";
import { SectionTitle } from "@/components/SectionTitle";
import { useSite } from "@/components/site-context";

/** O elenco como página de álbum de figurinhas. */
export function Squad() {
  const { players } = useSite();
  return (
    <section id="elenco" className="bg-[var(--papel)]">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 md:py-28">
        <SectionTitle
          kicker={`Álbum ${new Date().getFullYear()} · ${players.length} figurinhas`}
          title="Elenco"
        />
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          Toque na figurinha pra ver a ficha.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-5">
          {players.map((player, i) => (
            <PlayerCard
              key={player.id}
              player={player}
              code={`DRI ${String(i + 1).padStart(2, "0")}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
