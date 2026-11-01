import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { Logo, NAV } from "./SiteHeader";

const SERVICES = [
  { label: "Cloud Servers", hash: "cloud-servers" },
  { label: "Tally on Cloud", hash: "tally-on-cloud" },
  { label: "Managed Hosting", hash: "managed-hosting" },
  { label: "Secure Storage", hash: "secure-storage" },
  { label: "Backup & Disaster Recovery", hash: "backup-disaster-recovery" },
  { label: "IT Infrastructure & Support", hash: "it-infrastructure-support" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            HTwoCloud provides cloud servers, Tally on Cloud, managed hosting, secure storage, backup &amp; recovery and IT
            infrastructure support for growing businesses.
          </p>
          <a
            href="mailto:hello@htwocloud.com"
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary transition hover:opacity-80"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            hello@htwocloud.com
          </a>
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Quick Links</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link to={n.href} className="transition-colors hover:text-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Our services">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Our Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {SERVICES.map((s) => (
              <li key={s.hash}>
                <Link to="/services" hash={s.hash} className="transition-colors hover:text-foreground">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/contact" className="transition-colors hover:text-foreground">
                Contact form
              </Link>
            </li>
            <li>
              <a href="mailto:hello@htwocloud.com" className="transition-colors hover:text-foreground">
                hello@htwocloud.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} HTwoCloud. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
