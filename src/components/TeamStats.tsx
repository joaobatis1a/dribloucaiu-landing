import { useSite } from "@/components/site-context";
import { useCountUp, useReveal } from "@/hooks/use-reveal";

function Stat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.4);
  const n = useCountUp(Math.abs(value), shown);
  return (
    <div ref={ref} className="px-4 py-6 sm:px-6">
      <div className="font-stencil text-6xl font-black leading-none tabular-nums md:text-7xl">
        {value < 0 ? "−" : value > 0 && label.startsWith("Saldo") ? "+" : ""}
        {n}
        {suffix}
      </div>
      <div className="mt-2 font-mono text-xs uppercase text-white/80">{label}</div>
    </div>
  );
}

/** Os números do clube pintados num muro vermelho. */
export function TeamStats() {
  const { team } = useSite();
  return (
    <section id="numeros" aria-label="Números do clube" className="bg-[var(--tinta)] text-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-white/25 px-2 sm:grid-cols-3 sm:px-0 md:grid-cols-5 md:divide-x">
        <Stat label="Jogos" value={team.played} />
        <Stat label="Vitórias" value={team.won} />
        <Stat label="Gols marcados" value={team.gf} />
        <Stat label="Saldo de gols" value={team.gd} />
        <Stat label="Aproveitamento" value={team.rate} suffix="%" />
      </div>
    </section>
  );
}
