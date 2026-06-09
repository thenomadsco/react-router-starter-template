/**
 * Applies accessibility and SEO fixes across all destination pages.
 * Run once with: node scripts/fix-all-pages.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const routesDir = 'C:/Users/vedan/react-router-starter-template/app/routes';

// ── TYPE A: Destination pages with PAGE_CONFIG + heroSlides carousel ──────────
const destFiles = [
  'andaman.tsx', 'australia.tsx', 'france.tsx', 'goa.tsx', 'gujarat.tsx',
  'himachal.tsx', 'indonesia.tsx', 'italy.tsx', 'japan.tsx', 'kashmir.tsx',
  'kerala.tsx', 'ladakh.tsx', 'london.tsx', 'maldives.tsx', 'meghalaya.tsx',
  'mp.tsx', 'rajasthan.tsx', 'sikkim.tsx', 'singapore.tsx', 'switzerland.tsx',
  'thailand.tsx', 'uae.tsx', 'up.tsx', 'vietnam.tsx'
];

const META_DEST = `
export function meta() {
  const title = \`\${PAGE_CONFIG.title} Tour Package | The Nomads Co.\`;
  const description = \`Explore \${PAGE_CONFIG.title} with The Nomads Co. \${PAGE_CONFIG.badge} destination. \${PAGE_CONFIG.durationLabel}. Get your free custom quote today.\`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
`;

const HEADERS_SUFFIX = 'return { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" };\n}';

function fixDestPage(file) {
  const filePath = join(routesDir, file);
  let c = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  // 1. Add meta() after headers() if not already present
  if (c.includes(HEADERS_SUFFIX) && !c.includes('export function meta()')) {
    c = c.replace(HEADERS_SUFFIX, HEADERS_SUFFIX + META_DEST);
  }

  // 2. Carousel slide indicator buttons – add aria-label
  c = c.replace(
    'key={i} type="button" onClick={() => setActiveSlide(i)}',
    'key={i} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => setActiveSlide(i)}'
  );

  // 3. Hamburger button – add aria-label
  c = c.replace(
    '<button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>',
    '<button className="lg:hidden p-2" aria-label="Open navigation menu" onClick={() => setIsOpen(!isOpen)}>'
  );

  // 4. Footer social links – add aria-labels
  c = c.replace(
    '<a href="https://www.instagram.com/thenomadsco/">',
    '<a href="https://www.instagram.com/thenomadsco/" aria-label="Follow on Instagram">'
  );
  c = c.replace(
    '<a href="https://www.facebook.com/Thenomadsco/">',
    '<a href="https://www.facebook.com/Thenomadsco/" aria-label="Follow on Facebook">'
  );
  c = c.replace(
    '<a href="mailto:thenomadsco@gmail.com">',
    '<a href="mailto:thenomadsco@gmail.com" aria-label="Email us">'
  );

  // 5. Enquiry form paragraph contrast fix
  c = c.replace(
    '<p className="text-[#1F2328]/60 mb-8">Get your final quote based on your travel dates.</p>',
    '<p className="text-[#1F2328] mb-8">Get your final quote based on your travel dates.</p>'
  );

  // 6. Form label/input associations (add htmlFor + id)
  c = c.replace(
    '>Full Name</label><input type="text" name="name"',
    ' htmlFor="name">Full Name</label><input id="name" type="text" name="name"'
  );
  c = c.replace(
    '>Phone Number</label><input type="tel" name="phone"',
    ' htmlFor="phone">Phone Number</label><input id="phone" type="tel" name="phone"'
  );
  c = c.replace(
    '>Travel Month</label><input type="text" name="travel_dates"',
    ' htmlFor="travel_dates">Travel Month</label><input id="travel_dates" type="text" name="travel_dates"'
  );
  c = c.replace(
    '>Travelers</label><input type="text" name="travelers"',
    ' htmlFor="travelers">Travelers</label><input id="travelers" type="text" name="travelers"'
  );

  writeFileSync(filePath, c, 'utf8');
  console.log(`  ✓ ${file}`);
}

// ── TYPE B: family.tsx ────────────────────────────────────────────────────────
function fixFamilyPage() {
  const filePath = join(routesDir, 'family.tsx');
  let c = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  // Add meta() before export default
  if (!c.includes('export function meta()')) {
    c = c.replace(
      'export default function FamilyPage()',
      `export function meta() {
  return [
    { title: "Family Vacations | The Nomads Co." },
    { name: "description", content: "Plan the perfect family holiday with The Nomads Co. Kid-friendly stays, relaxed itineraries, and 24/7 support. Tailored trips across India and worldwide." },
    { property: "og:title", content: "Family Vacations | The Nomads Co." },
    { property: "og:description", content: "Unforgettable family holidays crafted by The Nomads Co." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export default function FamilyPage()`
    );
  }

  // Hero image – add loading/decoding attributes
  c = c.replace(
    '<img src={PAGE_CONFIG.heroImage} alt="Family Vacation" className="absolute inset-0 w-full h-full object-cover" />',
    '<img src={PAGE_CONFIG.heroImage} alt="Family Vacation" className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />'
  );

  // EnquiryForm paragraph contrast
  c = c.replace(
    '<p className="text-[#1F2328]/60 mb-8">Tell us about your family and we\'ll craft the perfect trip.</p>',
    '<p className="text-[#1F2328] mb-8">Tell us about your family and we\'ll craft the perfect trip.</p>'
  );

  // Add labels to form inputs (inputs-only form, add sr-only labels)
  c = c.replace(
    '<input type="text" name="name" required placeholder="Parent\'s Name"',
    '<label htmlFor="family-name" className="sr-only">Full Name</label><input id="family-name" type="text" name="name" required placeholder="Parent\'s Name"'
  );
  c = c.replace(
    '<input type="tel" name="phone" required placeholder="Phone Number"',
    '<label htmlFor="family-phone" className="sr-only">Phone Number</label><input id="family-phone" type="tel" name="phone" required placeholder="Phone Number"'
  );

  writeFileSync(filePath, c, 'utf8');
  console.log('  ✓ family.tsx');
}

// ── TYPE C: honeymoon.tsx ─────────────────────────────────────────────────────
function fixHoneymoonPage() {
  const filePath = join(routesDir, 'honeymoon.tsx');
  let c = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  if (!c.includes('export function meta()')) {
    c = c.replace(
      'export default function HoneymoonPage()',
      `export function meta() {
  return [
    { title: "Honeymoon Specials | The Nomads Co." },
    { name: "description", content: "Begin your forever with The Nomads Co. Romantic honeymoon packages to Maldives, Switzerland, France, Kerala, and more. Complimentary hotel upgrades included." },
    { property: "og:title", content: "Honeymoon Specials | The Nomads Co." },
    { property: "og:description", content: "Curated honeymoon packages with complimentary room upgrades, candlelit dinners, and spa treatments." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export default function HoneymoonPage()`
    );
  }

  // Hero image
  c = c.replace(
    '<img src={PAGE_CONFIG.heroImage} alt="Honeymoon" className="absolute inset-0 w-full h-full object-cover" />',
    '<img src={PAGE_CONFIG.heroImage} alt="Honeymoon" className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />'
  );

  // EnquiryForm paragraph contrast
  c = c.replace(
    '<p className="text-[#1F2328]/60 mb-8">Let us make your first trip as a married couple magical.</p>',
    '<p className="text-[#1F2328] mb-8">Let us make your first trip as a married couple magical.</p>'
  );

  // Add sr-only labels to form inputs
  c = c.replace(
    '<input type="text" name="name" required placeholder="Name"',
    '<label htmlFor="hm-name" className="sr-only">Full Name</label><input id="hm-name" type="text" name="name" required placeholder="Name"'
  );
  c = c.replace(
    '<input type="tel" name="phone" required placeholder="Phone Number"',
    '<label htmlFor="hm-phone" className="sr-only">Phone Number</label><input id="hm-phone" type="tel" name="phone" required placeholder="Phone Number"'
  );

  writeFileSync(filePath, c, 'utf8');
  console.log('  ✓ honeymoon.tsx');
}

// ── TYPE D: friends.tsx (same structure as honeymoon) ─────────────────────────
function fixFriendsPage() {
  const filePath = join(routesDir, 'friends.tsx');
  let c = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  if (!c.includes('export function meta()')) {
    c = c.replace(
      'export default function HoneymoonPage()',
      `export function meta() {
  return [
    { title: "Honeymoon Specials | The Nomads Co." },
    { name: "description", content: "Begin your forever with The Nomads Co. Romantic honeymoon packages to Maldives, Switzerland, France, Kerala, and more. Complimentary hotel upgrades included." },
    { property: "og:title", content: "Honeymoon Specials | The Nomads Co." },
    { property: "og:description", content: "Curated honeymoon packages with complimentary room upgrades, candlelit dinners, and spa treatments." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export default function HoneymoonPage()`
    );
  }

  // Hero image
  c = c.replace(
    '<img src={PAGE_CONFIG.heroImage} alt="Honeymoon" className="absolute inset-0 w-full h-full object-cover" />',
    '<img src={PAGE_CONFIG.heroImage} alt="Honeymoon" className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" decoding="async" />'
  );

  // Paragraph contrast
  c = c.replace(
    '<p className="text-[#1F2328]/60 mb-8">Let us make your first trip as a married couple magical.</p>',
    '<p className="text-[#1F2328] mb-8">Let us make your first trip as a married couple magical.</p>'
  );

  // sr-only labels
  c = c.replace(
    '<input type="text" name="name" required placeholder="Name"',
    '<label htmlFor="fr-name" className="sr-only">Full Name</label><input id="fr-name" type="text" name="name" required placeholder="Name"'
  );
  c = c.replace(
    '<input type="tel" name="phone" required placeholder="Phone Number"',
    '<label htmlFor="fr-phone" className="sr-only">Phone Number</label><input id="fr-phone" type="tel" name="phone" required placeholder="Phone Number"'
  );

  writeFileSync(filePath, c, 'utf8');
  console.log('  ✓ friends.tsx');
}

// ── TYPE E: journal.tsx ───────────────────────────────────────────────────────
function fixJournalPage() {
  const filePath = join(routesDir, 'journal.tsx');
  let c = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  // Add meta() after loader
  if (!c.includes('export function meta()')) {
    c = c.replace(
      'export default function Journal()',
      `export function meta() {
  return [
    { title: "The Journal | The Nomads Co." },
    { name: "description", content: "Travel stories, tips, and behind-the-scenes insights from The Nomads Co. journeys around the world." },
    { property: "og:title", content: "The Journal | The Nomads Co." },
    { property: "og:description", content: "Stories, insights, and behind-the-scenes glimpses from our journeys around the globe." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export default function Journal()`
    );
  }

  // Post images – add lazy loading
  c = c.replace(
    'className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"',
    'className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" loading="lazy" decoding="async"'
  );

  // Post title heading h4 → h2 (inside posts grid, h1 is already "The Journal")
  c = c.replace(
    /<h4 className="text-xl font-bold text-white/g,
    '<h2 className="text-xl font-bold text-white'
  );
  c = c.replace(/<\/h4>/g, '</h2>');

  writeFileSync(filePath, c, 'utf8');
  console.log('  ✓ journal.tsx');
}

// ── RUN ALL ───────────────────────────────────────────────────────────────────
console.log('\nFixing destination pages (Type A)...');
for (const f of destFiles) fixDestPage(f);

console.log('\nFixing special pages...');
fixFamilyPage();
fixHoneymoonPage();
fixFriendsPage();
fixJournalPage();

console.log('\nAll done.\n');
