import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, Award, BookOpen, Globe, Star, ArrowRight, Clock, Book, Heart, Sparkles, GraduationCap as GraduationIcon, Award as AwardIcon, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { CtaBand } from "@/components/CtaBand";
import { ValuesBand } from "@/components/ValuesBand";
import { useCredentials, useSiteSetting } from "@/lib/content-hooks";
import { getIcon } from "@/lib/icon-map";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const ACHIEVEMENT_ICONS: Record<string, any> = {
  clock: Clock, book: Book, heart: Heart, sparkles: Sparkles, award: AwardIcon, graduation: GraduationIcon,
};

function AchievementIcon({ name }: { name: string }) {
  const Icon = ACHIEVEMENT_ICONS[name] || AwardIcon;
  return <Icon className="size-5" strokeWidth={1.5} />;
}

function AboutPage() {
  const { data: credentials = [], isLoading: credsLoading } = useCredentials();

  const heroEyebrow = (useSiteSetting("about_hero_eyebrow") as string) || "Σχετικά";
  const heroTitle = (useSiteSetting("about_hero_title") as string) || "Η ιστορία, η φιλοσοφία & η διαδρομή μου";
  const heroSubtitle = (useSiteSetting("about_hero_subtitle") as string) || "Γνωρίστε με λίγα λόγια το ποιος είμαι και τι με οδήγησε σε αυτή τη δουλειά.";
  const heroImage = (useSiteSetting("about_hero_image") as string) || "";
  const heroPositioning = (useSiteSetting("about_hero_positioning") as string) || "";

  const bioEyebrow = (useSiteSetting("about_bio_eyebrow") as string) || "Λιγα λογια για εμενα";
  const bioTitle = (useSiteSetting("about_bio_title") as string) || "Ποιος είμαι";
  const bioParagraphs = (useSiteSetting("about_bio_paragraphs") as string[]) || [];
  const portraitImage = (useSiteSetting("about_portrait") as string) || "";

  const aboutAchievements = useSiteSetting("about_achievements");
  const achievements = Array.isArray(aboutAchievements) ? aboutAchievements : [];

  const aboutBooks = useSiteSetting("about_books");
  const books = Array.isArray(aboutBooks) ? aboutBooks.filter((b: any) => b.featured).sort((a: any, b: any) => a.sort_order - b.sort_order) : [];
  const booksCtaText = (useSiteSetting("about_books_cta_text") as string) || "Δείτε όλα τα βιβλία";
  const booksCtaUrl = (useSiteSetting("about_books_cta_url") as string) || "/books";

  const pullQuote = (useSiteSetting("about_pull_quote") as string) || "";
  const pullQuoteAuthor = (useSiteSetting("about_pull_quote_author") as string) || "";

  const credsTitle = (useSiteSetting("credentials_section_title") as string) || "Πιστοποιήσεις & σπουδές";

  const paragraphs = bioParagraphs.length > 0 ? bioParagraphs : [
    "Είμαι ψυχολόγος, ψυχοθεραπευτής και Reiki Master, με έδρα το Νέο Ηράκλειο. Εδώ και χρόνια συνοδεύω ανθρώπους στο ταξίδι της αυτογνωσίας, της εσωτερικής ισορροπίας και της προσωπικής τους εξέλιξης.",
    "Στον χώρο μου, που βρίσκεται λίγα βήματα από τον ηλεκτρικό σταθμό, θα νιώσετε άνετα, ασφαλείς και ελεύθεροι να εκφραστείτε. Η προσέγγισή μου είναι ανθρωποκεντρική, συνδυάζοντας ψυχοθεραπευτικές μεθόδους, ενεργειακές πρακτικές και πνευματική καθοδήγηση, προσαρμοσμένες στις ανάγκες του κάθε ανθρώπου.",
  ];

  const insertQuoteIdx = Math.min(2, paragraphs.length);

  return (
    <PageShell>
      {heroImage ? (
        <section className="relative h-[60vh] min-h-[420px] bg-secondary/30">
          <img
            src={heroImage}
            alt={heroTitle || "About Hero Image"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 container-page pb-12 md:pb-16">
            <div className="max-w-3xl">
              {heroPositioning && (
                <p className="text-xs tracking-[0.25em] uppercase text-white/70 mb-4">{heroPositioning}</p>
              )}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">{heroTitle}</h1>
              {heroSubtitle && (
                <p className="mt-4 text-base md:text-lg text-white/80 max-w-xl leading-relaxed">{heroSubtitle}</p>
              )}
              {heroEyebrow && (
                <p className="text-xs tracking-[0.2em] uppercase text-primary-light mt-4">{heroEyebrow}</p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <PageHero
          eyebrow={heroEyebrow}
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      )}

      {achievements.length > 0 && (
        <section className="border-b border-border">
          <div className="container-page py-10 md:py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {achievements.map((a, i) => {
                const Icon = ACHIEVEMENT_ICONS[a.icon] || AwardIcon;
                return (
                  <div key={i} className="text-center">
                    <div className="inline-flex size-12 rounded-xl bg-primary/10 text-primary items-center justify-center mb-3">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <p className="font-serif text-3xl md:text-4xl text-foreground">{a.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{a.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-16 md:py-20">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              {portraitImage ? (
                <img src={portraitImage} alt="Νικόλας Κολοκοτρώνης" width={1024} height={1024} className="rounded-l-[3rem] rounded-tr-[3rem] aspect-square object-cover w-full shadow-[var(--shadow-card)]" />
              ) : (
                <div className="rounded-l-[3rem] rounded-tr-[3rem] aspect-square w-full bg-secondary/50 flex items-center justify-center text-muted-foreground text-sm">Προσθέστε φωτογραφία</div>
              )}
            </div>
          </div>
          <div className="lg:col-span-3">
            <p className="text-xs tracking-[0.25em] uppercase text-primary mb-4">{bioEyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">{bioTitle}</h2>
            <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed space-y-4">
              {paragraphs.map((p, i) => (
                <div key={i}>
                  {i === insertQuoteIdx && pullQuote && (
                    <aside className="my-8 pl-6 border-l-2 border-primary py-2">
                      <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic">&ldquo;{pullQuote}&rdquo;</p>
                      {pullQuoteAuthor && (
                        <p className="text-sm text-muted-foreground mt-2">&mdash; {pullQuoteAuthor}</p>
                      )}
                    </aside>
                  )}
                  <p>{p}</p>
                </div>
              ))}
              {paragraphs.length === 0 && pullQuote && (
                <aside className="my-8 pl-6 border-l-2 border-primary py-2">
                  <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic">&ldquo;{pullQuote}&rdquo;</p>
                  {pullQuoteAuthor && (
                    <p className="text-sm text-muted-foreground mt-2">&mdash; {pullQuoteAuthor}</p>
                  )}
                </aside>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border">
        <div className="container-page py-16 md:py-20">
          <h2 className="font-serif text-3xl md:text-4xl mb-10">{credsTitle}</h2>
          {credsLoading ? (
            <div className="flex justify-center py-10"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {credentials.map((c) => {
                const Icon = getIcon(c.icon);
                return (
                  <div key={c.id} className="flex items-center gap-3 justify-center text-center md:text-left">
                    <Icon className="size-5 text-primary shrink-0" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-foreground/80">{c.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {books.length > 0 && (
        <section className="border-y border-border">
          <div className="container-page py-16 md:py-20">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <h2 className="font-serif text-3xl md:text-4xl">Συγγραφικό Έργο</h2>
              {booksCtaText && booksCtaUrl && (
                <Link to={booksCtaUrl} className="text-primary text-xs tracking-[0.2em] uppercase font-medium inline-flex items-center gap-2 hover:gap-3 transition-all">
                  {booksCtaText} <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
            <div className="relative">
              <div
                id="books-carousel"
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {books.map((b, i) => (
                  <div key={i} className="snap-start shrink-0 w-[180px] md:w-[220px] group">
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
                    <h3 className="font-medium text-sm text-foreground leading-snug">{b.title}</h3>
                    {b.subtitle && <p className="text-xs text-muted-foreground mt-1">{b.subtitle}</p>}
                    {b.url && (
                      <a href={b.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-2">
                        {b.publisher || "Αγορά"} <ExternalLink className="size-3" strokeWidth={1.5} />
                      </a>
                    )}
                    {b.url_alt && (
                      <a href={b.url_alt} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-1">
                        Επίσης διαθέσιμο <ExternalLink className="size-3" strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { const el = document.getElementById('books-carousel'); if (el) el.scrollBy({ left: -240, behavior: 'smooth' }); }}
                className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 size-10 rounded-full bg-background/90 backdrop-blur border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-background transition-colors hidden md:flex"
                aria-label="Previous"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => { const el = document.getElementById('books-carousel'); if (el) el.scrollBy({ left: 240, behavior: 'smooth' }); }}
                className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 size-10 rounded-full bg-background/90 backdrop-blur border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-background transition-colors hidden md:flex"
                aria-label="Next"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="py-8" />

      <ValuesBand />

      <CtaBand />
    </PageShell>
  );
}
