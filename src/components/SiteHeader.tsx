import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/infrastructure", label: "Infrastructure" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
] as const;

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-display text-lg font-semibold ${className}`} aria-label="HTwoCloud home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-mono text-xs font-bold text-primary-foreground">H2</span>
      <span>
        HTwo<span className="text-primary">Cloud</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? "bg-background/85 shadow-glow backdrop-blur-xl" : "bg-background/60 backdrop-blur-lg"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5" aria-label="Primary">
        <Logo />
        <ul className="hidden items-center gap-7 text-sm lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                to={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`relative transition-colors hover:text-foreground ${isActive(n.href) ? "text-foreground" : "text-muted-foreground"}`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px bg-primary transition-all ${isActive(n.href) ? "w-full" : "w-0"}`}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:inline-flex"
          >
            Get a Quote
          </Link>
          <button
            type="button"
            className="rounded-md p-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t px-5 py-4 lg:hidden">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                to={n.href}
                className={`block py-2.5 ${isActive(n.href) ? "font-semibold text-primary" : "text-foreground"}`}
              >
                {n.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link to="/contact" className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Get a Quote
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
