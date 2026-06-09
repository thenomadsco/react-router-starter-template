import { destinations } from "./home";

export async function loader() {
  const WP_API_URL = "https://dev-nomadsco-journal-backend.pantheonsite.io/wp-json/wp/v2/posts?_fields=slug,modified";
  let wpUrls = "";

  try {
    const res = await fetch(WP_API_URL);
    const posts = await res.json();
    
    wpUrls = posts.map((post: any) => `
      <url>
        <loc>https://thenomadsco.in/journal/${post.slug}</loc>
        <lastmod>${new Date(post.modified).toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join("");
  } catch (e) {
    console.error("Sitemap failed to fetch WP posts", e);
  }

  // Generate URLs for all 37 dynamic destinations
  const destinationUrls = destinations.map(dest => `
    <url>
      <loc>https://thenomadsco.in/destinations/${dest.slug}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
    </url>
  `).join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://thenomadsco.in/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://thenomadsco.in/journal</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
      ${destinationUrls}
      ${wpUrls}
    </urlset>
  `;

  return new Response(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
