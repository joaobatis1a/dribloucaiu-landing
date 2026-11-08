// Re-renders the (low-res) player photos at 2x with Lanczos + light sharpening so they stay
// crisp on retina screens. Source files are small, so this is a best-effort improvement;
// uploading higher-resolution photos through /admin is the real fix.
import sharp from "sharp";
import { readdir, readFile, writeFile } from "node:fs/promises";

const dir = new URL("../src/assets/players/", import.meta.url);
for (const f of await readdir(dir)) {
  if (!f.endsWith(".webp")) continue;
  const input = await readFile(new URL(f, dir));
  const { width } = await sharp(input).metadata();
  if (width && width >= 700) continue; // already processed
  const out = await sharp(input)
    .resize({ width: Math.round(width * 2), kernel: "lanczos3" })
    .sharpen({ sigma: 1.1, m1: 0.8, m2: 2.2 })
    .webp({ quality: 86, effort: 5 })
    .toBuffer();
  await writeFile(new URL(f, dir), out);
  console.log(f, width, "->", width * 2, Math.round(out.length / 1024) + "KB");
}
