/**
 * Downloads all 96 accurately-matched carousel images for 24 destination pages.
 * Overwrites existing files. Source: research agent–verified Unsplash long-form IDs.
 */

import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';
import https from 'https';

const FFMPEG  = 'C:/Users/vedan/ffmpeg/ffmpeg-8.1.1-essentials_build/bin/ffmpeg.exe';
const OUT_DIR = 'C:/Users/vedan/react-router-starter-template/public/images/slides';
const BATCH   = 4;

const PHOTOS = {
  // ANDAMAN
  'andaman-1': '1593202232429-549625b8660d',   // Radhanagar Beach
  'andaman-2': '1708649290066-5f617003b93f',   // Coral reef / scuba
  'andaman-3': '1650451846800-b384c1ca0b25',   // Cellular Jail
  'andaman-4': '1545762374-d18079617da8',      // Neil Island natural arch

  // AUSTRALIA
  'australia-1': '1624138784614-87fd1b6528f8', // Sydney Opera House
  'australia-2': '1596430222039-4a2d7b4cd767', // Twelve Apostles
  'australia-3': '1575699914911-0027c7b95fb6', // Kangaroo at sunset
  'australia-4': '1607309843659-f4ad95cf3277', // Gold Coast skyline

  // FRANCE
  'france-1': '1626985249964-4fa612df0274',    // Eiffel Tower
  'france-2': '1554149082-75d460afced3',       // French Riviera Nice
  'france-3': '1587648415693-4a5362b2ce41',    // Louvre pyramid
  'france-4': '1581819896533-f8ab6767ce7e',    // Monaco harbour

  // GOA
  'goa-1': '1605015239078-95f963a8b35c',       // Palolem Beach
  'goa-2': '1654966786372-b28379e56b23',       // Old Goa church
  'goa-3': '1642516864335-2ca9d8b3a511',       // Chapora Fort
  'goa-4': '1582972236019-ea4af5ffe587',       // Palm trees sunset

  // GUJARAT
  'gujarat-1': '1670923331633-be262e035a9a',   // Rann of Kutch white salt
  'gujarat-2': '1644762932749-7127d6961253',   // Statue of Unity
  'gujarat-3': '1723871569771-7d1bf1d67628',   // Modhera Sun Temple
  'gujarat-4': '1588540828794-fba2342b0ef4',   // Gir lion

  // HIMACHAL PRADESH
  'himachal-1': '1597167231350-d057a45dc868',  // Manali snow mountains
  'himachal-2': '1648830802584-ec070946e591',  // Shimla Ridge
  'himachal-3': '1651317720959-2ee65b345736',  // Spiti Valley
  'himachal-4': '1681176323164-bd4eeb724b81',  // Kasol river

  // INDONESIA (BALI)
  'indonesia-1': '1633820313053-fa030b13ef94', // Tegalalang rice terraces
  'indonesia-2': '1566987827971-f2c40e748a54', // Kelingking Beach Nusa Penida
  'indonesia-3': '1604842937136-1648761a6256', // Uluwatu Temple
  'indonesia-4': '1530080338378-25af8876ae2e', // Balinese temple gate

  // ITALY
  'italy-1': '1552832230-c0197dd311b5',        // Colosseum Rome
  'italy-2': '1523906921802-b5d2d899e93b',     // Venice Grand Canal
  'italy-3': '1561495934-8c5cea8192b0',        // Florence Duomo
  'italy-4': '1612698093158-e07ac200d44e',     // Amalfi Coast

  // JAPAN
  'japan-1': '1509023464722-18d996393ca8',     // Mount Fuji
  'japan-2': '1549693578-d683be217e58',        // Shibuya crossing
  'japan-3': '1558862107-d49ef2a04d72',        // Fushimi Inari torii
  'japan-4': '1559866105-63d346cc87f3',        // Dotonbori Osaka

  // KASHMIR
  'kashmir-1': '1715457573748-8e8a70b2c1be',   // Dal Lake shikara
  'kashmir-2': '1552098933-a5ceb0e5dd91',      // Gulmarg snow slopes
  'kashmir-3': '1661747340818-df15f186554e',   // Pahalgam valley
  'kashmir-4': '1716447340468-b8b8cc3da3c7',   // Sonamarg glacier

  // KERALA
  'kerala-1': '1602216056096-3b40cc0c9944',    // Alleppey backwaters
  'kerala-2': '1580818135730-ebd11086660b',    // Munnar tea gardens
  'kerala-3': '1590123732197-e7079d2ceb89',    // Kochi Chinese fishing nets
  'kerala-4': '1591414638143-12980893e46f',    // Kathakali dance

  // LADAKH
  'ladakh-1': '1635255506105-b74adbd94026',    // Pangong Lake
  'ladakh-2': '1593118845043-359e5f628214',    // Thiksey Monastery
  'ladakh-3': '1593118960299-4818285df788',    // Nubra Valley sand dunes
  'ladakh-4': '1558187424-f786111643b0',       // Khardung La pass

  // LONDON (UK)
  'london-1': '1486299267070-83823f5448dd',    // Big Ben Westminster
  'london-2': '1535448033526-c0e85c9e6968',    // Edinburgh Castle
  'london-3': '1609674750700-33895b9b7ce1',    // Scottish Highlands
  'london-4': '1589806361261-01ee46a61fda',    // Bath Roman Baths

  // MALDIVES
  'maldives-1': '1514282401047-d79a71a590e8',  // Overwater villas
  'maldives-2': '1491119683413-71b291d4c957',  // Aerial turquoise lagoon
  'maldives-3': '1515931159317-fbb9577f43b8',  // Snorkeling coral reef
  'maldives-4': '1503125210483-8b1d12bccdbe',  // Sunset dhow cruise

  // MEGHALAYA
  'meghalaya-1': '1742494267580-e026d3737f65', // Living root bridge Cherrapunji
  'meghalaya-2': '1506486166020-f65a2be581f8', // Dawki river crystal clear
  'meghalaya-3': '1735567065045-97ba386867ad', // Nohkalikai Falls
  'meghalaya-4': '1534531409543-069f6204c5b4', // Shillong cityscape

  // MADHYA PRADESH
  'mp-1': '1671375159250-8f81a29e54e7',        // Khajuraho temples
  'mp-2': '1591824390307-891be1626e6d',        // Tiger at Kanha NP
  'mp-3': '1650652982956-8586505461bb',        // Bhedaghat marble rocks
  'mp-4': '1699988194923-50f944f92d9a',        // Sanchi Stupa

  // RAJASTHAN
  'rajasthan-1': '1603262110263-fb0112e7cc33', // Hawa Mahal Jaipur
  'rajasthan-2': '1695956353120-54ce5e91632b', // Udaipur Lake Pichola
  'rajasthan-3': '1602643454724-21d5a40722db', // Jodhpur blue city
  'rajasthan-4': '1698759087628-22a6460560df', // Thar desert camels

  // SIKKIM
  'sikkim-1': '1668350200913-61ed1101f4d5',    // Tsomgo Lake
  'sikkim-2': '1668437824006-1be44600774b',    // Kanchenjunga peak
  'sikkim-3': '1687074106203-f3dad46d9eb6',    // Pelling monastery
  'sikkim-4': '1635756227689-01eda5140530',    // Temi tea garden

  // SINGAPORE
  'singapore-1': '1620033263019-f2ec2c738a60', // Marina Bay Sands
  'singapore-2': '1768117177972-d7210aff2d5d', // Gardens by the Bay
  'singapore-3': '1662385825401-d529115306a4', // Sentosa Island
  'singapore-4': '1708084026185-7fca3b12ee26', // Jewel Changi waterfall

  // SWITZERLAND
  'switzerland-1': '1586752488885-6ce47fdfd874', // Matterhorn Zermatt
  'switzerland-2': '1477271706509-fecda7438b68', // Chapel Bridge Lucerne
  'switzerland-3': '1605825831039-8b6b4199b04a', // Interlaken lakes
  'switzerland-4': '1620563092215-0fbc6b55cfc5', // Zurich old town

  // THAILAND
  'thailand-1': '1563492065599-3520f775eeed',  // Wat Arun Bangkok
  'thailand-2': '1534008897995-27a23e859048',  // Phi Phi Islands
  'thailand-3': '1674043549153-fd19e38b5197',  // Phang Nga James Bond Island
  'thailand-4': '1642391326189-46e163cad59f',  // Floating market

  // UAE (DUBAI)
  'uae-1': '1651467606797-e1c660cf3fda',       // Burj Khalifa
  'uae-2': '1590273089302-ebbc53986b6e',       // Sheikh Zayed Grand Mosque
  'uae-3': '1671169154676-3173d0a1ac4c',       // Desert safari dunes
  'uae-4': '1682410601904-24ec1d9858e6',       // Palm Jumeirah aerial

  // UTTAR PRADESH
  'up-1': '1627938823193-fd13c1c867dd',        // Varanasi ghats
  'up-2': '1564507592333-c60657eea523',        // Taj Mahal
  'up-3': '1672398760212-08ce34b88c62',        // Ram Mandir Ayodhya
  'up-4': '1688287580970-70fe8e0f4bef',        // Lucknow Rumi Darwaza

  // VIETNAM
  'vietnam-1': '1698776037447-7825b5495803',   // Ha Long Bay
  'vietnam-2': '1741138327956-dfa75763b50d',   // Golden Bridge Ba Na Hills
  'vietnam-3': '1596401057633-54a8fe8ef647',   // Hoi An lantern street
  'vietnam-4': '1679562078540-09ae866ef4bf',   // Hanoi Old Quarter
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
const tasks = [];

for (const [key, photoId] of Object.entries(PHOTOS)) {
  tasks.push(async () => {
    const w800  = join(OUT_DIR, `${key}-800.webp`);
    const w1400 = join(OUT_DIR, `${key}-1400.webp`);
    const tmp   = join(OUT_DIR, `_tmp-${key}.jpg`);
    let downloaded = false;

    for (const w of ['1400', '1200']) {
      try {
        const buf = await download(
          `https://images.unsplash.com/photo-${photoId}?w=${w}&q=85&auto=format&fit=crop`
        );
        writeFileSync(tmp, buf);
        downloaded = true;
        break;
      } catch (_) { /* try next */ }
    }

    if (!downloaded) {
      failed.push(key);
      process.stdout.write(`  ✗ ${key} (${photoId}): 404 both sizes\n`);
      return;
    }

    try {
      toWebP(tmp, w800, 800);
      toWebP(tmp, w1400, 1400);
      process.stdout.write(`  ✓ ${key}\n`);
    } catch (e) {
      failed.push(key);
      process.stdout.write(`  ✗ ${key}: ffmpeg: ${e.message}\n`);
    } finally {
      if (existsSync(tmp)) unlinkSync(tmp);
    }
  });
}

console.log(`Downloading ${tasks.length} images (${BATCH} at a time)...`);
await runBatched(tasks, BATCH);

if (failed.length > 0) {
  console.log(`\nFailed (${failed.length}): ${failed.join(', ')}`);
} else {
  console.log(`\nAll ${tasks.length} images downloaded successfully.`);
}
console.log('Done.');
