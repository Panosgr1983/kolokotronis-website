import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/lib/supabase";

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
}

const TENANT_ID = "00000000-0000-0000-0000-000000000001";
const monthsGR = ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαϊ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()} ${monthsGR[d.getMonth()]} ${d.getFullYear()}`;
}

function renderTipContent(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;

  if (node.type === "doc") {
    return (node.content || []).map(renderTipContent).join("");
  }

  if (node.type === "paragraph") {
    return `<p class="text-muted-foreground leading-relaxed mb-5">${(node.content || []).map(renderTipContent).join("")}</p>`;
  }

  if (node.type === "heading") {
    const level = node.attrs?.level || 2;
    const sizes: Record<number, string> = { 2: "text-2xl md:text-3xl mt-10 mb-5", 3: "text-xl mt-8 mb-4" };
    return `<h${level} class="font-serif ${sizes[level] || "text-lg mt-6 mb-3"} text-foreground">${(node.content || []).map(renderTipContent).join("")}</h${level}>`;
  }

  if (node.type === "bulletList") {
    return `<ul class="space-y-2 mb-6">${(node.content || []).map(renderTipContent).join("")}</ul>`;
  }

  if (node.type === "listItem") {
    const childContent = (node.content || []).map(renderTipContent).join("");
    return `<li class="flex items-start gap-2 text-muted-foreground"><span class="text-primary mt-1.5 shrink-0 size-1.5 rounded-full bg-primary"></span><span>${childContent.replace(/<\/?p[^>]*>/g, "")}</span></li>`;
  }

  if (node.type === "image") {
    const src = node.attrs?.src || "";
    const alt = node.attrs?.alt || "";
    return `<figure class="my-8"><img src="${src}" alt="${alt}" class="w-full rounded-2xl" loading="lazy" /><figcaption class="text-xs text-muted-foreground text-center mt-2">${alt}</figcaption></figure>`;
  }

  if (node.type === "text") {
    let text = node.text || "";
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === "bold") text = `<strong>${text}</strong>`;
        if (mark.type === "italic") text = `<em>${text}</em>`;
      }
    }
    return text;
  }

  return "";
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("tenant_id", TENANT_ID)
      .eq("is_published", true)
      .single();
    return data as BlogPost | null;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.meta_title || loaderData?.title || "Άρθρο — Νικόλας Κολοκοτρώνης" },
      { name: "description", content: loaderData?.meta_description || loaderData?.excerpt || "" },
      { property: "og:title", content: loaderData?.title || "" },
      { property: "og:description", content: loaderData?.excerpt || "" },
      ...(loaderData?.og_image ? [{ property: "og:image", content: loaderData.og_image }] : []),
    ],
  }),
  component: BlogPostPage,
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

  if (!post) return null;

  return (
    <PageShell>
      <article>
        <div
          className="relative h-[60vh] md:h-[70vh] min-h-[400px] bg-fixed bg-top bg-cover"
          style={post.image_url ? { backgroundImage: `url(${post.image_url})` } : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container-page pb-10">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft size={14} /> Ολα τα αρθρα
            </Link>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground max-w-3xl leading-tight">{post.title}</h1>
            <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>{formatDate(post.published_at)}</span>
              {post.category && <><span>·</span><span className="text-primary font-medium">{post.category}</span></>}
            </div>
          </div>
        </div>

        <div className="container-page py-12 md:py-16 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: renderTipContent(post.content) }} />

        <div className="container-page pb-16 text-center border-t border-border pt-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
            <ArrowLeft size={14} /> Ολα τα αρθρα
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
