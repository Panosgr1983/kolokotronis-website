import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Συμπληρώστε το ονοματεπώνυμο").max(100),
  email: z.string().trim().email("Μη έγκυρο email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Γράψτε ένα σύντομο μήνυμα").max(1000),
});

type FormData = z.infer<typeof schema>;

export function ContactForm({ compact = false, contactEmail }: { compact?: boolean; contactEmail?: string }) {
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Partial<Record<keyof FormData, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormData;
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Το μήνυμά σας στάλθηκε. Θα επικοινωνήσω σύντομα.");
      e.currentTarget.reset();
    } catch {
      toast.error("Δεν ήταν δυνατή η αποστολή. Δοκιμάστε ξανά ή στείλτε email.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full bg-background border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary transition-colors";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {!compact && (
        <>
          <h3 className="font-serif text-2xl mb-2">Στείλτε μου μήνυμα</h3>
          {contactEmail && (
            <p className="text-xs text-muted-foreground mb-4">
              Το μήνυμά σας θα σταλεί στο <span className="text-foreground">{contactEmail}</span>
            </p>
          )}
        </>
      )}
      <div>
        <input name="name" placeholder="Ονοματεπώνυμο" className={inputCls} maxLength={100} />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
      </div>
      <div>
        <input name="email" type="email" placeholder="Email" className={inputCls} maxLength={255} />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
      </div>
      <div>
        <input name="phone" placeholder="Τηλέφωνο (προαιρετικό)" className={inputCls} maxLength={40} />
        {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
      </div>
      <div>
        <textarea
          name="message"
          placeholder="Το μήνυμά σας..."
          rows={compact ? 4 : 5}
          maxLength={1000}
          className={inputCls + " resize-none"}
        />
        {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="btn-cta w-full text-xs tracking-[0.18em] uppercase disabled:opacity-60"
      >
        <Send className="size-4" />
        {submitting ? "Αποστολη..." : "Αποστολη μηνυματος"}
      </button>
      <p className="text-xs text-muted-foreground text-center pt-1">
        Τα στοιχεία σας είναι ασφαλή και δεν κοινοποιούνται.
      </p>
    </form>
  );
}
