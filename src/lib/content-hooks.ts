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

export function useBlogPostsByCategory(category: string) {
  return useQuery({
    queryKey: ["blog_posts", category],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("category", category)
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
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
