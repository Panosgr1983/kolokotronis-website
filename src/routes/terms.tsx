import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Όροι Χρήσης — Νικόλας Κολοκοτρώνης" },
      { name: "description", content: "Όροι χρήσης της ιστοσελίδας και των υπηρεσιών." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Νομικά"
        title="Όροι Χρήσης"
        subtitle="Παρακαλώ διαβάστε προσεκτικά τους όρους που διέπουν τη χρήση της ιστοσελίδας και των υπηρεσιών."
      />
      <section className="container-page py-12 md:py-16 max-w-3xl">
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Η χρήση της παρούσας ιστοσελίδας υποδηλώνει την ανεπιφύλακτη αποδοχή των ακόλουθων όρων. Παρακαλώ διαβάστε τους προσεκτικά πριν συνεχίσετε.
          </p>
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">1. Φύση της ιστοσελίδας</h2>
            <p>
              Η ιστοσελίδα παρέχει πληροφορίες για τις υπηρεσίες ψυχολογικής υποστήριξης και προσωπικής ανάπτυξης του Νικόλα Κολοκοτρώνη. Δεν αντικαθιστά την επαγγελματική θεραπευτική σχέση.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">2. Περιεχόμενο</h2>
            <p>
              Τα άρθρα και το υλικό της ιστοσελίδας έχουν ενημερωτικό χαρακτήρα και δεν αποτελούν εξατομικευμένη ψυχολογική συμβουλή ή διάγνωση. Σε περίπτωση ψυχολογικής δυσκολίας απευθυνθείτε σε επαγγελματία.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">3. Ραντεβού & ακυρώσεις</h2>
            <p>
              Τα ραντεβού επιβεβαιώνονται κατόπιν τηλεφωνικής συνεννόησης. Παρακαλείσθε να ενημερώνετε για τυχόν ακύρωση τουλάχιστον 24 ώρες πριν από την προγραμματισμένη συνεδρία.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">4. Πνευματική ιδιοκτησία</h2>
            <p>
              Όλο το περιεχόμενο της ιστοσελίδας (κείμενα, εικόνες, σχεδιασμός) αποτελεί πνευματική ιδιοκτησία και δεν επιτρέπεται η αναπαραγωγή χωρίς γραπτή άδεια.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">5. Επείγουσες καταστάσεις</h2>
            <p>
              Σε περίπτωση επείγουσας κρίσης ή ψυχολογικής δυσκολίας, καλέστε άμεσα την Γραμμή Βοήθειας SOS 1018 ή το ΕΚΑΒ στο 166. Η ιστοσελίδα δεν προορίζεται για επείγουσα υποστήριξη.
            </p>
          </div>
          <p className="text-xs pt-6 border-t border-border">
            Τελευταία ενημέρωση: Μάιος 2026
          </p>
        </div>
      </section>
    </PageShell>
  );
}
