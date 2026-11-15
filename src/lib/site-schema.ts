import { z } from "zod";
import { FORMATION_IDS, formations } from "@/lib/formations";

export const POSITIONS = ["GOL", "ZAG", "LE", "LD", "VOL", "MC", "MEI", "PE", "PD", "ATA"] as const;
export const COMPETITIONS = ["Liga", "Amistoso", "Copa"] as const;

const stat = z.number().int().min(0).max(99);
const goals = z.number().int().min(0).max(99);

export const MAX_BENCH = 7;
export const CAPTAIN_LABELS = { 1: "Capitão", 2: "Vice-capitão", 3: "3º capitão" } as const;
export const CAPTAIN_BADGES = { 1: "C", 2: "VC", 3: "3C" } as const;

const playerShape = z.object({
  id: z.string().min(1).max(60),
  name: z.string().trim().min(1).max(40),
  number: z.number().int().min(0).max(99),
  /** Posição principal: define o setor do jogador na lista do elenco. */
  position: z.enum(POSITIONS),
  /** Outras posições que o jogador cobre. */
  altPositions: z.array(z.enum(POSITIONS)).max(3).default([]),
  overall: z.number().int().min(1).max(99),
  /** Hierarquia de capitania: 1 = capitão, 2 = vice, 3 = terceiro. Sem valor = não é capitão. */
  captainRank: z.number().int().min(1).max(3).optional(),
  /** Só preenchido quando a foto foi enviada pelo painel. */
  photo: z.string().max(300).optional(),
  photoScale: z.number().min(0.5).max(1.5).optional(),
  stats: z.object({ pac: stat, sho: stat, pas: stat, dri: stat, def: stat, phy: stat }),
  /** Números do jogador de antes do site (as partidas lançadas somam por cima). */
  history: z
    .object({
      games: z.number().int().min(0).max(9999),
      goals: z.number().int().min(0).max(9999),
      assists: z.number().int().min(0).max(9999),
    })
    .default({ games: 0, goals: 0, assists: 0 }),
});

/** Lê também o formato antigo (`captain: true`), pra não perder dados já salvos. */
export const playerSchema = z.preprocess((raw) => {
  if (raw && typeof raw === "object" && "captain" in raw) {
    const { captain, ...rest } = raw as Record<string, unknown>;
    return captain === true && rest["captainRank"] === undefined
      ? { ...rest, captainRank: 1 }
      : rest;
  }
  return raw;
}, playerShape);

export const matchSchema = z.object({
  id: z.string().min(1).max(60),
  opponent: z.string().trim().min(1).max(40),
  goalsFor: goals,
  goalsAgainst: goals,
  competition: z.enum(COMPETITIONS),
  /** AAAA-MM-DD */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scorers: z
    .array(z.object({ playerId: z.string(), goals: goals, assists: goals }))
    .max(30)
    .default([]),
  /** Quem entrou em campo (quem marcou ou deu assistência conta como tendo jogado). */
  played: z.array(z.string()).max(30).default([]),
  motm: z.string().max(60).optional(),
  note: z.string().trim().max(160).optional(),
});

export const nextMatchSchema = z.object({
  opponent: z.string().trim().min(1).max(40),
  competition: z.enum(COMPETITIONS),
  /** ISO com fuso, ex.: 2026-08-22T20:30:00-03:00 */
  date: z.string().min(10).max(40),
  venue: z.string().trim().min(1).max(30),
});

export const baselineSchema = z.object({
  played: z.number().int().min(0).max(9999),
  won: z.number().int().min(0).max(9999),
  drawn: z.number().int().min(0).max(9999),
  lost: z.number().int().min(0).max(9999),
  gf: z.number().int().min(0).max(9999),
  ga: z.number().int().min(0).max(9999),
});

export const lineupSlotSchema = z.object({
  number: z.number().int().min(0).max(99),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  /** Jogador escalado nesse slot (opcional: sem jogador o slot mostra só o número). */
  playerId: z.string().max(60).optional(),
});

export const lineupSchema = z.object({
  formation: z.enum(FORMATION_IDS),
  slots: z.array(lineupSlotSchema).length(11),
  /** Reservas, em ordem de preferência. */
  bench: z.array(z.string().max(60)).max(MAX_BENCH).default([]),
});

/** Escalação inicial de um esquema: slots numerados de 1 a 11 nas posições padrão. */
export function presetLineup(
  formation: (typeof FORMATION_IDS)[number],
): z.infer<typeof lineupSchema> {
  return {
    formation,
    slots: formations[formation].slots.map((s, i) => ({ number: i + 1, x: s.x, y: s.y })),
    bench: [],
  };
}

export const siteSchema = z.object({
  updatedAt: z.string(),
  nextMatch: nextMatchSchema.nullable(),
  matches: z.array(matchSchema).max(2000),
  players: z.array(playerSchema).max(60),
  /** Histórico anterior ao site (jogos que não estão cadastrados como partida). */
  baseline: baselineSchema,
  lineup: lineupSchema.default(presetLineup("3-4-1-2")),
});

export type Player = z.infer<typeof playerSchema>;
export type Match = z.infer<typeof matchSchema>;
export type NextMatch = z.infer<typeof nextMatchSchema>;
export type Baseline = z.infer<typeof baselineSchema>;
export type SiteData = z.infer<typeof siteSchema>;
export type Lineup = z.infer<typeof lineupSchema>;
export type LineupSlot = z.infer<typeof lineupSlotSchema>;
