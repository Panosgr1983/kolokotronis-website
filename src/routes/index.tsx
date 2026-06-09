import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ArrowRight, Phone, MapPin, PlayCircle, Leaf, BookOpen } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CtaBand } from "@/components/CtaBand";
import { ValuesBand } from "@/components/ValuesBand";
import { ContactForm } from "@/components/ContactForm";
import { useServices, useBlogPosts, useTestimonials, useSiteSetting, usePageData } from "@/lib/content-hooks";
import { getIcon } from "@/lib/icon-map";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="font-serif text-3xl md:text-4xl text-foreground">{children}</h2>
      <span className="block w-16 h-px bg-primary/60 mx-auto mt-4" />
    </div>
  );
}

function BooksShowcase() {
  const aboutBooks = useSiteSetting("about_books");
  const enabled = useSiteSetting("home_books_showcase_enabled");
  const pageVisibility = (useSiteSetting("page_visibility") as Record<string, boolean>) || {};
  const showcaseTitle = (useSiteSetting("home_books_showcase_title") as string) || "Συγγραφικό Έργο";
  const linkText = (useSiteSetting("home_books_showcase_link_text") as string) || "Δείτε όλα τα βιβλία";
  const linkUrl = (useSiteSetting("home_books_showcase_link_url") as string) || "/books";
  const books = Array.isArray(aboutBooks) ? [...aboutBooks].sort((a: any, b: any) => a.sort_order - b.sort_order).slice(0, 4) : [];

  if (!enabled || pageVisibility['/books'] === false || books.length === 0) return null;

  return (
    <section className="bg-secondary/30 border-y border-border">
      <div className="container-page py-20 md:py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <h2 className="font-serif text-3xl md:text-4xl">{showcaseTitle}</h2>
          <Link to={linkUrl} className="text-primary text-xs tracking-[0.2em] uppercase font-medium inline-flex items-center gap-2 hover:gap-3 transition-all">
            {linkText} <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {books.map((b: any, i: number) => (
            <div key={i} className="group">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary mb-4">
                {b.cover_image ? (
                  <img src={b.cover_image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <BookOpen className="size-8 text-primary/40 mx-auto mb-2" strokeWidth={1} />
                    <p className="text-xs text-muted-foreground text-center line-clamp-2">{b.title}</p>
                  </div>
                )}
              </div>
              <h3 className="font-medium text-sm text-foreground leading-snug line-clamp-2">{b.title}</h3>
              {b.subtitle && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{b.subtitle}</p>}
              {b.url && (
                <a href={b.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-2">
                  {b.publisher || "Αγορά"} <ArrowRight className="size-3" strokeWidth={1.5} />
                </a>
              )}
              {b.url_alt && (
                <a href={b.url_alt} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5">
                  Επίσης διαθέσιμο
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const addressLine1 = (useSiteSetting("contact_address_line_1") as string) || "Απόλλωνος 30, ισόγειο";
  const addressLine2 = (useSiteSetting("contact_address_line_2") as string) || "Νέο Ηράκλειο, Αθήνα";
  const addressHint = (useSiteSetting("contact_address_hint") as string) || "";
  const phoneHint = (useSiteSetting("contact_phone_hint") as string) || "+30 697 437 1139";
  const hoursLabel = (useSiteSetting("contact_hours_label") as string) || "Ωράριο";
  const hoursLine1 = (useSiteSetting("contact_hours_line_1") as string) || "Δευ – Παρ: 10:00 – 20:00";
  const hoursLine2 = (useSiteSetting("contact_hours_line_2") as string) || "Σάββατο: κατόπιν ραντεβού";
  const mapEmbedUrl = (useSiteSetting("contact_map_embed_url") as string) || "https://www.google.com/maps?q=Απόλλωνος+30,+Νέο+Ηράκλειο,+Αθήνα&output=embed";

  return (
    <section className="bg-secondary/50 border-t border-border">
      <div className="container-page py-16 md:py-20 grid lg:grid-cols-3 gap-10">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-primary mb-4">Στοιχεια επικοινωνιας</p>
          <ul className="space-y-5">
            <li className="flex gap-3">
              <MapPin className="size-5 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-foreground font-medium">{addressLine1}</p>
                <p className="text-sm text-muted-foreground">{addressLine2}{addressHint && <><br />{addressHint}</>}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Phone className="size-5 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
              <a href={`tel:${phoneHint.replace(/\s/g, "")}`} className="text-foreground font-medium hover:text-primary">{phoneHint}</a>
            </li>
            <li className="text-sm text-muted-foreground">
              <p className="text-foreground font-medium mb-1">{hoursLabel}</p>
              {hoursLine1}<br />
              {hoursLine2}
            </li>
          </ul>
          <Link to="/contact" className="btn-cta mt-7 text-xs tracking-[0.18em] uppercase">
            <Calendar className="size-4" /> Κλειστε ραντεβου
          </Link>
        </div>
        <div className="card-soft p-6"><ContactForm compact /></div>
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe title="Map" src={mapEmbedUrl} loading="lazy" className="w-full h-full min-h-[360px] border-0" />
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: blogPosts = [], isLoading: blogLoading } = useBlogPosts();
  const { data: testimonials = [], isLoading: testimonialsLoading } = useTestimonials();
  const homePage = usePageData()["/"] || {};

  const heroHeading = (useSiteSetting("hero_heading") as string) || homePage.title || "Κατανόηση.\nΑποδοχή.\nΑλλαγή.";
  const heroSubtitle = (useSiteSetting("hero_subtitle") as string) || homePage.subtitle || "Ένας ασφαλής χώρος για να μιλήσετε, να κατανοήσετε, να προχωρήσετε.";
  const heroCtaPrimaryText = (useSiteSetting("hero_cta_primary_text") as string) || "Μαθετε περισσοτερα";
  const heroCtaPrimaryLink = (useSiteSetting("hero_cta_primary_link") as string) || "/about";
  const heroCtaSecondaryText = (useSiteSetting("hero_cta_secondary_text") as string) || "Πως μπορω να σας βοηθησω";
  const heroCtaSecondaryLink = (useSiteSetting("hero_cta_secondary_link") as string) || "/services";
  const heroImage = (useSiteSetting("hero_image") as string) || homePage.hero_image || "";

  const servicesSectionTitle = (useSiteSetting("services_section_title") as string) || "Πώς μπορώ να σας βοηθήσω";
  const servicesSectionLinkText = (useSiteSetting("services_section_link_text") as string) || "Ολες οι υπηρεσιες";

  const aboutSectionEyebrow = (useSiteSetting("about_section_eyebrow") as string) || "Σχετικα με εμενα";
  const aboutSectionTitle = (useSiteSetting("about_section_title") as string) || "Γεια σας, είμαι ο Νικόλας Κολοκοτρώνης";
  const aboutSectionParagraph1 = (useSiteSetting("about_section_paragraph_1") as string) || "Πιστεύω ότι κάθε άνθρωπος κουβαλά μέσα του τη δύναμη να αλλάξει — απλώς, μερικές φορές, χρειάζεται κάποιον δίπλα του για να τη ξαναβρεί. Αυτόν τον ρόλο επιλέγω να κρατώ στη δουλειά μου.";
  const aboutSectionParagraph2 = (useSiteSetting("about_section_paragraph_2") as string) || "Είμαι Ψυχολόγος και σύμβουλος ψυχικής υγείας, με εξειδίκευση σε συμπληρωματικές προσεγγίσεις (Ρέικι, NLP, Σωματοδυναμική Ψυχοθεραπεία) και πολυετή εμπειρία στην υποστήριξη ενηλίκων που επιθυμούν να ξεπεράσουν δυσκολίες και να ζήσουν μια πιο ισορροπημένη και ουσιαστική ζωή.";
  const aboutSectionCtaText = (useSiteSetting("about_section_cta_text") as string) || "Περισσοτερα για εμενα";
  const aboutSectionPortrait = (useSiteSetting("about_section_portrait") as string) || "";

  const testimonialsSectionTitle = (useSiteSetting("testimonials_section_title") as string) || "Τι λένε όσοι έχουν συνεργαστεί μαζί μου";
  const blogSectionTitle = (useSiteSetting("blog_section_title") as string) || "Πρόσφατα Άρθρα";
  const blogSectionLinkText = (useSiteSetting("blog_section_link_text") as string) || "Δειτε ολα τα αρθρα";

  const headlineParts = heroHeading.split("\n");

  return (
    <PageShell>
      <section className="bg-background">
        <div className="container-page grid lg:grid-cols-2 gap-10 lg:gap-14 items-center pt-12 md:pt-16 pb-16 md:pb-24">
          <div className="max-w-xl">
            <Leaf className="size-7 text-primary mb-6 -rotate-12" />
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05]">
              {headlineParts.map((part, i) => (
                <span key={i}>{part}<br /></span>
              ))}
            </h1>
            <p className="mt-7 text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
              {heroSubtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to={heroCtaPrimaryLink} className="btn-cta text-xs tracking-[0.18em] uppercase">
                {heroCtaPrimaryText}
              </Link>
              <Link to={heroCtaSecondaryLink} className="inline-flex items-center gap-2.5 text-sm tracking-[0.18em] uppercase text-foreground/80 hover:text-primary transition-colors">
                <PlayCircle className="size-7 text-primary" strokeWidth={1.25} />
                {heroCtaSecondaryText}
              </Link>
            </div>
          </div>
          <div className="relative">
            {heroImage ? (
              <img src={heroImage} alt="Ζεστός, ήσυχος χώρος θεραπείας" width={1280} height={1280} className="rounded-l-[3rem] rounded-tr-[3rem] aspect-[5/4] object-cover w-full shadow-[var(--shadow-card)]" />
            ) : (
              <div className="rounded-l-[3rem] rounded-tr-[3rem] aspect-[5/4] w-full bg-secondary/50 flex items-center justify-center text-muted-foreground text-sm">Προσθέστε εικόνα hero</div>
            )}
          </div>
        </div>
      </section>

      <section className="container-page py-20 md:py-24">
        <SectionTitle>{servicesSectionTitle}</SectionTitle>
        {servicesLoading ? (
          <div className="mt-16 flex justify-center"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
        ) : (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-8">
            {services.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <article key={s.id} className="text-center px-2">
                  <div className="size-14 mx-auto mb-5 text-primary flex items-center justify-center">
                    <Icon className="size-9" strokeWidth={1.25} />
                  </div>
                  <h3 className="font-serif text-lg md:text-xl mb-3 text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1">{s.short_description}</p>
                </article>
              );
            })}
          </div>
        )}
        <div className="text-center mt-12">
          <Link to="/services" className="text-primary text-xs tracking-[0.2em] uppercase font-medium inline-flex items-center gap-2 hover:gap-3 transition-all">
            {servicesSectionLinkText} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="bg-secondary/50 border-y border-border">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center py-20 md:py-24">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-primary mb-4">{aboutSectionEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">{aboutSectionTitle}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{aboutSectionParagraph1}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{aboutSectionParagraph2}</p>
            <Link to="/about" className="btn-outline text-xs tracking-[0.18em] uppercase">{aboutSectionCtaText}</Link>
          </div>
          <div>
            {aboutSectionPortrait ? (
              <img src={aboutSectionPortrait} alt="Νικόλας Κολοκοτρώνης" width={1024} height={1024} loading="lazy" className="rounded-l-[3rem] rounded-tr-[3rem] aspect-square object-cover w-full max-w-lg ml-auto shadow-[var(--shadow-card)]" />
            ) : (
              <div className="rounded-l-[3rem] rounded-tr-[3rem] aspect-square w-full max-w-lg ml-auto bg-secondary/50 flex items-center justify-center text-muted-foreground text-sm">Προσθέστε φωτογραφία</div>
            )}
          </div>
        </div>
      </section>

      <ValuesBand />

      <BooksShowcase />

      <section className="bg-background">
        <div className="container-page py-20 md:py-24">
          <SectionTitle>{testimonialsSectionTitle}</SectionTitle>
          {testimonialsLoading ? (
            <div className="mt-14 flex justify-center"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
          ) : (
            <div className="mt-14 grid md:grid-cols-3 gap-7">
              {testimonials.map((t) => (
                <figure key={t.id} className="card-soft p-7 flex flex-col">
                  <blockquote className="font-serif text-lg leading-relaxed text-foreground/90 flex-1">«{t.content}»</blockquote>
                  <figcaption className="mt-6 pt-5 border-t border-border">
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs tracking-wider uppercase text-muted-foreground mt-1">{t.title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand />

      <section className="container-page py-20 md:py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <h2 className="font-serif text-3xl md:text-4xl">{blogSectionTitle}</h2>
          <Link to="/blog" className="text-primary text-xs tracking-[0.2em] uppercase font-medium inline-flex items-center gap-2 hover:gap-3 transition-all">
            {blogSectionLinkText} <ArrowRight className="size-4" />
          </Link>
        </div>
        {blogLoading ? (
          <div className="flex justify-center"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-7">
            {blogPosts.slice(0, 3).map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="card-soft overflow-hidden group">
                {p.image_url && <img src={p.image_url} alt={p.title} width={1024} height={768} loading="lazy" className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">{p.published_at ? new Date(p.published_at).toLocaleDateString("el-GR", { year: "numeric", month: "short", day: "numeric" }) : ""}</p>
                  <h3 className="font-serif text-xl leading-snug mb-4">{p.title}</h3>
                  <span className="text-xs tracking-[0.18em] uppercase text-primary font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Διαβαστε περισσοτερα <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <ContactSection />
    </PageShell>
  );
}
