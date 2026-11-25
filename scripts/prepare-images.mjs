// One-off preparation of the client's original pack images (downloaded with curl from the client's site).
// JPG packs on a white field: the white background connected to the image edge is made transparent (flood fill),
// the drawing itself is untouched. Everything is trimmed to the pack outline.
// Usage: node scripts/prepare-images.mjs <folder with originals>
import sharp from "sharp";
import path from "node:path";

const src = process.argv[2];
const out = path.resolve("src/assets/packs");
const jpg = ["sumatra", "tanzania", "kenya", "nicaragua", "brazil"];
const png = ["ethiopia", "rwanda", "colombia"];

async function cutWhite(name) {
  const { data, info } = await sharp(path.join(src, `${name}.jpg`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const lum = (i) => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  const bg = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => { const i = y * w + x; if (!bg[i] && lum(i) > 232) { bg[i] = 1; stack.push(i); } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const i = stack.pop(); const x = i % w, y = (i / w) | 0;
    if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1);
  }
  // soft edge: pixels touching the background get alpha by their distance from white
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) { data[i * 4 + 3] = 0; continue; }
    const x = i % w, y = (i / w) | 0;
    const near = (x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (y > 0 && bg[i - w]) || (y < h - 1 && bg[i + w]);
    if (near) { const l = lum(i); if (l > 180) data[i * 4 + 3] = Math.round(255 * (255 - l) / 75); }
  }
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(path.join(out, `${name}.png`));
}

for (const n of jpg) await cutWhite(n);
for (const n of png) await sharp(path.join(src, `${n}.png`)).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(path.join(out, `${n}.png`));

// Logo: the original file, the Russian tagline line (right of the cup, below the wordmark) is masked out — the site is Ukrainian.
const { data: ld, info: li } = await sharp(path.join(src, "logo.png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let y = 192; y < li.height; y++) for (let x = 205; x < li.width; x++) ld[(y * li.width + x) * 4 + 3] = 0;
await sharp(ld, { raw: { width: li.width, height: li.height, channels: 4 } }).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(path.resolve("src/assets/logo.png"));
// Favicon: the cup from the same logo file.
await sharp(path.resolve("src/assets/logo.png")).extract({ left: 0, top: 0, width: 200, height: 268 }).resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.resolve("public/favicon.png"));
console.log("ok");
