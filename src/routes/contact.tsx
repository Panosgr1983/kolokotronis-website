import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Facebook, Clock } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { ContactForm } from "@/components/ContactForm";
import { useSiteSetting, usePageData } from "@/lib/content-hooks";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const contactPage = usePageData()["/contact"] || {};
  const heroEyebrow = (useSiteSetting("contact_hero_eyebrow") as string) || "Επικοινωνία";
  const heroTitle = (useSiteSetting("contact_hero_title") as string) || contactPage.title || "Κλείστε το ραντεβού σας";
  const heroSubtitle = (useSiteSetting("contact_hero_subtitle") as string) || contactPage.subtitle || "Επικοινωνήστε για μια πρώτη γνωριμία ή για να ορίσουμε συνεδρία.";

  const phoneLabel = (useSiteSetting("contact_phone_label") as string) || "Τηλέφωνο";
  const phoneHint = (useSiteSetting("contact_phone_hint") as string) || "+30 697 437 1139";
  const phoneNote = (useSiteSetting("contact_phone_note") as string) || "Καλέστε για άμεση εξυπηρέτηση";

  const addressLabel = (useSiteSetting("contact_address_label") as string) || "Διεύθυνση";
  const addressLine1 = (useSiteSetting("contact_address_line_1") as string) || "Απόλλωνος 30, ισόγειο";
  const addressLine2 = (useSiteSetting("contact_address_line_2") as string) || "Νέο Ηράκλειο, Αθήνα";
  const addressHint = (useSiteSetting("contact_address_hint") as string) || "";

  const hoursLabel = (useSiteSetting("contact_hours_label") as string) || "Ωράριο";
  const hoursLine1 = (useSiteSetting("contact_hours_line_1") as string) || "Δευ – Παρ: 10:00 – 20:00";
  const hoursLine2 = (useSiteSetting("contact_hours_line_2") as string) || "Σάββατο: κατόπιν ραντεβού";

  const socialLabel = (useSiteSetting("contact_social_label") as string) || "Social";
  const facebookUrl = (useSiteSetting("contact_social_facebook_url") as string) || "";

  const mapEmbedUrl = (useSiteSetting("contact_map_embed_url") as string) || "https://www.google.com/maps?q=Απόλλωνος+30,+Νέο+Ηράκλειο,+Αθήνα&output=embed";

  const formHeading = (useSiteSetting("contact_form_heading") as string) || "Θα σας απαντήσω εντός 24 ωρών.";

  return (
    <PageShell>
      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        backgroundImage={contactPage.hero_image}
      />

      <section className="container-page py-16 md:py-20 grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="card-soft p-7 flex gap-5">
            <span className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Phone className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{phoneLabel}</p>
              <a href={`tel:${phoneHint.replace(/\s/g, "")}`} className="font-serif text-2xl text-foreground hover:text-primary">{phoneHint}</a>
              {phoneNote && <p className="text-sm text-muted-foreground mt-1">{phoneNote}</p>}
            </div>
          </div>

          <div className="card-soft p-7 flex gap-5">
            <span className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{addressLabel}</p>
              <p className="font-medium text-foreground">{addressLine1}</p>
              {addressLine2 && <p className="text-foreground">{addressLine2}</p>}
              {addressHint && <p className="text-sm text-muted-foreground mt-1">{addressHint}</p>}
            </div>
          </div>

          <div className="card-soft p-7 flex gap-5">
            <span className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{hoursLabel}</p>
              <p className="text-foreground">{hoursLine1}</p>
              <p className="text-foreground">{hoursLine2}</p>
            </div>
          </div>

          {facebookUrl && (
            <div className="card-soft p-7 flex gap-5">
              <span className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Facebook className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{socialLabel}</p>
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary">Facebook</a>
              </div>
            </div>
          )}
        </div>

        <div className="card-soft p-8 md:p-10">
          <p className="text-sm text-muted-foreground mb-6">{formHeading}</p>
          <ContactForm />
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="card-soft overflow-hidden p-0">
          <iframe
            title="Χάρτης"
            src={mapEmbedUrl}
            loading="lazy"
            className="w-full h-[420px] border-0"
          />
        </div>
      </section>
    </PageShell>
  );
}
