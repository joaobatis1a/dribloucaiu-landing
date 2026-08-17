import { teamStats } from "@/data/team";
import { useCountUp, useReveal } from "@/hooks/use-reveal";

function StatItem({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.4);
  const shownValue = useCountUp(value, shown);

  return (
    <div ref={ref} className="relative px-4 py-6 text-center">
      <div className="font-display text-5xl leading-none text-foreground md:text-6xl">
        {shownValue}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function TeamStats() {
  return (
    <section id="numeros" className="border-b border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border px-6 md:grid-cols-5 md:divide-y-0">
        {teamStats.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
