import "server-only";
import crypto from "node:crypto";
import { siteConfig } from "@/site.config";
import {
  type Consultation,
  accommodationOptions,
  contactMethodOptions,
  experienceOptions,
  guidingOptions,
  labelFor,
  lengthOptions,
  partySizeOptions,
  partyTypeOptions,
  plannerOptions,
  purposeOptions,
  regionOptions,
  timingOptions,
  transportOptions,
} from "@/lib/consultation";

/**
 * Lead delivery. Configure with environment variables (never in the repo):
 *
 *   LEAD_WEBHOOK_URL      POST the lead as JSON to a CRM or automation tool
 *                         (HubSpot workflow, Pipedrive via Make/Zapier, n8n …)
 *   LEAD_WEBHOOK_SECRET   optional; signs the body as X-Blasio-Signature (HMAC-SHA256)
 *   RESEND_API_KEY        send email through Resend (https://resend.com)
 *   LEAD_INBOX_EMAIL      the inbox that receives new enquiries
 *
 * A submission counts as accepted only when at least one delivery channel
 * (webhook or inbox email) succeeds. The guest's confirmation email is sent
 * after that and does not affect acceptance.
 */

export type Lead = Consultation & {
  id: string;
  receivedAt: string;
  followUp: boolean;
  userAgent: string;
};

export type DeliveryResult = { channel: string; ok: boolean; error?: string };

export function deliveryChannelsConfigured() {
  return {
    webhook: Boolean(process.env.LEAD_WEBHOOK_URL),
    inboxEmail: Boolean(process.env.RESEND_API_KEY && process.env.LEAD_INBOX_EMAIL),
    autoReply: Boolean(
      siteConfig.consultation.autoReply.enabled && process.env.RESEND_API_KEY && siteConfig.consultation.autoReply.fromEmail,
    ),
  };
}

export function summariseLead(l: Lead) {
  const when =
    l.timing === "month"
      ? `Around ${l.travelMonth}`
      : l.timing === "dates"
        ? `${l.dateFrom} to ${l.dateTo}`
        : "Flexible dates";
  const list = (opts: readonly { value: string; label: string }[], v: string[]) =>
    v.length ? v.map((x) => labelFor(opts, x)).join("; ") : "—";
  return [
    ["Reason", labelFor(purposeOptions, l.purpose) + (l.purposeOther ? ` (${l.purposeOther})` : "")],
    ["Party", `${labelFor(partyTypeOptions, l.partyType)}, ${labelFor(partySizeOptions, l.partySize)} guests`],
    ["Planning for", labelFor(plannerOptions, l.planner) + (l.plannerOrganisation ? ` (${l.plannerOrganisation})` : "")],
    ["When", `${when} · ${labelFor(timingOptions, l.timing)}`],
    ["Length", l.tripLength ? labelFor(lengthOptions, l.tripLength) : "—"],
    ["Transport", l.transport ? labelFor(transportOptions, l.transport) : "—"],
    ["Guiding", list(guidingOptions, l.guiding)],
    ["Accommodation", l.accommodation ? labelFor(accommodationOptions, l.accommodation) : "—"],
    ["Experiences", list(experienceOptions, l.experiences)],
    ["Regions", list(regionOptions, l.regions)],
    ["Name", l.name],
    ["Email", l.email],
    ["Phone / WhatsApp", l.phone || "—"],
    ["Preferred contact", labelFor(contactMethodOptions, l.contactMethod)],
    ["Time zone", l.timeZone || "—"],
    ["Notes", l.notes || "—"],
    ["Journey", l.journey || "—"],
    ["Context", l.context || "—"],
    ["Source page", l.sourcePage || "—"],
    [
      "Campaign",
      Object.entries(l.attribution || {})
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}=${v}`)
        .join(" · ") || "—",
    ],
  ] as [string, string][];
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function sendWebhook(lead: Lead): Promise<DeliveryResult> {
  const url = process.env.LEAD_WEBHOOK_URL!;
  const body = JSON.stringify({ type: "consultation_request", lead, summary: Object.fromEntries(summariseLead(lead)) });
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.LEAD_WEBHOOK_SECRET) {
    headers["x-blasio-signature"] = crypto.createHmac("sha256", process.env.LEAD_WEBHOOK_SECRET).update(body).digest("hex");
  }
  try {
    const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(10_000) });
    return { channel: "webhook", ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { channel: "webhook", ok: false, error: (e as Error).message };
  }
}

async function sendResend(payload: Record<string, unknown>, channel: string): Promise<DeliveryResult> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    return { channel, ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { channel, ok: false, error: (e as Error).message };
  }
}

function inboxEmail(lead: Lead) {
  const rows = summariseLead(lead)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5b5a52;vertical-align:top">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`)
    .join("");
  const from = siteConfig.consultation.autoReply.fromEmail;
  return {
    from: from ? `Website enquiries <${from}>` : "Website enquiries <onboarding@resend.dev>",
    to: [process.env.LEAD_INBOX_EMAIL],
    reply_to: lead.email,
    subject: `New consultation request: ${lead.name}${lead.journey ? ` · ${lead.journey}` : ""}`,
    html: `<p>New consultation request received ${lead.receivedAt} (ref ${lead.id}).</p><table>${rows}</table>`,
    text: summariseLead(lead).map(([k, v]) => `${k}: ${v}`).join("\n"),
  };
}

/** The guest's confirmation email. It acknowledges receipt only. */
export function guestConfirmationEmail(lead: Pick<Lead, "name" | "contactMethod" | "id">) {
  const first = lead.name.split(/\s+/)[0];
  const method =
    lead.contactMethod === "whatsapp" ? "on WhatsApp" : lead.contactMethod === "phone" ? "by phone" : "by email";
  const { responseTime } = siteConfig.contact;
  const lines = [
    `Dear ${first},`,
    `Thank you for your enquiry. This email confirms that we have received it.`,
    `Someone from our team will reply ${method} ${responseTime} to arrange a time to talk. On that call we'll go through the places you're interested in, who is travelling, the pace you'd like and how you would prefer to travel between regions. After that, we'll prepare a proposal for you.`,
    `Nothing has been booked or held at this stage, and there is no obligation.`,
    `If anything changes in the meantime, simply reply to this email.`,
    `With kind regards,`,
    siteConfig.brand.name,
    `Reference: ${lead.id}`,
  ];
  return {
    subject: siteConfig.consultation.autoReply.subject,
    text: lines.join("\n\n"),
    html: lines.map((l) => `<p style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#171713">${escapeHtml(l)}</p>`).join(""),
  };
}

export async function deliverLead(lead: Lead) {
  const ch = deliveryChannelsConfigured();
  const tasks: Promise<DeliveryResult>[] = [];
  if (ch.webhook) tasks.push(sendWebhook(lead));
  if (ch.inboxEmail) tasks.push(sendResend(inboxEmail(lead), "inbox-email"));
  const results = await Promise.all(tasks);
  const accepted = results.some((r) => r.ok);

  if (accepted && ch.autoReply) {
    const mail = guestConfirmationEmail(lead);
    const { fromName, fromEmail } = siteConfig.consultation.autoReply;
    results.push(
      await sendResend(
        {
          from: `${fromName} <${fromEmail}>`,
          to: [lead.email],
          reply_to: process.env.LEAD_INBOX_EMAIL || fromEmail,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        },
        "guest-confirmation",
      ),
    );
  }
  return { accepted, results, configured: tasks.length > 0 };
}
