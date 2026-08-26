export const club = {
  name: "Driblou Caiu",
  tagline: "Pro Clubs · EA FC 26 · Amistosos & Liga",
  founded: 2023,
  platform: "PS5 · Cross-play",
  formation: "4-3-3",
  discord: "https://discord.gg/",
  social: {
    tiktok: { handle: "@dribloucaiu", url: "https://www.tiktok.com/@dribloucaiu" },
    instagram: { handle: "@dribloucaiu", url: "https://www.instagram.com/dribloucaiu" },
  },
  about:
    "O Driblou Caiu nasceu de uma resenha que não parava: um grupo cansado de perder pra time que só sabe comprar 90+ e não marca ninguém. Aqui o esquema é simples. Pressão alta, saída curta, três pontas correndo pra cima. Joga quem treina, senta quem não corre. Sem money team.",
  pillars: [
    {
      title: "Pressão alta",
      description: "Perdeu a bola, recompõe em 6 segundos. O rival não sai jogando tranquilo.",
    },
    {
      title: "Meio criativo",
      description: "Triângulo curto entre volante, meia e ponta pra furar linha com um toque a mais.",
    },
    {
      title: "Ponta em velocidade",
      description: "PE e PD colados na linha, prontos pra pegar o furo nas costas da zaga.",
    },
  ],
  achievements: [
    { title: "Campeã", detail: "Copa de Verão 2025", year: "2025" },
    { title: "Melhor ataque", detail: "Liga Amistosa 2025", year: "2025" },
    { title: "Vice-campeã", detail: "Liga Amistosa 2024", year: "2024" },
  ],
  nextMatch: {
    opponent: "Meta Squad",
    competition: "Liga Amistosa",
    date: "2026-08-22T20:30:00-03:00",
    venue: "Casa",
  },
};

export type Player = {
  name: string;
  number: number;
  position: string;
  overall: number;
  captain?: boolean;
  /** Foto do jogador (opcional). Sem foto, mostra uma silhueta no lugar. */
  photo?: string;
  stats: { pac: number; sho: number; pas: number; dri: number; def: number; phy: number };
};

export const squad: Player[] = [
  {
    name: "Caio",
    number: 1,
    position: "GOL",
    overall: 88,
    stats: { pac: 62, sho: 40, pas: 71, dri: 55, def: 88, phy: 84 },
  },
  {
    name: "Bruno",
    number: 4,
    position: "ZAG",
    overall: 85,
    captain: true,
    stats: { pac: 74, sho: 48, pas: 70, dri: 63, def: 87, phy: 86 },
  },
  {
    name: "Léo",
    number: 5,
    position: "ZAG",
    overall: 83,
    stats: { pac: 78, sho: 45, pas: 68, dri: 66, def: 84, phy: 82 },
  },
  {
    name: "Rafa",
    number: 6,
    position: "LE",
    overall: 84,
    stats: { pac: 91, sho: 62, pas: 79, dri: 82, def: 76, phy: 71 },
  },
  {
    name: "Tiago",
    number: 2,
    position: "LD",
    overall: 82,
    stats: { pac: 90, sho: 58, pas: 77, dri: 80, def: 75, phy: 70 },
  },
  {
    name: "Vitor",
    number: 8,
    position: "VOL",
    overall: 86,
    stats: { pac: 75, sho: 72, pas: 86, dri: 81, def: 80, phy: 83 },
  },
  {
    name: "Igor",
    number: 15,
    position: "MC",
    overall: 87,
    stats: { pac: 79, sho: 78, pas: 89, dri: 88, def: 62, phy: 72 },
  },
  {
    name: "Nando",
    number: 10,
    position: "MEI",
    overall: 89,
    stats: { pac: 84, sho: 84, pas: 90, dri: 91, def: 48, phy: 68 },
  },
  {
    name: "Duda",
    number: 11,
    position: "PE",
    overall: 86,
    stats: { pac: 94, sho: 82, pas: 78, dri: 90, def: 40, phy: 64 },
  },
  {
    name: "Kaká",
    number: 7,
    position: "PD",
    overall: 85,
    stats: { pac: 93, sho: 80, pas: 76, dri: 89, def: 38, phy: 66 },
  },
  {
    name: "Zeca",
    number: 9,
    position: "ATA",
    overall: 90,
    stats: { pac: 89, sho: 92, pas: 74, dri: 87, def: 42, phy: 81 },
  },
];

export const teamStats = [
  { label: "Jogos", value: 42, suffix: "" },
  { label: "Vitórias", value: 31, suffix: "" },
  { label: "Gols marcados", value: 128, suffix: "" },
  { label: "Saldo de gols", value: 74, suffix: "" },
  { label: "Aproveitamento", value: 78, suffix: "%" },
];

export type Match = {
  opponent: string;
  goalsFor: number;
  goalsAgainst: number;
  competition: "Liga" | "Amistoso";
  date: string;
};

export const results: Match[] = [
  { opponent: "Ala Fantasma FC", goalsFor: 4, goalsAgainst: 1, competition: "Liga", date: "14 AGO" },
  { opponent: "Rebaixados United", goalsFor: 3, goalsAgainst: 3, competition: "Amistoso", date: "12 AGO" },
  { opponent: "Tira o Pé SC", goalsFor: 2, goalsAgainst: 0, competition: "Liga", date: "09 AGO" },
  { opponent: "Meta Squad", goalsFor: 1, goalsAgainst: 2, competition: "Liga", date: "05 AGO" },
  { opponent: "Canela Seca FC", goalsFor: 6, goalsAgainst: 2, competition: "Amistoso", date: "02 AGO" },
];

export type TableRow = {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  points: number;
};

export const leagueTable: TableRow[] = [
  { team: "Meta Squad", played: 18, won: 14, drawn: 2, lost: 2, gd: 38, points: 44 },
  { team: "Driblou Caiu", played: 18, won: 13, drawn: 3, lost: 2, gd: 35, points: 42 },
  { team: "Tira o Pé SC", played: 18, won: 11, drawn: 3, lost: 4, gd: 21, points: 36 },
  { team: "Ala Fantasma FC", played: 18, won: 8, drawn: 4, lost: 6, gd: 7, points: 28 },
  { team: "Rebaixados United", played: 18, won: 5, drawn: 5, lost: 8, gd: -9, points: 20 },
  { team: "Canela Seca FC", played: 18, won: 2, drawn: 3, lost: 13, gd: -31, points: 9 },
];
