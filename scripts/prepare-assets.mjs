// Menyiapkan aset web dari folder /assets (sumber asli tidak diubah).
// Jalankan: node scripts/prepare-assets.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("assets");
const OUT = path.resolve("public/images");
await mkdir(OUT, { recursive: true });

const photos = [
  // [sumber, output, lebar maks, grade hangat?]
  ["hero1palingatas.png", "hero.webp", 2155, false],
  ["digital-menu/kriteria1.jpg", "menu-kopi.webp", 1000, false],
  ["digital-menu/kriteria2.jpg", "menu-makanan.webp", 1000, false],
  ["digital-menu/kriteria3.jpg", "menu-snack.webp", 1000, false],
  ["ambience&socialprof/kriteria1.jpg", "ambience-interaksi.webp", 1400, false],
  ["ambience&socialprof/kriteria2.jpg", "ambience-produktif.webp", 1100, false],
  ["ambience&socialprof/kriteria3.jpg", "ambience-privat.webp", 1000, false],
  // Foto outdoor siang hari -> disamakan ke grading low-exposure warm/amber
  ["ambience&socialprof/kriteria3(1).jpg", "venue-event.webp", 1400, true],
];

for (const [src, out, width, warm] of photos) {
  let img = sharp(path.join(SRC, src)).rotate().resize({ width, withoutEnlargement: true });
  if (warm) {
    img = img
      .modulate({ brightness: 0.74, saturation: 0.55 })
      .recomb([
        [1.1, 0.04, 0],
        [0.02, 0.95, 0],
        [0, 0, 0.72],
      ]);
  }
  const info = await img.webp({ quality: 80 }).toFile(path.join(OUT, out));
  console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

// OG image 1200x630 dari hero
await sharp(path.join(SRC, "hero1palingatas.png"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .modulate({ brightness: 0.9 })
  .jpeg({ quality: 82 })
  .toFile(path.join(OUT, "og.jpg"));
console.log("og.jpg 1200x630");

// Logo: hitam -> transparan (alpha dari luminansi), crop wordmark & simbol "8"
async function whiteOnAlpha(region, outFile) {
  const { data, info } = await sharp(path.join(SRC, "logo.jpg"))
    .extract(region)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const a = Math.min(255, Math.round(Math.max(data[i], data[i + 1], data[i + 2]) * 1.08));
    rgba[j] = 244; rgba[j + 1] = 236; rgba[j + 2] = 222; rgba[j + 3] = a;
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(path.join(OUT, outFile));
  console.log(`${outFile} ${info.width}x${info.height}`);
}
await whiteOnAlpha({ left: 118, top: 340, width: 884, height: 400 }, "logo-wordmark.png");
await whiteOnAlpha({ left: 118, top: 340, width: 236, height: 400 }, "logo-mark.png");

// Favicon / app icon: simbol "8" di atas latar gelap
const mark = await sharp(path.join(OUT, "logo-mark.png")).resize({ height: 300 }).toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#0B0907" } })
  .composite([{ input: mark, gravity: "centre" }])
  .png()
  .toFile(path.resolve("src/app/icon.png"));
console.log("src/app/icon.png 512x512");
