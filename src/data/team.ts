import { presetLineup, type SiteData } from "@/lib/site-schema";

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

/** Conteúdo inicial: vale enquanto ninguém salvou nada pelo painel. */
export const defaultSite: SiteData = {
  updatedAt: "2026-08-17T00:00:00.000Z",
  nextMatch: {
    opponent: "Meta Squad",
    competition: "Liga",
    date: "2026-08-22T20:30:00-03:00",
    venue: "Casa",
  },
  // Elenco em reformulação: os jogadores são cadastrados pelo painel /admin.
  players: [],
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
  lineup: presetLineup("3-4-1-2"),
};
