import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { InfraShowcase } from "@/components/InfraShowcase";
import { ServiceVisual } from "@/components/mini3d/ServiceVisual";
import { Reveal } from "@/components/Reveal";
import type { VisualKind } from "@/components/mini3d/VisualScene";

const TITLE = "Infrastructure — HTwoCloud";
const DESC =
  "How HTwoCloud puts an environment together: architecture, servers, network, storage, cloud connectivity, security and backup.";

type Layer = { title: string; body: string; points: string[]; kind: VisualKind };

const LAYERS: Layer[] = [
  {
    title: "Servers",
    body: "Compute sized to the workload — the right balance of processing, memory and storage for what each server actually does.",
    points: ["Virtual servers sized per workload", "Capacity that grows with demand", "Managed access and monitoring"],
    kind: "server",
  },
  {
    title: "Network",
    body: "Switching ties every server together and connects the environment to the outside world, with redundancy designed in from the start.",
    points: ["Internal switching between servers", "Redundant external connectivity", "Traffic routed and isolated by design"],
    kind: "network",
  },
  {
    title: "Storage",
    body: "Data lives close to compute, organized so it can be protected, backed up and restored without guesswork.",
    points: ["Centralized storage pools", "Separate copies for backup", "Room to expand as data grows"],
    kind: "storage",
  },
  {
    title: "Cloud environment",
    body: "The environment connects outward to the services your business uses, and connects your team inward — from the office or remotely.",
    points: ["Connectivity to cloud services", "Remote access for your team", "Environments that fit hybrid setups"],
    kind: "globe",
  },
  {
    title: "Security & backup",
    body: "Layered controls limit who can reach what, and scheduled backups keep data recoverable if something goes wrong.",
    points: ["Access controls at every layer", "Scheduled, tested backups", "Documented recovery steps"],
    kind: "security",
  },
];

export const Route = createFileRoute("/infrastructure")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
  }),
  component: InfrastructurePage,
});

function InfrastructurePage() {
  return (
    <>
      <section className="bg-hero relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Infrastructure</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl">
            One environment, assembled with intent.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Scroll through how the pieces fit together — from racks and switching to storage, cloud connectivity and the
            protection wrapped around it all.
          </p>
        </div>
      </section>

      <InfraShowcase />

      <section className="mx-auto max-w-7xl px-5 pt-24 md:pt-32">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">The layers</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold md:text-5xl">What we put in place, layer by layer.</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            We deliver, configure and support these environments for our customers; the exact setup is matched to each
            workload and service plan.
          </p>
        </Reveal>
      </section>

      {LAYERS.map((l, i) => (
        <section key={l.title} className={`border-t bg-surface/20 ${i % 2 === 1 ? "bg-surface/40" : ""}`}>
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-24">
            <Reveal className={i % 2 === 1 ? "md:order-2" : ""}>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                {String(i + 1).padStart(2, "0")} · Layer
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{l.title}</h2>
              <p className="mt-4 text-muted-foreground">{l.body}</p>
              <ul className="mt-6 space-y-3">
                {l.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={80} className={`h-64 md:h-80 ${i % 2 === 1 ? "md:order-1" : ""}`}>
              <ServiceVisual kind={l.kind} className="h-full w-full" />
            </Reveal>
          </div>
        </section>
      ))}

      <section className="px-5 pb-24 pt-8">
        <div className="bg-hero relative mx-auto max-w-7xl overflow-hidden rounded-2xl border bg-surface px-6 py-16 text-center md:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold md:text-4xl">Want this behind your business?</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            We'll map your workload to the right environment and walk you through the setup.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            Talk to us <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
