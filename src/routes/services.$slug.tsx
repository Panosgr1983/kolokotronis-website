import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, ChevronDown } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CtaBand } from "@/components/CtaBand";
import { usePageData, useRelatedArticles, useSiteSetting, isAnnouncementCategory, useServiceFaq, renderTipContent, extractPlainText } from "@/lib/content-hooks";
import { getIcon } from "@/lib/icon-map";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { supabase } from "@/lib/supabase";
import { TENANT_ID } from "@/lib/content-hooks";

const monthsGR = ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαϊ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()} ${monthsGR[d.getMonth()]} ${d.getFullYear()}`;
}

function truncate(str: string, max: number): string {
  const s = str.trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function absoluteUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `https://nikolaskolokotronis.gr${url}`;
  return `https://nikolaskolokotronis.gr/${url}`;
}

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("slug", params.slug)
      .eq("tenant_id", TENANT_ID)
      .eq("is_active", true)
      .maybeSingle();
    if (!data) throw notFound();
    return data as any;
  },
  head: ({ loaderData, params }) => {
    const service = loaderData as any;
    const desc = service
      ? truncate(extractPlainText(service.meta_description || service.short_description), 160)
      : "";
    const ogImage = service ? absoluteUrl(service.og_image || service.image_url) : "";
    return {
      meta: [
        { title: service?.meta_title || service?.title || "Υπηρεσία — Νικόλας Κολοκοτρώνης" },
        ...(desc ? [{ name: "description", content: desc }] : []),
        ...(service?.title ? [{ property: "og:title", content: service.title }] : []),
        ...(desc ? [{ property: "og:description", content: desc }] : []),
        ...(ogImage ? [{ property: "og:image", content: ogImage }] : []),
        { property: "og:url", content: `https://nikolaskolokotronis.gr/services/${params.slug}` },
      ],
      links: [
        { rel: "canonical", href: `https://nikolaskolokotronis.gr/services/${params.slug}` },
      ],
    };
  },
  component: ServiceDetailPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="container-page py-32 text-center">
        <h1 className="font-serif text-4xl mb-4">Η υπηρεσία δεν βρέθηκε</h1>
        <p className="text-muted-foreground mb-8">Η υπηρεσία που αναζητάτε δεν υπάρχει.</p>
        <Link to="/services" className="btn-cta">Επιστροφή στις υπηρεσίες</Link>
      </div>
    </PageShell>
  ),
  pendingComponent: () => (
    <PageShell>
      <div className="flex justify-center py-32"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
    </PageShell>
  ),
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const service = Route.useLoaderData();
  const svcPageData = usePageData()[`/services/${slug}`] || {};
  const { data: relatedData } = useRelatedArticles(slug);
  const relatedPosts = relatedData?.articles ?? [];
  const relatedSectionTitle = relatedData?.title ?? "Σχετικά άρθρα";
  const announcementShowDates = (useSiteSetting("announcement_show_dates") as string) === "true";
  const { data: faqData } = useServiceFaq(slug);
  const faqEntries = faqData ?? [];
  const serviceFaqVisible = (useSiteSetting("service_faq_visible") as string) === "true";

  const Icon = getIcon(service.icon);

  return (
    <PageShell>
      <div
        className="relative aspect-[2.35/1] min-h-[300px] bg-fixed sm:bg-top bg-center bg-cover"
        style={(service.image_url || svcPageData.hero_image) ? { backgroundImage: `url(${service.image_url || svcPageData.hero_image})` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-page pb-6 sm:pb-10">
          <Link to="/services" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 sm:mb-4">
            <ArrowLeft size={14} /> Πίσω στις υπηρεσίες
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="size-10 sm:size-14 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon className="size-5 sm:size-7" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-xl sm:text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight">{service.title}</h1>
          </div>
        </div>
      </div>

      <section className="container-page py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-10">
            {(() => {
              try {
                const p = JSON.parse(service.short_description);
                if (p && typeof p === "object" && p.type === "doc") return <div className="prose-content" dangerouslySetInnerHTML={{ __html: renderTipContent(p) }} />;
              } catch {}
              return service.short_description;
            })()}
          </div>

          <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed">
            {(() => {
              try {
                const parsed = JSON.parse(service.long_description);
                if (parsed && typeof parsed === "object" && parsed.type === "doc") {
                  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: renderTipContent(parsed) }} />;
                }
              } catch {}
              return service.long_description.split("\n").map((p: string, i: number) => (
                <p key={i} className="mb-5">{p}</p>
              ));
            })()}
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-border">
            <Link to="/contact" className="btn-cta inline-flex items-center gap-2">
              <Calendar className="size-4" /> Κλείστε ραντεβού
            </Link>
          </div>
        </div>
      </section>

      {faqEntries.length > 0 && serviceFaqVisible && (
        <section className="border-t border-border py-14 sm:py-20 md:py-24">
          <div className="container-page max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-center">Συχνές Ερωτήσεις</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqEntries.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b border-border" data-testid="faq-item">
                  <AccordionTrigger className="text-left font-medium text-sm sm:text-base py-4 hover:text-primary transition-colors" data-testid="faq-trigger">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqEntries.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section className="border-t border-border mt-12 sm:mt-16 pt-10 sm:pt-14 pb-10 sm:pb-14">
          <div className="container-page">
            <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-center">
              {relatedSectionTitle}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
              {relatedPosts.map((p) => {
                const isAnnouncement = isAnnouncementCategory(p.category);
                return (
                <Link key={p.id} to={`/blog/${p.slug}`} className="card-soft overflow-hidden flex flex-col group">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="aspect-[4/3] w-full bg-primary/5 flex items-center justify-center">
                      <span className="text-4xl font-serif text-primary/30">{p.title[0]}</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                      <span className="text-primary font-medium">{p.category}</span>
                      {p.category && <span>·</span>}
                      {(p.show_date === true || (isAnnouncement && announcementShowDates)) && (
                        <span>{formatDate(p.published_at)}</span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl leading-snug mb-3 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{p.excerpt}</p>
                    <span className="text-sm text-primary font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all self-start">
                      Διαβάστε <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </PageShell>
  );
}
