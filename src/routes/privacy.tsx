import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { usePageData } from "@/lib/content-hooks";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Πολιτική Απορρήτου — Νικόλας Κολοκοτρώνης" },
      { name: "description", content: "Πολιτική απορρήτου και προστασίας δεδομένων." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const privacyPage = usePageData()["/privacy"] || {};
  return (
    <PageShell>
      <PageHero
        eyebrow="Νομικά"
        title={privacyPage.title || "Πολιτική Απορρήτου"}
        subtitle={privacyPage.subtitle || "Πώς συλλέγονται, χρησιμοποιούνται και προστατεύονται τα προσωπικά σας δεδομένα."}
        backgroundImage={privacyPage.hero_image}
      />
      <section className="container-page py-12 md:py-16 max-w-3xl">
        <div className="prose-content space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Η παρούσα Πολιτική Απορρήτου περιγράφει τον τρόπο με τον οποίο συλλέγονται, χρησιμοποιούνται και προστατεύονται τα προσωπικά σας δεδομένα όταν επισκέπτεστε την ιστοσελίδα ή επικοινωνείτε για συνεδρία.
          </p>
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">1. Δεδομένα που συλλέγονται</h2>
            <p>
              Συλλέγονται μόνο τα στοιχεία που μας παρέχετε εθελοντικά μέσω της φόρμας επικοινωνίας (ονοματεπώνυμο, email, τηλέφωνο, μήνυμα). Δεν συλλέγονται ευαίσθητα δεδομένα μέσω της ιστοσελίδας.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">2. Σκοπός χρήσης</h2>
            <p>
              Τα δεδομένα χρησιμοποιούνται αποκλειστικά για την επικοινωνία μαζί σας και τον προγραμματισμό συνεδρίας. Δεν κοινοποιούνται σε τρίτους και δεν χρησιμοποιούνται για διαφημιστικούς σκοπούς.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">3. Εμπιστευτικότητα συνεδριών</h2>
            <p>
              Όλες οι πληροφορίες που μοιράζεστε στο πλαίσιο των συνεδριών προστατεύονται από το επαγγελματικό απόρρητο, σύμφωνα με τον κώδικα δεοντολογίας του Συλλόγου Ελλήνων Ψυχολόγων.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">4. Δικαιώματά σας (GDPR)</h2>
            <p>
              Έχετε δικαίωμα πρόσβασης, διόρθωσης, διαγραφής και φορητότητας των δεδομένων σας. Για οποιοδήποτε αίτημα, επικοινωνήστε στο +30 697 437 1139.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-3">5. Cookies</h2>
            <p>
              Η ιστοσελίδα χρησιμοποιεί μόνο τα απαραίτητα τεχνικά cookies για τη λειτουργία της. Δεν χρησιμοποιούνται cookies παρακολούθησης ή διαφήμισης.
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
