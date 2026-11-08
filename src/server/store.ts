// Tiny key-value layer. Production: Upstash Redis over REST (works on Vercel and Workers, no SDK).
// Dev without Redis: a JSON file in .data/. Anything else: read-only (site shows the built-in defaults).

function env(name: string): string | undefined {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[
    name
  ];
}

function redisConfig() {
  const url = env("UPSTASH_REDIS_REST_URL") ?? env("KV_REST_API_URL");
  const token = env("UPSTASH_REDIS_REST_TOKEN") ?? env("KV_REST_API_TOKEN");
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redis(command: Array<string>): Promise<unknown> {
  const cfg = redisConfig()!;
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (!res.ok || json.error) throw new Error(json.error ?? `Redis HTTP ${res.status}`);
  return json.result;
}

const DEV_FILE = ".data/db.json";

async function devRead(): Promise<Record<string, string>> {
  if (!import.meta.env.DEV) return {};
  const fs = await import("node:fs/promises");
  try {
    return JSON.parse(await fs.readFile(DEV_FILE, "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
}

export type StoreMode = "redis" | "file" | "none";

export function storeMode(): StoreMode {
  if (redisConfig()) return "redis";
  if (import.meta.env.DEV) return "file";
  return "none";
}

export async function kvGet(key: string): Promise<string | null> {
  const mode = storeMode();
  if (mode === "redis") return ((await redis(["GET", key])) as string | null) ?? null;
  if (mode === "file") return (await devRead())[key] ?? null;
  return null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  const mode = storeMode();
  if (mode === "redis") {
    await redis(["SET", key, value]);
  } else if (mode === "file") {
    const fs = await import("node:fs/promises");
    const data = await devRead();
    data[key] = value;
    await fs.mkdir(".data", { recursive: true });
    await fs.writeFile(DEV_FILE, JSON.stringify(data), "utf8");
  } else {
    throw new Error(
      "Banco de dados não configurado. Conecte um Redis (Upstash) ao projeto — veja o README.",
    );
  }
}

export { env };
