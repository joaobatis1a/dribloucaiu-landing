import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  baselineSchema,
  matchSchema,
  nextMatchSchema,
  playerSchema,
  tableRowSchema,
} from "@/lib/site-schema";

export const getSite = createServerFn({ method: "GET" }).handler(async () => {
  const { loadSite } = await import("@/server/site");
  return loadSite();
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getCookie } = await import("@tanstack/react-start/server");
  const { verifyToken, adminConfigured, cookieName } = await import("@/server/auth");
  const { storeMode } = await import("@/server/store");
  return {
    configured: adminConfigured(),
    authed: await verifyToken(getCookie(cookieName)),
    storage: storeMode(),
  };
});

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().max(200) }))
  .handler(async ({ data }) => {
    const { setCookie, getRequestIP } = await import("@tanstack/react-start/server");
    const auth = await import("@/server/auth");
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    if (auth.loginBlocked(ip)) {
      return { ok: false as const, error: "Muitas tentativas. Aguarde alguns minutos." };
    }
    const ok = await auth.checkPassword(data.password);
    auth.recordLogin(ip, ok);
    if (!ok) {
      await new Promise((r) => setTimeout(r, 700));
      return { ok: false as const, error: "Senha incorreta." };
    }
    setCookie(auth.cookieName, await auth.makeToken(), {
      httpOnly: true,
      secure: !import.meta.env.DEV,
      sameSite: "strict",
      path: "/",
      maxAge: auth.cookieMaxAgeSeconds,
    });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { deleteCookie } = await import("@tanstack/react-start/server");
  const { cookieName } = await import("@/server/auth");
  deleteCookie(cookieName, { path: "/" });
  return { ok: true as const };
});

const actionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("saveMatch"), match: matchSchema }),
  z.object({ type: z.literal("deleteMatch"), id: z.string() }),
  z.object({ type: z.literal("saveNextMatch"), nextMatch: nextMatchSchema.nullable() }),
  z.object({
    type: z.literal("savePlayer"),
    player: playerSchema,
    /** data URL (webp/jpeg/png) já redimensionada no navegador */
    photoData: z.string().max(450_000).optional(),
    removePhoto: z.boolean().optional(),
  }),
  z.object({ type: z.literal("deletePlayer"), id: z.string() }),
  z.object({ type: z.literal("saveTable"), table: z.array(tableRowSchema) }),
  z.object({ type: z.literal("saveBaseline"), baseline: baselineSchema }),
]);

export const adminSave = createServerFn({ method: "POST" })
  .validator(actionSchema)
  .handler(async ({ data }) => {
    const { getCookie } = await import("@tanstack/react-start/server");
    const { verifyToken, cookieName } = await import("@/server/auth");
    if (!(await verifyToken(getCookie(cookieName)))) {
      throw new Error("Sessão expirada. Entre de novo.");
    }
    const { loadSite, saveSite, photoKey } = await import("@/server/site");
    const { kvSet } = await import("@/server/store");
    const site = await loadSite();

    switch (data.type) {
      case "saveMatch": {
        const i = site.matches.findIndex((m) => m.id === data.match.id);
        if (i >= 0) site.matches[i] = data.match;
        else site.matches.push(data.match);
        break;
      }
      case "deleteMatch":
        site.matches = site.matches.filter((m) => m.id !== data.id);
        break;
      case "saveNextMatch":
        site.nextMatch = data.nextMatch;
        break;
      case "savePlayer": {
        const player = { ...data.player };
        if (data.photoData) {
          if (!/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(data.photoData)) {
            throw new Error("Foto inválida.");
          }
          await kvSet(photoKey(player.id), data.photoData);
          player.photo = `/api/photo/${encodeURIComponent(player.id)}?v=${Date.now()}`;
        } else if (data.removePhoto) {
          delete player.photo;
        } else {
          const prev = site.players.find((p) => p.id === player.id);
          if (prev?.photo) player.photo = prev.photo;
        }
        const i = site.players.findIndex((p) => p.id === player.id);
        if (i >= 0) site.players[i] = player;
        else site.players.push(player);
        break;
      }
      case "deletePlayer":
        site.players = site.players.filter((p) => p.id !== data.id);
        break;
      case "saveTable":
        site.table = data.table;
        break;
      case "saveBaseline":
        site.baseline = data.baseline;
        break;
    }
    return saveSite(site);
  });
