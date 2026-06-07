import { useEffect } from "react";
import { supabase } from "./supabase";

const TENANT_ID = "00000000-0000-0000-0000-000000000001";

let lastPath = "";

export function usePageviewTracking() {
  useEffect(() => {
    const path = window.location.pathname;
    if (path === lastPath) return;
    lastPath = path;

    supabase.from("pageviews").insert({
      tenant_id: TENANT_ID,
      path,
      referrer: document.referrer || "",
      user_agent: navigator.userAgent.slice(0, 500),
    }).then(({ error }) => {
      if (error) console.warn("Analytics track error:", error.message);
    });
  });
}
