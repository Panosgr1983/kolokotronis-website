import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { CtaBand } from "@/components/CtaBand";
import { useSiteSetting } from "@/lib/content-hooks";

export const Route = createFileRoute("/books")({
  component: BooksPage,
});

function BooksPage() {
  const heroTitle = (useSiteSetting("books_hero_title") as string) || "Συγγραφικό Έργο";
  const heroSubtitle = (useSiteSetting("books_hero_subtitle") as string) || "Τα βιβλία & οι εκδόσεις μου";

  const aboutBooks = useSiteSetting("about_books");
  const books = Array.isArray(aboutBooks)
    ? [...aboutBooks].sort((a: any, b: any) => a.sort_order - b.sort_order)
    : [];

  if (books.length === 0) {
    return (
      <PageShell>
        <PageHero title={heroTitle} subtitle={heroSubtitle} />
        <section className="container-page py-20 text-center">
          <BookOpen className="size-16 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
          <p className="text-muted-foreground">Τα βιβλία θα προστεθούν σύντομα.</p>
        </section>
        <CtaBand />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <section className="container-page py-16 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {books.map((b, i) => (
            <div key={i} className="flex flex-col card-soft p-6 group">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary mb-5">
                {b.cover_image ? (
                  <img
                    src={b.cover_image}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <BookOpen className="size-10 text-primary/30 mx-auto mb-3" strokeWidth={1} />
                      <p className="text-xs text-muted-foreground/60 line-clamp-2">{b.title}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="font-serif text-lg text-foreground leading-snug">{b.title}</h3>
                {b.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{b.subtitle}</p>
                )}

                {b.type && (
                  <span className="inline-block mt-3 text-[11px] tracking-wider uppercase text-primary bg-primary/10 rounded-full px-3 py-1 self-start">
                    {b.type}
                  </span>
                )}

                {b.description && (
                  <p className="text-sm text-muted-foreground/80 leading-relaxed mt-4 line-clamp-4">
                    {b.description}
                  </p>
                )}

                <div className="mt-auto pt-5 space-y-1.5">
                  {b.publisher && (
                    <p className="text-xs text-muted-foreground">
                      <span className="text-foreground/60">Εκδόσεις:</span> {b.publisher}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground/60">Έτος:</span> {b.year || "Προσωρινά μη διαθέσιμο"}
                  </p>
                  {b.isbn && (
                    <p className="text-xs text-muted-foreground">
                      <span className="text-foreground/60">ISBN:</span> {b.isbn}
                    </p>
                  )}
                </div>

                {b.url && (
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-4"
                  >
                    Αγοράστε το <ExternalLink className="size-3.5" strokeWidth={1.5} />
                  </a>
                )}
                {b.url_alt && (
                  <a
                    href={b.url_alt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-1"
                  >
                    Επίσης διαθέσιμο <ExternalLink className="size-3" strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
}
