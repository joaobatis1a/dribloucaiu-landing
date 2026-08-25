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
      className={`group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-border bg-card/60 px-4 py-7 text-center shadow-[0_20px_50px_-30px_rgba(0,0,0,0.85)] backdrop-blur-sm transition-all duration-700 hover:-translate-y-1 hover:border-accent/40 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={shown ? { boxShadow: "0 20px 50px -30px rgba(0,0,0,0.85)" } : undefined}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(140px circle at 50% 0%, color-mix(in oklab, var(--accent) 20%, transparent), transparent 70%)",
        }}
      />
      <Icon className="relative h-4 w-4 text-primary/70 transition-colors group-hover:text-accent" aria-hidden />
      <div className="relative font-display text-5xl leading-none tabular-nums text-foreground md:text-6xl">
        {shownValue}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="relative text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function TeamStats() {
  return (
    <section id="numeros" className="relative overflow-hidden border-b border-border bg-background py-14">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-3 px-6 sm:grid-cols-3 md:grid-cols-5">
        {teamStats.map((s, i) => (
          <StatItem key={s.label} {...s} Icon={icons[i % icons.length]!} />
        ))}
      </div>
    </section>
  );
}
