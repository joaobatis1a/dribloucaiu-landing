import type { Player } from "@/data/team";

type Coord = { x: number; y: number };

// Percentage coordinates on a vertical pitch (0,0 = top-left, own goal at y=100).
const SLOTS: Record<string, Coord | Coord[]> = {
  GOL: { x: 50, y: 91 },
  ZAG: [
    { x: 37, y: 78 },
    { x: 63, y: 78 },
  ],
  LE: { x: 14, y: 72 },
  LD: { x: 86, y: 72 },
  VOL: { x: 50, y: 57 },
  MC: { x: 29, y: 44 },
  MEI: { x: 71, y: 39 },
  PE: { x: 15, y: 20 },
  PD: { x: 85, y: 20 },
  ATA: { x: 50, y: 10 },
};

export function formationLayout(players: Player[]): Array<Player & Coord> {
  const cursor: Record<string, number> = {};
  return players.map((player) => {
    const slot = SLOTS[player.position];
    if (Array.isArray(slot)) {
      const i = cursor[player.position] ?? 0;
      cursor[player.position] = i + 1;
      const coord = slot[i % slot.length]!;
      return { ...player, ...coord };
    }
    const coord = slot ?? { x: 50, y: 50 };
    return { ...player, ...coord };
  });
}
