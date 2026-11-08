// Recorta as fotos dos jogadores (prints da carta do EA FC) no formato de figurinha:
// cabeça e tronco, 4:5, sem a coluna de atributos nem o selo de nível do jogo.
// Caixas medidas num contact sheet 300x400 por jogador: [x0, x1, y0] nessa escala.
// Uso: node scripts/crop-stickers.mjs <pasta-origem> <pasta-destino>
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const boxes = {
  dioginho9222: [80, 210, 50],
  dragonjoao10: [95, 202, 50],
  gommes07: [70, 200, 40],
  itzguiboy: [72, 208, 36],
  paix2007: [80, 208, 38],
  peubezerra07: [84, 190, 40],
  rankthread7162: [70, 194, 46],
  ratinggoat9879: [70, 194, 44],
  richardxzs: [78, 200, 50],
  xchavozinhodopea: [64, 194, 42],
};

const [src, out] = process.argv.slice(2);
await mkdir(out, { recursive: true });
for (const [name, [x0, x1, y0]] of Object.entries(boxes)) {
  const img = sharp(`${src}/${name}.webp`);
  const { width: W, height: H } = await img.metadata();
  const left = Math.round((x0 / 300) * W);
  const width = Math.round(((x1 - x0) / 300) * W);
  const height = Math.min(Math.round(width * 1.25), H - Math.round((y0 / 400) * H));
  const top = Math.round((y0 / 400) * H);
  await img
    .extract({ left, top, width, height })
    .resize(480, 600, { fit: "cover", position: "top", kernel: "lanczos3" })
    .sharpen({ sigma: 0.8 })
    .webp({ quality: 86 })
    .toFile(`${out}/${name}.webp`);
  console.log(name, `${width}x${height}`);
}
