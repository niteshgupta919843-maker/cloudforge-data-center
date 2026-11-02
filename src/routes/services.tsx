import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { ServiceVisual } from "@/components/mini3d/ServiceVisual";
import { Reveal } from "@/components/Reveal";
import { SERVICES } from "@/lib/services";

const TITLE = "Services — HTwoCloud";
const DESC =
  "Cloud servers, Tally on Cloud, managed hosting, secure storage, backup & disaster recovery and IT infrastructure support from HTwoCloud.";

export const Route = createFileRoute("/services")({
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
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="bg-hero relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Services</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl">
            Six services, one accountable team.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            From the servers themselves to the backups behind them — pick what you need today and add more as you grow.
          </p>
          <nav aria-label="Jump to a service" className="mt-9 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="rounded-full border px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {SERVICES.map((s, i) => (
        <section
          key={s.slug}
          id={s.slug}
          className={`scroll-mt-20 border-t bg-surface/20 ${i % 2 === 1 ? "bg-surface/40" : ""}`}
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
            <Reveal className={i % 2 === 1 ? "md:order-2" : ""}>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                {String(i + 1).padStart(2, "0")} · Service
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{s.title}</h2>
              <p className="mt-4 text-muted-foreground">{s.description}</p>
              <ul className="mt-8 space-y-3">
                {s.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-secondary text-primary" aria-hidden="true">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-9 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
              >
                Discuss {s.title.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
            <Reveal delay={80} className={`h-64 md:h-96 ${i % 2 === 1 ? "md:order-1" : ""}`}>
              <ServiceVisual kind={s.kind} className="h-full w-full" />
            </Reveal>
          </div>
        </section>
      ))}

      <section className="px-5 pb-24 pt-4">
        <div className="bg-hero relative mx-auto max-w-7xl overflow-hidden rounded-2xl border bg-surface px-6 py-16 text-center md:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold md:text-4xl">
            Not sure which service fits?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Describe what you run and where you want to take it — we'll recommend the right combination.
          </p>
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
