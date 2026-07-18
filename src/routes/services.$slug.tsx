import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CtaBand } from "@/components/CtaBand";
import { useServiceBySlug, usePageData, useBlogPostsByCategory } from "@/lib/content-hooks";
import { getIcon } from "@/lib/icon-map";

const CATEGORY_MAP: Record<string, string> = {
  omades: "ΟΜΑΔΕΣ",
  "seminar-omilies": "ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ",
};

const monthsGR = ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαϊ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()} ${monthsGR[d.getMonth()]} ${d.getFullYear()}`;
}

export const Route = createFileRoute("/services/$slug")({
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const { data: service, isLoading } = useServiceBySlug(slug);
  const svcPageData = usePageData()[`/services/${slug}`] || {};
  const blogCategory = CATEGORY_MAP[slug];
  const showRelatedArticles = !!blogCategory;
  const { data: relatedPosts = [] } = useBlogPostsByCategory(blogCategory || "", { showOnServicePage: true, enabled: showRelatedArticles });

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex justify-center py-32"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      </PageShell>
    );
  }

  if (!service) {
    return (
      <PageShell>
        <div className="container-page py-32 text-center">
          <h1 className="font-serif text-4xl mb-4">Η υπηρεσία δεν βρέθηκε</h1>
          <p className="text-muted-foreground mb-8">Η υπηρεσία που αναζητάτε δεν υπάρχει.</p>
          <Link to="/services" className="btn-cta">Επιστροφή στις υπηρεσίες</Link>
        </div>
      </PageShell>
    );
  }

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
            <h1 className="font-serif text-xl sm:text-3xl md:text-5xl lg:text-6xl text-foreground max-w-3xl leading-tight">{service.title}</h1>
          </div>
        </div>
      </div>

      <section className="container-page py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-10">
            {service.short_description}
          </p>

          <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed">
            {service.long_description.split("\n").map((p: string, i: number) => (
              <p key={i} className="mb-5">{p}</p>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-border">
            <Link to="/contact" className="btn-cta inline-flex items-center gap-2">
              <Calendar className="size-4" /> Κλείστε ραντεβού
            </Link>
          </div>
        </div>
      </section>

      {showRelatedArticles && relatedPosts.length > 0 && (
        <section className="border-t border-border mt-12 sm:mt-16 pt-10 sm:pt-14 pb-10 sm:pb-14">
          <div className="container-page">
            <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-center">
              Άρθρα για {service.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
              {relatedPosts.map((p) => (
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
                      <span>·</span>
                      <span>{formatDate(p.published_at)}</span>
                    </div>
                    <h3 className="font-serif text-xl leading-snug mb-3 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{p.excerpt}</p>
                    <span className="text-sm text-primary font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all self-start">
                      Διαβάστε <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </PageShell>
  );
}
