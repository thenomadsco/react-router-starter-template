const STORAGE_KEYS = {
  source: "nomads_utm_source",
  medium: "nomads_utm_medium",
  campaign: "nomads_utm_campaign",
};

export function persistUtm(data: { source: string; medium: string; campaign: string }): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEYS.source, data.source);
  sessionStorage.setItem(STORAGE_KEYS.medium, data.medium);
  sessionStorage.setItem(STORAGE_KEYS.campaign, data.campaign);
}

// Captures explicit ?utm_source=...&utm_medium=...&utm_campaign=... from the
// current URL and persists it. Call on every page load (not just the
// homepage) so a UTM-tagged link straight to e.g. a destination page is
// still attributed correctly, even if the visitor never touches the homepage.
export function captureUtmFromUrl(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source");
  if (!source) return;

  persistUtm({
    source,
    medium: params.get("utm_medium") || "",
    campaign: params.get("utm_campaign") || "",
  });
}

export function readStoredUtm(): { utm_source: string; utm_medium: string; utm_campaign: string } {
  if (typeof window === "undefined") return { utm_source: "", utm_medium: "", utm_campaign: "" };
  return {
    utm_source: sessionStorage.getItem(STORAGE_KEYS.source) || "",
    utm_medium: sessionStorage.getItem(STORAGE_KEYS.medium) || "",
    utm_campaign: sessionStorage.getItem(STORAGE_KEYS.campaign) || "",
  };
}
