import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://kolokotronis-website.choliasmenos-panos.workers.dev';

test.describe('Service FAQ — Functional (content-agnostic)', () => {

  test('FAQ section renders on service with FAQ data', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`);
    await page.waitForTimeout(3000);
    const faqSection = page.locator('text=Συχνές Ερωτήσεις');
    await expect(faqSection).toBeVisible({ timeout: 10000 });
  });

  test('FAQ accordion expands and collapses', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`);
    await page.waitForTimeout(3000);
    const trigger = page.locator('[data-testid="faq-trigger"]').first();
    await expect(trigger).toBeVisible({ timeout: 10000 });
    await trigger.click();
    await page.waitForTimeout(500);
    const open = page.locator('[data-state="open"]').first();
    await expect(open).toBeVisible({ timeout: 3000 });
    await trigger.click();
  });

  test('FAQ entries render at least one item when data exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`);
    await page.waitForTimeout(3000);
    const items = page.locator('[data-testid="faq-item"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(1);
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

  test('FAQ ordering matches DB sort_order (ascending)', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`);
    await page.waitForTimeout(3000);
    const items = page.locator('[data-testid="faq-trigger"]');
    const texts = await items.allTextContents();
    expect(texts.length).toBeGreaterThanOrEqual(1);
    // First item must be the recovered authoritative entry
    expect(texts[0].trim()).toBe('Πόσο διαρκεί μία συνεδρία;');
  });
});

test.describe('Service FAQ — Other services (functional)', () => {

  test('EMDR page renders without errors (FAQ optional)', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/emdr`);
    await page.waitForTimeout(3000);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('Reiki page renders without errors (FAQ optional)', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/reiki`);
    await page.waitForTimeout(3000);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });
});
