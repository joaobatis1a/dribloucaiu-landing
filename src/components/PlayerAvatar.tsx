const SIZES = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-16 w-16",
} as const;

export function PlayerAvatar({
  photo,
  ring,
  size = "md",
}: {
  photo?: string | undefined;
  ring: string;
  size?: keyof typeof SIZES;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border-2 bg-secondary ${SIZES[size]}`}
      style={{ borderColor: ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${ring} 14%, transparent)` }}
    >
      {photo ? (
        <img src={photo} alt="" className="h-full w-full object-cover" />
      ) : (
        <svg viewBox="0 0 40 40" className="absolute -bottom-1 h-full w-full text-foreground/15" fill="currentColor" aria-hidden>
          <circle cx="20" cy="14" r="7.5" />
          <path d="M3 40c0-10.5 7.6-16 17-16s17 5.5 17 16" />
        </svg>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(125deg, color-mix(in oklab, white 22%, transparent) 0%, transparent 30%, transparent 70%, color-mix(in oklab, black 25%, transparent) 100%)",
        }}
      />
    </div>
  );
}
