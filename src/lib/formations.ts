export type FormationId =
  | "4-3-3"
  | "4-4-2"
  | "3-5-2"
  | "4-2-3-1"
  | "3-4-3"
  | "5-3-2"
  | "4-1-4-1";

export type LineRole = "ATA" | "MEI" | "DEF" | "GOL";

export type Slot = { name: string; role: LineRole; x: number; y: number };

export const formations: Record<FormationId, { label: string; blurb: string; slots: Slot[] }> = {
  "4-3-3": {
    label: "4-3-3",
    blurb: "Base do clube: linha de 4 segura, RankThread7162 e peubezerra07 no meio e três lá na frente.",
    slots: [
      { name: "ItzGuiBoy", role: "GOL", x: 50, y: 91 },
      { name: "Paix2007", role: "DEF", x: 86, y: 72 },
      { name: "Dioginho9222", role: "DEF", x: 63, y: 78 },
      { name: "Xchavozinhodopea", role: "DEF", x: 37, y: 78 },
      { name: "dragonjoao10", role: "DEF", x: 14, y: 72 },
      { name: "RankThread7162", role: "MEI", x: 35, y: 50 },
      { name: "peubezerra07", role: "MEI", x: 65, y: 46 },
      { name: "RatingGoat9879", role: "ATA", x: 15, y: 20 },
      { name: "Gommes07", role: "ATA", x: 50, y: 10 },
      { name: "Richardxzs", role: "ATA", x: 85, y: 20 },
    ],
  },
  "4-4-2": {
    label: "4-4-2",
    blurb: "Linha de 4 no meio pra sufocar o corredor central, Gommes07 e Richardxzs de duo lá na frente.",
    slots: [
      { name: "ItzGuiBoy", role: "GOL", x: 50, y: 91 },
      { name: "Paix2007", role: "DEF", x: 86, y: 74 },
      { name: "Dioginho9222", role: "DEF", x: 63, y: 80 },
      { name: "Xchavozinhodopea", role: "DEF", x: 37, y: 80 },
      { name: "dragonjoao10", role: "DEF", x: 14, y: 74 },
      { name: "RankThread7162", role: "MEI", x: 25, y: 54 },
      { name: "peubezerra07", role: "MEI", x: 50, y: 58 },
      { name: "RatingGoat9879", role: "MEI", x: 75, y: 54 },
      { name: "Gommes07", role: "ATA", x: 35, y: 16 },
      { name: "Richardxzs", role: "ATA", x: 65, y: 16 },
    ],
  },
  "3-5-2": {
    label: "3-5-2",
    blurb: "Três atrás e dragonjoao10 desce pra virar 5 no meio quando precisa segurar o jogo.",
    slots: [
      { name: "ItzGuiBoy", role: "GOL", x: 50, y: 91 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 78 },
      { name: "Xchavozinhodopea", role: "DEF", x: 30, y: 80 },
      { name: "Paix2007", role: "DEF", x: 70, y: 80 },
      { name: "RankThread7162", role: "MEI", x: 50, y: 48 },
      { name: "peubezerra07", role: "MEI", x: 28, y: 42 },
      { name: "RatingGoat9879", role: "MEI", x: 72, y: 42 },
      { name: "dragonjoao10", role: "MEI", x: 12, y: 55 },
      { name: "Gommes07", role: "ATA", x: 35, y: 15 },
      { name: "Richardxzs", role: "ATA", x: 65, y: 15 },
    ],
  },
  "4-2-3-1": {
    label: "4-2-3-1",
    blurb: "Xchavozinhodopea e RankThread7162 formam o pivô duplo protegendo a zaga, Gommes07 de referência lá na frente.",
    slots: [
      { name: "ItzGuiBoy", role: "GOL", x: 50, y: 91 },
      { name: "dragonjoao10", role: "DEF", x: 20, y: 76 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 78 },
      { name: "Paix2007", role: "DEF", x: 80, y: 76 },
      { name: "Xchavozinhodopea", role: "MEI", x: 35, y: 58 },
      { name: "RankThread7162", role: "MEI", x: 65, y: 58 },
      { name: "peubezerra07", role: "MEI", x: 15, y: 32 },
      { name: "RatingGoat9879", role: "MEI", x: 50, y: 30 },
      { name: "Richardxzs", role: "MEI", x: 85, y: 32 },
      { name: "Gommes07", role: "ATA", x: 50, y: 10 },
    ],
  },
  "3-4-3": {
    label: "3-4-3",
    blurb: "Três zagueiros e Paix2007 sobe pra formar o ataque de três na hora de pressionar.",
    slots: [
      { name: "ItzGuiBoy", role: "GOL", x: 50, y: 91 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 78 },
      { name: "Xchavozinhodopea", role: "DEF", x: 35, y: 80 },
      { name: "dragonjoao10", role: "DEF", x: 65, y: 80 },
      { name: "RankThread7162", role: "MEI", x: 30, y: 52 },
      { name: "peubezerra07", role: "MEI", x: 50, y: 46 },
      { name: "RatingGoat9879", role: "MEI", x: 70, y: 52 },
      { name: "Paix2007", role: "ATA", x: 25, y: 18 },
      { name: "Gommes07", role: "ATA", x: 50, y: 12 },
      { name: "Richardxzs", role: "ATA", x: 75, y: 18 },
    ],
  },
  "5-3-2": {
    label: "5-3-2",
    blurb: "Cinco na defesa com dragonjoao10 e Paix2007 subindo a linha toda, meio compacto pra sair jogando com calma.",
    slots: [
      { name: "ItzGuiBoy", role: "GOL", x: 50, y: 91 },
      { name: "dragonjoao10", role: "DEF", x: 10, y: 68 },
      { name: "Xchavozinhodopea", role: "DEF", x: 32, y: 80 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 78 },
      { name: "RankThread7162", role: "DEF", x: 68, y: 80 },
      { name: "Paix2007", role: "DEF", x: 90, y: 68 },
      { name: "peubezerra07", role: "MEI", x: 35, y: 46 },
      { name: "RatingGoat9879", role: "MEI", x: 65, y: 46 },
      { name: "Gommes07", role: "ATA", x: 35, y: 15 },
      { name: "Richardxzs", role: "ATA", x: 65, y: 15 },
    ],
  },
  "4-1-4-1": {
    label: "4-1-4-1",
    blurb: "Xchavozinhodopea sozinho na frente da zaga segurando o jogo, linha de 4 no meio e Gommes07 como referência isolada.",
    slots: [
      { name: "ItzGuiBoy", role: "GOL", x: 50, y: 91 },
      { name: "Paix2007", role: "DEF", x: 86, y: 74 },
      { name: "Dioginho9222", role: "DEF", x: 63, y: 80 },
      { name: "dragonjoao10", role: "DEF", x: 37, y: 80 },
      { name: "RankThread7162", role: "DEF", x: 14, y: 74 },
      { name: "Xchavozinhodopea", role: "MEI", x: 50, y: 62 },
      { name: "Richardxzs", role: "MEI", x: 75, y: 38 },
      { name: "RatingGoat9879", role: "MEI", x: 50, y: 38 },
      { name: "peubezerra07", role: "MEI", x: 25, y: 38 },
      { name: "Gommes07", role: "ATA", x: 50, y: 12 },
    ],
  },
};

export const formationIds = Object.keys(formations) as FormationId[];

export function slotsToPositions(slots: Slot[]): Record<string, { x: number; y: number }> {
  const map: Record<string, { x: number; y: number }> = {};
  for (const slot of slots) map[slot.name] = { x: slot.x, y: slot.y };
  return map;
}

export function slotRoles(slots: Slot[]): Record<string, LineRole> {
  const map: Record<string, LineRole> = {};
  for (const slot of slots) map[slot.name] = slot.role;
  return map;
}

export const roleOrder: Array<{ role: LineRole; label: string }> = [
  { role: "ATA", label: "Ataque" },
  { role: "MEI", label: "Meio-campo" },
  { role: "DEF", label: "Defesa" },
  { role: "GOL", label: "Gol" },
];
