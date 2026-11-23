"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ADVICE,
  accommodationOptions,
  consultationSchema,
  crossFieldErrors,
  contactMethodOptions,
  experienceOptions,
  guidingOptions,
  lengthOptions,
  partySizeOptions,
  partyTypeOptions,
  plannerOptions,
  purposeOptions,
  regionOptions,
  stepFields,
  timingOptions,
  transportOptions,
  labelFor,
} from "@/lib/consultation";
import { getAttribution } from "@/lib/attribution";
import { track, trackConversion } from "@/lib/analytics";
import { siteConfig } from "@/site.config";
import { journeys } from "@/content/journeys";
import { destinations } from "@/content/destinations";

export type FormContext = {
  journey?: string;
  destination?: string;
  interest?: string;
  context?: string;
  from?: string;
};

type Data = {
  purpose: string;
  purposeOther: string;
  partyType: string;
  partySize: string;
  planner: string;
  plannerOrganisation: string;
  timing: string;
  travelMonth: string;
  dateFrom: string;
  dateTo: string;
  tripLength: string;
  transport: string;
  guiding: string[];
  accommodation: string;
  experiences: string[];
  regions: string[];
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  timeZone: string;
  notes: string;
};

const EMPTY: Data = {
  purpose: "",
  purposeOther: "",
  partyType: "",
  partySize: "",
  planner: "self",
  plannerOrganisation: "",
  timing: "",
  travelMonth: "",
  dateFrom: "",
  dateTo: "",
  tripLength: "",
  transport: "",
  guiding: [],
  accommodation: "",
  experiences: [],
  regions: [],
  name: "",
  email: "",
  phone: "",
  contactMethod: "email",
  timeZone: "",
  notes: "",
};

const STEPS = [
  { n: 1, name: "reason", title: "What's bringing you to Kenya?", help: "Choose the closest fit. We'll ask about details on the call." },
  { n: 2, name: "party", title: "Who's travelling?", help: "Approximate numbers are fine." },
  { n: 3, name: "timing", title: "When would you like to travel?", help: "A month, specific dates, or leave it to us to advise." },
  { n: 4, name: "preferences", title: "What would you like us to plan around?", help: "Everything here is optional. Choose “I'd like your advice” where you'd rather we suggested something." },
  { n: 5, name: "contact", title: "How can we reach you?", help: "We only use these details to reply to your enquiry." },
] as const;

const DRAFT_KEY = "blasio-consultation-draft";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const COMMON_TZ = ["America/New_York", "America/Chicago", "America/Los_Angeles", "Europe/London", "Asia/Dubai", "Asia/Riyadh", "Asia/Qatar", "Africa/Nairobi"];

function initialFromContext(ctx: FormContext): { data: Partial<Data>; label: string | null; journeyTitle: string } {
  const d: Partial<Data> = {};
  const labels: string[] = [];
  let journeyTitle = "";
  const j = journeys.find((x) => x.slug === ctx.journey);
  if (j) {
    journeyTitle = `${j.title} | ${j.length}`;
    labels.push(`${j.title} (${j.length}, sample journey)`);
    d.tripLength = j.nights <= 10 ? "8-10" : "11-14";
    d.regions = j.slug === "rhino-and-big-cat-journey" ? ["lewa-laikipia", "maasai-mara"] : ["maasai-mara"];
    if (j.slug === "rhino-and-big-cat-journey") d.experiences = ["rhino"];
  }
  const dest = destinations.find((x) => x.slug === ctx.destination);
  if (dest) {
    labels.push(dest.name);
    d.regions = Array.from(new Set([...(d.regions ?? []), dest.slug]));
  }
  if (ctx.interest === "family") {
    labels.push("Family safari");
    Object.assign(d, { purpose: "family", partyType: "family", guiding: ["family-guide"] });
  } else if (ctx.interest === "couple") {
    labels.push("A safari for two");
    Object.assign(d, { purpose: "celebration", partyType: "couple", partySize: "2" });
  } else if (ctx.interest === "photography") {
    labels.push("Wildlife photography");
    Object.assign(d, { purpose: "photography", guiding: ["private-vehicle", "photo-guide"] });
  }
  if (ctx.context) labels.push(ctx.context.slice(0, 80));
  return { data: d, label: labels.length ? labels.join(" · ") : null, journeyTitle };
}

export function ConsultationForm({ context = {}, variant = "page" }: { context?: FormContext; variant?: "page" | "landing" }) {
  const preview = siteConfig.mode !== "live";
  const ctxInit = useMemo(() => initialFromContext(context), [context]);
  const [ctxLabel, setCtxLabel] = useState<string | null>(ctxInit.label);
  const [journeyTitle, setJourneyTitle] = useState(ctxInit.journeyTitle);
  const [data, setData] = useState<Data>({ ...EMPTY, ...ctxInit.data });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "preview-done" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [reference, setReference] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const startedAt = useRef<number>(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const sourcePage = context.from || (variant === "landing" ? "/private-safari-kenya" : "/private-consultation");

  // Restore an unsent draft from this browser session (context from the link still wins).
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
      if (saved && typeof saved === "object") setData((d) => ({ ...d, ...saved, ...ctxInit.data }));
    } catch {}
    if (!data.timeZone) {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) setData((d) => ({ ...d, timeZone: d.timeZone || tz }));
      } catch {}
    }
    track("consultation_view", { source_page: sourcePage, journey: context.journey, mode: siteConfig.mode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== "idle" && status !== "error") return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch {}
  }, [data, status]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (status === "success" || status === "preview-done") {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [status]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const toggle = (k: "guiding" | "experiences" | "regions", v: string) => {
    setData((d) => {
      let next = d[k].includes(v) ? d[k].filter((x) => x !== v) : [...d[k], v];
      // "I'd like your advice" is exclusive of specific choices.
      if (v === ADVICE && next.includes(ADVICE)) next = [ADVICE];
      else if (v !== ADVICE) next = next.filter((x) => x !== ADVICE);
      return { ...d, [k]: next };
    });
  };

  const payload = () => ({
    ...data,
    sourcePage,
    journey: journeyTitle,
    context: ctxLabel ?? "",
    attribution: getAttribution(),
    website: honeypot,
    startedAt: startedAt.current,
    turnstileToken,
  });

  const validate = (upTo: number) => {
    const p = payload();
    const res = consultationSchema.safeParse(p);
    if (res.success) return {};
    const fields = Array.from({ length: upTo }, (_, i) => stepFields[i + 1]).flat();
    const errs: Record<string, string> = {};
    const issues = [...res.error.issues.map((i) => ({ path: String(i.path[0]), message: i.message })), ...crossFieldErrors(p)];
    for (const issue of issues) {
      if (fields.includes(issue.path) && !errs[issue.path]) errs[issue.path] = issue.message;
    }
    return errs;
  };

  const showErrors = (errs: Record<string, string>) => {
    setErrors(errs);
    requestAnimationFrame(() => {
      summaryRef.current?.focus({ preventScroll: true });
      summaryRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  };

  const next = () => {
    const errs = validate(step);
    const stepErrs = Object.fromEntries(Object.entries(errs).filter(([k]) => stepFields[step].includes(k)));
    if (Object.keys(stepErrs).length) return showErrors(stepErrs);
    setErrors({});
    track("consultation_step", { step: step + 1, step_name: STEPS[step].name, journey: context.journey });
    setStep((s) => Math.min(5, s + 1));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) return next();
    const errs = validate(5);
    if (Object.keys(errs).length) {
      const firstStep = [1, 2, 3, 4, 5].find((n) => stepFields[n].some((f) => errs[f])) ?? 5;
      if (firstStep !== 5) setStep(firstStep);
      return showErrors(errs);
    }
    setStatus("submitting");
    setServerMsg("");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {}
        if (body.mode === "preview") {
          setStatus("preview-done");
          track("consultation_test_submit", { mode: "preview" });
        } else {
          setReference(body.reference || "");
          setStatus("success");
          track("generate_lead", { purpose: data.purpose, party_type: data.partyType, journey: context.journey, source_page: sourcePage });
          trackConversion();
        }
        return;
      }
      if (res.status === 422 && body.fieldErrors) {
        const errs2: Record<string, string> = {};
        for (const [k, v] of Object.entries(body.fieldErrors as Record<string, string>)) errs2[k.split(".")[0]] = v;
        const firstStep = [1, 2, 3, 4, 5].find((n) => stepFields[n].some((f) => errs2[f])) ?? 5;
        setStatus("idle");
        setStep(firstStep);
        return showErrors(errs2);
      }
      setServerMsg(body.message || "");
      setStatus("error");
      track("consultation_submit_error", { error_code: body.code || res.status });
    } catch {
      setServerMsg("");
      setStatus("error");
      track("consultation_submit_error", { error_code: "network" });
    }
  };

  const reset = () => {
    setData({ ...EMPTY, ...ctxInit.data, timeZone: data.timeZone });
    setStep(1);
    setStatus("idle");
    startedAt.current = Date.now();
  };

  const err = (k: string) =>
    errors[k] ? (
      <p className="field-error" id={`${k}-error`}>
        {errors[k]}
      </p>
    ) : null;
  const inv = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});

  const firstName = data.name.trim().split(/\s+/)[0];
  const altContact = (
    <div className="alt-contact">
      {siteConfig.contact.publicEmail && (
        <p className="small" style={{ margin: 0 }}>
          Email us directly: <a href={`mailto:${siteConfig.contact.publicEmail}`}>{siteConfig.contact.publicEmail}</a>
        </p>
      )}
      {siteConfig.contact.whatsappUrl && (
        <a className="text-link" href={siteConfig.contact.whatsappUrl} target="_blank" rel="noopener">
          Message us on WhatsApp <span className="arrow" aria-hidden="true">→</span>
        </a>
      )}
      {siteConfig.contact.schedulingUrl && (
        <a className="text-link" href={siteConfig.contact.schedulingUrl} target="_blank" rel="noopener">
          Schedule a call <span className="arrow" aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );

  // ---------- Result states ----------

  if (status === "success") {
    return (
      <div className="form-card result-panel" ref={resultRef} tabIndex={-1} role="status" aria-live="polite">
        <p className="eyebrow">Enquiry received</p>
        <h2>Thank you{firstName ? `, ${firstName}` : ""}.</h2>
        <p>
          We&apos;ve received your enquiry. Someone from our team will reply{" "}
          {data.contactMethod === "email" ? "by email" : data.contactMethod === "whatsapp" ? "on WhatsApp" : "by phone"}{" "}
          {siteConfig.contact.responseTime} to arrange a time to talk.
        </p>
        <p>
          {siteConfig.consultation.autoReply.enabled
            ? "A confirmation email is on its way to you. If you don't see it, please check your junk folder."
            : null}{" "}
          Nothing has been booked or held, and there is no obligation.
        </p>
        {reference && <p className="small muted">Reference: {reference}</p>}
        {(siteConfig.contact.schedulingUrl || siteConfig.contact.whatsappUrl) && altContact}
        <div className="result-actions">
          <Link className="btn btn-ghost" href="/journeys">Explore sample journeys</Link>
        </div>
      </div>
    );
  }

  if (status === "preview-done") {
    return (
      <div className="form-card result-panel" ref={resultRef} tabIndex={-1} role="status" aria-live="polite">
        <p className="eyebrow">Preview mode: test enquiry</p>
        <h2>Test enquiry not sent.</h2>
        <p>
          Your answers passed validation on the server, but this is a preview build, so nothing was sent to an inbox or CRM and no
          confirmation email was sent. When the site is switched to live mode, real enquiries are delivered and the guest sees a
          confirmation here.
        </p>
        <div className="result-actions">
          <button type="button" className="btn" onClick={reset}>Start another test</button>
          <Link className="btn btn-ghost" href="/">Back to the home page</Link>
        </div>
      </div>
    );
  }

  const s = STEPS[step - 1];
  const errorList = Object.entries(errors).filter(([, v]) => v);

  return (
    <div className="form-card">
      {preview && (
        <div className="test-notice" role="note">
          <strong>Test form</strong>
          This is a preview. Test enquiries are checked but not sent to anyone.
        </div>
      )}

      {ctxLabel && (
        <div className="context-chip">
          <span>
            <span className="muted">Enquiring about: </span>
            <strong>{ctxLabel}</strong>
          </span>
          <button
            type="button"
            onClick={() => {
              setCtxLabel(null);
              setJourneyTitle("");
            }}
          >
            Remove
          </button>
        </div>
      )}

      <div className="progress" aria-hidden="false">
        <div className="progress-meta">
          <span>Step {step} of 5</span>
          <span>{s.name === "contact" ? "Last step" : ""}</span>
        </div>
        <div className="progress-track" role="progressbar" aria-label="Consultation progress" aria-valuemin={1} aria-valuemax={5} aria-valuenow={step} aria-valuetext={`Step ${step} of 5: ${s.title}`}>
          {STEPS.map((x) => (
            <span key={x.n} className={x.n < step ? "done" : x.n === step ? "current" : ""} />
          ))}
        </div>
      </div>

      <form onSubmit={submit} noValidate aria-labelledby="step-title">
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>

        <div className="form-step">
          <h2 id="step-title" ref={headingRef} tabIndex={-1}>{s.title}</h2>
          <p className="step-help">{s.help}</p>

          {errorList.length > 0 && (
            <div className="error-summary" ref={summaryRef} tabIndex={-1} role="alert">
              <h3>Please check {errorList.length === 1 ? "this answer" : "these answers"}</h3>
              <ul>
                {errorList.map(([k, v]) => (
                  <li key={k}>
                    <a href={`#field-${k}`}>{v}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 1 && (
            <>
              <fieldset id="field-purpose" {...(errors.purpose ? { "aria-describedby": "purpose-error" } : {})}>
                <legend className="visually-hidden">{s.title}</legend>
                <div className="choice-grid">
                  {purposeOptions.map((o) => (
                    <label className="choice" key={o.value}>
                      <input type="radio" name="purpose" value={o.value} checked={data.purpose === o.value} onChange={() => set("purpose", o.value)} />
                      <span className="choice-text">
                        <span className="choice-title">{o.label}</span>
                        <span className="choice-hint">{o.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {err("purpose")}
              </fieldset>
              {data.purpose === "other" && (
                <div className="field">
                  <label htmlFor="field-purposeOther">In a few words</label>
                  <input id="field-purposeOther" type="text" value={data.purposeOther} onChange={(e) => set("purposeOther", e.target.value)} maxLength={300} {...inv("purposeOther")} />
                  {err("purposeOther")}
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <fieldset id="field-partyType" {...(errors.partyType ? { "aria-describedby": "partyType-error" } : {})}>
                <legend>Your party</legend>
                <div className="choice-grid cols-2">
                  {partyTypeOptions.map((o) => (
                    <label className="choice" key={o.value}>
                      <input type="radio" name="partyType" value={o.value} checked={data.partyType === o.value} onChange={() => set("partyType", o.value)} />
                      <span className="choice-text"><span className="choice-title">{o.label}</span></span>
                    </label>
                  ))}
                </div>
                {err("partyType")}
              </fieldset>
              <div className="field">
                <label htmlFor="field-partySize">Approximate number of travellers</label>
                <select id="field-partySize" value={data.partySize} onChange={(e) => set("partySize", e.target.value)} {...inv("partySize")}>
                  <option value="">Choose…</option>
                  {partySizeOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {err("partySize")}
              </div>
              <fieldset>
                <legend>Who is planning?</legend>
                <div className="choice-grid">
                  {plannerOptions.map((o) => (
                    <label className="choice" key={o.value}>
                      <input type="radio" name="planner" value={o.value} checked={data.planner === o.value} onChange={() => set("planner", o.value)} />
                      <span className="choice-text"><span className="choice-title">{o.label}</span></span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {data.planner !== "self" && (
                <div className="field">
                  <label htmlFor="field-plannerOrganisation">
                    Company or agency <span className="optional">(optional)</span>
                  </label>
                  <input id="field-plannerOrganisation" type="text" autoComplete="organization" value={data.plannerOrganisation} onChange={(e) => set("plannerOrganisation", e.target.value)} />
                  <p className="field-hint">You don&apos;t need to share your client&apos;s name at this stage.</p>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <fieldset id="field-timing" {...(errors.timing ? { "aria-describedby": "timing-error" } : {})}>
                <legend className="visually-hidden">Timing</legend>
                <div className="choice-grid cols-3">
                  {timingOptions.map((o) => (
                    <label className={`choice${o.value === "flexible" ? " advice" : ""}`} key={o.value}>
                      <input type="radio" name="timing" value={o.value} checked={data.timing === o.value} onChange={() => set("timing", o.value)} />
                      <span className="choice-text"><span className="choice-title">{o.label}</span></span>
                    </label>
                  ))}
                </div>
                {err("timing")}
              </fieldset>

              {data.timing === "month" && <MonthPicker value={data.travelMonth} onChange={(v) => set("travelMonth", v)} error={errors.travelMonth} />}

              {data.timing === "dates" && (
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="field-dateFrom">From</label>
                    <input id="field-dateFrom" type="date" value={data.dateFrom} onChange={(e) => set("dateFrom", e.target.value)} {...inv("dateFrom")} />
                    {err("dateFrom")}
                  </div>
                  <div className="field">
                    <label htmlFor="field-dateTo">To</label>
                    <input id="field-dateTo" type="date" value={data.dateTo} min={data.dateFrom || undefined} onChange={(e) => set("dateTo", e.target.value)} {...inv("dateTo")} />
                    {err("dateTo")}
                  </div>
                </div>
              )}

              {data.timing === "flexible" && (
                <p className="field-hint" style={{ marginBottom: 24 }}>
                  We&apos;ll suggest timing based on what you want to see. The migration, the rains and school holidays all affect it.
                </p>
              )}

              <fieldset id="field-tripLength">
                <legend>
                  Approximate length <span className="optional">(optional)</span>
                </legend>
                <div className="choice-grid cols-3">
                  {lengthOptions.map((o) => (
                    <label className={`choice${o.value === ADVICE ? " advice" : ""}`} key={o.value}>
                      <input type="radio" name="tripLength" value={o.value} checked={data.tripLength === o.value} onChange={() => set("tripLength", o.value)} />
                      <span className="choice-text"><span className="choice-title">{o.label}</span></span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {step === 4 && (
            <>
              <ChoiceSet legend="Travel between regions" name="transport" options={transportOptions} value={data.transport} onPick={(v) => set("transport", v)} />
              <MultiSet legend="Vehicle and guiding" options={guidingOptions} values={data.guiding} onToggle={(v) => toggle("guiding", v)} />
              <ChoiceSet legend="Where you stay" name="accommodation" options={accommodationOptions} value={data.accommodation} onPick={(v) => set("accommodation", v)} />
              <MultiSet legend="Experiences" options={experienceOptions} values={data.experiences} onToggle={(v) => toggle("experiences", v)} hint="Walks, night drives and balloon flights depend on local rules and permissions." />
              <MultiSet legend="Regions you're drawn to" options={regionOptions} values={data.regions} onToggle={(v) => toggle("regions", v)} />
            </>
          )}

          {step === 5 && (
            <>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="field-name">Your name</label>
                  <input id="field-name" type="text" autoComplete="name" value={data.name} onChange={(e) => set("name", e.target.value)} {...inv("name")} />
                  {err("name")}
                </div>
                <div className="field">
                  <label htmlFor="field-email">Email</label>
                  <input id="field-email" type="email" autoComplete="email" inputMode="email" value={data.email} onChange={(e) => set("email", e.target.value)} {...inv("email")} />
                  {err("email")}
                </div>
              </div>

              <fieldset id="field-contactMethod">
                <legend>How would you prefer we reply?</legend>
                <div className="choice-grid cols-3">
                  {contactMethodOptions.map((o) => (
                    <label className="choice" key={o.value}>
                      <input type="radio" name="contactMethod" value={o.value} checked={data.contactMethod === o.value} onChange={() => set("contactMethod", o.value)} />
                      <span className="choice-text"><span className="choice-title">{o.label}</span></span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="field-phone">
                    Phone or WhatsApp number{" "}
                    {data.contactMethod === "email" ? <span className="optional">(optional)</span> : <span className="optional">(required for {data.contactMethod === "whatsapp" ? "WhatsApp" : "a call"})</span>}
                  </label>
                  <input
                    id="field-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+44 20 0000 0000"
                    value={data.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    aria-required={data.contactMethod !== "email"}
                    {...inv("phone")}
                  />
                  {err("phone") ?? <p className="field-hint">Include your country code.</p>}
                </div>
                <div className="field">
                  <label htmlFor="field-timeZone">
                    Your time zone <span className="optional">(optional)</span>
                  </label>
                  <input id="field-timeZone" type="text" list="tz-list" value={data.timeZone} onChange={(e) => set("timeZone", e.target.value)} />
                  <datalist id="tz-list">
                    {COMMON_TZ.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                  <p className="field-hint">So we call at a sensible hour.</p>
                </div>
              </div>

              <div className="field">
                <label htmlFor="field-notes">
                  Anything else we should know? <span className="optional">(optional)</span>
                </label>
                <textarea id="field-notes" value={data.notes} maxLength={3000} onChange={(e) => set("notes", e.target.value)} placeholder="Ages of children, a special date, mobility needs, places you've already been…" />
              </div>

              <details style={{ marginBottom: 24 }}>
                <summary style={{ cursor: "pointer", fontSize: "0.9rem" }}>Review your answers</summary>
                <dl className="review-list" style={{ marginTop: 12 }}>
                  <dt>Reason</dt>
                  <dd>{labelFor(purposeOptions, data.purpose) || "—"}</dd>
                  <dt>Party</dt>
                  <dd>
                    {labelFor(partyTypeOptions, data.partyType) || "—"}
                    {data.partySize ? `, ${labelFor(partySizeOptions, data.partySize)}` : ""}
                  </dd>
                  <dt>When</dt>
                  <dd>
                    {data.timing === "month" ? data.travelMonth : data.timing === "dates" ? `${data.dateFrom} – ${data.dateTo}` : labelFor(timingOptions, data.timing) || "—"}
                    {data.tripLength ? ` · ${labelFor(lengthOptions, data.tripLength)}` : ""}
                  </dd>
                  <dt>Regions</dt>
                  <dd>{data.regions.map((r) => labelFor(regionOptions, r)).join(", ") || "—"}</dd>
                </dl>
                <button type="button" className="text-link" style={{ background: "none", border: 0, borderBottom: "1px solid", cursor: "pointer", font: "inherit", fontSize: "0.75rem" }} onClick={() => setStep(1)}>
                  Edit from the start
                </button>
              </details>

              {turnstileKey && (
                <>
                  <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
                  <TurnstileBridge onToken={setTurnstileToken} />
                  <div className="cf-turnstile" data-sitekey={turnstileKey} data-callback="blasioTurnstile" style={{ marginBottom: 16 }} />
                </>
              )}

              <p className="privacy-note">
                We use these details only to respond to your enquiry and plan your trip. See our <Link href="/privacy">privacy notice</Link>.
              </p>
            </>
          )}
        </div>

        {status === "error" && (
          <div className="error-summary" role="alert" style={{ marginTop: 16 }}>
            <h3>Your enquiry hasn&apos;t been sent</h3>
            <p style={{ margin: "0 0 8px" }}>
              {serverMsg || "Something went wrong while sending."} Your answers are still here. Please try again in a moment.
            </p>
            {altContact}
          </div>
        )}

        <div className="form-nav">
          {step > 1 ? (
            <button type="button" className="btn btn-ghost" onClick={back} disabled={status === "submitting"}>
              Back
            </button>
          ) : (
            <span className="spacer" />
          )}
          {step < 5 ? (
            <button type="submit" className="btn">
              Continue
            </button>
          ) : (
            <button type="submit" className="btn" disabled={status === "submitting"} aria-describedby={preview ? "preview-submit-note" : undefined}>
              {status === "submitting" ? "Sending…" : status === "error" ? "Try again" : preview ? "Send test enquiry" : "Request a Private Consultation"}
            </button>
          )}
        </div>
        {preview && step === 5 && (
          <p id="preview-submit-note" className="small muted" style={{ marginTop: 12 }}>
            Preview mode: this test enquiry will not be sent.
          </p>
        )}
        <p className="visually-hidden" aria-live="polite">
          {status === "submitting" ? "Sending your enquiry" : ""}
        </p>
      </form>
    </div>
  );
}

function ChoiceSet({ legend, name, options, value, onPick }: { legend: string; name: string; options: readonly { value: string; label: string }[]; value: string; onPick: (v: string) => void }) {
  return (
    <fieldset id={`field-${name}`}>
      <legend>
        {legend} <span className="optional">(optional)</span>
      </legend>
      <div className="choice-grid cols-2">
        {options.map((o) => (
          <label className={`choice${o.value === ADVICE ? " advice" : ""}`} key={o.value}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onPick(o.value)} />
            <span className="choice-text"><span className="choice-title">{o.label}</span></span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function MultiSet({ legend, options, values, onToggle, hint }: { legend: string; options: readonly { value: string; label: string }[]; values: string[]; onToggle: (v: string) => void; hint?: string }) {
  return (
    <fieldset>
      <legend>
        {legend} <span className="optional">(optional, choose any)</span>
      </legend>
      {hint && <p className="field-hint" style={{ marginTop: -6, marginBottom: 12 }}>{hint}</p>}
      <div className="choice-grid cols-2">
        {options.map((o) => (
          <label className={`choice${o.value === ADVICE ? " advice" : ""}`} key={o.value}>
            <input type="checkbox" value={o.value} checked={values.includes(o.value)} onChange={() => onToggle(o.value)} />
            <span className="choice-text"><span className="choice-title">{o.label}</span></span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function MonthPicker({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const [y, m] = value ? value.split("-") : ["", ""];
  const now = new Date();
  const years = Array.from({ length: 4 }, (_, i) => String(now.getFullYear() + i));
  const update = (ny: string, nm: string) => onChange(ny && nm ? `${ny}-${nm}` : ny || nm ? `${ny}-${nm}` : "");
  return (
    <div className="field-row" id="field-travelMonth">
      <div className="field">
        <label htmlFor="tm-month">Month</label>
        <select id="tm-month" value={m || ""} onChange={(e) => update(y || years[0], e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? "travelMonth-error" : undefined}>
          <option value="">Choose…</option>
          {MONTHS.map((name, i) => (
            <option key={name} value={String(i + 1).padStart(2, "0")}>{name}</option>
          ))}
        </select>
        {error && <p className="field-error" id="travelMonth-error">{error}</p>}
      </div>
      <div className="field">
        <label htmlFor="tm-year">Year</label>
        <select id="tm-year" value={y || years[0]} onChange={(e) => update(e.target.value, m)}>
          {years.map((yy) => (
            <option key={yy} value={yy}>{yy}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function TurnstileBridge({ onToken }: { onToken: (t: string) => void }) {
  useEffect(() => {
    (window as unknown as Record<string, unknown>).blasioTurnstile = (t: string) => onToken(t);
  }, [onToken]);
  return null;
}
