import {
  COMPETITIONS,
  type Lineup,
  type LineupSlot,
  type Match,
  type Player,
  type SiteData,
} from "@/lib/site-schema";
import type { LineRole } from "@/lib/formations";
import { matchOutcome, positionBucket } from "@/lib/match";

export function sortedMatches(site: SiteData): Match[] {
  return [...site.matches].sort((a, b) => b.date.localeCompare(a.date));
}

export function teamTotals(site: SiteData) {
  const b = site.baseline;
  let { played, won, drawn, lost, gf, ga } = b;
  for (const m of site.matches) {
    played++;
    gf += m.goalsFor;
    ga += m.goalsAgainst;
    const o = matchOutcome(m.goalsFor, m.goalsAgainst);
    if (o === "V") won++;
    else if (o === "E") drawn++;
    else lost++;
  }
  const rate = played > 0 ? Math.round(((won * 3 + drawn) / (played * 3)) * 100) : 0;
  return { played, won, drawn, lost, gf, ga, gd: gf - ga, rate };
}

export type PlayerTotals = {
  games: number;
  goals: number;
  assists: number;
  motm: number;
  /** Só das partidas lançadas no site (sem o histórico anterior). */
  tracked: { games: number; goals: number; assists: number };
};

const zero = (): PlayerTotals => ({
  games: 0,
  goals: 0,
  assists: 0,
  motm: 0,
  tracked: { games: 0, goals: 0, assists: 0 },
});

/** Histórico anterior do jogador + tudo que foi lançado nas partidas. */
export function playerTotals(site: SiteData): Record<string, PlayerTotals> {
  const out: Record<string, PlayerTotals> = {};
  for (const p of site.players) {
    out[p.id] = {
      ...zero(),
      games: p.history.games,
      goals: p.history.goals,
      assists: p.history.assists,
    };
  }
  const get = (id: string) => (out[id] ??= zero());
  for (const m of site.matches) {
    const involved = new Set([...m.played, ...m.scorers.map((s) => s.playerId)]);
    for (const id of involved) {
      const t = get(id);
      t.games++;
      t.tracked.games++;
    }
    for (const s of m.scorers) {
      const t = get(s.playerId);
      t.goals += s.goals;
      t.assists += s.assists;
      t.tracked.goals += s.goals;
      t.tracked.assists += s.assists;
    }
    if (m.motm) get(m.motm).motm++;
  }
  return out;
}

export function topBy(
  players: Player[],
  totals: Record<string, PlayerTotals>,
  key: "goals" | "assists",
) {
  return players
    .map((p) => ({ player: p, value: totals[p.id]?.[key] ?? 0 }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

/** Recordes e sequência do clube, só nas partidas lançadas (o histórico anterior não tem placares). */
export function clubRecords(site: SiteData) {
  const list = sortedMatches(site);
  const outcome = (m: Match) => matchOutcome(m.goalsFor, m.goalsAgainst);

  let streak: { kind: "V" | "E" | "D"; count: number } | null = null;
  for (const m of list) {
    const o = outcome(m);
    if (!streak) streak = { kind: o, count: 1 };
    else if (streak.kind === o) streak.count++;
    else break;
  }

  const wins = list.filter((m) => outcome(m) === "V");
  const losses = list.filter((m) => outcome(m) === "D");
  const margin = (m: Match) => Math.abs(m.goalsFor - m.goalsAgainst);
  const biggestWin =
    wins.sort((a, b) => margin(b) - margin(a) || b.goalsFor - a.goalsFor)[0] ?? null;
  const biggestLoss = losses.sort((a, b) => margin(b) - margin(a))[0] ?? null;

  const byCompetition = COMPETITIONS.map((c) => {
    const ms = list.filter((m) => m.competition === c);
    return {
      competition: c,
      played: ms.length,
      won: ms.filter((m) => outcome(m) === "V").length,
      drawn: ms.filter((m) => outcome(m) === "E").length,
      lost: ms.filter((m) => outcome(m) === "D").length,
      gf: ms.reduce((n, m) => n + m.goalsFor, 0),
      ga: ms.reduce((n, m) => n + m.goalsAgainst, 0),
    };
  }).filter((c) => c.played > 0);

  return { streak, biggestWin, biggestLoss, byCompetition, tracked: list.length };
}

const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

/** "2026-08-14" -> { day: "14", month: "AGO", full: "14 AGO 2026" } */
export function dateParts(iso: string) {
  const [y, m, d] = iso.split("-");
  const month = MONTHS[Number(m) - 1] ?? "";
  return { day: d ?? "", month, year: y ?? "", full: `${d} ${month} ${y}` };
}

/** Camisa mostrada no slot: a do jogador escalado; sem jogador, o número do próprio slot. */
export function slotNumber(slot: LineupSlot, players: Player[]): number {
  const p = slot.playerId ? players.find((x) => x.id === slot.playerId) : undefined;
  return p ? p.number : slot.number;
}

/** O jogador cobre esse setor com a posição principal ou com alguma das outras? */
export function coversRole(player: Player, role: LineRole): boolean {
  return [player.position, ...player.altPositions].some((pos) => positionBucket(pos) === role);
}

/** Camisas repetidas entre os escalados (campo e banco). */
export function duplicateNumbers(lineup: Lineup, players: Player[]): number[] {
  const ids = [...lineup.slots.map((s) => s.playerId), ...lineup.bench].filter(
    (id): id is string => !!id,
  );
  const seen = new Map<number, number>();
  for (const id of ids) {
    const n = players.find((p) => p.id === id)?.number;
    if (n !== undefined) seen.set(n, (seen.get(n) ?? 0) + 1);
  }
  return [...seen].filter(([, c]) => c > 1).map(([n]) => n);
}
