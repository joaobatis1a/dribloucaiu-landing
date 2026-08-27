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

/** name null = vaga aberta (nenhum jogador do elenco cobre essa posição nesse esquema). */
export type Slot = { name: string | null; role: LineRole; x: number; y: number };

export const formations: Record<FormationId, { label: string; blurb: string; slots: Slot[] }> = {
  "3-4-1-2": {
    label: "3-4-1-2",
    blurb: "Esquema principal do clube: três na zaga segurando, Ratingoat armando por trás da dupla de ataque.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 77 },
      { name: "Chatuba", role: "DEF", x: 28, y: 81 },
      { name: "RankThread7162", role: "DEF", x: 72, y: 81 },
      { name: "PEU XRC", role: "MEI", x: 12, y: 58 },
      { name: "Paix2007", role: "MEI", x: 35, y: 54 },
      { name: null, role: "MEI", x: 65, y: 54 },
      { name: "Elmamaria pika", role: "MEI", x: 88, y: 58 },
      { name: "Ratingoat", role: "MEI", x: 50, y: 32 },
      { name: "Osmo", role: "ATA", x: 35, y: 13 },
      { name: "Gommes07.", role: "ATA", x: 65, y: 13 },
    ],
  },
  "4-3-3": {
    label: "4-3-3",
    blurb: "PEU XRC e RankThread7162 nas laterais, Ratingoat, Paix2007 e Elmamaria pika sustentando o meio.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "RankThread7162", role: "DEF", x: 86, y: 72 },
      { name: "Dioginho9222", role: "DEF", x: 63, y: 78 },
      { name: "Chatuba", role: "DEF", x: 37, y: 78 },
      { name: "PEU XRC", role: "DEF", x: 14, y: 72 },
      { name: "Elmamaria pika", role: "MEI", x: 25, y: 50 },
      { name: "Paix2007", role: "MEI", x: 50, y: 46 },
      { name: "Ratingoat", role: "MEI", x: 75, y: 50 },
      { name: "Osmo", role: "ATA", x: 25, y: 14 },
      { name: "Gommes07.", role: "ATA", x: 50, y: 10 },
      { name: null, role: "ATA", x: 75, y: 14 },
    ],
  },
  "4-4-2": {
    label: "4-4-2",
    blurb: "Linha de 4 com PEU XRC e RankThread7162 nas laterais, Osmo e Gommes07. de duo lá na frente.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "RankThread7162", role: "DEF", x: 86, y: 74 },
      { name: "Dioginho9222", role: "DEF", x: 63, y: 80 },
      { name: "Chatuba", role: "DEF", x: 37, y: 80 },
      { name: "PEU XRC", role: "DEF", x: 14, y: 74 },
      { name: null, role: "MEI", x: 84, y: 52 },
      { name: "Elmamaria pika", role: "MEI", x: 60, y: 56 },
      { name: "Paix2007", role: "MEI", x: 40, y: 56 },
      { name: "Ratingoat", role: "MEI", x: 16, y: 52 },
      { name: "Osmo", role: "ATA", x: 35, y: 16 },
      { name: "Gommes07.", role: "ATA", x: 65, y: 16 },
    ],
  },
  "3-5-2": {
    label: "3-5-2",
    blurb: "Três atrás, PEU XRC e Elmamaria pika sobem a linha toda pra virar 5 no meio.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 77 },
      { name: "Chatuba", role: "DEF", x: 28, y: 82 },
      { name: "RankThread7162", role: "DEF", x: 72, y: 82 },
      { name: "PEU XRC", role: "MEI", x: 10, y: 55 },
      { name: "Elmamaria pika", role: "MEI", x: 90, y: 55 },
      { name: "Ratingoat", role: "MEI", x: 50, y: 48 },
      { name: "Paix2007", role: "MEI", x: 30, y: 42 },
      { name: null, role: "MEI", x: 70, y: 42 },
      { name: "Osmo", role: "ATA", x: 35, y: 15 },
      { name: "Gommes07.", role: "ATA", x: 65, y: 15 },
    ],
  },
  "4-2-3-1": {
    label: "4-2-3-1",
    blurb: "Elmamaria pika e Ratingoat formam o pivô duplo, Osmo entra na função de meia pra dar apoio, Gommes07. de referência lá na frente.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "PEU XRC", role: "DEF", x: 14, y: 74 },
      { name: "Chatuba", role: "DEF", x: 37, y: 79 },
      { name: "Dioginho9222", role: "DEF", x: 63, y: 79 },
      { name: "RankThread7162", role: "DEF", x: 86, y: 74 },
      { name: "Elmamaria pika", role: "MEI", x: 35, y: 58 },
      { name: "Ratingoat", role: "MEI", x: 65, y: 58 },
      { name: "Paix2007", role: "MEI", x: 15, y: 32 },
      { name: "Osmo", role: "MEI", x: 50, y: 30 },
      { name: null, role: "MEI", x: 85, y: 32 },
      { name: "Gommes07.", role: "ATA", x: 50, y: 10 },
    ],
  },
  "3-4-3": {
    label: "3-4-3",
    blurb: "Três zagueiros e um meio-campo de quatro, com Osmo abrindo a ponta esquerda e Gommes07. de centroavante.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 77 },
      { name: "Chatuba", role: "DEF", x: 35, y: 80 },
      { name: "RankThread7162", role: "DEF", x: 65, y: 80 },
      { name: "PEU XRC", role: "MEI", x: 15, y: 55 },
      { name: "Paix2007", role: "MEI", x: 35, y: 50 },
      { name: "Ratingoat", role: "MEI", x: 60, y: 46 },
      { name: "Elmamaria pika", role: "MEI", x: 85, y: 55 },
      { name: "Osmo", role: "ATA", x: 25, y: 16 },
      { name: "Gommes07.", role: "ATA", x: 50, y: 12 },
      { name: null, role: "ATA", x: 75, y: 16 },
    ],
  },
  "5-3-2": {
    label: "5-3-2",
    blurb: "Cinco na defesa com PEU XRC e Elmamaria pika subindo a linha toda, meio compacto pra sair jogando com calma.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "PEU XRC", role: "DEF", x: 10, y: 68 },
      { name: "Chatuba", role: "DEF", x: 30, y: 80 },
      { name: "Dioginho9222", role: "DEF", x: 50, y: 77 },
      { name: "RankThread7162", role: "DEF", x: 70, y: 80 },
      { name: "Elmamaria pika", role: "DEF", x: 90, y: 68 },
      { name: "Ratingoat", role: "MEI", x: 30, y: 46 },
      { name: null, role: "MEI", x: 50, y: 42 },
      { name: "Paix2007", role: "MEI", x: 70, y: 46 },
      { name: "Osmo", role: "ATA", x: 35, y: 15 },
      { name: "Gommes07.", role: "ATA", x: 65, y: 15 },
    ],
  },
  "4-1-4-1": {
    label: "4-1-4-1",
    blurb: "Elmamaria pika sozinho na frente da zaga segurando o jogo, linha de 4 no meio e Gommes07. como referência isolada.",
    slots: [
      { name: "Gui Araújo", role: "GOL", x: 50, y: 91 },
      { name: "PEU XRC", role: "DEF", x: 14, y: 74 },
      { name: "Chatuba", role: "DEF", x: 37, y: 79 },
      { name: "Dioginho9222", role: "DEF", x: 63, y: 79 },
      { name: "RankThread7162", role: "DEF", x: 86, y: 74 },
      { name: "Elmamaria pika", role: "MEI", x: 50, y: 62 },
      { name: "Paix2007", role: "MEI", x: 20, y: 38 },
      { name: "Ratingoat", role: "MEI", x: 40, y: 36 },
      { name: "Osmo", role: "MEI", x: 60, y: 36 },
      { name: null, role: "MEI", x: 80, y: 38 },
      { name: "Gommes07.", role: "ATA", x: 50, y: 12 },
    ],
  },
};

export const formationIds = Object.keys(formations) as FormationId[];

export function slotsToPositions(slots: Slot[]): Record<string, { x: number; y: number }> {
  const map: Record<string, { x: number; y: number }> = {};
  for (const slot of slots) if (slot.name) map[slot.name] = { x: slot.x, y: slot.y };
  return map;
}

export function slotRoles(slots: Slot[]): Record<string, LineRole> {
  const map: Record<string, LineRole> = {};
  for (const slot of slots) if (slot.name) map[slot.name] = slot.role;
  return map;
}

export const roleOrder: Array<{ role: LineRole; label: string }> = [
  { role: "ATA", label: "Ataque" },
  { role: "MEI", label: "Meio-campo" },
  { role: "DEF", label: "Defesa" },
  { role: "GOL", label: "Gol" },
];
