import { motion } from "framer-motion";
import { CalendarClock, Goal, LayoutGrid, UserPlus } from "lucide-react";
import type { SiteData } from "@/lib/site-schema";
import { teamTotals } from "@/lib/site-derive";
import { Scoreboard } from "@/components/Scoreboard";
import { panel } from "@/components/admin/kit";

export type TabId =
  "visao" | "partidas" | "proximo" | "escalacao" | "elenco" | "tabela" | "historico";

const ACTIONS: Array<{ tab: TabId; label: string; note: string; Icon: typeof Goal }> = [
  { tab: "partidas", label: "Lançar resultado", note: "Placar, gols e assistências", Icon: Goal },
  {
    tab: "proximo",
    label: "Marcar próximo jogo",
    note: "Adversário, data e horário",
    Icon: CalendarClock,
  },
  {
    tab: "escalacao",
    label: "Mexer na escalação",
    note: "Esquema e os 11 do campo",
    Icon: LayoutGrid,
  },
  { tab: "elenco", label: "Adicionar jogador", note: "Nome, foto e atributos", Icon: UserPlus },
];

export function Overview({ site, go }: { site: SiteData; go: (t: TabId) => void }) {
  const t = teamTotals(site);
  const next = site.nextMatch;
  const filled = site.lineup.slots.filter((s) => s.playerId).length;
  const tiles = [
    { label: "Jogos", value: t.played },
    { label: "Vitórias", value: t.won },
    { label: "Gols", value: t.gf },
    { label: "Aproveitamento", value: `${t.rate}%` },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-[var(--tinta)] p-4 text-white"
          >
            <p className="font-stencil text-5xl font-black leading-none">{tile.value}</p>
            <p className="mt-1 font-mono text-xs uppercase text-white/80">{tile.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-xs font-bold uppercase text-muted-foreground">
            Último resultado
          </p>
          {site.matches.length ? (
            <Scoreboard />
          ) : (
            <p className={panel}>Nenhuma partida lançada ainda.</p>
          )}
        </div>
        <div>
          <p className="mb-3 font-mono text-xs font-bold uppercase text-muted-foreground">
            Próximo jogo
          </p>
          <button
            onClick={() => go("proximo")}
            className="torn block w-full bg-[var(--cartao)] px-6 py-7 text-left transition-transform hover:-rotate-1"
          >
            {next ? (
              <>
                <span className="font-mono text-xs uppercase">
                  {next.competition} · {next.venue}
                </span>
                <span className="block font-stencil text-4xl font-black uppercase leading-[0.9]">
                  × {next.opponent}
                </span>
                <span className="mt-2 block font-mono text-sm uppercase">
                  {new Date(next.date).toLocaleString("pt-BR", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "America/Sao_Paulo",
                  })}
                </span>
              </>
            ) : (
              <span className="font-stencil text-4xl font-black uppercase">
                Nenhum jogo marcado
              </span>
            )}
          </button>
          <p className="mt-4 font-mono text-xs uppercase text-muted-foreground">
            Elenco: {site.players.length} jogadores · Escalação: {filled}/11 com jogador
          </p>
        </div>
      </div>

      <div>
        <p className="mb-3 font-mono text-xs font-bold uppercase text-muted-foreground">Atalhos</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ACTIONS.map(({ tab, label, note, Icon }) => (
            <button
              key={tab}
              onClick={() => go(tab)}
              className="group flex flex-col items-start gap-6 border-2 border-[var(--piche)] bg-[var(--papel)] p-5 text-left shadow-[4px_4px_0_var(--piche)] transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--tinta)]"
            >
              <Icon className="h-7 w-7 transition-transform duration-300 group-hover:-rotate-12 group-hover:text-[var(--tinta)]" />
              <span>
                <span className="block font-display text-2xl font-black uppercase leading-none">
                  {label}
                </span>
                <span className="mt-1 block font-mono text-xs uppercase text-muted-foreground">
                  {note}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
