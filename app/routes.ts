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
  
  // --- Existing Static Routes ---
  route("contactus", "routes/contactus.tsx"),
  route("privacypolicy", "routes/privacypolicy.tsx"),
  route("terms", "routes/terms.tsx"),
] satisfies RouteConfig;
