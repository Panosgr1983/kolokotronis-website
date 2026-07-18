# Kolokotronis: Service Pages + Related Articles

## Goal
- "Ομιλίες, Σεμινάρια" nav/footer links → `/services/seminar-omilies` (not `/blog`)
- `services.$slug.tsx` shows related blog posts below the description, filtered by category
- Create blog category "ΟΜΑΔΕΣ" with a generated article

## Files to edit (4)

### 1. `src/components/SiteHeader.tsx:26`
```diff
- { label: "Ομιλιες, Σεμιναρια", path: "/blog" },
+ { label: "Ομιλιες, Σεμιναρια", path: "/services/seminar-omilies" },
```

### 2. `src/components/SiteFooter.tsx:27`
```diff
- { label: "Ομιλίες, Σεμινάρια", path: "/blog" },
+ { label: "Ομιλίες, Σεμινάρια", path: "/services/seminar-omilies" },
```

### 3. `src/lib/content-hooks.ts`
Add new hook:
```ts
export function useBlogPostsByCategory(category: string) {
  return useQuery({
    queryKey: ["blog_posts", category],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("category", category)
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

### 4. `src/routes/services.$slug.tsx`
After the service description section (before `<CtaBand />`), add:

```tsx
const CATEGORY_MAP: Record<string, string> = {
  omades: "ΟΜΑΔΕΣ",
  "seminar-omilies": "ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ",
};

const blogCategory = CATEGORY_MAP[slug];
const { data: relatedPosts = [] } = useBlogPostsByCategory(blogCategory || "");
```

And render the articles section:
```tsx
{relatedPosts.length > 0 && (
  <section className="border-t border-border mt-12 sm:mt-16 pt-10 sm:pt-14">
    <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-center">
      Άρθρα για {service.title}
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
      {relatedPosts.map((p) => (
        <Link key={p.id} to={`/blog/${p.slug}`} className="card-soft overflow-hidden flex flex-col group">
          {p.image_url && (
            <img src={p.image_url} alt={p.title} className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500" />
          )}
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-3">
              <span className="text-primary font-medium">{p.category}</span>
              <span>·</span>
              <span>{formatDate(p.published_at)}</span>
            </div>
            <h3 className="font-serif text-xl leading-snug mb-3 group-hover:text-primary transition-colors">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{p.excerpt}</p>
            <span className="text-sm text-primary font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all self-start">
              Διαβάστε <ArrowRight className="size-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>
)}
```

Need to add imports:
- `ArrowRight` from `lucide-react`
- `useBlogPostsByCategory` from `@/lib/content-hooks`
- `formatDate` helper (copy from `blog.tsx` or `blog.$slug.tsx`)

### 5. Database (SQL executed via Supabase)

```sql
-- Update existing article category
UPDATE blog_posts 
SET category = 'ΟΜΙΛΙΕΣ ΣΕΜΙΝΑΡΙΑ', updated_at = NOW()
WHERE category = 'Ομιλία';

-- Insert new article for ΟΜΑΔΕΣ category
INSERT INTO blog_posts (
  id, tenant_id, title, slug, excerpt, content, category, image_url,
  is_published, published_at, created_at, updated_at
)
SELECT
  gen_random_uuid()::text,
  '00000000-0000-0000-0000-000000000001',
  'Ομάδες Προσωπικής Ανάπτυξης: Η Δύναμη της Συνύπαρξης',
  'omades-prosopikis-anaptyxis',
  'Οι ομάδες προσωπικής ανάπτυξης προσφέρουν ένα μοναδικό πλαίσιο όπου η ατομική εξέλιξη ενισχύεται μέσα από την ομαδική δυναμική και την αλληλοϋποστήριξη.',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Οι ομάδες προσωπικής ανάπτυξης αποτελούν έναν από τους πιο αποτελεσματικούς τρόπους για να εξερευνήσετε τον εαυτό σας μέσα από την αλληλεπίδραση με άλλους ανθρώπους. Σε ένα ασφαλές και εμπιστευτικό περιβάλλον, οι συμμετέχοντες μοιράζονται εμπειρίες, προκλήσεις και στόχους."}]},{"type":"paragraph","content":[{"type":"text","text":"Η δύναμη της ομάδας βρίσκεται στην ποικιλομορφία των προοπτικών και στην αμοιβαία υποστήριξη που προσφέρουν τα μέλη μεταξύ τους. Μέσα από την ομαδική διαδικασία, μπορείτε να:"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Ανακαλύψετε νέες πτυχές του εαυτού σας"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Αναπτύξετε κοινωνικές δεξιότητες σε ένα ασφαλές περιβάλλον"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Λάβετε πολλαπλές οπτικές γωνίες για τις προκλήσεις σας"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Νιώσετε ότι δεν είστε μόνοι στις δυσκολίες σας"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Ενισχύσετε την ενσυναίσθηση και την κατανόηση προς τους άλλους"}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"Οι ομάδες συνήθως αποτελούνται από 6-10 άτομα και συναντώνται σε τακτική βάση, με τη συμμετοχή ενός έμπειρου συντονιστή. Το πρόγραμμα περιλαμβάνει τεχνικές όπως η ενεργητική ακρόαση, ο αναστοχασμός, οι ασκήσεις ενσυναίσθησης και η ανταλλαγή ανατροφοδότησης."}]},{"type":"paragraph","content":[{"type":"text","text":"Εάν αισθάνεστε ότι έχετε ανάγκη από υποστήριξη, αλλά ταυτόχρονα θέλετε να μάθετε από τις εμπειρίες άλλων, η συμμετοχή σε μια ομάδα προσωπικής ανάπτυξης μπορεί να είναι το επόμενο βήμα σας."}]}]}',
  'ΟΜΑΔΕΣ',
  NULL,
  true,
  NOW(),
  NOW(),
  NOW()
WHERE EXISTS (
  SELECT 1 FROM services WHERE slug = 'omades' AND tenant_id = '00000000-0000-0000-0000-000000000001'
);
```

## Verification
1. `npm run build` — should compile with no errors
2. Check `/services/seminar-omilies` — nav link should work + articles section visible
3. Check `/services/omades` — should show the new article
4. Check `/blog` — should no longer show seminar categories directly (only general articles)
