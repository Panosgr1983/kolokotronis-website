import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Calendar } from "lucide-react";
import { useSiteSetting } from "@/lib/content-hooks";

interface NavLink { label: string; path: string; }

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const siteName = (useSiteSetting("site_name") as string) || "Νικολας Κολοκοτρωνης";
  const subtitle = (useSiteSetting("site_subtitle") as string) || "Ψυχολογος";
  const monogram = (useSiteSetting("site_monogram") as string) || "ΝΚ";
  const navLinks = (useSiteSetting("nav_links") as NavLink[]) || [];
  const pageVisibility = (useSiteSetting("page_visibility") as Record<string, boolean>) || {};
  const ctaText = (useSiteSetting("header_cta_text") as string) || "Κλειστε ραντεβου";
  const ctaLink = (useSiteSetting("header_cta_link") as string) || "/contact";

  const nav = (navLinks.length > 0 ? navLinks : [
    { label: "Αρχικη", path: "/" },
    { label: "Σχετικα με εμενα", path: "/about" },
    { label: "Υπηρεσιες", path: "/services" },
    { label: "Αρθρα", path: "/blog" },
    { label: "Βιβλια", path: "/books" },
    { label: "Επικοινωνια", path: "/contact" },
  ]).filter(n => pageVisibility[n.path] !== false);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container-page flex items-center justify-between h-20 py-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="inline-flex items-center justify-center size-12 border border-foreground/30 font-serif text-lg tracking-wider text-foreground shrink-0">
            {monogram}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base md:text-lg tracking-[0.18em] uppercase text-foreground">
              {siteName}
            </span>
            <span className="text-xs tracking-widest uppercase text-muted-foreground">{subtitle}</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.path}
              to={n.path}
              className="text-[11px] tracking-[0.2em] uppercase text-foreground/75 hover:text-primary transition-colors pb-1 border-b-2 border-transparent"
              activeProps={{ className: "text-primary border-primary" }}
              activeOptions={{ exact: n.path === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link to={ctaLink} className="hidden md:inline-flex btn-cta !py-2.5 !px-5 text-xs tracking-[0.18em] uppercase">
          <Calendar className="size-4" />
          {ctaText}
        </Link>

        <button
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-page py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.path}
                to={n.path}
                onClick={() => setOpen(false)}
                className="py-3 text-foreground/80 text-sm tracking-[0.15em] uppercase"
                activeProps={{ className: "text-primary font-medium" }}
                activeOptions={{ exact: n.path === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link to={ctaLink} onClick={() => setOpen(false)} className="btn-cta mt-3">
              <Calendar className="size-4" />
              {ctaText}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
