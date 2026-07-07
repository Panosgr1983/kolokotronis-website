import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Mail, Facebook, ExternalLink } from "lucide-react";
import { useSiteSetting } from "@/lib/content-hooks";

interface NavLink { label: string; path: string; }

export function SiteFooter() {
  const siteName = (useSiteSetting("site_name") as string) || "Νικολας Κολοκοτρωνης";
  const subtitle = (useSiteSetting("site_subtitle") as string) || "Ψυχολογος";
  const monogram = (useSiteSetting("site_monogram") as string) || "ΝΚ";
  const logoUrl = (useSiteSetting("site_logo_footer") as string) || (useSiteSetting("site_logo") as string) || "";
  const tagline = (useSiteSetting("site_tagline") as string) || "Ένας ασφαλής χώρος για αυτογνωσία, ισορροπία και αλλαγή.";
  const copyright = (useSiteSetting("footer_copyright") as string) || "Νικόλας Κολοκοτρώνης — Ψυχολόγος · Νέο Ηράκλειο";
  const footerNavLinks = (useSiteSetting("footer_nav_links") as NavLink[]) || [];
  const pageVisibility = (useSiteSetting("page_visibility") as Record<string, boolean>) || {};
  const facebookUrl = (useSiteSetting("contact_social_facebook_url") as string) || "https://www.facebook.com/nikolas.kolokotronis/";
  const email = (useSiteSetting("contact_email") as string) || "";
  const emailLabel = (useSiteSetting("contact_email_label") as string) || "Email";
  const phone = (useSiteSetting("contact_phone_hint") as string) || "+30 697 437 1139";
  const addressLabel = (useSiteSetting("contact_address_label") as string) || "Απόλλωνος 30, ισόγειο";
  const addressHint = (useSiteSetting("contact_address_hint") as string) || "Νέο Ηράκλειο, Αθήνα 14121";

  const footerNavHeading = (useSiteSetting("footer_heading_nav") as string) || "Πλοήγηση";
  const footerContactHeading = (useSiteSetting("footer_heading_contact") as string) || "Επικοινωνία";
  const addressArea = (useSiteSetting("contact_address_area") as string) || "Νέο Ηράκλειο";
  const addressPostalCode = (useSiteSetting("contact_address_postal_code") as string) || "14121";
  const openMapsText = (useSiteSetting("contact_open_maps_text") as string) || "Άνοιγμα στους Χάρτες";
  const privacyText = (useSiteSetting("footer_privacy_text") as string) || "Πολιτική Απορρήτου";
  const termsText = (useSiteSetting("footer_terms_text") as string) || "Όροι Χρήσης";

  const nav = (footerNavLinks.length > 0 ? footerNavLinks : [
    { label: "Αρχική", path: "/" },
    { label: "Βιογραφικό", path: "/about" },
    { label: "Υπηρεσίες", path: "/services" },
    { label: "Ομάδες", path: "/services/omades" },
    { label: "Ομιλίες, Σεμινάρια", path: "/blog" },
    { label: "Βιβλία", path: "/books" },
    { label: "Επικοινωνία", path: "/contact" },
  ]).filter(n => pageVisibility[n.path] !== false);

  return (
    <footer className="bg-footer text-footer-foreground mt-20">
      <div className="container-page py-10 sm:py-14 grid gap-8 sm:gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            {logoUrl ? (
              <span className="inline-flex items-center justify-center size-12 border border-footer-foreground/40 shrink-0 overflow-hidden">
                <img src={logoUrl} alt={siteName} className="size-full object-contain p-1" />
              </span>
            ) : (
              <span className="inline-flex items-center justify-center size-12 border border-footer-foreground/40 shrink-0 overflow-hidden">
                <img src="/logo-white.png" alt={siteName} className="size-full object-contain p-1" />
              </span>
            )}
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
          <h4 className="text-xs tracking-[0.2em] uppercase mb-4 text-footer-foreground/60">{footerNavHeading}</h4>
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
          <h4 className="text-xs tracking-[0.2em] uppercase mb-4 text-footer-foreground/60">{footerContactHeading}</h4>
          <ul className="space-y-3 text-sm text-footer-foreground/80">
            {email && (
              <li className="flex gap-3">
                <Mail className="size-4 mt-0.5 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-footer-foreground">{email}</a>
              </li>
            )}
            <li className="flex gap-3">
              <MapPin className="size-4 mt-0.5 shrink-0" />
              <span className="space-y-0.5">
                <p className="text-footer-foreground/80"><span className="text-footer-foreground/60 text-xs">Οδός:</span> {addressLabel}</p>
                <p className="text-footer-foreground/80"><span className="text-footer-foreground/60 text-xs">Περιοχή:</span> {addressArea}</p>
                <p className="text-footer-foreground/80"><span className="text-footer-foreground/60 text-xs">Τ.Κ.:</span> {addressPostalCode}</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=%CE%91%CF%80%CF%8C%CE%BB%CE%BB%CF%89%CE%BD%CE%BF%CF%82+30+%CE%9D%CE%AD%CE%BF+%CE%97%CF%81%CE%AC%CE%BA%CE%BB%CE%B5%CE%B9%CE%BF+%CE%91%CE%B8%CE%AE%CE%BD%CE%B1+14121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-footer-foreground/60 hover:text-footer-foreground mt-2 transition-colors"
                >
                  <ExternalLink className="size-3" />
                  {openMapsText}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="size-4 mt-0.5 shrink-0" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-footer-foreground">{phone}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-footer-foreground/10">
        <div className="container-page py-4 sm:py-5 text-xs text-footer-foreground/60 flex flex-col sm:flex-row justify-between gap-3">
          <span className="flex flex-col sm:flex-row sm:gap-1">
            <span>© {new Date().getFullYear()} {copyright}</span>
            <span>Website designed &amp; developed by <a href="https://www.aionweb.gr" target="_blank" rel="noopener noreferrer" class="hover:text-footer-foreground">AION WEB</a>.</span>
          </span>
          <div className="flex gap-5">
            {pageVisibility['/privacy'] !== false && <Link to="/privacy" className="hover:text-footer-foreground">{privacyText}</Link>}
            {pageVisibility['/terms'] !== false && <Link to="/terms" className="hover:text-footer-foreground">{termsText}</Link>}
          </div>
        </div>
      </div>
    </footer>
  );
}
