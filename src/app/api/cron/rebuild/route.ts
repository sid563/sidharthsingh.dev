/**
 * Daily rebuild trigger, called by Vercel Cron (see vercel.json) so the
 * GitHub activity calendar on /progress stays fresh without a push.
 *
 * Inert until two environment variables exist on Vercel:
 * - CRON_SECRET: Vercel sends it as a bearer token with every cron request.
 * - DEPLOY_HOOK_URL: a Deploy Hook from the project's Git settings.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const hook = process.env.DEPLOY_HOOK_URL;
  if (!hook) {
    return Response.json({ ok: false, reason: "DEPLOY_HOOK_URL is not set" });
  }
  const res = await fetch(hook, { method: "POST" });
  return Response.json({ ok: res.ok, status: res.status });
}
