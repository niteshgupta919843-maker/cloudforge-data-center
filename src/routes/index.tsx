import { createFileRoute } from "@tanstack/react-router";
import { Cloud, Database, HardDrive, Headphones, LifeBuoy, Server, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { BuildSequence } from "@/components/BuildSequence";

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

const SERVICES = [
  { icon: Server, title: "Cloud Servers", body: "Scalable virtual servers provisioned for your applications and workloads." },
  { icon: Cloud, title: "Tally on Cloud", body: "Access Tally securely from anywhere, without maintaining local hardware." },
  { icon: Database, title: "Managed Hosting", body: "We handle setup, updates and monitoring so your team can focus on the business." },
  { icon: HardDrive, title: "Secure Storage", body: "Protected storage for files and data, with controlled access." },
  { icon: LifeBuoy, title: "Backup & Recovery", body: "Scheduled backups and restore options to help keep your data recoverable." },
  { icon: Headphones, title: "24/7 Support", body: "Reach our team any time of day for help with your cloud services." },
];

const NAV = [
  { href: "#build", label: "Platform" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2 font-display text-lg font-semibold" aria-label="HTwoCloud home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-mono text-xs font-bold text-primary-foreground">H2</span>
      <span>
        HTwo<span className="text-primary">Cloud</span>
      </span>
    </a>
  );
}

function Index() {
  const [open, setOpen] = useState(false);
  return (
    <div id="top" className="min-h-screen bg-background">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/70 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5" aria-label="Primary">
          <Logo />
          <ul className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-foreground">{n.label}</a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 md:inline-flex">
            Talk to us
          </a>
          <button type="button" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </nav>
        {open && (
          <ul className="border-t px-5 py-4 md:hidden">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="block py-2 text-foreground">{n.label}</a>
              </li>
            ))}
          </ul>
        )}
      </header>

      <main id="main">
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
              <a href="#contact" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90">
                Get in touch <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#build" className="inline-flex items-center rounded-lg border px-5 py-3 font-semibold transition hover:bg-secondary">
                See how it's built
              </a>
            </div>
          </div>
        </section>

        <BuildSequence />

        <section id="services" className="mx-auto max-w-7xl px-5 py-24 md:py-32">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Services</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold md:text-5xl">Everything you need to run in the cloud.</h2>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, body }) => (
              <article key={title} className="group rounded-xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-glow">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="px-5 pb-24">
          <div className="bg-hero relative mx-auto max-w-7xl overflow-hidden rounded-2xl border bg-surface px-6 py-16 text-center md:py-20">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold md:text-5xl">Ready to move to HTwoCloud?</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Tell us about your workload and we'll recommend the right setup.</p>
            <a href="mailto:hello@htwocloud.com" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90">
              Contact sales <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground md:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} HTwoCloud. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
