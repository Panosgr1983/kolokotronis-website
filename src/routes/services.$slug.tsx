import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { CtaBand } from "@/components/CtaBand";
import { useServiceBySlug, usePageData } from "@/lib/content-hooks";
import { getIcon } from "@/lib/icon-map";

export const Route = createFileRoute("/services/$slug")({
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const { data: service, isLoading } = useServiceBySlug(slug);
  const svcPageData = usePageData()[`/services/${slug}`] || {};

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
        className="relative aspect-[2.35/1] min-h-[300px] bg-fixed bg-top bg-cover"
        style={(service.image_url || svcPageData.hero_image) ? { backgroundImage: `url(${service.image_url || svcPageData.hero_image})` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-page pb-10">
          <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft size={14} /> Πίσω στις υπηρεσίες
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Icon className="size-7" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground max-w-3xl leading-tight">{service.title}</h1>
          </div>
        </div>
      </div>

      <section className="container-page py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            {service.short_description}
          </p>

          <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed">
            {service.long_description.split("\n").map((p: string, i: number) => (
              <p key={i} className="mb-5">{p}</p>
            ))}
          </div>

          <div className="mt-12 pt-10 border-t border-border">
            <Link to="/contact" className="btn-cta inline-flex items-center gap-2">
              <Calendar className="size-4" /> Κλείστε ραντεβού
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
}
