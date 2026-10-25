import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, createAuthMiddleware } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { z } from "zod";
import { browserHandoffStore, handoffCookie } from "./browser-handoff-store";

export function browserHandoff(store: ReturnType<typeof browserHandoffStore>, baseURL: string) {
  const cookie = handoffCookie(baseURL);
  return {
    id: "browser-handoff",
    endpoints: {
      startBrowserHandoff: createAuthEndpoint("/browser-handoff/start", {
        method: "POST",
        requireHeaders: true,
        body: z.object({ email: z.string().email() }),
      }, async (ctx) => {
        const secret = await store.start(ctx.body.email, ctx.getCookie(cookie.name));
        ctx.setCookie(cookie.name, secret, cookie.options);
        ctx.setHeader("Cache-Control", "no-store");
        return ctx.json({ status: true });
      }),
    },
    hooks: {
      after: [
        {
          matcher: (ctx) => ctx.path === "/magic-link/verify",
          handler: createAuthMiddleware(async (ctx) => {
            const verified = ctx.context.newSession;
            // Bind approval to the actual single-use magic token, never to a
            // caller-controlled callback URL or an already logged-in browser.
            if (verified && typeof ctx.query?.token === "string") {
              await store.approve(ctx.query.token, verified.user, verified.session.id);
            }
          }),
        },
        {
          matcher: (ctx) => ctx.path === "/get-session",
          handler: createAuthMiddleware(async (ctx) => {
            // Recovery must run through HTTP so Set-Cookie reaches the browser.
            // Server-side auth.api.getSession calls must not consume a request.
            if (!ctx.request) return;
            ctx.setHeader("Cache-Control", "no-store");
            const secret = ctx.getCookie(cookie.name);
            if (!secret) return;
            if (ctx.context.session?.user && ctx.context.session.session.expiresAt > new Date()) {
              await store.cancel(secret);
              ctx.setCookie(cookie.name, "", { ...cookie.options, maxAge: 0 });
              return;
            }
            const userId = await store.consume(secret);
            if (!userId) return;
            const user = await ctx.context.internalAdapter.findUserById(userId);
            if (!user) return;
            const session = await ctx.context.internalAdapter.createSession(userId, ctx);
            if (!session) return;
            await setSessionCookie(ctx, { session, user });
            ctx.setCookie(cookie.name, "", { ...cookie.options, maxAge: 0 });
            return ctx.json({ session, user });
          }),
        },
        {
          matcher: (ctx) => ctx.path === "/sign-out",
          handler: createAuthMiddleware(async (ctx) => {
            const secret = ctx.getCookie(cookie.name);
            if (secret) await store.cancel(secret);
            ctx.setCookie(cookie.name, "", { ...cookie.options, maxAge: 0 });
          }),
        },
      ],
    },
    rateLimit: [
      { pathMatcher: (path) => path === "/browser-handoff/start", window: 60, max: 3 },
      { pathMatcher: (path) => path === "/get-session", window: 60, max: 30 },
    ],
  } satisfies BetterAuthPlugin;
}
