import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";

const TENANT_ID = "00000000-0000-0000-0000-000000000001";

export { TENANT_ID };

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogPostsByCategory(category: string, options?: { showOnServicePage?: boolean; enabled?: boolean }) {
  return useQuery({
    queryKey: ["blog_posts", category, options?.showOnServicePage],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("is_published", true);
      if (category) {
        query = query.eq("category", normalizeBlogCategory(category) || category);
      }
      if (options?.showOnServicePage) {
        query = query.eq("show_on_service_page", true);
      }
      const { data } = await query.order("published_at", { ascending: false });
      return data ?? [];
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedArticles(slug: string) {
  return useQuery({
    queryKey: ["related_articles", slug],
    queryFn: async () => {
      const { data: service } = await supabase
        .from("services")
        .select("id, show_related_articles, related_articles_mode, related_articles_limit, related_articles_title, related_articles_title_en, title")
        .eq("tenant_id", TENANT_ID)
        .eq("slug", slug)
        .maybeSingle();

      if (!service || !service.show_related_articles) {
        return { articles: [], title: "" };
      }

      const limit = service.related_articles_limit || 6;
      const sectionTitle = service.related_articles_title || "Σχετικά άρθρα";
      let articles: any[] = [];

      if (service.related_articles_mode === "manual") {
        const { data: relations } = await supabase
          .from("service_related_articles")
          .select("blog_post_id, sort_order, blog_posts!inner(*)")
          .eq("service_id", service.id)
          .eq("blog_posts.is_published", true)
          .order("sort_order")
          .limit(limit);

        if (relations) {
          articles = relations.map((r: any) => r.blog_posts).filter(Boolean);
        }
      } else if (service.related_articles_mode === "category" && service.title) {
        const { data: posts } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("tenant_id", TENANT_ID)
          .eq("is_published", true)
          .eq("category", service.title)
          .order("published_at", { ascending: false })
          .limit(limit);
        articles = posts ?? [];
      } else {
        const { data: posts } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("tenant_id", TENANT_ID)
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(limit);
        articles = posts ?? [];
      }

      return { articles, title: sectionTitle };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCredentials() {
  return useQuery({
    queryKey: ["credentials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("credentials")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useServiceBySlug(slug: string) {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      return data ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCoreValues() {
  return useQuery({
    queryKey: ["core_values"],
    queryFn: async () => {
      const { data } = await supabase
        .from("core_values")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("tenant_id", TENANT_ID);
      if (!data) return {};
      return data.reduce<Record<string, unknown>>((acc, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {});
    },
    staleTime: 30 * 1000,
  });
}

export const ANNOUNCEMENT_CATEGORIES = [
  "ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ",
  "ΟΜΑΔΕΣ",
] as const;

export function isAnnouncementCategory(category?: string | null): boolean {
  if (!category) return false;
  const normalized = normalizeBlogCategory(category);
  return ANNOUNCEMENT_CATEGORIES.includes(
    normalized as typeof ANNOUNCEMENT_CATEGORIES[number]
  );
}

export const CANONICAL_CATEGORIES = [
  "ΑΡΘΡΑ",
  "ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ",
  "ΟΜΑΔΕΣ",
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  ΑΡΘΡΑ: "Άρθρα",
  "ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ": "Ομιλίες & Σεμινάρια",
  ΟΜΑΔΕΣ: "Ομάδες",
};

export function normalizeBlogCategory(cat: string | null | undefined): string | null {
  if (!cat) return null;
  const trimmed = cat.trim();
  if (trimmed === "ΟΜΙΛΙΕΣ" || trimmed === "ΣΕΜΙΝΑΡΙΑ" || trimmed === "ΟΜΙΛΙΕΣ & ΣΕΜΙΝΑΡΙΑ") return "ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ";
  return trimmed;
}

export function useSiteSetting(key: string) {
  const { data: settings } = useSiteSettings();
  return settings?.[key];
}

export type PageDataEntry = {
  hero_image?: string;
  title?: string;
  subtitle?: string;
};

export type PageData = Record<string, PageDataEntry>;

export function usePageData(): PageData {
  const raw = useSiteSetting("page_data");
  if (!raw || typeof raw !== "object") return {};
  return raw as PageData;
}

export type ServiceFaqEntry = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function renderTipContent(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return escapeHtml(node);

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
    return `<ul class="space-y-2 mb-6 pl-5 list-disc text-muted-foreground">${(node.content || []).map(renderTipContent).join("")}</ul>`;
  }

  if (node.type === "orderedList") {
    return `<ol class="space-y-2 mb-6 pl-5 list-decimal text-muted-foreground">${(node.content || []).map(renderTipContent).join("")}</ol>`;
  }

  if (node.type === "listItem") {
    const childContent = (node.content || []).map(renderTipContent).join("");
    return `<li class="mb-1">${childContent.replace(/<\/?p[^>]*>/g, "")}</li>`;
  }

  if (node.type === "image") {
    const src = escapeHtml(node.attrs?.src || "");
    const alt = escapeHtml(node.attrs?.alt || "");
    return `<figure class="my-8"><img src="${src}" alt="${alt}" class="w-full rounded-2xl" loading="lazy" /><figcaption class="text-xs text-muted-foreground text-center mt-2">${alt}</figcaption></figure>`;
  }

  if (node.type === "horizontalRule") {
    return `<hr class="my-8 border-border" />`;
  }

  if (node.type === "hardBreak") {
    return "<br />";
  }

  if (node.type === "codeBlock") {
    const lang = node.attrs?.language ? ` class="language-${escapeHtml(node.attrs.language)}"` : "";
    return `<pre class="bg-muted p-4 rounded-xl overflow-x-auto text-sm mb-5"><code${lang}>${escapeHtml((node.content || []).map(renderTipContent).join(""))}</code></pre>`;
  }

  if (node.type === "blockquote") {
    return `<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">${(node.content || []).map(renderTipContent).join("")}</blockquote>`;
  }

  if (node.type === "text") {
    let text = escapeHtml(node.text || "");
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === "bold") text = `<strong>${text}</strong>`;
        if (mark.type === "italic") text = `<em>${text}</em>`;
        if (mark.type === "strike") text = `<s>${text}</s>`;
        if (mark.type === "underline") text = `<u>${text}</u>`;
        if (mark.type === "link") {
          const href = escapeHtml(mark.attrs?.href || "");
          text = `<a href="${href}" class="text-primary underline hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
      }
    }
    return text;
  }

  return "";
}

export function useServiceFaq(slug: string) {
  return useQuery({
    queryKey: ["service_faq", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("service_faq_entries")
        .select("id, question, answer, sort_order, services!inner(slug)")
        .eq("services.slug", slug)
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true)
        .order("sort_order");
      return (data ?? []) as ServiceFaqEntry[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
