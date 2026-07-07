import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';

const TENANT_ID = "00000000-0000-0000-0000-000000000001";

export function useCoreEntity(entityType: string) {
  return useQuery({
    queryKey: ["core_entity", entityType],
    queryFn: async () => {
      const { data } = await supabase
        .from("core_entities")
        .select("data, version, updated_at")
        .eq("tenant_id", TENANT_ID)
        .eq("entity_type", entityType)
        .single();
      return data || null;
    },
    staleTime: 30 * 1000,
  });
}

export function useCoreEntityData<T = any>(entityType: string, defaults: T): T {
  const { data: entity } = useCoreEntity(entityType);
  if (!entity?.data) return defaults;
  return { ...defaults, ...entity.data };
}

export interface BrandingData {
  site_name: string;
  site_subtitle: string;
  monogram: string;
  tagline: string;
  copyright: string;
  logo: string;
  logo_footer: string;
  favicon: string;
  apple_icon: string;
  primary_color: string;
  background_color: string;
}

const defaultBranding: BrandingData = {
  site_name: "Νικολας Κολοκοτρωνης",
  site_subtitle: "Ψυχολογος",
  monogram: "ΝΚ",
  tagline: "Ένας ασφαλής χώρος για αυτογνωσία, ισορροπία και αλλαγή.",
  copyright: "Νικόλας Κολοκοτρώνης — Ψυχολόγος · Νέο Ηράκλειο",
  logo: "",
  logo_footer: "",
  favicon: "",
  apple_icon: "",
  primary_color: "#6b8f3a",
  background_color: "#faf8f5",
};

export function useBranding(): BrandingData {
  return useCoreEntityData('branding', defaultBranding);
}
