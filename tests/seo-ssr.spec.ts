import { test, expect } from '@playwright/test';

const SITE = 'https://nikolaskolokotronis.gr';

test.describe('SEO SSR & Routing Semantics', () => {

  test('service page renders SEO meta in server HTML', async ({ page }) => {
    const res = await page.request.get(`${SITE}/services/autognosia`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('<title>');
    expect(html).toMatch(/<title>[^<]*Αυτογνωσία[^<]*<\/title>/);
    expect(html).toMatch(/<meta name="description" content="[^"]{10,}/);
    expect(html).toContain('rel="canonical" href="https://nikolaskolokotronis.gr/services/autognosia"');
    expect(html).toContain('og:url');
  });

  test('service page has no raw JSON keys in server HTML body', async ({ page }) => {
    const res = await page.request.get(`${SITE}/services/autognosia`);
    const html = await res.text();
    const body = html.replace(/<script[\s\S]*?<\/script>/g, '');
    expect(body).not.toContain('"type"');
    expect(body).not.toContain('{"type":"doc"');
  });

  test('valid blog slug returns 200', async ({ page }) => {
    const res = await page.request.get(`${SITE}/blog/eygnomosyni-egkefalos-zoi`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('<title>');
    expect(html).toContain('rel="canonical"');
  });

  test('invalid blog slug returns proper 404 (not generic error)', async ({ page }) => {
    const res = await page.request.get(`${SITE}/blog/this-slug-does-not-exist-xyz`);
    expect(res.status()).toBe(404);
    const html = await res.text();
    expect(html).toContain('Το άρθρο δεν βρέθηκε');
    expect(html).not.toContain('Κάτι πήγε στραβά');
  });

  test('invalid service slug returns proper 404 (not generic error)', async ({ page }) => {
    const res = await page.request.get(`${SITE}/services/this-service-does-not-exist-xyz`);
    expect(res.status()).toBe(404);
    const html = await res.text();
    expect(html).toContain('Η υπηρεσία δεν βρέθηκε');
    expect(html).not.toContain('Κάτι πήγε στραβά');
  });

  test('blog page no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${SITE}/blog`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    expect(errors).toHaveLength(0);
  });

  test('service page no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${SITE}/services/autognosia`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    expect(errors).toHaveLength(0);
  });
});
