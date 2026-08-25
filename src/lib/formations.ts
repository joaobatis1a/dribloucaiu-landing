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
    blurb: "Base do clube: saída curta pelo meio e dois pontas abertos no limite da linha.",
    slots: [
      { name: "Caio", role: "GOL", x: 50, y: 91 },
      { name: "Tiago", role: "DEF", x: 86, y: 72 },
      { name: "Bruno", role: "DEF", x: 63, y: 78 },
      { name: "Léo", role: "DEF", x: 37, y: 78 },
      { name: "Rafa", role: "DEF", x: 14, y: 72 },
      { name: "Vitor", role: "MEI", x: 50, y: 57 },
      { name: "Igor", role: "MEI", x: 29, y: 44 },
      { name: "Nando", role: "MEI", x: 71, y: 39 },
      { name: "Kaká", role: "ATA", x: 85, y: 20 },
      { name: "Zeca", role: "ATA", x: 50, y: 10 },
      { name: "Duda", role: "ATA", x: 15, y: 20 },
    ],
  },
  "4-4-2": {
    label: "4-4-2",
    blurb: "Linha de 4 no meio pra sufocar o corredor central, Duda e Zeca de duo lá na frente.",
    slots: [
      { name: "Caio", role: "GOL", x: 50, y: 91 },
      { name: "Tiago", role: "DEF", x: 86, y: 74 },
      { name: "Bruno", role: "DEF", x: 63, y: 80 },
      { name: "Léo", role: "DEF", x: 37, y: 80 },
      { name: "Rafa", role: "DEF", x: 14, y: 74 },
      { name: "Kaká", role: "MEI", x: 84, y: 52 },
      { name: "Vitor", role: "MEI", x: 60, y: 56 },
      { name: "Igor", role: "MEI", x: 40, y: 56 },
      { name: "Nando", role: "MEI", x: 16, y: 50 },
      { name: "Duda", role: "ATA", x: 35, y: 16 },
      { name: "Zeca", role: "ATA", x: 65, y: 16 },
    ],
  },
  "3-5-2": {
    label: "3-5-2",
    blurb: "Três zagueiros e alas subindo a linha toda pra virar 5 no meio quando precisa.",
    slots: [
      { name: "Caio", role: "GOL", x: 50, y: 91 },
      { name: "Tiago", role: "DEF", x: 70, y: 80 },
      { name: "Bruno", role: "DEF", x: 50, y: 82 },
      { name: "Léo", role: "DEF", x: 30, y: 80 },
      { name: "Kaká", role: "MEI", x: 88, y: 55 },
      { name: "Igor", role: "MEI", x: 28, y: 42 },
      { name: "Vitor", role: "MEI", x: 50, y: 48 },
      { name: "Nando", role: "MEI", x: 72, y: 42 },
      { name: "Rafa", role: "MEI", x: 12, y: 55 },
      { name: "Duda", role: "ATA", x: 35, y: 15 },
      { name: "Zeca", role: "ATA", x: 65, y: 15 },
    ],
  },
  "4-2-3-1": {
    label: "4-2-3-1",
    blurb: "Pivô duplo protegendo a zaga e Nando armando entre linhas pro Zeca de referência.",
    slots: [
      { name: "Caio", role: "GOL", x: 50, y: 91 },
      { name: "Tiago", role: "DEF", x: 86, y: 74 },
      { name: "Bruno", role: "DEF", x: 63, y: 80 },
      { name: "Léo", role: "DEF", x: 37, y: 80 },
      { name: "Rafa", role: "DEF", x: 14, y: 74 },
      { name: "Vitor", role: "MEI", x: 35, y: 58 },
      { name: "Igor", role: "MEI", x: 65, y: 58 },
      { name: "Duda", role: "MEI", x: 15, y: 32 },
      { name: "Nando", role: "MEI", x: 50, y: 30 },
      { name: "Kaká", role: "MEI", x: 85, y: 32 },
      { name: "Zeca", role: "ATA", x: 50, y: 10 },
    ],
  },
  "3-4-3": {
    label: "3-4-3",
    blurb: "Três zagueiros puros e alas avançados, virando um ataque de três na hora de pressionar.",
    slots: [
      { name: "Caio", role: "GOL", x: 50, y: 91 },
      { name: "Tiago", role: "DEF", x: 65, y: 80 },
      { name: "Bruno", role: "DEF", x: 50, y: 82 },
      { name: "Léo", role: "DEF", x: 35, y: 80 },
      { name: "Kaká", role: "MEI", x: 88, y: 58 },
      { name: "Igor", role: "MEI", x: 38, y: 50 },
      { name: "Vitor", role: "MEI", x: 62, y: 50 },
      { name: "Rafa", role: "MEI", x: 12, y: 58 },
      { name: "Duda", role: "ATA", x: 25, y: 18 },
      { name: "Zeca", role: "ATA", x: 50, y: 12 },
      { name: "Nando", role: "ATA", x: 75, y: 18 },
    ],
  },
  "5-3-2": {
    label: "5-3-2",
    blurb: "Cinco na defesa com alas subindo a linha toda, meio compacto pra sair jogando com calma.",
    slots: [
      { name: "Caio", role: "GOL", x: 50, y: 91 },
      { name: "Rafa", role: "DEF", x: 10, y: 68 },
      { name: "Léo", role: "DEF", x: 32, y: 80 },
      { name: "Bruno", role: "DEF", x: 50, y: 83 },
      { name: "Tiago", role: "DEF", x: 68, y: 80 },
      { name: "Kaká", role: "DEF", x: 90, y: 68 },
      { name: "Igor", role: "MEI", x: 30, y: 48 },
      { name: "Vitor", role: "MEI", x: 50, y: 45 },
      { name: "Nando", role: "MEI", x: 70, y: 48 },
      { name: "Duda", role: "ATA", x: 35, y: 15 },
      { name: "Zeca", role: "ATA", x: 65, y: 15 },
    ],
  },
  "4-1-4-1": {
    label: "4-1-4-1",
    blurb: "Vitor sozinho na frente da zaga segurando o jogo, linha de 4 no meio e Zeca como referência isolada.",
    slots: [
      { name: "Caio", role: "GOL", x: 50, y: 91 },
      { name: "Tiago", role: "DEF", x: 86, y: 74 },
      { name: "Bruno", role: "DEF", x: 63, y: 80 },
      { name: "Léo", role: "DEF", x: 37, y: 80 },
      { name: "Rafa", role: "DEF", x: 14, y: 74 },
      { name: "Vitor", role: "MEI", x: 50, y: 62 },
      { name: "Kaká", role: "MEI", x: 84, y: 40 },
      { name: "Nando", role: "MEI", x: 61, y: 38 },
      { name: "Igor", role: "MEI", x: 39, y: 38 },
      { name: "Duda", role: "MEI", x: 16, y: 40 },
      { name: "Zeca", role: "ATA", x: 50, y: 12 },
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
