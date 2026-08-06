import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/lib/supabase";
import { useSiteSetting, isAnnouncementCategory, CATEGORY_LABELS, renderTipContent } from "@/lib/content-hooks";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  category: string;
  image_url: string;
  is_published: boolean;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  og_image: string;
  show_date: boolean;
}

const TENANT_ID = "00000000-0000-0000-0000-000000000001";
const monthsGR = ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαϊ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()} ${monthsGR[d.getMonth()]} ${d.getFullYear()}`;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("tenant_id", TENANT_ID)
      .eq("is_published", true)
      .maybeSingle();
    if (!data) throw notFound();
    return data as BlogPost;
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: loaderData?.meta_title || loaderData?.title || "Άρθρο — Νικόλας Κολοκοτρώνης" },
      { name: "description", content: loaderData?.meta_description || loaderData?.excerpt || "" },
      { property: "og:title", content: loaderData?.title || "" },
      { property: "og:description", content: loaderData?.excerpt || "" },
      { property: "og:url", content: `https://nikolaskolokotronis.gr/blog/${params.slug}` },
      ...(loaderData?.og_image ? [{ property: "og:image", content: loaderData.og_image }] : []),
    ],
    links: [
      { rel: "canonical", href: `https://nikolaskolokotronis.gr/blog/${params.slug}` },
    ],
  }),
  component: BlogPostPage,
  pendingComponent: () => (
    <PageShell>
      <div className="flex justify-center py-32"><div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell>
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Το άρθρο δεν βρέθηκε</h1>
        <Link to="/blog" className="text-primary hover:underline">← Επιστροφή στα άρθρα</Link>
      </div>
    </PageShell>
  ),
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  const announcementShowDates = (useSiteSetting("announcement_show_dates") as string) === "true";

  if (!post) return null;

  const isAnnouncement = isAnnouncementCategory(post.category);
  const backLabel = (useSiteSetting(isAnnouncement ? "announcement_back_button_text" : "blog_back_button_text") as string)
    || (isAnnouncement ? "Όλες οι ανακοινώσεις" : "Όλα τα άρθρα");

  return (
    <PageShell>
      <article>
        <div
          className="relative aspect-[2.35/1] min-h-[300px] bg-fixed sm:bg-top bg-center bg-cover"
          style={post.image_url ? { backgroundImage: `url(${post.image_url})` } : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container-page pb-6 sm:pb-10">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 sm:mb-4">
              <ArrowLeft size={14} /> {backLabel}
            </Link>
            <h1 className="font-serif text-xl sm:text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight">{post.title}</h1>
            {post.show_date === true || (isAnnouncement && announcementShowDates) ? (
              <div className="flex items-center gap-3 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                <Calendar size={14} />
                <span>{formatDate(post.published_at)}</span>
                {post.category && <><span>·</span><span className="text-primary font-medium">{CATEGORY_LABELS[post.category] || post.category}</span></>}
              </div>
            ) : (
              post.category && (
                <div className="flex items-center gap-3 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="text-primary font-medium">{CATEGORY_LABELS[post.category] || post.category}</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="container-page py-12 md:py-16 max-w-3xl mx-auto prose-content" dangerouslySetInnerHTML={{ __html: renderTipContent(post.content) }} />

        <div className="container-page pb-12 sm:pb-16 text-center border-t border-border pt-6 sm:pt-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
            <ArrowLeft size={14} /> {backLabel}
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
