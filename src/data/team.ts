import itzguiboy from "@/assets/players/itzguiboy.png";
import dioginho9222 from "@/assets/players/dioginho9222.png";
import xchavozinhodopea from "@/assets/players/xchavozinhodopea.png";
import rankthread7162 from "@/assets/players/rankthread7162.png";
import peubezerra07 from "@/assets/players/peubezerra07.png";
import ratinggoat9879 from "@/assets/players/ratinggoat9879.png";
import dragonjoao10 from "@/assets/players/dragonjoao10.png";
import paix2007 from "@/assets/players/paix2007.png";
import gommes07 from "@/assets/players/gommes07.png";
import richardxzs from "@/assets/players/richardxzs.png";

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
  /** Ajuste de escala pra compensar fotos com enquadramento mais próximo (1 = sem ajuste). */
  photoScale?: number;
  stats: { pac: number; sho: number; pas: number; dri: number; def: number; phy: number };
};

export const squad: Player[] = [
  {
    name: "Gui Araújo",
    number: 11,
    position: "PD",
    overall: 95,
    photo: itzguiboy,
    stats: { pac: 95, sho: 91, pas: 79, dri: 91, def: 34, phy: 68 },
  },
  {
    name: "Dioginho9222",
    number: 4,
    position: "ZAG",
    overall: 95,
    photo: dioginho9222,
    stats: { pac: 70, sho: 46, pas: 65, dri: 58, def: 93, phy: 92 },
  },
  {
    name: "Chatuba",
    number: 9,
    position: "VOL",
    overall: 93,
    captain: true,
    photo: xchavozinhodopea,
    photoScale: 0.87,
    stats: { pac: 74, sho: 65, pas: 92, dri: 80, def: 78, phy: 80 },
  },
  {
    name: "RankThread7162",
    number: 8,
    position: "MC",
    overall: 91,
    photo: rankthread7162,
    photoScale: 0.95,
    stats: { pac: 76, sho: 80, pas: 91, dri: 86, def: 58, phy: 70 },
  },
  {
    name: "PEU XRC",
    number: 69,
    position: "MEI",
    overall: 89,
    photo: peubezerra07,
    stats: { pac: 80, sho: 82, pas: 93, dri: 90, def: 42, phy: 62 },
  },
  {
    name: "Ratingoat",
    number: 10,
    position: "MEI",
    overall: 91,
    photo: ratinggoat9879,
    photoScale: 0.96,
    stats: { pac: 82, sho: 84, pas: 90, dri: 89, def: 40, phy: 64 },
  },
  {
    name: "Osmo",
    number: 72,
    position: "PE",
    overall: 93,
    photo: dragonjoao10,
    stats: { pac: 95, sho: 90, pas: 76, dri: 92, def: 35, phy: 66 },
  },
  {
    name: "Paix2007",
    number: 7,
    position: "PD",
    overall: 93,
    photo: paix2007,
    photoScale: 0.94,
    stats: { pac: 92, sho: 87, pas: 74, dri: 90, def: 33, phy: 63 },
  },
  {
    name: "Gommes07.",
    number: 7,
    position: "ATA",
    overall: 96,
    photo: gommes07,
    photoScale: 0.96,
    stats: { pac: 84, sho: 93, pas: 68, dri: 85, def: 38, phy: 88 },
  },
  {
    name: "Elmamaria pika",
    number: 2,
    position: "ATA",
    overall: 98,
    photo: richardxzs,
    photoScale: 0.92,
    stats: { pac: 86, sho: 96, pas: 70, dri: 88, def: 36, phy: 90 },
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
