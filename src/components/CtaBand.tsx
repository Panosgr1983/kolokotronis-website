import { Link } from "@tanstack/react-router";
import { Calendar, Leaf } from "lucide-react";
import { useSiteSetting } from "@/lib/content-hooks";

export function CtaBand() {
  const title = (useSiteSetting("cta_band_title") as string) || "Είστε έτοιμοι για το επόμενο βήμα;";
  const subtitle = (useSiteSetting("cta_band_subtitle") as string) || "Κλείστε μια πρώτη γνωριμία — χωρίς δέσμευση.";
  const buttonText = (useSiteSetting("cta_band_button_text") as string) || "Κλειστε ραντεβου";
  const buttonLink = (useSiteSetting("cta_band_button_link") as string) || "/contact";

  return (
    <section className="bg-trust text-trust-foreground">
      <div className="container-page py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-5">
          <span className="hidden sm:inline-flex size-14 rounded-full border border-trust-foreground/30 items-center justify-center shrink-0">
            <Leaf className="size-6" />
          </span>
          <div>
            <h2 className="font-serif text-2xl md:text-3xl mb-1">{title}</h2>
            <p className="text-trust-foreground/80 text-sm md:text-base">
              {subtitle}
            </p>
          </div>
        </div>
        <Link to={buttonLink} className="btn-cta shrink-0 text-xs tracking-[0.18em] uppercase">
          <Calendar className="size-4" />
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
