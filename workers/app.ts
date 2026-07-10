import { createRequestHandler } from "react-router";
import { sendDailyTaskDigest, checkDueFollowUps } from "../app/lib/cron.server";

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

export default {
	fetch(request, env, ctx) {
		return requestHandler(request, {
			cloudflare: { env, ctx },
		});
	},
	async scheduled(event, env, ctx) {
		// "30 2 * * *"  -> 8:00am IST daily task digest
		// "30 3 * * *"  -> 9:00am IST daily follow-up cadence check
		if (event.cron === "30 2 * * *") {
			ctx.waitUntil(sendDailyTaskDigest(env));
		} else if (event.cron === "30 3 * * *") {
			ctx.waitUntil(checkDueFollowUps(env));
		}
	},
} satisfies ExportedHandler<Env>;
