import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Mail, Facebook, ExternalLink } from "lucide-react";
import { useSiteSetting } from "@/lib/content-hooks";
import { useBusinessInfo } from "@/lib/business-info";
import { useBranding } from "@/lib/core-hooks";

interface NavLink { label: string; path: string; }

export function SiteFooter() {
  const biz = useBusinessInfo();
  const branding = useBranding();
  const footerNavLinks = (useSiteSetting("footer_nav_links") as NavLink[]) || [];
  const pageVisibility = (useSiteSetting("page_visibility") as Record<string, boolean>) || {};
  const emailLabel = (useSiteSetting("contact_email_label") as string) || "Email";

  const footerNavHeading = (useSiteSetting("footer_heading_nav") as string) || "Πλοήγηση";
  const footerContactHeading = (useSiteSetting("footer_heading_contact") as string) || "Επικοινωνία";
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
            {branding.logo || branding.logo_footer ? (
              <span className="inline-flex items-center justify-center size-12 border border-footer-foreground/40 shrink-0 overflow-hidden">
                <img src={branding.logo_footer || branding.logo || ''} alt={branding.site_name} className="size-full object-contain p-1" />
              </span>
            ) : (
              <span className="inline-flex items-center justify-center size-12 border border-footer-foreground/40 shrink-0 overflow-hidden">
                <img src="/logo-white.png" alt={branding.site_name} className="size-full object-contain p-1" />
              </span>
            )}
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-base tracking-[0.18em] uppercase">{branding.site_name}</span>
              <span className="text-xs tracking-widest uppercase text-footer-foreground/60">{branding.site_subtitle}</span>
            </span>
          </div>
          <p className="text-sm text-footer-foreground/70 max-w-sm leading-relaxed">
            {branding.tagline}
          </p>
          {biz.social.facebook && (
            <a
              href={biz.social.facebook}
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
            {biz.contact.email && (
              <li className="flex gap-3">
                <Mail className="size-4 mt-0.5 shrink-0" />
                <a href={`mailto:${biz.contact.email}`} className="hover:text-footer-foreground">{biz.contact.email}</a>
              </li>
            )}
            <li className="flex gap-3">
              <MapPin className="size-4 mt-0.5 shrink-0" />
              <span className="space-y-0.5">
                <p className="text-footer-foreground/80"><span className="text-footer-foreground/60 text-xs">Οδός:</span> {biz.address.street} {biz.address.number}{biz.address.floor ? `, ${biz.address.floor}` : ""}</p>
                <p className="text-footer-foreground/80"><span className="text-footer-foreground/60 text-xs">Περιοχή:</span> {biz.address.area}</p>
                <p className="text-footer-foreground/80"><span className="text-footer-foreground/60 text-xs">Τ.Κ.:</span> {biz.address.postal_code}</p>
                <a
                  href={biz.maps.url}
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
              <a href={`tel:${biz.contact.phone.replace(/\s/g, "")}`} className="hover:text-footer-foreground">{biz.contact.phone}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-footer-foreground/10">
        <div className="container-page py-4 sm:py-5 text-xs text-footer-foreground/60 flex flex-col sm:flex-row justify-between gap-3">
          <span className="flex flex-col sm:flex-row sm:gap-1">
            <span>© {new Date().getFullYear()} {branding.copyright}</span>
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
