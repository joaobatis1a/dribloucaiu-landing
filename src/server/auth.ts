import { env } from "@/server/store";

const COOKIE = "dc_admin";
const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 dias
const enc = new TextEncoder();

function password(): string | undefined {
  return env("ADMIN_PASSWORD") ?? (import.meta.env.DEV ? "driblou" : undefined);
}

async function sign(message: string): Promise<string> {
  const secret = env("ADMIN_SECRET") ?? password() ?? "";
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const adminConfigured = () => password() !== undefined;
export const cookieName = COOKIE;
export const cookieMaxAgeSeconds = TTL_MS / 1000;

export async function checkPassword(input: string): Promise<boolean> {
  const real = password();
  if (!real) return false;
  // Compare HMACs so the length of the real password never leaks through timing.
  return safeEqual(await sign(`pw:${input}`), await sign(`pw:${real}`));
}

export async function makeToken(): Promise<string> {
  const exp = String(Date.now() + TTL_MS);
  return `${exp}.${await sign(`session:${exp}`)}`;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token || !adminConfigured()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await sign(`session:${exp}`));
}

// Best-effort brute-force brake (per server instance).
const failures = new Map<string, { n: number; until: number }>();
export function loginBlocked(ip: string): boolean {
  const f = failures.get(ip);
  return !!f && f.n >= 5 && f.until > Date.now();
}
export function recordLogin(ip: string, ok: boolean) {
  if (ok) return void failures.delete(ip);
  const f = failures.get(ip);
  failures.set(ip, { n: (f?.n ?? 0) + 1, until: Date.now() + 5 * 60_000 });
}
