import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://kolokotronis-website.choliasmenos-panos.workers.dev';

test.describe('Manual QA — Pre-Client Review', () => {

  test('No console errors on any page', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    const pages = ['/', '/about', '/services', '/services/autognosia', '/services/emdr', '/services/reiki',
      '/services/mindfulness', '/services/epignosi', '/blog', '/books', '/contact', '/privacy', '/terms'];
    for (const p of pages) {
      await page.goto(`${BASE_URL}${p}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
    }
    expect(errors).toHaveLength(0);
  });

  test('No broken images (404)', async ({ page }) => {
    const broken: string[] = [];
    page.on('response', resp => {
      if (resp.request().resourceType() === 'image' && resp.status() === 404)
        broken.push(resp.url());
    });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    expect(broken).toHaveLength(0);
  });

  test('FAQ JSON-LD present on service with FAQ', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const jsonld = page.locator('script[type="application/ld+json"]');
    let foundFaq = false;
    const count = await jsonld.count();
    for (let i = 0; i < count; i++) {
      const text = await jsonld.nth(i).textContent();
      try {
        const parsed = JSON.parse(text || '{}');
        if (parsed['@type'] === 'FAQPage') {
          foundFaq = true;
          expect(parsed.mainEntity.length).toBeGreaterThanOrEqual(1);
          expect(parsed.mainEntity[0]['@type']).toBe('Question');
        }
      } catch { /* skip */ }
    }
    expect(foundFaq).toBe(true);
  });

  test('FAQ JSON-LD absent on service without FAQ', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/epignosi`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const jsonld = page.locator('script[type="application/ld+json"]');
    const count = await jsonld.count();
    let foundFaq = false;
    for (let i = 0; i < count; i++) {
      const text = await jsonld.nth(i).textContent();
      try {
        const parsed = JSON.parse(text || '{}');
        if (parsed['@type'] === 'FAQPage' && parsed.mainEntity?.length > 0) foundFaq = true;
      } catch { /* skip */ }
    }
    expect(foundFaq).toBe(false);
  });

  test('FAQ accordion expand shows answer', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/autognosia`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const trigger = page.locator('[data-testid="faq-trigger"]').first();
    await expect(trigger).toBeVisible({ timeout: 5000 });
    await trigger.click();
    await page.waitForTimeout(500);
    const content = page.locator('[data-state="open"]').first();
    await expect(content).toBeVisible({ timeout: 3000 });
  });

  test('FAQ empty state: service without FAQ has no accordion', async ({ page }) => {
    await page.goto(`${BASE_URL}/services/epignosi`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const faqSection = page.locator('h2:has-text("Συχνές Ερωτήσεις")');
    await expect(faqSection).toHaveCount(0);
  });

  test('Blog renders without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    expect(errors).toHaveLength(0);
  });

  test('Contact page renders map iframe', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const iframe = page.locator('iframe[src*="google.com/maps"]');
    await expect(iframe).toBeVisible({ timeout: 5000 });
  });

  test('Footer renders with AION WEB credit', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('AION WEB');
  });

  test('Homepage layout: hero, values, services, contact', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Αξίες').or(page.locator('text=Προσέγγιση')).first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Υπηρεσίες').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Επικοινωνία').first()).toBeVisible({ timeout: 5000 });
  });

  test('Mobile viewport: no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });

  test('Service pages: all 5 load without 404s', async ({ page }) => {
    const services = ['/services/autognosia', '/services/reiki', '/services/emdr', '/services/mindfulness', '/services/epignosi'];
    for (const s of services) {
      await page.goto(`${BASE_URL}${s}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      expect(page.url()).toContain(s);
      await expect(page.locator('h1').first()).toBeVisible({ timeout: 5000 });
    }
  });
});
