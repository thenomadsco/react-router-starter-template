import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  
  // --- SEO & Infrastructure ---
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("robots.txt", "routes/robots.txt.ts"),
  route("*", "routes/not-found.tsx"), // Smart 404 Page catches broken links
  
  // --- Dynamic Routes ---
  route("journal", "routes/journal.tsx"),
  route("journal/:slug", "routes/article.tsx"),
  route("destinations/:slug", "routes/destination.tsx"),
  
  // --- Hash-anchor redirects for direct URL access ---
  route("about",        "routes/redirect-about.ts"),
  route("reviews",      "routes/redirect-reviews.ts"),
  route("destinations", "routes/redirect-destinations.ts"),

  // --- Existing Static Routes ---
  route("contactus",    "routes/redirect-contactus.ts"),
  route("privacypolicy", "routes/privacypolicy.tsx"),
  route("terms", "routes/terms.tsx"),
] satisfies RouteConfig;
