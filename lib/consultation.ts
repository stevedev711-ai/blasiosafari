import { z } from "zod";

/** Shared by the form (client) and the API route (server). Edit labels here. */

export const ADVICE = "advice";
export const ADVICE_LABEL = "I'd like your advice";

export const purposeOptions = [
  { value: "celebration", label: "A celebration", hint: "Honeymoon, anniversary or a milestone birthday" },
  { value: "family", label: "A family trip", hint: "Including multigenerational families" },
  { value: "photography", label: "Wildlife photography", hint: "Time, light and a vehicle set up for it" },
  { value: "general", label: "A private safari", hint: "Wildlife, landscape and time away" },
  { value: "other", label: "Something else", hint: "Tell us in a few words" },
] as const;

export const partyTypeOptions = [
  { value: "couple", label: "A couple" },
  { value: "family", label: "A family, possibly several generations" },
  { value: "solo", label: "Travelling alone" },
  { value: "friends", label: "Friends or a private group" },
] as const;

export const partySizeOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3-4", label: "3–4" },
  { value: "5-8", label: "5–8" },
  { value: "9-12", label: "9–12" },
  { value: "13+", label: "13 or more" },
] as const;

export const plannerOptions = [
  { value: "self", label: "I'm planning for myself and my party" },
  { value: "assistant", label: "I'm arranging this for someone else, as an assistant or family office" },
  { value: "advisor", label: "I'm a travel advisor planning for a client" },
] as const;

export const timingOptions = [
  { value: "month", label: "A month in mind" },
  { value: "dates", label: "Specific dates" },
  { value: "flexible", label: "Flexible. Advise us on timing" },
] as const;

export const lengthOptions = [
  { value: "5-7", label: "5–7 nights" },
  { value: "8-10", label: "8–10 nights" },
  { value: "11-14", label: "11–14 nights" },
  { value: "15+", label: "15 nights or more" },
  { value: ADVICE, label: ADVICE_LABEL },
] as const;

export const transportOptions = [
  { value: "charter", label: "Private charter flights" },
  { value: "scheduled", label: "Scheduled bush flights" },
  { value: "road", label: "Road transfers where practical" },
  { value: "mix", label: "A mix, leg by leg" },
  { value: ADVICE, label: ADVICE_LABEL },
] as const;

export const guidingOptions = [
  { value: "private-vehicle", label: "A private vehicle for our party" },
  { value: "photo-guide", label: "A guide experienced with photographers" },
  { value: "family-guide", label: "A guide who is good with children" },
  { value: "specialist", label: "Specialist interests (birds, botany, conservation)" },
  { value: ADVICE, label: ADVICE_LABEL },
] as const;

export const accommodationOptions = [
  { value: "exclusive-house", label: "An exclusive-use house" },
  { value: "small-camp", label: "Small tented camps" },
  { value: "lodge", label: "Lodges with more space and amenities" },
  { value: "mix", label: "A mix" },
  { value: ADVICE, label: ADVICE_LABEL },
] as const;

export const experienceOptions = [
  { value: "walks", label: "Guided walks" },
  { value: "balloon", label: "A balloon flight" },
  { value: "night-drives", label: "Night drives" },
  { value: "rhino", label: "Rhino and conservation" },
  { value: "riding", label: "Horseback riding" },
  { value: "downtime", label: "Time to do very little" },
  { value: ADVICE, label: ADVICE_LABEL },
] as const;

export const regionOptions = [
  { value: "maasai-mara", label: "Maasai Mara" },
  { value: "lewa-laikipia", label: "Lewa & Laikipia" },
  { value: "chyulu-hills", label: "Chyulu Hills" },
  { value: ADVICE, label: ADVICE_LABEL },
] as const;

export const contactMethodOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

const values = <T extends readonly { value: string }[]>(o: T) =>
  o.map((x) => x.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

const optionalEnum = <T extends readonly { value: string }[]>(o: T) => z.enum(values(o)).optional().or(z.literal(""));

const shortText = (max: number) => z.string().trim().max(max).optional().default("");

export const attributionSchema = z
  .object({
    utm_source: shortText(200),
    utm_medium: shortText(200),
    utm_campaign: shortText(200),
    utm_term: shortText(200),
    utm_content: shortText(200),
    gclid: shortText(300),
    gbraid: shortText(300),
    wbraid: shortText(300),
    fbclid: shortText(300),
    landingPage: shortText(500),
    referrer: shortText(500),
  })
  .partial()
  .default({});

export const consultationSchema = z
  .object({
    // Step 1
    purpose: z.enum(values(purposeOptions), { errorMap: () => ({ message: "Please choose what's bringing you to Kenya." }) }),
    purposeOther: shortText(300),
    // Step 2
    partyType: z.enum(values(partyTypeOptions), { errorMap: () => ({ message: "Please tell us who is travelling." }) }),
    partySize: z.enum(values(partySizeOptions), { errorMap: () => ({ message: "Please choose an approximate party size." }) }),
    planner: z.enum(values(plannerOptions)).default("self"),
    plannerOrganisation: shortText(200),
    // Step 3
    timing: z.enum(values(timingOptions), { errorMap: () => ({ message: "Please tell us roughly when you'd like to travel." }) }),
    travelMonth: shortText(7), // YYYY-MM
    dateFrom: shortText(10), // YYYY-MM-DD
    dateTo: shortText(10),
    tripLength: optionalEnum(lengthOptions),
    // Step 4
    transport: optionalEnum(transportOptions),
    guiding: z.array(z.enum(values(guidingOptions))).max(10).default([]),
    accommodation: optionalEnum(accommodationOptions),
    experiences: z.array(z.enum(values(experienceOptions))).max(10).default([]),
    regions: z.array(z.enum(values(regionOptions))).max(10).default([]),
    // Step 5
    name: z.string().trim().min(2, "Please enter your name.").max(120),
    email: z.string().trim().email("Please enter a valid email address.").max(200),
    phone: shortText(40),
    contactMethod: z.enum(values(contactMethodOptions)).default("email"),
    timeZone: shortText(80),
    notes: shortText(3000),
    // Context
    sourcePage: shortText(300),
    journey: shortText(120),
    context: shortText(200),
    attribution: attributionSchema,
    // Spam protection (checked separately on the server)
    website: z.string().max(200).optional().default(""), // honeypot; must stay empty
    startedAt: z.number().int().optional(),
    turnstileToken: z.string().max(4000).optional(),
  })
  .superRefine((d, ctx) => {
    for (const issue of crossFieldErrors(d)) ctx.addIssue({ code: "custom", path: [issue.path], message: issue.message });
  });

/**
 * Rules that depend on other answers. Kept separate so the form can check
 * them step by step (Zod only runs superRefine once every field parses).
 */
export function crossFieldErrors(d: {
  purpose?: string;
  purposeOther?: string;
  timing?: string;
  travelMonth?: string;
  dateFrom?: string;
  dateTo?: string;
  contactMethod?: string;
  phone?: string;
}) {
  const out: { path: string; message: string }[] = [];
  const t = (v?: string) => (v ?? "").trim();
  if (d.purpose === "other" && !t(d.purposeOther)) out.push({ path: "purposeOther", message: "Please tell us a little about the trip." });
  if (d.timing === "month" && !/^\d{4}-\d{2}$/.test(t(d.travelMonth))) out.push({ path: "travelMonth", message: "Please choose a month." });
  if (d.timing === "dates") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(t(d.dateFrom))) out.push({ path: "dateFrom", message: "Please choose a start date." });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(t(d.dateTo))) out.push({ path: "dateTo", message: "Please choose an end date." });
    else if (t(d.dateFrom) && t(d.dateTo) < t(d.dateFrom)) out.push({ path: "dateTo", message: "The end date should be after the start date." });
  }
  if ((d.contactMethod === "phone" || d.contactMethod === "whatsapp") && !/^\+?[\d\s().-]{7,}$/.test(t(d.phone))) {
    out.push({
      path: "phone",
      message: `Please add a number with country code so we can reach you by ${d.contactMethod === "whatsapp" ? "WhatsApp" : "phone"}.`,
    });
  }
  return out;
}

export type ConsultationInput = z.input<typeof consultationSchema>;
export type Consultation = z.output<typeof consultationSchema>;

/** Which fields belong to which step, so the client can validate one step at a time. */
export const stepFields: Record<number, string[]> = {
  1: ["purpose", "purposeOther"],
  2: ["partyType", "partySize", "planner", "plannerOrganisation"],
  3: ["timing", "travelMonth", "dateFrom", "dateTo", "tripLength"],
  4: ["transport", "guiding", "accommodation", "experiences", "regions"],
  5: ["name", "email", "phone", "contactMethod", "timeZone", "notes"],
};

export const labelFor = (opts: readonly { value: string; label: string }[], v?: string) =>
  opts.find((o) => o.value === v)?.label ?? v ?? "";
