export type Outcome = "V" | "E" | "D";

export function matchOutcome(goalsFor: number, goalsAgainst: number): Outcome {
  if (goalsFor > goalsAgainst) return "V";
  if (goalsFor === goalsAgainst) return "E";
  return "D";
}

export const outcomeStyles: Record<Outcome, { label: string; className: string }> = {
  V: { label: "V", className: "bg-accent text-accent-foreground" },
  E: { label: "E", className: "bg-secondary text-foreground" },
  D: { label: "D", className: "bg-primary text-primary-foreground" },
};

export type RatingTier = "icon" | "gold" | "silver" | "bronze";

export function ratingTier(overall: number): RatingTier {
  if (overall >= 89) return "icon";
  if (overall >= 80) return "gold";
  if (overall >= 70) return "silver";
  return "bronze";
}

export const ratingTierStyles: Record<
  RatingTier,
  { label: string; card: string; rating: string; glow: string }
> = {
  icon: {
    label: "Ícone",
    card: "from-[color-mix(in_oklab,var(--accent)_38%,var(--card))] via-card to-card",
    rating: "text-accent",
    glow: "var(--shadow-glow)",
  },
  gold: {
    label: "Ouro",
    card: "from-[color-mix(in_oklab,var(--gold)_28%,var(--card))] via-card to-card",
    rating: "text-[color:var(--gold)]",
    glow: "0 18px 45px -22px color-mix(in oklab, var(--gold) 55%, transparent)",
  },
  silver: {
    label: "Prata",
    card: "from-[color-mix(in_oklab,var(--steel)_24%,var(--card))] via-card to-card",
    rating: "text-[color:var(--steel)]",
    glow: "0 18px 45px -22px color-mix(in oklab, var(--steel) 45%, transparent)",
  },
  bronze: {
    label: "Bronze",
    card: "from-[color-mix(in_oklab,var(--bronze)_28%,var(--card))] via-card to-card",
    rating: "text-[color:var(--bronze)]",
    glow: "0 18px 45px -22px color-mix(in oklab, var(--bronze) 50%, transparent)",
  },
};

export const positionNames: Record<string, string> = {
  GOL: "Goleiro",
  ZAG: "Zagueiro",
  LE: "Lateral esquerdo",
  LD: "Lateral direito",
  VOL: "Volante",
  MC: "Meio-campo",
  MEI: "Meia-atacante",
  PE: "Ponta esquerda",
  PD: "Ponta direita",
  ATA: "Atacante",
};
