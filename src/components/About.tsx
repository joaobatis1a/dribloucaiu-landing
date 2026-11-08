import { club } from "@/data/team";
import { SectionTitle } from "@/components/SectionTitle";

export function About() {
  return (
    <section id="sobre" className="wall">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 md:py-28">
        <SectionTitle kicker="Quem somos" title="O clube" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <p className="max-w-3xl text-2xl leading-snug text-foreground md:text-[2rem] md:leading-[1.25]">
            {club.about}
          </p>

          <div>
            <p className="font-mono text-sm uppercase text-muted-foreground">Regras da casa</p>
            <ul className="mt-3 border-t-2 border-foreground">
              {club.rules.map((rule) => (
                <li
                  key={rule}
                  className="flex items-center gap-3 border-b-2 border-foreground py-3 font-display text-2xl uppercase"
                >
                  <span className="h-3 w-3 shrink-0 bg-primary" aria-hidden />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 font-stencil text-[clamp(2.75rem,8vw,6rem)] font-black uppercase leading-[0.85] text-primary">
          {club.motto}
        </p>
      </div>
    </section>
  );
}
