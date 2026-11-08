import type { Match, Player, SiteData } from "@/lib/site-schema";
import { matchOutcome } from "@/lib/match";

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

export type PlayerTotals = { games: number; goals: number; assists: number; motm: number };

export function playerTotals(site: SiteData): Record<string, PlayerTotals> {
  const out: Record<string, PlayerTotals> = {};
  const get = (id: string) => (out[id] ??= { games: 0, goals: 0, assists: 0, motm: 0 });
  for (const m of site.matches) {
    for (const s of m.scorers) {
      const t = get(s.playerId);
      t.goals += s.goals;
      t.assists += s.assists;
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

const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

/** "2026-08-14" -> { day: "14", month: "AGO", full: "14 AGO 2026" } */
export function dateParts(iso: string) {
  const [y, m, d] = iso.split("-");
  const month = MONTHS[Number(m) - 1] ?? "";
  return { day: d ?? "", month, year: y ?? "", full: `${d} ${month} ${y}` };
}
