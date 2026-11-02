import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BuildSequence } from "@/components/BuildSequence";
import { Reveal } from "@/components/Reveal";
import { SERVICES } from "@/lib/services";

const TITLE = "HTwoCloud — Cloud Servers, Tally on Cloud & Managed Hosting";
const DESC =
  "HTwoCloud provides cloud servers, Tally on Cloud, managed hosting, secure storage, backup & recovery and round-the-clock support.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

const WHY = [
  {
    title: "Built around your workload",
    body: "We size servers, storage and backups to what you actually run — not to a fixed plan you have to grow into.",
  },
  {
    title: "Security-first by habit",
    body: "Controlled access, protected storage and recoverable data are part of the setup from day one.",
  },
  {
    title: "Managed end to end",
    body: "Setup, updates, monitoring and support stay with us, so your team is not the one babysitting servers.",
  },
  {
    title: "People you can reach",
    body: "When something needs attention, you talk to the team that runs your environment — around the clock.",
  },
];

const STEPS = [
  { n: "01", title: "Tell us about your workload", body: "What you run today, what slows you down, and where you want to be." },
  { n: "02", title: "We assess and recommend", body: "A right-sized proposal: servers, storage, backups and support." },
  { n: "03", title: "Setup and migration", body: "We provision, configure and move your services with minimal disruption." },
  { n: "04", title: "Ongoing care", body: "Monitoring, updates and support keep your environment healthy." },
];

function Index() {
  return (
    <>
      <section className="bg-hero relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Cloud infrastructure · HTwoCloud</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl">
            From bare metal to <span className="text-brand">your cloud.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Cloud servers, Tally on Cloud and managed hosting — built on infrastructure we assemble, run and support for you.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
            >
              Get in touch <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#build"
              className="inline-flex items-center rounded-lg border px-5 py-3 font-semibold transition hover:bg-secondary"
            >
              See how it's built
            </a>
          </div>
        </div>
      </section>

      <BuildSequence />

      <section id="services" className="mx-auto max-w-7xl px-5 py-24 md:py-32">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Services</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold md:text-5xl">Everything you need to run in the cloud.</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: _icon, ...s }, i) => (
            <Reveal key={s.slug} delay={i * 60}>
              <Link
                to="/services"
                hash={s.slug}
                className="group flex h-full flex-col rounded-xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-glow"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary font-mono text-sm font-semibold text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y bg-surface/30">
        <div className="mx-auto max-w-7xl px-5 py-24 md:py-32">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Why HTwoCloud</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold md:text-5xl">An infrastructure partner, not a vendor.</h2>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <article className="h-full rounded-xl border bg-card p-6">
                  <h3 className="font-display text-base font-semibold">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:py-32">
        <Reveal>
          <div className="bg-hero relative overflow-hidden rounded-2xl border">
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
            <div className="relative grid items-center gap-8 px-6 py-12 md:grid-cols-[1.2fr_1fr] md:px-12 md:py-16">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Infrastructure</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  See the environment we build, stage by stage.
                </h2>
                <p className="mt-4 max-w-lg text-muted-foreground">
                  From individual components to racks, networking, storage and a complete cloud environment — explore the
                  full infrastructure tour.
                </p>
                <Link
                  to="/infrastructure"
                  className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
                >
                  Explore infrastructure <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="grid-lines hidden h-48 rounded-xl border bg-background/40 md:block" aria-hidden="true" />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t bg-surface/30">
        <div className="mx-auto max-w-7xl px-5 py-24 md:py-32">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">How we work</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold md:text-5xl">A straightforward path to the cloud.</h2>
          </Reveal>
          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 60}>
                <li className="h-full rounded-xl border bg-card p-6">
                  <p className="font-mono text-sm font-semibold text-primary">{s.n}</p>
                  <h3 className="mt-3 font-display text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 pb-24 pt-8">
        <div className="bg-hero relative mx-auto max-w-7xl overflow-hidden rounded-2xl border bg-surface px-6 py-16 text-center md:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold md:text-5xl">Ready to move to HTwoCloud?</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Tell us about your workload and we'll recommend the right setup.</p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            Get a quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
