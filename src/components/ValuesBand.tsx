import { useCoreValues } from "@/lib/content-hooks";
import { getIcon } from "@/lib/icon-map";

export function ValuesBand() {
  const { data: values = [], isLoading } = useCoreValues();

  return (
    <section className="bg-trust text-trust-foreground">
      <div className="container-page py-12 sm:py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        {isLoading ? (
          <div className="col-span-full flex justify-center"><div className="size-8 border-2 border-trust-foreground/30 border-t-white rounded-full animate-spin" /></div>
        ) : (
          values.map((v) => {
            const Icon = getIcon(v.icon);
            return (
              <div key={v.id} className="flex gap-4">
                <span className="shrink-0 size-11 rounded-full border border-trust-foreground/30 flex items-center justify-center text-cta">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="font-serif text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-trust-foreground/75 leading-relaxed">{v.description}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
