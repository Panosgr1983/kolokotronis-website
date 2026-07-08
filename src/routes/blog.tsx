import { createFileRoute, Link, Outlet, useSearch, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { useBlogPosts, usePageData } from "@/lib/content-hooks";

interface BlogSearch {
  category?: string;
}

export const Route = createFileRoute("/blog")({
  validateSearch: (s: Record<string, unknown>): BlogSearch => ({
    category: typeof s.category === "string" ? s.category : undefined,
  }),
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

const CATEGORIES = ["ΟΜΙΛΙΕΣ", "ΣΕΜΙΝΑΡΙΑ", "ΟΜΑΔΕΣ"];
const CATEGORY_LABELS: Record<string, string> = {
  "ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ": "Ομιλίες, Σεμινάρια",
  "ΟΜΙΛΙΕΣ": "Ομιλίες",
  "ΣΕΜΙΝΑΡΙΑ": "Σεμινάρια",
  "ΟΜΑΔΕΣ": "Ομάδες",
};

const monthsGR = ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαϊ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()} ${monthsGR[d.getMonth()]} ${d.getFullYear()}`;
}

function matchesCategory(post: { category: string | null }, filter: string | null): boolean {
  if (!filter) return true;
  const c = post.category || "";
  if (filter === "ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ") return c === "ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ";
  return c === filter;
}

function BlogPage() {
  const { data: posts = [], isLoading } = useBlogPosts();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { category: activeCategory } = useSearch({ from: Route.id });
  const isIndex = pathname === '/blog';
  const blogPage = usePageData()["/blog"] || {};

  const filtered = activeCategory
    ? posts.filter(p => matchesCategory(p, activeCategory))
    : posts;

  if (!isIndex) return <Outlet />;

  return (
    <PageShell>
      <PageHero
        eyebrow="Άρθρα"
        title={blogPage.title || "Ομιλίες, Σεμινάρια, Ομάδες"}
        subtitle={blogPage.subtitle || "Άρθρα και σκέψεις για την ψυχική υγεία, την αυτογνωσία και την προσωπική ανάπτυξη."}
        backgroundImage={blogPage.hero_image}
      />

      <section className="container-page py-12 sm:py-16 md:py-20">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          <Link
            to="/blog"
            className={`text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition-colors ${
              !activeCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            Ολα
          </Link>
          {CATEGORIES.map((cat) => {
            const isSingle = cat === "ΟΜΙΛΙΕΣ" || cat === "ΣΕΜΙΝΑΡΙΑ";
            if (isSingle) {
              const combinedCat = "ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ";
              return (
                <Link
                  key={cat}
                  to="/blog"
                  search={{ category: combinedCat }}
                  className={`text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition-colors ${
                    activeCategory === combinedCat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </Link>
              );
            }
            const catPosts = posts.filter(p => matchesCategory(p, cat));
            if (catPosts.length === 0) return null;
            return (
              <Link
                key={cat}
                to="/blog"
                search={{ category: cat }}
                className={`text-xs tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </Link>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">Δεν υπάρχουν άρθρα σε αυτή την κατηγορία.</div>
            )}
            {filtered.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="card-soft overflow-hidden flex flex-col group">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} width={1024} height={768} loading="lazy" className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="aspect-[4/3] w-full bg-primary/5 flex items-center justify-center">
                    <span className="font-serif text-5xl text-primary/30">{p.title[0]}</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    {p.category && <span className="text-primary font-medium">{CATEGORY_LABELS[p.category] || p.category}</span>}
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
