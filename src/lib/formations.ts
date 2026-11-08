export type FormationId =
  "3-4-1-2" | "4-3-3" | "4-4-2" | "3-5-2" | "4-2-3-1" | "3-4-3" | "5-3-2" | "4-1-4-1";

export type LineRole = "ATA" | "MEI" | "DEF" | "GOL";

/** Posição de um dos 11 slots no campo (x/y em % do campo, y=0 é o ataque). */
export type Slot = { role: LineRole; x: number; y: number };

export const formations: Record<FormationId, { label: string; blurb: string; slots: Slot[] }> = {
  "3-4-1-2": {
    label: "3-4-1-2",
    blurb: "Três na zaga, alas abertos e um meia armando por trás da dupla de ataque.",
    slots: [
      { role: "GOL", x: 50, y: 91 },
      { role: "DEF", x: 50, y: 77 },
      { role: "DEF", x: 28, y: 81 },
      { role: "DEF", x: 72, y: 81 },
      { role: "MEI", x: 12, y: 58 },
      { role: "MEI", x: 35, y: 54 },
      { role: "MEI", x: 65, y: 54 },
      { role: "MEI", x: 88, y: 58 },
      { role: "MEI", x: 50, y: 32 },
      { role: "ATA", x: 35, y: 13 },
      { role: "ATA", x: 65, y: 13 },
    ],
  },
  "4-3-3": {
    label: "4-3-3",
    blurb: "Linha de quatro, meio em triângulo e três na frente apertando a saída.",
    slots: [
      { role: "GOL", x: 50, y: 91 },
      { role: "DEF", x: 86, y: 72 },
      { role: "DEF", x: 63, y: 78 },
      { role: "DEF", x: 37, y: 78 },
      { role: "DEF", x: 14, y: 72 },
      { role: "MEI", x: 25, y: 50 },
      { role: "MEI", x: 50, y: 46 },
      { role: "MEI", x: 75, y: 50 },
      { role: "ATA", x: 25, y: 14 },
      { role: "ATA", x: 50, y: 10 },
      { role: "ATA", x: 75, y: 14 },
    ],
  },
  "4-4-2": {
    label: "4-4-2",
    blurb: "Duas linhas de quatro compactas e dupla de ataque pra puxar o contra-ataque.",
    slots: [
      { role: "GOL", x: 50, y: 91 },
      { role: "DEF", x: 86, y: 74 },
      { role: "DEF", x: 63, y: 80 },
      { role: "DEF", x: 37, y: 80 },
      { role: "DEF", x: 14, y: 74 },
      { role: "MEI", x: 84, y: 52 },
      { role: "MEI", x: 60, y: 56 },
      { role: "MEI", x: 40, y: 56 },
      { role: "MEI", x: 16, y: 52 },
      { role: "ATA", x: 35, y: 16 },
      { role: "ATA", x: 65, y: 16 },
    ],
  },
  "3-5-2": {
    label: "3-5-2",
    blurb: "Três atrás e cinco no meio: os alas sobem a linha inteira.",
    slots: [
      { role: "GOL", x: 50, y: 91 },
      { role: "DEF", x: 50, y: 77 },
      { role: "DEF", x: 28, y: 82 },
      { role: "DEF", x: 72, y: 82 },
      { role: "MEI", x: 10, y: 55 },
      { role: "MEI", x: 90, y: 55 },
      { role: "MEI", x: 50, y: 48 },
      { role: "MEI", x: 30, y: 42 },
      { role: "MEI", x: 70, y: 42 },
      { role: "ATA", x: 35, y: 15 },
      { role: "ATA", x: 65, y: 15 },
    ],
  },
  "4-2-3-1": {
    label: "4-2-3-1",
    blurb: "Dois volantes protegendo, três meias por trás de um centroavante.",
    slots: [
      { role: "GOL", x: 50, y: 91 },
      { role: "DEF", x: 14, y: 74 },
      { role: "DEF", x: 37, y: 79 },
      { role: "DEF", x: 63, y: 79 },
      { role: "DEF", x: 86, y: 74 },
      { role: "MEI", x: 35, y: 58 },
      { role: "MEI", x: 65, y: 58 },
      { role: "MEI", x: 15, y: 32 },
      { role: "MEI", x: 50, y: 30 },
      { role: "MEI", x: 85, y: 32 },
      { role: "ATA", x: 50, y: 10 },
    ],
  },
  "3-4-3": {
    label: "3-4-3",
    blurb: "Três atrás e três na frente: pressão alta o jogo todo.",
    slots: [
      { role: "GOL", x: 50, y: 91 },
      { role: "DEF", x: 50, y: 77 },
      { role: "DEF", x: 35, y: 80 },
      { role: "DEF", x: 65, y: 80 },
      { role: "MEI", x: 15, y: 55 },
      { role: "MEI", x: 35, y: 50 },
      { role: "MEI", x: 60, y: 46 },
      { role: "MEI", x: 85, y: 55 },
      { role: "ATA", x: 25, y: 16 },
      { role: "ATA", x: 50, y: 12 },
      { role: "ATA", x: 75, y: 16 },
    ],
  },
  "5-3-2": {
    label: "5-3-2",
    blurb: "Cinco atrás pra segurar resultado, dois na frente pra matar no contra-ataque.",
    slots: [
      { role: "GOL", x: 50, y: 91 },
      { role: "DEF", x: 10, y: 68 },
      { role: "DEF", x: 30, y: 80 },
      { role: "DEF", x: 50, y: 77 },
      { role: "DEF", x: 70, y: 80 },
      { role: "DEF", x: 90, y: 68 },
      { role: "MEI", x: 30, y: 46 },
      { role: "MEI", x: 50, y: 42 },
      { role: "MEI", x: 70, y: 46 },
      { role: "ATA", x: 35, y: 15 },
      { role: "ATA", x: 65, y: 15 },
    ],
  },
  "4-1-4-1": {
    label: "4-1-4-1",
    blurb: "Um volante fixo entre as linhas e quatro meias chegando na área.",
    slots: [
      { role: "GOL", x: 50, y: 91 },
      { role: "DEF", x: 14, y: 74 },
      { role: "DEF", x: 37, y: 79 },
      { role: "DEF", x: 63, y: 79 },
      { role: "DEF", x: 86, y: 74 },
      { role: "MEI", x: 50, y: 62 },
      { role: "MEI", x: 20, y: 38 },
      { role: "MEI", x: 40, y: 36 },
      { role: "MEI", x: 60, y: 36 },
      { role: "MEI", x: 80, y: 38 },
      { role: "ATA", x: 50, y: 12 },
    ],
  },
};

export const formationIds = Object.keys(formations) as FormationId[];

export const FORMATION_IDS = [
  "3-4-1-2",
  "4-3-3",
  "4-4-2",
  "3-5-2",
  "4-2-3-1",
  "3-4-3",
  "5-3-2",
  "4-1-4-1",
] as const;

export const roleNames: Record<LineRole, string> = {
  GOL: "Goleiro",
  DEF: "Defesa",
  MEI: "Meio-campo",
  ATA: "Ataque",
};
