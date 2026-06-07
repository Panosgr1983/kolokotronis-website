## Στόχος

Ενσωμάτωση των πιο δυνατών στοιχείων του reference template στο υπάρχον site του Νικόλα, διατηρώντας τη ζεστή μινιμαλιστική ταυτότητα (olive/terracotta/cream) — όχι αντιγραφή του dark navy template.

---

## 1. Νέο Hero (full-width, cinematic)

- Full-width section με τη φωτογραφία γραφείου ως **background image**
- Σκούρο gradient overlay από αριστερά (deep charcoal → semi-transparent) για αναγνωσιμότητα
- Κείμενο σε λευκό αριστερά:
  - Leaf icon (μικρό, terracotta accent)
  - H1 σε 3 γραμμές: «Κατανόηση. Αποδοχή. Αλλαγή.»
  - Subtitle: «Ένας ασφαλής χώρος για να μιλήσετε, να κατανοήσετε, να προχωρήσετε.»
  - 2 buttons: terracotta CTA «Μάθετε περισσότερα» + outline λευκό «Πώς μπορώ να σας βοηθήσω»
- Ύψος ~85vh σε desktop, αυτόματο σε mobile
- Νέο asset hero φωτογραφία ζεστού γραφείου (αν χρειαστεί καινούργιο visual για να δουλέψει σωστά το overlay)

## 2. Νέα ενότητα Αξιών (dark band)

Αντικαθιστά το slate-blue CtaBand με μια πιο πλούσια σκούρα ενότητα 4 αξιών (πριν παραμένει το credentials strip ως light band):

| Icon | Τίτλος | Περιγραφή |
|---|---|---|
| ShieldCheck | Εμπιστευτικότητα | Ο απόρρητος χαρακτήρας της συνεδρίας είναι απόλυτη προτεραιότητα |
| UserCheck | Εξατομικευμένη προσέγγιση | Κάθε άνθρωπος είναι μοναδικός — προσαρμόζω τη διαδικασία στις δικές σας ανάγκες |
| BookCheck | Επιστημονική τεκμηρίωση | Βασίζομαι σε σύγχρονες ψυχοθεραπευτικές μεθόδους και διαρκή επιμόρφωση |
| MapPin | Κεντρική τοποθεσία | Το γραφείο μου βρίσκεται στο Νέο Ηράκλειο, εύκολα προσβάσιμο |

Στυλ: bg-footer (dark olive) ή bg-trust, λευκά κείμενα, terracotta icons. Διατηρείται το credentials strip ως ξεχωριστή light section.

Το CtaBand μετακινείται πιο κάτω (πριν το blog ή πριν το contact preview).

## 3. Φόρμα Επικοινωνίας

**Νέο component:** `src/components/ContactForm.tsx`
- Πεδία: Ονοματεπώνυμο, Email, Τηλέφωνο (προαιρετικό), Μήνυμα
- Validation με zod (max length, email format)
- React Hook Form + shadcn `Form`, `Input`, `Textarea`, `Button`
- Submit για τώρα: εμφανίζει toast «Το μήνυμά σας στάλθηκε» (placeholder — δεν στέλνει mail χωρίς backend)
- Disclaimer κάτω: «Τα στοιχεία σας είναι ασφαλή και δεν κοινοποιούνται»

Τοποθέτηση:
- **/contact**: η φόρμα γίνεται κεντρικό στοιχείο (3 στήλες: στοιχεία | φόρμα | map)
- **Homepage contact preview**: layout γίνεται `md:grid-cols-3` με στήλες (επικοινωνία | φόρμα compact | map)

Σημείωση: για πραγματική αποστολή email θα χρειαστεί Lovable Cloud + edge function (Resend) — το αναφέρω μετά την υλοποίηση ως επόμενο βήμα.

## 4. Footer additions

- **Νέες σελίδες:** `src/routes/privacy.tsx`, `src/routes/terms.tsx` με placeholder Greek κείμενο που μπορεί να επεξεργαστεί ο χρήστης (4–5 παραγράφους η κάθε μία, βασικό πρότυπο GDPR-aware)
- Κάτω γραμμή footer: copyright αριστερά, links «Πολιτική Απορρήτου» · «Όροι Χρήσης» δεξιά

---

## Τι ΔΕΝ αλλάζει

- Color palette (olive/terracotta/cream) — δεν υιοθετούμε το navy του reference
- Navigation, services data, blog, testimonials, About preview — όλα παραμένουν
- Typography (Cormorant + DM Sans)
- Monogram και layout header

---

## Σειρά εκτέλεσης

1. Νέο hero (index.tsx) με dark overlay + στυλ
2. Νέα Values band component + ένταξη στην homepage
3. ContactForm component + ένταξη σε /contact και homepage
4. Privacy + Terms routes + footer links

## Τεχνικές σημειώσεις

- Όλα τα νέα strings ακολουθούν τον κανόνα «κεφαλαία χωρίς τόνους» όπου εμφανίζονται με `uppercase` class
- Χρήση semantic tokens από `styles.css` (καμία απευθείας hex/Tailwind color)
- Form validation σύμφωνα με zod schema (max lengths, email)
- Routes αυτο-εγγράφονται από TanStack Router plugin — δεν αγγίζουμε το `routeTree.gen.ts`