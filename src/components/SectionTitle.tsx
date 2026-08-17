export function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex items-end gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent">{kicker}</p>
        <h2 className="mt-2 font-display text-4xl uppercase tracking-tight text-foreground md:text-6xl">
          {title}
        </h2>
      </div>
      <div className="mb-3 h-px flex-1 bg-gradient-to-r from-primary to-transparent" />
    </div>
  );
}
