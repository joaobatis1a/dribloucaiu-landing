import { Gamepad2, Percent, Target, Trophy, Zap } from "lucide-react";
import { teamStats } from "@/data/team";
import { useCountUp, useReveal } from "@/hooks/use-reveal";

const icons = [Gamepad2, Trophy, Target, Zap, Percent];

function StatItem({
  label,
  value,
  suffix,
  Icon,
}: {
  label: string;
  value: number;
  suffix: string;
  Icon: (typeof icons)[number];
}) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.4);
  const shownValue = useCountUp(value, shown);

  return (
    <div
      ref={ref}
      className={`group relative flex flex-col items-center gap-2 px-4 py-7 text-center transition-all duration-700 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Icon className="h-4 w-4 text-primary/70 transition-colors group-hover:text-accent" aria-hidden />
      <div className="font-display text-5xl leading-none tabular-nums text-foreground md:text-6xl">
        {shownValue}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function TeamStats() {
  return (
    <section id="numeros" className="border-b border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border px-6 md:grid-cols-5 md:divide-y-0">
        {teamStats.map((s, i) => (
          <StatItem key={s.label} {...s} Icon={icons[i % icons.length]!} />
        ))}
      </div>
    </section>
  );
}
