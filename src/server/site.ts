import { defaultSite } from "@/data/team";
import { siteSchema, type SiteData } from "@/lib/site-schema";
import { kvGet, kvSet } from "@/server/store";

const SITE_KEY = "dc:site:v1";

export async function loadSite(): Promise<SiteData> {
  try {
    const raw = await kvGet(SITE_KEY);
    if (!raw) return defaultSite;
    const parsed = siteSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : defaultSite;
  } catch (err) {
    console.error("loadSite failed, serving defaults", err);
    return defaultSite;
  }
}

export async function saveSite(site: SiteData): Promise<SiteData> {
  const next = siteSchema.parse({ ...site, updatedAt: new Date().toISOString() });
  await kvSet(SITE_KEY, JSON.stringify(next));
  return next;
}

export const photoKey = (id: string) => `dc:photo:${id}`;
