import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { CtaBand } from "@/components/CtaBand";
import { useServices } from "@/lib/content-hooks";
import { getIcon } from "@/lib/icon-map";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Υπηρεσίες — Ψυχοθεραπεία, Ρέικι, NLP | Ν. Κολοκοτρώνης" },
      { name: "description", content: "Ατομική συμβουλευτική, Ρέικι, NLP, Σωματοδυναμική Ψυχοθεραπεία και workshops στο Νέο Ηράκλειο." },
      { property: "og:title", content: "Υπηρεσίες — Νικόλας Κολοκοτρώνης" },
      { property: "og:description", content: "Ολιστικές υπηρεσίες ψυχοθεραπείας και προσωπικής ανάπτυξης." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services = [], isLoading } = useServices();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isIndex = pathname === '/services';

  if (!isIndex) return <Outlet />;

  return (
    <PageShell>
      <PageHero
        eyebrow="Υπηρεσίες"
        title="Υπηρεσίες & προσεγγίσεις"
        subtitle="Επιλέξτε την προσέγγιση που ταιριάζει σε εσάς — ή ας τη βρούμε μαζί."
      />

      <section className="container-page py-16 md:py-20">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-7">
            {services.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <article key={s.id} className="card-soft p-8 flex flex-col">
                  <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Icon className="size-7" />
                  </div>
                  <h2 className="font-serif text-2xl mb-3">{s.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1">{s.short_description}</p>
                  <div className="flex items-center gap-4">
                    <Link to={`/services/${s.slug}`} className="text-primary font-medium inline-flex items-center gap-2 hover:gap-3 transition-all text-sm">
                      Διαβάστε περισσότερα <ArrowRight className="size-4" />
                    </Link>
                    <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Κλείστε ραντεβού
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-14 card-soft p-8 md:p-10 bg-secondary/40 text-center">
          <h3 className="font-serif text-2xl mb-3">Δεν είστε σίγουροι τι σας ταιριάζει;</h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Σε μια πρώτη γνωριμία θα συζητήσουμε τι αναζητάτε και θα προτείνω την κατάλληλη προσέγγιση για εσάς.
          </p>
          <Link to="/contact" className="btn-cta">Επικοινωνήστε</Link>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
}
