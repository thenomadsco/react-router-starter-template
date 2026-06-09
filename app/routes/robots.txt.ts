export function loader() {
  const content = `User-agent: *
Allow: /

Sitemap: https://thenomadsco.in/sitemap.xml`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400"
    }
  });
}
