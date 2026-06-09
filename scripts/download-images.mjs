import https from "https";
import http from "http";
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FFMPEG = "C:\\Users\\vedan\\ffmpeg\\ffmpeg-8.1.1-essentials_build\\bin\\ffmpeg.exe";
const OUT = path.join(__dirname, "../public/images/hero");
const TMP = path.join(OUT, "tmp");

if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;
    const req = protocol.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    });
    req.on("error", (e) => { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); reject(e); });
    req.setTimeout(30000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

function toWebP(input, output, width) {
  execFileSync(FFMPEG, [
    "-y", "-i", input,
    "-vf", `scale=${width}:-2`,
    "-c:v", "libwebp",
    "-quality", "82",
    "-compression_level", "6",
    output
  ], { stdio: "pipe" });
}

// image_id → { url_800, url_1400, slug }
// For Unsplash CDN images, we fetch at the desired width directly.
// For /download?force=true links, we fetch once at full resolution and resize with ffmpeg.
const images = [
  // Hero backgrounds
  { name: "hero-1", url800: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=85", url1400: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=85" },
  { name: "hero-2", url800: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=85", url1400: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=85" },
  { name: "hero-3", url800: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=85", url1400: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=85" },
  // Destinations banner
  { name: "banner", url800: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=85", url1400: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1400&q=85" },
  // Destination cards
  { name: "dest-bali",           url800: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-maldives",       url800: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-dubai",          url800: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-singapore",      url800: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-thailand",       url800: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-vietnam",        url800: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-sri-lanka",      url800: "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-bhutan",         url800: "https://images.unsplash.com/photo-1578556881786-851d4b79cb73?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1578556881786-851d4b79cb73?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-europe",         url800: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-australia",      url800: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-new-zealand",    url800: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-japan",          url800: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-south-korea",    url800: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-turkey",         url800: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-usa",            url800: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-south-africa",   url800: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-kenya",          downloadUrl: "https://unsplash.com/photos/60XLoOgwkfA/download?force=true" },
  { name: "dest-tanzania",       downloadUrl: "https://unsplash.com/photos/qs4E9t0hJc0/download?force=true" },
  { name: "dest-kashmir",        url800: "https://images.unsplash.com/photo-1643449416258-5c8e7ec598b1?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1643449416258-5c8e7ec598b1?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-leh-ladakh",     url800: "https://images.unsplash.com/photo-1706013997636-29354e064ccc?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1706013997636-29354e064ccc?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-himachal-pradesh",url800:"https://images.unsplash.com/photo-1621232082074-1a7750ecc557?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1621232082074-1a7750ecc557?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-uttarakhand",    url800: "https://images.unsplash.com/photo-1742281412128-5832da2ddce3?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1742281412128-5832da2ddce3?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-rajasthan",      url800: "https://images.unsplash.com/photo-1757168896276-607112de366b?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1757168896276-607112de366b?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-goa",            url800: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-kerala",         url800: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-andaman",        url800: "https://images.unsplash.com/photo-1709623244452-f690c1fc8f2f?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1709623244452-f690c1fc8f2f?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-north-east-india",url800:"https://images.unsplash.com/photo-1568644577260-0568ed0217e0?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1568644577260-0568ed0217e0?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-sikkim",         url800: "https://images.unsplash.com/photo-1706465416840-85482d841da7?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1706465416840-85482d841da7?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-meghalaya",      url800: "https://images.unsplash.com/photo-1685271567656-84a60da957d9?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1685271567656-84a60da957d9?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-arunachal-pradesh",url800:"https://images.unsplash.com/photo-1648963799576-b225d65eb10c?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1648963799576-b225d65eb10c?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-karnataka",      url800: "https://plus.unsplash.com/premium_photo-1697730504977-26847b1f1f91?auto=format&fit=crop&w=800&q=82", url1400: "https://plus.unsplash.com/premium_photo-1697730504977-26847b1f1f91?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-tamil-nadu",     url800: "https://images.unsplash.com/photo-1742277296187-1cc2f783d792?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1742277296187-1cc2f783d792?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-pondicherry",    url800: "https://images.unsplash.com/photo-1706465416840-85482d841da7?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1706465416840-85482d841da7?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-west-bengal",    url800: "https://plus.unsplash.com/premium_photo-1697730497487-7bda47e4baff?auto=format&fit=crop&w=800&q=82", url1400: "https://plus.unsplash.com/premium_photo-1697730497487-7bda47e4baff?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-odisha",         downloadUrl: "https://unsplash.com/photos/a4KEI6SYy10/download?force=true" },
  { name: "dest-gujarat",        url800: "https://images.unsplash.com/photo-1670406312373-6d4d1776e4aa?auto=format&fit=crop&w=800&q=82",  url1400: "https://images.unsplash.com/photo-1670406312373-6d4d1776e4aa?auto=format&fit=crop&w=1400&q=82" },
  { name: "dest-andhra-pradesh", downloadUrl: "https://unsplash.com/photos/eQhFAilXCJ4/download?force=true" },
];

let done = 0;
const total = images.length;

async function processImage(img) {
  const w800 = path.join(OUT, `${img.name}-800.webp`);
  const w1400 = path.join(OUT, `${img.name}-1400.webp`);

  // Skip if both already exist
  if (fs.existsSync(w800) && fs.existsSync(w1400)) {
    console.log(`  [skip] ${img.name} (already exists)`);
    return;
  }

  if (img.downloadUrl) {
    // Download full-res, then resize with ffmpeg
    const tmpFile = path.join(TMP, `${img.name}.jpg`);
    console.log(`  [dl]   ${img.name} (full-res download)`);
    await download(img.downloadUrl, tmpFile);
    if (!fs.existsSync(w800)) { console.log(`  [conv] ${img.name} → 800`); toWebP(tmpFile, w800, 800); }
    if (!fs.existsSync(w1400)) { console.log(`  [conv] ${img.name} → 1400`); toWebP(tmpFile, w1400, 1400); }
    fs.unlinkSync(tmpFile);
  } else {
    // Download at specific widths directly
    const tmp800  = path.join(TMP, `${img.name}-800.jpg`);
    const tmp1400 = path.join(TMP, `${img.name}-1400.jpg`);
    if (!fs.existsSync(w800)) {
      console.log(`  [dl]   ${img.name} @800`);
      await download(img.url800, tmp800);
      console.log(`  [conv] ${img.name} → 800`);
      toWebP(tmp800, w800, 800);
      fs.unlinkSync(tmp800);
    }
    if (!fs.existsSync(w1400)) {
      console.log(`  [dl]   ${img.name} @1400`);
      await download(img.url1400, tmp1400);
      console.log(`  [conv] ${img.name} → 1400`);
      toWebP(tmp1400, w1400, 1400);
      fs.unlinkSync(tmp1400);
    }
  }
  done++;
  console.log(`  [OK]   ${img.name} (${done}/${total})`);
}

// Process 4 at a time to avoid hammering Unsplash
async function runAll() {
  const CONCURRENCY = 4;
  for (let i = 0; i < images.length; i += CONCURRENCY) {
    const batch = images.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(processImage));
  }
  // Clean up tmp
  try { fs.rmdirSync(TMP); } catch {}
  console.log("\nAll images downloaded and converted.");
}

runAll().catch(err => { console.error("Fatal:", err); process.exit(1); });
