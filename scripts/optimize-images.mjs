import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function recompressWebP(filePath, quality) {
  const before = (await stat(filePath)).size;
  const inputBuf = await readFile(filePath); // Read fully to release file handle
  const outputBuf = await sharp(inputBuf).webp({ quality, effort: 6 }).toBuffer();
  if (outputBuf.length < before) {
    await writeFile(filePath, outputBuf);
    return { before, after: outputBuf.length, saved: before - outputBuf.length };
  }
  return { before, after: before, saved: 0 };
}

let totalSaved = 0;

// 1. Recompress all hero WebP images
console.log("\n--- Recompressing hero WebP images ---");
const heroDir = join(root, "public/images/hero");
const heroFiles = (await readdir(heroDir)).filter(f => f.endsWith(".webp"));

for (const file of heroFiles.sort()) {
  const filePath = join(heroDir, file);
  const quality = file.includes("-1400") ? 72 : 75;
  const result = await recompressWebP(filePath, quality);
  const savedKB = Math.round(result.saved / 1024);
  const beforeKB = Math.round(result.before / 1024);
  const afterKB = Math.round(result.after / 1024);
  totalSaved += result.saved;
  if (result.saved > 0) {
    console.log(`  ✓ ${file}: ${beforeKB}KB → ${afterKB}KB (saved ${savedKB}KB)`);
  } else {
    console.log(`  - ${file}: ${beforeKB}KB (already optimal, kept original)`);
  }
}

// 2. Convert kirti-shah-profile.jpeg → .webp (resize to max 800w — displayed in 600px container)
console.log("\n--- Converting JPEG assets to WebP ---");
const kirtiSrc = join(root, "app/routes/kirti-shah-profile.jpeg");
const kirtiDest = join(root, "app/routes/kirti-shah-profile.webp");
{
  const before = (await stat(kirtiSrc)).size;
  const buffer = await sharp(kirtiSrc).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toBuffer();
  await writeFile(kirtiDest, buffer);
  const savedKB = Math.round((before - buffer.length) / 1024);
  totalSaved += before - buffer.length;
  console.log(`  ✓ kirti-shah-profile: ${Math.round(before/1024)}KB → ${Math.round(buffer.length/1024)}KB (saved ${savedKB}KB)`);
}

// 3. Convert logo.jpeg → .webp (resize to 160x160 — displayed at 40px, 4x headroom for retina)
const logoSrc = join(root, "app/routes/the nomads logo.jpeg");
const logoDest = join(root, "app/routes/the nomads logo.webp");
{
  const before = (await stat(logoSrc)).size;
  await sharp(logoSrc).resize({ width: 160, height: 160, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).webp({ quality: 85, effort: 6 }).toFile(logoDest);
  const after = (await stat(logoDest)).size;
  const savedKB = Math.round((before - after) / 1024);
  totalSaved += before - after;
  console.log(`  ✓ the nomads logo: ${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB (saved ${savedKB}KB)`);
}

console.log(`\nTotal saved: ${Math.round(totalSaved / 1024)}KB (${(totalSaved / 1024 / 1024).toFixed(1)}MB)`);
