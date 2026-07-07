import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { Toaster } from "sonner";

import { usePageviewTracking } from "../lib/analytics";
import { supabase } from "../lib/supabase";
import { TENANT_ID } from "../lib/content-hooks";
import { useBranding } from "../lib/core-hooks";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Η σελίδα δεν βρέθηκε</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Επιστροφή στην αρχική
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("ROUTE ERROR:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Κάτι πήγε στραβά
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Δοκιμάστε να ανανεώσετε ή επιστρέψτε στην αρχική.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Δοκιμάστε ξανά
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Επιστροφή στην αρχική
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery({
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
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Νικόλας Κολοκοτρώνης — Ψυχολόγος | Νέο Ηράκλειο" },
      { name: "description", content: "Ένας ασφαλής χώρος για αυτογνωσία, ισορροπία και αλλαγή. Ατομικές συνεδρίες, Ρέικι, NLP και συνδυαστική προσέγγιση στο Νέο Ηράκλειο." },
      { name: "author", content: "Nikolas Kolokotronis" },
      { property: "og:title", content: "Νικόλας Κολοκοτρώνης — Ψυχολόγος" },
      { property: "og:description", content: "Ένας ασφαλής χώρος για αυτογνωσία, ισορροπία και αλλαγή." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Νικόλας Κολοκοτρώνης — Ψυχολόγος" },
      { name: "twitter:description", content: "Ένας ασφαλής χώρος για αυτογνωσία, ισορροπία και αλλαγή." },
    ],
    links: [
      { rel: "icon", href: "/logo.png" },
      { rel: "shortcut icon", href: "/logo.png" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  usePageviewTracking();
  const branding = useBranding();
  const favicon = branding.favicon || "/logo.png";

  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.setAttribute("rel", "icon");
    link.setAttribute("href", favicon);
    document.head.appendChild(link);
  }, [favicon]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
