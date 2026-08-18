import { squad } from "@/data/team";

const AXES: Array<[keyof (typeof squad)[number]["stats"], string]> = [
  ["pac", "Ritmo"],
  ["sho", "Finalização"],
  ["pas", "Passe"],
  ["dri", "Drible"],
  ["def", "Defesa"],
  ["phy", "Físico"],
];

export function squadDna() {
  return AXES.map(([key, label]) => {
    const total = squad.reduce((sum, p) => sum + p.stats[key], 0);
    return { stat: label, value: Math.round(total / squad.length) };
  });
}
