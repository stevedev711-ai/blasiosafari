import { siteConfig } from "@/site.config";

export const processSteps = [
  {
    title: "Your enquiry",
    body: "Tell us who is travelling, roughly when, and what matters to you. It takes a few minutes, and you can leave anything you're unsure about for us to advise on.",
  },
  {
    title: "A conversation",
    body: `We arrange a call at a time that suits your time zone, ${siteConfig.consultation.callLength}. We talk through pace, where you'd like to stay, how you'd travel between regions and the kind of guiding you want.`,
  },
  {
    title: "Your proposal",
    body: `We send a route with a night-by-night outline, accommodation options with our reasons, the transport plan and a quote, ${siteConfig.consultation.proposalTurnaround}.`,
  },
  {
    title: "Refining it",
    body: "We adjust the proposal with you until it's right, then confirm availability and arrangements before anything is booked.",
  },
];

export function Process({ light = false }: { light?: boolean }) {
  return (
    <ol className={`process${light ? " on-light" : ""}`} style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {processSteps.map((s, i) => (
        <li key={s.title} className="process-step">
          <span className="step-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
