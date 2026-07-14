import { createRequestHandler } from "react-router";
import { sendDailyTaskDigest, checkDueFollowUps, escalateOverdueManualReviews, backupDatabase, checkVisaExpiry } from "../app/lib/cron.server";

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

// Reasonable-default security headers, not maximally strict — 'unsafe-inline'
// is needed for script-src/style-src because the app uses React Router's own
// inline hydration/scroll-restoration script and inline style={{}} attributes
// throughout; challenges.cloudflare.com is allowed for the Turnstile widget
// (script + iframe + its own verification calls); Google Fonts is allowed for
// the stylesheet + font files already loaded from root.tsx.
const SECURITY_HEADERS: Record<string, string> = {
	"Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"Content-Security-Policy": [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"font-src 'self' https://fonts.gstatic.com",
		"img-src 'self' data: https:",
		"connect-src 'self' https://challenges.cloudflare.com",
		"frame-src https://challenges.cloudflare.com",
	].join("; "),
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "geolocation=(), camera=(), microphone=()",
};

function withSecurityHeaders(response: Response): Response {
	const headers = new Headers(response.headers);
	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		headers.set(name, value);
	}
	return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
	async fetch(request, env, ctx) {
		const response = await requestHandler(request, {
			cloudflare: { env, ctx },
		});
		return withSecurityHeaders(response);
	},
	async scheduled(event, env, ctx) {
		// "30 2 * * *"  -> 8:00am IST daily task digest + visa/passport expiry check
		// "30 3 * * *"  -> 9:00am IST daily follow-up cadence check
		// "0 4 * * *"   -> 9:30am IST daily database backup (Supabase Storage)
		if (event.cron === "30 2 * * *") {
			ctx.waitUntil(sendDailyTaskDigest(env));
			ctx.waitUntil(checkVisaExpiry(env));
		} else if (event.cron === "30 3 * * *") {
			ctx.waitUntil(checkDueFollowUps(env));
			ctx.waitUntil(escalateOverdueManualReviews(env));
		} else if (event.cron === "0 4 * * *") {
			ctx.waitUntil(backupDatabase(env));
		}
	},
} satisfies ExportedHandler<Env>;
