import { createContext, useContext, useMemo, type ReactNode } from "react";
import { bundledPhotos } from "@/data/team";
import type { Match, Player, SiteData } from "@/lib/site-schema";
import { playerTotals, sortedMatches, teamTotals, type PlayerTotals } from "@/lib/site-derive";

export type SitePlayer = Player & { totals: PlayerTotals };

type SiteView = {
  site: SiteData;
  players: SitePlayer[];
  matches: Match[];
  team: ReturnType<typeof teamTotals>;
};

const Ctx = createContext<SiteView | null>(null);

export function SiteProvider({ site, children }: { site: SiteData; children: ReactNode }) {
  const value = useMemo<SiteView>(() => {
    const totals = playerTotals(site);
    return {
      site,
      matches: sortedMatches(site),
      team: teamTotals(site),
      players: site.players.map((p) => ({
        ...p,
        photo: p.photo ?? bundledPhotos[p.id],
        totals: totals[p.id] ?? { games: 0, goals: 0, assists: 0, motm: 0 },
      })),
    };
  }, [site]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite(): SiteView {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSite precisa estar dentro de <SiteProvider>");
  return v;
}
