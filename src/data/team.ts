import itzguiboy from "@/assets/players/itzguiboy.webp";
import dioginho9222 from "@/assets/players/dioginho9222.webp";
import xchavozinhodopea from "@/assets/players/xchavozinhodopea.webp";
import rankthread7162 from "@/assets/players/rankthread7162.webp";
import peubezerra07 from "@/assets/players/peubezerra07.webp";
import ratinggoat9879 from "@/assets/players/ratinggoat9879.webp";
import dragonjoao10 from "@/assets/players/dragonjoao10.webp";
import paix2007 from "@/assets/players/paix2007.webp";
import gommes07 from "@/assets/players/gommes07.webp";
import richardxzs from "@/assets/players/richardxzs.webp";

import type { Player, SiteData } from "@/lib/site-schema";

/** Fotos embutidas no site. Fotos enviadas pelo painel admin têm prioridade (player.photo). */
export const bundledPhotos: Record<string, string> = {
  "gui-araujo": itzguiboy,
  dioginho: dioginho9222,
  chatuba: xchavozinhodopea,
  rankthread: rankthread7162,
  "peu-xrc": peubezerra07,
  ratingoat: ratinggoat9879,
  osmo: dragonjoao10,
  paix2007: paix2007,
  gommes07: gommes07,
  elmamaria: richardxzs,
};

/** Identidade fixa do clube. O que muda a cada jogo vive no banco (ver defaultSite). */
export const club = {
  name: "Driblou Caiu",
  tagline: "Pro Clubs · EA FC 26 · Amistosos & Liga",
  founded: 2026,
  platform: "PS5 · Cross-play",
  formation: "3-4-1-2",
  discord: "https://discord.gg/",
  social: {
    tiktok: { handle: "@dribloucaiufc", url: "https://www.tiktok.com/@dribloucaiufc" },
    instagram: { handle: "@dribloucaiufc", url: "https://www.instagram.com/dribloucaiufc/" },
  },
  about:
    "O Driblou Caiu nasceu de uma resenha que não parava: um grupo cansado de perder pra time que só compra 90+ e não marca ninguém. Aqui é treino toda semana, banco por mérito e uma regra só: quem não corre pra trás, não joga.",
  rules: ["Sem money team", "Banco por mérito", "Bola no chão", "Treino toda semana"],
  motto: "Quer ganhar? Faça 5.",
};

const P = (
  id: string,
  name: string,
  number: number,
  position: Player["position"],
  overall: number,
  pac: number,
  sho: number,
  pas: number,
  dri: number,
  def: number,
  phy: number,
  extra: Partial<Player> = {},
): Player => ({
  id,
  name,
  number,
  position,
  overall,
  stats: { pac, sho, pas, dri, def, phy },
  ...extra,
});

/** Conteúdo inicial: vale enquanto ninguém salvou nada pelo painel. */
export const defaultSite: SiteData = {
  updatedAt: "2026-08-17T00:00:00.000Z",
  nextMatch: {
    opponent: "Meta Squad",
    competition: "Liga",
    date: "2026-08-22T20:30:00-03:00",
    venue: "Casa",
  },
  players: [
    P("gui-araujo", "Gui Araújo", 11, "PD", 95, 95, 91, 79, 91, 34, 68),
    P("dioginho", "Dioginho9222", 4, "ZAG", 95, 70, 46, 65, 58, 93, 92),
    P("chatuba", "Chatuba", 9, "VOL", 93, 74, 65, 92, 80, 78, 80, {
      captain: true,
    }),
    P("rankthread", "RankThread7162", 8, "MC", 91, 76, 80, 91, 86, 58, 70),
    P("peu-xrc", "PEU XRC", 69, "MEI", 89, 80, 82, 93, 90, 42, 62),
    P("ratingoat", "Ratingoat", 10, "MEI", 91, 82, 84, 90, 89, 40, 64),
    P("osmo", "Osmo", 72, "PE", 93, 95, 90, 76, 92, 35, 66),
    P("paix2007", "Paix2007", 7, "PD", 93, 92, 87, 74, 90, 33, 63),
    P("gommes07", "Gommes07.", 7, "ATA", 96, 84, 93, 68, 85, 38, 88),
    P("elmamaria", "Elmamaria pika", 2, "ATA", 98, 86, 96, 70, 88, 36, 90),
  ],
  matches: [
    {
      id: "m5",
      opponent: "Ala Fantasma FC",
      goalsFor: 4,
      goalsAgainst: 1,
      competition: "Liga",
      date: "2026-08-14",
      scorers: [],
    },
    {
      id: "m4",
      opponent: "Rebaixados United",
      goalsFor: 3,
      goalsAgainst: 3,
      competition: "Amistoso",
      date: "2026-08-12",
      scorers: [],
    },
    {
      id: "m3",
      opponent: "Tira o Pé SC",
      goalsFor: 2,
      goalsAgainst: 0,
      competition: "Liga",
      date: "2026-08-09",
      scorers: [],
    },
    {
      id: "m2",
      opponent: "Meta Squad",
      goalsFor: 1,
      goalsAgainst: 2,
      competition: "Liga",
      date: "2026-08-05",
      scorers: [],
    },
    {
      id: "m1",
      opponent: "Canela Seca FC",
      goalsFor: 6,
      goalsAgainst: 2,
      competition: "Amistoso",
      date: "2026-08-02",
      scorers: [],
    },
  ],
  table: [
    { team: "Meta Squad", played: 18, won: 14, drawn: 2, lost: 2, gd: 38, points: 44 },
    { team: "Driblou Caiu", played: 18, won: 13, drawn: 3, lost: 2, gd: 35, points: 42 },
    { team: "Tira o Pé SC", played: 18, won: 11, drawn: 3, lost: 4, gd: 21, points: 36 },
    { team: "Ala Fantasma FC", played: 18, won: 8, drawn: 4, lost: 6, gd: 7, points: 28 },
    { team: "Rebaixados United", played: 18, won: 5, drawn: 5, lost: 8, gd: -9, points: 20 },
    { team: "Canela Seca FC", played: 18, won: 2, drawn: 3, lost: 13, gd: -31, points: 9 },
  ],
  // Soma com as 5 partidas acima e dá os números que o site mostrava antes (42 jogos, 31 V, 128 gols, saldo +74).
  baseline: { played: 37, won: 28, drawn: 4, lost: 5, gf: 112, ga: 46 },
};
