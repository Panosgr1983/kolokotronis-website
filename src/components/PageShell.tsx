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

export function PageHero({ eyebrow, title, subtitle, backgroundImage }: { eyebrow?: string; title: string; subtitle?: string; backgroundImage?: string }) {
  if (backgroundImage) {
    return (
      <section className="relative aspect-[2.35/1] min-h-[300px] bg-fixed bg-top bg-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 container-page pb-12 md:pb-16">
          <div className="max-w-3xl">
            {eyebrow && <p className="text-xs tracking-[0.2em] uppercase text-primary-light mb-4">{eyebrow}</p>}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">{title}</h1>
            {subtitle && <p className="mt-4 text-base md:text-lg text-white/80 max-w-xl leading-relaxed">{subtitle}</p>}
          </div>
        </div>
      </section>
    );
  }

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
