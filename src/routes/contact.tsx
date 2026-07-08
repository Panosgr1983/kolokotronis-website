import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Facebook, Clock, ExternalLink } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { ContactForm } from "@/components/ContactForm";
import { useSiteSetting, usePageData } from "@/lib/content-hooks";
import { useBusinessInfo } from "@/lib/business-info";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const contactPage = usePageData()["/contact"] || {};
  const biz = useBusinessInfo();

  const heroEyebrow = (useSiteSetting("contact_hero_eyebrow") as string) || "Επικοινωνία";
  const heroTitle = (useSiteSetting("contact_hero_title") as string) || contactPage.title || "Κλείστε το ραντεβού σας";
  const heroSubtitle = (useSiteSetting("contact_hero_subtitle") as string) || contactPage.subtitle || "Επικοινωνήστε για μια πρώτη γνωριμία ή για να ορίσουμε συνεδρία.";

  const phoneLabel = (useSiteSetting("contact_phone_label") as string) || "Τηλέφωνο";
  const phoneNote = (useSiteSetting("contact_phone_note") as string) || "Καλέστε για άμεση εξυπηρέτηση";
  const addressLabel = (useSiteSetting("contact_address_label") as string) || "Διεύθυνση";
  const hoursLabel = (useSiteSetting("contact_hours_label") as string) || "Ωράριο";
  const socialLabel = (useSiteSetting("contact_social_label") as string) || "Social";

  const formHeading = (useSiteSetting("contact_form_heading") as string) || "Θα σας απαντήσω εντός 24 ωρών.";
  const contactEmail = (useSiteSetting("contact_email") as string) || "";
  const mapTitle = (useSiteSetting("contact_map_title") as string) || "Χάρτης";
  const openMapsText = (useSiteSetting("contact_open_maps_text") as string) || "Άνοιγμα στους Χάρτες";

  return (
    <PageShell>
      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        backgroundImage={contactPage.hero_image}
      />

      <section className="container-page py-12 sm:py-16 md:py-20 grid lg:grid-cols-2 gap-6 sm:gap-10">
        <div className="space-y-6">
          <div className="card-soft p-7 flex gap-5">
            <span className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Phone className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{phoneLabel}</p>
              <a href={`tel:${biz.contact.phone.replace(/\s/g, "")}`} className="font-serif text-2xl text-foreground hover:text-primary">{biz.contact.phone}</a>
              {phoneNote && <p className="text-sm text-muted-foreground mt-1">{phoneNote}</p>}
            </div>
          </div>

          <div className="card-soft p-7 flex gap-5">
            <span className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MapPin className="size-5" />
            </span>
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground font-medium tracking-wider uppercase">{addressLabel}</p>
              <p className="text-foreground"><span className="text-muted-foreground text-sm">Οδός:</span> {biz.address.street} {biz.address.number}{biz.address.floor ? `, ${biz.address.floor}` : ""}</p>
              <p className="text-foreground"><span className="text-muted-foreground text-sm">Περιοχή:</span> {biz.address.area}</p>
              <p className="text-foreground"><span className="text-muted-foreground text-sm">Τ.Κ.:</span> {biz.address.postal_code}</p>
              {biz.address.instructions && <p className="text-sm text-muted-foreground mt-1">{biz.address.instructions}</p>}
            </div>
          </div>

          {biz.hours.visible !== false && (
            <div className="card-soft p-7 flex gap-5">
              <span className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Clock className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{hoursLabel}</p>
                <p className="text-foreground">{biz.hours.monday && <>Δευ: {biz.hours.monday}<br /></>}</p>
                <p className="text-foreground">{biz.hours.tuesday && <>Τρ: {biz.hours.tuesday}<br /></>}</p>
                <p className="text-foreground">{biz.hours.wednesday && <>Τετ: {biz.hours.wednesday}<br /></>}</p>
                <p className="text-foreground">{biz.hours.thursday && <>Πεμ: {biz.hours.thursday}<br /></>}</p>
                <p className="text-foreground">{biz.hours.friday && <>Παρ: {biz.hours.friday}<br /></>}</p>
                <p className="text-foreground">{biz.hours.saturday && <>Σαβ: {biz.hours.saturday}<br /></>}</p>
                <p className="text-foreground">{biz.hours.sunday && <>Κυρ: {biz.hours.sunday}</>}</p>
              </div>
            </div>
          )}

          {biz.social.facebook && (
            <div className="card-soft p-7 flex gap-5">
              <span className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Facebook className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{socialLabel}</p>
                <a href={biz.social.facebook} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">Facebook</a>
              </div>
            </div>
          )}
        </div>

        <div className="card-soft p-8 md:p-10">
          <p className="text-sm text-muted-foreground mb-6">{formHeading}</p>
          <ContactForm contactEmail={contactEmail} />
        </div>
      </section>

      <section className="container-page pb-12 sm:pb-20">
        <div className="card-soft overflow-hidden p-0">
          <iframe
            title={mapTitle}
            src={biz.maps.embed_url}
            loading="lazy"
            className="w-full h-[420px] border-0"
          />
        </div>
        <div className="text-center mt-6">
          <a
            href={biz.maps.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta text-xs tracking-[0.18em] uppercase"
          >
            <ExternalLink className="size-4" /> {openMapsText}
          </a>
        </div>
      </section>
    </PageShell>
  );
}
