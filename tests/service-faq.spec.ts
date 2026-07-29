import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://kolokotronis-website.choliasmenos-panos.workers.dev';

test.describe('Service FAQ — Performance Baseline #1', () => {

  test('FAQ section renders on service with FAQ data', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`);
    await page.waitForTimeout(3000);
    const faqSection = page.locator('text=Συχνές Ερωτήσεις');
    await expect(faqSection).toBeVisible({ timeout: 10000 });
  });

  test('FAQ accordion expands and collapses', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`);
    await page.waitForTimeout(3000);
    const trigger = page.locator('text=Πόσο διαρκεί μία συνεδρία;');
    await expect(trigger).toBeVisible({ timeout: 10000 });
    await trigger.click();
    const answer = page.locator('text=Η κάθε συνεδρία διαρκεί περίπου 50-60 λεπτά');
    await expect(answer).toBeVisible({ timeout: 3000 });
    await trigger.click();
  });

  test('FAQ entries count matches seeded data (4 for autognosia)', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`);
    await page.waitForTimeout(3000);
    const items = page.locator('[data-testid="faq-item"]');
    await expect(items).toHaveCount(4, { timeout: 10000 });
  });

  test('FAQ section not shown for service without FAQ', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/epignosi`);
    await page.waitForTimeout(3000);
    const faqSection = page.locator('text=Συχνές Ερωτήσεις');
    await expect(faqSection).toHaveCount(0, { timeout: 10000 });
  });

  test('FAQ JSON-LD structured data present', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`);
    await page.waitForTimeout(3000);
    const jsonld = page.locator('script[type="application/ld+json"]');
    const count = await jsonld.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const text = await jsonld.first().textContent();
    const parsed = JSON.parse(text);
    if (parsed['@type'] === 'FAQPage') {
      expect(parsed.mainEntity.length).toBeGreaterThanOrEqual(1);
      expect(parsed.mainEntity[0]['@type']).toBe('Question');
    }
  });

  test('EMDR service has 2 FAQ entries', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/emdr`);
    await page.waitForTimeout(3000);
    const items = page.locator('[data-testid="faq-item"]');
    await expect(items).toHaveCount(2, { timeout: 10000 });
  });

  test('Reiki service has 2 FAQ entries', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/reiki`);
    await page.waitForTimeout(3000);
    const items = page.locator('[data-testid="faq-item"]');
    await expect(items).toHaveCount(2, { timeout: 10000 });
  });

  test('FAQ ordering matches DB sort_order', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`);
    await page.waitForTimeout(3000);
    const items = page.locator('[data-testid="faq-trigger"]');
    const texts = await items.allTextContents();
    expect(texts[0].trim()).toBe('Πόσο διαρκεί μία συνεδρία;');
    expect(texts[1].trim()).toBe('Πόσες συνεδρίες χρειάζονται;');
  });
});
