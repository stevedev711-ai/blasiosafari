import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { consultationSchema } from "@/lib/consultation";
import { deliverLead, type Lead } from "@/lib/server/delivery";
import { siteConfig } from "@/site.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Best-effort rate limit per server instance. Use your host's firewall or a shared store for stronger limits. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string, limit = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > limit;
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured: rely on honeypot, timing and rate limit
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

const fail = (status: number, code: string, message: string, extra: object = {}) =>
  NextResponse.json({ ok: false, code, message, ...extra }, { status });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return fail(400, "bad_request", "We couldn't read the form data.");
  }

  const parsed = consultationSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return fail(422, "invalid", "Some details need attention.", { fieldErrors });
  }
  const data = parsed.data;

  // Spam protection: honeypot, minimum completion time, rate limit, optional Turnstile.
  const tooFast = typeof data.startedAt === "number" && Date.now() - data.startedAt < 4000;
  if (data.website || tooFast) {
    // Look successful to bots, but deliver nothing.
    return NextResponse.json({ ok: true, mode: siteConfig.mode, delivered: false });
  }
  if (rateLimited(ip)) return fail(429, "rate_limited", "Too many requests. Please wait a few minutes and try again.");
  if (!(await verifyTurnstile(data.turnstileToken, ip))) return fail(400, "verification", "We couldn't verify the submission. Please try again.");

  if (siteConfig.mode !== "live") {
    // Preview: validated but deliberately not sent anywhere.
    return NextResponse.json({ ok: true, mode: "preview", delivered: false });
  }

  const { website: _hp, startedAt: _s, turnstileToken: _t, ...clean } = data;
  const lead: Lead = {
    ...(clean as Lead),
    id: `BLS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
    receivedAt: new Date().toISOString(),
    followUp: siteConfig.consultation.followUp.enabled,
    userAgent: req.headers.get("user-agent")?.slice(0, 300) || "",
  };

  const { accepted, results, configured } = await deliverLead(lead);
  // Log delivery outcome without personal details.
  console.info("[consultation]", lead.id, JSON.stringify(results.map((r) => ({ c: r.channel, ok: r.ok, e: r.error }))));

  if (!configured) return fail(503, "not_configured", "Enquiries can't be received right now.");
  if (!accepted) return fail(502, "delivery_failed", "We couldn't send your enquiry.");

  return NextResponse.json({ ok: true, mode: "live", delivered: true, reference: lead.id });
}
