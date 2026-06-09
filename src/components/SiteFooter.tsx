import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Facebook } from "lucide-react";
import { useSiteSetting } from "@/lib/content-hooks";

interface NavLink { label: string; path: string; }

export function SiteFooter() {
  const siteName = (useSiteSetting("site_name") as string) || "Νικολας Κολοκοτρωνης";
  const subtitle = (useSiteSetting("site_subtitle") as string) || "Ψυχολογος";
  const monogram = (useSiteSetting("site_monogram") as string) || "ΝΚ";
  const tagline = (useSiteSetting("site_tagline") as string) || "Ένας ασφαλής χώρος για αυτογνωσία, ισορροπία και αλλαγή.";
  const copyright = (useSiteSetting("footer_copyright") as string) || "Νικόλας Κολοκοτρώνης — Ψυχολόγος · Νέο Ηράκλειο";
  const footerNavLinks = (useSiteSetting("footer_nav_links") as NavLink[]) || [];
  const pageVisibility = (useSiteSetting("page_visibility") as Record<string, boolean>) || {};
  const facebookUrl = (useSiteSetting("contact_social_facebook_url") as string) || "https://www.facebook.com/nikolas.kolokotronis/";
  const phone = (useSiteSetting("contact_phone_hint") as string) || "+30 697 437 1139";
  const addressLabel = (useSiteSetting("contact_address_label") as string) || "Απόλλωνος 30, ισόγειο";
  const addressHint = (useSiteSetting("contact_address_hint") as string) || "Νέο Ηράκλειο, Αθήνα";

  const nav = (footerNavLinks.length > 0 ? footerNavLinks : [
    { label: "Αρχική", path: "/" },
    { label: "Σχετικά με εμένα", path: "/about" },
    { label: "Υπηρεσίες", path: "/services" },
    { label: "Άρθρα", path: "/blog" },
    { label: "Βιβλία", path: "/books" },
    { label: "Επικοινωνία", path: "/contact" },
  ]).filter(n => pageVisibility[n.path] !== false);

  return (
    <footer className="bg-footer text-footer-foreground mt-20">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center size-12 border border-footer-foreground/40 font-serif text-lg tracking-wider">
              {monogram}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-base tracking-[0.18em] uppercase">{siteName}</span>
              <span className="text-xs tracking-widest uppercase text-footer-foreground/60">{subtitle}</span>
            </span>
          </div>
          <p className="text-sm text-footer-foreground/70 max-w-sm leading-relaxed">
            {tagline}
          </p>
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center size-9 rounded-full border border-footer-foreground/30 text-footer-foreground/80 hover:text-footer-foreground hover:border-footer-foreground/60 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="size-4" />
            </a>
          )}
        </div>

        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase mb-4 text-footer-foreground/60">Πλοηγηση</h4>
          <ul className="space-y-2.5 text-sm">
            {nav.map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="text-footer-foreground/75 hover:text-footer-foreground transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase mb-4 text-footer-foreground/60">Επικοινωνια</h4>
          <ul className="space-y-3 text-sm text-footer-foreground/80">
            <li className="flex gap-3">
              <MapPin className="size-4 mt-0.5 shrink-0" />
              <span>{addressLabel}<br />{addressHint}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="size-4 mt-0.5 shrink-0" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-footer-foreground">{phone}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-footer-foreground/10">
        <div className="container-page py-5 text-xs text-footer-foreground/60 flex flex-col sm:flex-row justify-between gap-3">
          <span>© {new Date().getFullYear()} {copyright}</span>
          <div className="flex gap-5">
            {pageVisibility['/privacy'] !== false && <Link to="/privacy" className="hover:text-footer-foreground">Πολιτική Απορρήτου</Link>}
            {pageVisibility['/terms'] !== false && <Link to="/terms" className="hover:text-footer-foreground">Όροι Χρήσης</Link>}
          </div>
        </div>
      </div>
    </footer>
  );
}
