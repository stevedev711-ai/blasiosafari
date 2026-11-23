/** Builds a consultation URL that carries the context of the page the guest came from. */
export type ConsultContext = {
  journey?: string; // journey slug
  destination?: string; // destination slug
  interest?: "family" | "couple" | "photography";
  context?: string; // free label, e.g. "Exclusive-use house"
  from?: string; // originating path
};

export function consultHref(ctx: ConsultContext = {}, base = "/private-consultation") {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(ctx)) if (v) p.set(k, v);
  const q = p.toString();
  return q ? `${base}?${q}` : base;
}
