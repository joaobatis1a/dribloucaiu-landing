export type FormationId =
  | "3-4-1-2"
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
  "3-4-1-2": {
    label: "3-4-1-2",
    blurb: "Esquema principal do clube: dois na zaga segurando, Ratingoat armando por trás da dupla de ataque.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Dioginho9222", role: "DEF", x: 60, y: 83 },
      { name: "Chatuba", role: "DEF", x: 40, y: 83 },
      { name: "Osmo", role: "MEI", x: 12, y: 58 },
      { name: "RankThread7162", role: "MEI", x: 35, y: 52 },
      { name: "PEU XRC", role: "MEI", x: 65, y: 52 },
      { name: "Paix2007", role: "MEI", x: 88, y: 58 },
      { name: "Ratingoat", role: "MEI", x: 50, y: 32 },
      { name: "Gommes07.", role: "ATA", x: 35, y: 13 },
      { name: "Elmamaria pika", role: "ATA", x: 65, y: 13 },
    ],
  },
  "4-3-3": {
    label: "4-3-3",
    blurb: "Linha de 4 segura, RankThread7162, PEU XRC e Ratingoat sustentando o meio.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Paix2007", role: "DEF", x: 86, y: 72 },
      { name: "Dioginho9222", role: "DEF", x: 63, y: 78 },
      { name: "Chatuba", role: "DEF", x: 37, y: 78 },
      { name: "Osmo", role: "DEF", x: 14, y: 72 },
      { name: "RankThread7162", role: "MEI", x: 25, y: 50 },
      { name: "PEU XRC", role: "MEI", x: 50, y: 46 },
      { name: "Ratingoat", role: "MEI", x: 75, y: 50 },
      { name: "Gommes07.", role: "ATA", x: 35, y: 14 },
      { name: "Elmamaria pika", role: "ATA", x: 65, y: 14 },
    ],
  },
  "4-4-2": {
    label: "4-4-2",
    blurb: "Linha de 4 no meio pra sufocar o corredor central, Gommes07. e Elmamaria pika de duo lá na frente.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Chatuba", role: "DEF", x: 80, y: 78 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 77 },
      { name: "Osmo", role: "DEF", x: 20, y: 78 },
      { name: "Paix2007", role: "MEI", x: 84, y: 52 },
      { name: "RankThread7162", role: "MEI", x: 60, y: 56 },
      { name: "PEU XRC", role: "MEI", x: 40, y: 56 },
      { name: "Ratingoat", role: "MEI", x: 16, y: 52 },
      { name: "Gommes07.", role: "ATA", x: 35, y: 16 },
      { name: "Elmamaria pika", role: "ATA", x: 65, y: 16 },
    ],
  },
  "3-5-2": {
    label: "3-5-2",
    blurb: "Três atrás só, todo mundo mais sobe pra virar 5 no meio quando precisa segurar o jogo.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Dioginho9222", role: "DEF", x: 60, y: 82 },
      { name: "Chatuba", role: "DEF", x: 40, y: 82 },
      { name: "Osmo", role: "MEI", x: 10, y: 55 },
      { name: "Paix2007", role: "MEI", x: 90, y: 55 },
      { name: "RankThread7162", role: "MEI", x: 50, y: 48 },
      { name: "PEU XRC", role: "MEI", x: 30, y: 42 },
      { name: "Ratingoat", role: "MEI", x: 70, y: 42 },
      { name: "Gommes07.", role: "ATA", x: 35, y: 15 },
      { name: "Elmamaria pika", role: "ATA", x: 65, y: 15 },
    ],
  },
  "4-2-3-1": {
    label: "4-2-3-1",
    blurb: "Chatuba e RankThread7162 formam o pivô duplo protegendo a zaga, Gommes07. de referência lá na frente.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Osmo", role: "DEF", x: 20, y: 76 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 77 },
      { name: "Paix2007", role: "DEF", x: 80, y: 76 },
      { name: "Chatuba", role: "MEI", x: 35, y: 58 },
      { name: "RankThread7162", role: "MEI", x: 65, y: 58 },
      { name: "PEU XRC", role: "MEI", x: 15, y: 32 },
      { name: "Ratingoat", role: "MEI", x: 50, y: 30 },
      { name: "Elmamaria pika", role: "MEI", x: 85, y: 32 },
      { name: "Gommes07.", role: "ATA", x: 50, y: 10 },
    ],
  },
  "3-4-3": {
    label: "3-4-3",
    blurb: "Três zagueiros e um meio-campo de quatro pra dar apoio nos dois lados.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 77 },
      { name: "Chatuba", role: "DEF", x: 35, y: 80 },
      { name: "Osmo", role: "DEF", x: 65, y: 80 },
      { name: "Paix2007", role: "MEI", x: 85, y: 55 },
      { name: "RankThread7162", role: "MEI", x: 35, y: 50 },
      { name: "PEU XRC", role: "MEI", x: 60, y: 46 },
      { name: "Ratingoat", role: "MEI", x: 15, y: 55 },
      { name: "Gommes07.", role: "ATA", x: 35, y: 16 },
      { name: "Elmamaria pika", role: "ATA", x: 65, y: 16 },
    ],
  },
  "5-3-2": {
    label: "5-3-2",
    blurb: "Quatro na defesa com Osmo e Paix2007 subindo a linha toda, meio compacto pra sair jogando com calma.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Osmo", role: "DEF", x: 12, y: 70 },
      { name: "Chatuba", role: "DEF", x: 34, y: 80 },
      { name: "Dioginho9222", role: "DEF", x: 66, y: 80 },
      { name: "Paix2007", role: "DEF", x: 88, y: 70 },
      { name: "RankThread7162", role: "MEI", x: 30, y: 48 },
      { name: "PEU XRC", role: "MEI", x: 50, y: 44 },
      { name: "Ratingoat", role: "MEI", x: 70, y: 48 },
      { name: "Gommes07.", role: "ATA", x: 35, y: 15 },
      { name: "Elmamaria pika", role: "ATA", x: 65, y: 15 },
    ],
  },
  "4-1-4-1": {
    label: "4-1-4-1",
    blurb: "Chatuba sozinho na frente da zaga segurando o jogo, linha de 4 no meio e Gommes07. como referência isolada.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Osmo", role: "DEF", x: 20, y: 76 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 77 },
      { name: "Paix2007", role: "DEF", x: 80, y: 76 },
      { name: "Chatuba", role: "MEI", x: 50, y: 62 },
      { name: "RankThread7162", role: "MEI", x: 20, y: 38 },
      { name: "PEU XRC", role: "MEI", x: 40, y: 36 },
      { name: "Ratingoat", role: "MEI", x: 60, y: 36 },
      { name: "Elmamaria pika", role: "MEI", x: 80, y: 38 },
      { name: "Gommes07.", role: "ATA", x: 50, y: 12 },
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
