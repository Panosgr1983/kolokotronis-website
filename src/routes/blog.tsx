import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useBlogPosts, usePageData } from "@/lib/content-hooks";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Άρθρα — Ψυχολογία & Αυτογνωσία | Ν. Κολοκοτρώνης" },
      { name: "description", content: "Σκέψεις και άρθρα για την ψυχική υγεία, την αυτογνωσία και τη συνολική ευεξία." },
      { property: "og:title", content: "Άρθρα — Νικόλας Κολοκοτρώνης" },
      { property: "og:description", content: "Σκέψεις για την ψυχική υγεία και την αυτογνωσία." },
    ],
  }),
  component: BlogPage,
});

const monthsGR = ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαϊ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()} ${monthsGR[d.getMonth()]} ${d.getFullYear()}`;
}

function BlogPage() {
  const { data: posts = [], isLoading } = useBlogPosts();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isIndex = pathname === '/blog';
  const blogPage = usePageData()["/blog"] || {};

  if (!isIndex) return <Outlet />;

  return (
    <PageShell>
      <PageHero
        eyebrow="Άρθρα"
        title={blogPage.title || "Σκέψεις για την ψυχική υγεία"}
        subtitle={blogPage.subtitle || "Άρθρα για την αυτογνωσία, τις σχέσεις και τη συνολική ευεξία."}
        backgroundImage={blogPage.hero_image}
      />

      <section className="container-page py-12 sm:py-16 md:py-20">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {posts.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">Δεν υπάρχουν ακόμα άρθρα.</div>
            )}
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="card-soft overflow-hidden flex flex-col group">
                {p.image_url && <img src={p.image_url} alt={p.title} width={1024} height={768} loading="lazy" className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    {p.category && <span className="text-primary font-medium">{p.category}</span>}
                    {p.category && <span>·</span>}
                    <span>{formatDate(p.published_at)}</span>
                  </div>
                  <h2 className="font-serif text-xl leading-snug mb-3 group-hover:text-primary transition-colors">{p.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{p.excerpt}</p>
                  <span className="text-sm text-primary font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all self-start">
                    Διαβαστε <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
