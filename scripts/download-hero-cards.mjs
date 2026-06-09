/**
 * Downloads correctly-matched hero card images for all 37 destination cards.
 * Overwrites existing files in public/images/hero/
 */

import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';
import https from 'https';

const FFMPEG  = 'C:/Users/vedan/ffmpeg/ffmpeg-8.1.1-essentials_build/bin/ffmpeg.exe';
const OUT_DIR = 'C:/Users/vedan/react-router-starter-template/public/images/hero';
const BATCH   = 4;

// All 37 destination card photos — verified HTTP 200 against Unsplash CDN
const PHOTOS = {
  // ── INTERNATIONAL (18) ──────────────────────────────────────────────────────
  'bali':          '1537996194471-e657df975ab4',  // Bali rice terraces / Uluwatu
  'maldives':      '1514282401047-d79a71a590e8',  // Overwater villas
  'dubai':         '1651467606797-e1c660cf3fda',  // Burj Khalifa
  'singapore':     '1620033263019-f2ec2c738a60',  // Marina Bay Sands
  'thailand':      '1563492065599-3520f775eeed',  // Wat Arun Bangkok
  'vietnam':       '1596401057633-54a8fe8ef647',  // Hoi An lanterns
  'sri-lanka':     '1562602833-0f4ab2fc46e3',     // Sigiriya / elephants
  'bhutan':        '1578556881786-851d4b79cb73',  // Tiger's Nest monastery
  'europe':        '1626985249964-4fa612df0274',  // Eiffel Tower Paris
  'australia':     '1624138784614-87fd1b6528f8',  // Sydney Opera House
  'new-zealand':   '1507699622108-4be3abd695ad',  // Milford Sound / mountains
  'japan':         '1509023464722-18d996393ca8',  // Mount Fuji
  'south-korea':   '1538485399081-7191377e8241',  // Gyeongbokgung Palace Seoul
  'turkey':        '1524231757912-21f4fe3a7200',  // Cappadocia hot air balloons
  'usa':           '1485738422979-f5c462d49f74',  // Grand Canyon / national park
  'south-africa':  '1580060839134-75a5edca2e99',  // Cape Town / safari
  'kenya':         '1523805009345-7448845a9e53',  // Maasai Mara / safari wildlife
  'tanzania':      '1516426122078-c23e76319801',  // Serengeti / Kilimanjaro

  // ── INDIA (19) ──────────────────────────────────────────────────────────────
  'kashmir':            '1595815771614-ade9d652a65d',  // Dal Lake / valleys
  'leh-ladakh':         '1635255506105-b74adbd94026',  // Pangong Lake
  'himachal-pradesh':   '1597074866923-dc0589150358',  // Manali / Shimla
  'uttarakhand':        '1577516311194-eb14c570a137',  // Kedarnath / Rishikesh
  'rajasthan':          '1651569213711-b29d1fc3f995',  // Hawa Mahal / desert
  'goa':                '1672841828482-45faa4c70e50',  // Beach sunset
  'kerala':             '1609828913552-f9138ed9e42d',  // Backwaters
  'andaman':            '1599325601146-cb847c4064a1',  // Crystal clear beach
  'north-east-india':   '1742494340594-f745a81e2136',  // NE India landscapes
  'sikkim':             '1562413181-9013f9846bff',     // Kanchenjunga / Tsomgo
  'meghalaya':          '1600887988850-e78b8d504444',  // Living root bridge / waterfalls
  'arunachal-pradesh':  '1623078788671-f168da577997',  // Tawang / tribal culture
  'karnataka':          '1657856855186-7cf4909a4f78',  // Hampi / Coorg
  'tamil-nadu':         '1660582657568-e82c943318dc',  // Meenakshi temple
  'pondicherry':        '1597073642928-48c0971f7ded',  // French Quarter buildings
  'west-bengal':        '1652722230750-b8b97e4829c1',  // Darjeeling / Kolkata
  'odisha':             '1614082242765-7c98ca0f3df3',  // Konark Sun Temple / Puri
  'gujarat':            '1642841819300-20ed449c02a1',  // Rann of Kutch
  'andhra-pradesh':     '1741003415192-ea5c163aadd4',  // Tirupati / Araku valley
};

function download(url) {
  return new Promise((resolve, reject) => {
    const get = (u) => {
      https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        const bufs = [];
        res.on('data', b => bufs.push(b));
        res.on('end', () => resolve(Buffer.concat(bufs)));
        res.on('error', reject);
      }).on('error', reject);
    };
    get(url);
  });
}

function toWebP(src, dest, width) {
  execFileSync(FFMPEG, ['-y', '-i', src, '-vf', `scale=${width}:-1`,
    '-c:v', 'libwebp', '-quality', '82', dest], { stdio: 'pipe' });
}

async function runBatched(tasks, n) {
  for (let i = 0; i < tasks.length; i += n) {
    await Promise.all(tasks.slice(i, i + n).map(t => t()));
  }
}

const failed = [];
const tasks = Object.entries(PHOTOS).map(([slug, photoId]) => async () => {
  const w800  = join(OUT_DIR, `dest-${slug}-800.webp`);
  const w1400 = join(OUT_DIR, `dest-${slug}-1400.webp`);
  const tmp   = join(OUT_DIR, `_tmp-${slug}.jpg`);
  let downloaded = false;

  for (const w of ['1400', '1200']) {
    try {
      const buf = await download(
        `https://images.unsplash.com/photo-${photoId}?w=${w}&q=85&auto=format&fit=crop`
      );
      writeFileSync(tmp, buf);
      downloaded = true;
      break;
    } catch (_) {}
  }

  if (!downloaded) {
    failed.push(slug);
    process.stdout.write(`  ✗ ${slug} (${photoId}): 404\n`);
    return;
  }

  try {
    toWebP(tmp, w800, 800);
    toWebP(tmp, w1400, 1400);
    process.stdout.write(`  ✓ ${slug}\n`);
  } catch (e) {
    failed.push(slug);
    process.stdout.write(`  ✗ ${slug}: ffmpeg: ${e.message}\n`);
  } finally {
    if (existsSync(tmp)) unlinkSync(tmp);
  }
});

console.log(`Downloading ${tasks.length} destination card images (${BATCH} at a time)...`);
await runBatched(tasks, BATCH);

if (failed.length > 0) {
  console.log(`\nFailed (${failed.length}): ${failed.join(', ')}`);
} else {
  console.log(`\nAll ${tasks.length} card images downloaded successfully.`);
}
console.log('Done.');
