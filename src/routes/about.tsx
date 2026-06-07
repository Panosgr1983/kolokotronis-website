import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, Award, BookOpen, Globe, Star, ArrowRight, Clock, Book, Heart, Sparkles, GraduationCap as GraduationIcon, Award as AwardIcon } from "lucide-react";
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
    "Έχω σπουδάσει Ψυχολογία στο Πάντειο Πανεπιστήμιο Αθηνών, Προσωποκεντρική & Focusing-Βιωματική Ψυχοθεραπεία (Ελληνικό Κέντρο Focusing), Συνθετική Συμβουλευτική Ψυχικής Υγείας (Athens Synthesis Center), Ρέικι (master, Illium Center of Light), Regression Therapy (International Institute for Consciousness Exploration and Psychotherapy – Vitor Rodrigues), EMDR (EMDR Hellas Ινστιτούτο Τραυματοθεραπείας), IADC (Cesar Valdez), Bodynamic (Foundation, Bodynamic Greece), Ενεργειακή Διατροφολογία (Natural Health Science), Ανθοϊάματα Μπαχ (N.H.S.), Ρεφλεξολογία (N.H.S.), NLP (N.H.S.), Grief Support (Taking Flight International Corporation – Jane Simington), Trauma Recovery (T.F.I.C. – Jane Simington), Συστημική Σκέψη & Πράξη κατά Hellinger (Αλφάβητο Ζωής), Εθισμός & Συνεξάρτηση, Τα 12 βήματα απεξάρτησης (Τάσος Λάμπρου). Στις μεθόδους που χρησιμοποιώ συγκαταλέγονται επίσης ο Διαλογισμός, ο Οραματισμός, Το Μονοπάτι της Ευτυχίας, η Pre-Therapy και το Mindfulness.",
    "Έχω παρακολουθήσει βιωματικά σεμινάρια και ομιλίες με σημαντικούς δασκάλους και επιστήμονες όπως οι Hans TenDam, Marion Boon, Jane Simington, Vitor Rodrigues, Dr. Joe Dispenza, Irvin Yalom, Deepak Chopra, Wayne Dyer, Naomi Stephan, Julia Hastings, Patrick Holford, Jane Peterson, Uri Geller, Marlo Morgan, Alan Kohen, Colin Turner, Sonia Shoquette, Bert Hellinger, Sharlotte Palmgren και Cesar Valdez.",
    "Έχω ολοκληρώσει εξ αποστάσεως σεμινάρια: Caring for people with psychosis and schizophrenia (King's College, London), Palliative care (King's College, London), The Science of Happiness (Berkeley University, California) και Θετική Ψυχολογία (Πάντειο Πανεπιστήμιο).",
    "Έκανα πρακτική ως ψυχοθεραπευτής και εθελοντισμό στο Οικοτροφείο Αγίου Νικολάου της ΑμΚΕ ΙΑΣΙΣ για 19 μήνες. Εργάστηκα για δύο χρόνια ως ψυχολόγος στην Κοινωνική Υπηρεσία του Δήμου Γαλατσίου.",
    "Έχω γράψει εννέα βιβλία: ποίηση (4), διηγήματα (1), το μυθιστόρημα αυτογνωσίας «Το Μαγικό Ταξίδι» (εκδόσεις Διόπτρα) — το οποίο απέσπασε το Α' Βραβείο Μυθιστορήματος 2008 από τη Διεθνή Εταιρεία Ελλήνων Λογοτεχνών — τις κάρτες αυτογνωσίας, αγάπης & εξέλιξης «Μηνύματα & Επαφή με τους Αγίους» (εκδόσεις Κρύων) και το ομότιτλο βιβλίο. Το νέο μου μυθιστόρημα αυτογνωσίας έχει τίτλο «Tabula Rasa – Η Άγραφη Πλάκα της Ψυχής» (εκδόσεις Ιβίσκος).",
    "Έχω συνεργαστεί ως στιχουργός με τον Φίλιππο Πλιάτσικα, τον Γιάννη Ζουγανέλη, την Πόπη Αστεριάδη, το συγκρότημα Ο.Μ.Ν.Ι.Α. και τον Αλέξανδρο Θεοδωρή. Έχω επιμεληθεί βιβλία της Doreen Virtue («Πορεία προς το φως», «Θεϊκή καθοδήγηση»), των Lee Carroll & Jan Tober («Παιδιά σε βαθύ μπλε»), του Bert Hellinger («Μονοπάτια της αγάπης», «Η φαινομενολογική σκέψη του Bert Hellinger») και της Sharlotte Palmgren («Αν ήξερες πόσο πολύ σε αγαπώ»).",
    "Είμαι μέλος του ΣΕΨ (Σύλλογος Ελλήνων Ψυχολόγων) και του TIFI (The International Focusing Institute – New York). Ο χώρος μου βρίσκεται στο Νέο Ηράκλειο, λίγα βήματα από τον ηλεκτρικό σταθμό, και είναι φτιαγμένος για να νιώθετε άνετα, ασφαλείς και ελεύθεροι να εκφραστείτε.",
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

      {books.length > 0 && (
        <section className="bg-secondary/30 border-y border-border">
          <div className="container-page py-16 md:py-20">
            <h2 className="font-serif text-3xl md:text-4xl mb-10">Συγγραφικό Έργο</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((b, i) => (
                <div key={i} className="group">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary mb-4">
                    {b.cover_image ? (
                      <img src={b.cover_image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-6">
                        <div className="text-center">
                          <BookOpen className="size-8 text-primary/40 mx-auto mb-2" strokeWidth={1} />
                          <p className="text-xs text-muted-foreground text-center line-clamp-2">{b.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-sm text-foreground leading-snug">{b.title}</h3>
                  {b.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{b.subtitle}</p>
                  )}
                </div>
              ))}
            </div>
            {booksCtaText && booksCtaUrl && (
              <div className="mt-10 text-center">
                <Link to={booksCtaUrl} className="btn-cta inline-flex items-center gap-2">
                  {booksCtaText} <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="bg-secondary/30 border-y border-border">
        <div className="container-page py-16 md:py-20">
          <h2 className="font-serif text-3xl md:text-4xl mb-10">{credsTitle}</h2>
          {credsLoading ? (
            <div className="flex justify-center py-10"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {credentials.map((c) => {
                const Icon = getIcon(c.icon);
                return (
                  <div key={c.id} className="flex items-start gap-4 card-soft p-6">
                    <Icon className="size-6 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-foreground font-medium">{c.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="py-8" />

      <ValuesBand />

      <CtaBand />
    </PageShell>
  );
}
