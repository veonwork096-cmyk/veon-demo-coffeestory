// After `astro build`: make asset URLs relative, so dist/ opens from file:// and from a sub-path (GitHub Pages),
// and drop emitted source images that no page or stylesheet references (only the optimised AVIF/WebP are used).
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

let text = "";
for (const file of walk(dist)) {
  if (!/\.(html|css)$/.test(file)) continue;
  const rel = path.relative(path.dirname(file), dist).split(path.sep).join("/");
  const prefix = rel ? `${rel}/` : "./";
  const src = fs.readFileSync(file, "utf8");
  const out = src.replace(/(["'(\s,])\/(_astro|fonts|favicon\.png)/g, `$1${prefix}$2`);
  if (out !== src) fs.writeFileSync(file, out);
  text += out;
}

let removed = 0;
for (const file of walk(path.join(dist, "_astro"))) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  if (!text.includes(path.basename(file))) { fs.unlinkSync(file); removed++; }
}
console.log(`relative asset paths: ok; unused source images removed: ${removed}`);
