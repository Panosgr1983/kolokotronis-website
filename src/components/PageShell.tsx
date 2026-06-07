import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="bg-secondary/50 border-b border-border">
      <div className="container-page py-20 md:py-28 text-center max-w-3xl">
        {eyebrow && (
          <p className="text-xs tracking-[0.2em] uppercase text-primary mb-4">{eyebrow}</p>
        )}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">{title}</h1>
        {subtitle && <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}
