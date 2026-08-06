import { test, expect } from '@playwright/test';

const CANONICAL_CMS = 'https://aion-flow-v2.vercel.app';
const LEGACY_CMS = 'https://aion-flowv2.vercel.app';
const SITE = 'https://nikolaskolokotronis.gr';

test.describe('Production Identity Check', () => {

  test('both CMS aliases serve the same production bundle', async ({ page }) => {
    const canonical = await page.evaluate(async (url) => {
      const res = await fetch(url);
      const html = await res.text();
      const m = html.match(/assets\/index-([^"]+)\.js/);
      return m ? m[1] : 'NO_MATCH';
    }, CANONICAL_CMS);
    const legacy = await page.evaluate(async (url) => {
      const res = await fetch(url);
      const html = await res.text();
      const m = html.match(/assets\/index-([^"]+)\.js/);
      return m ? m[1] : 'NO_MATCH';
    }, LEGACY_CMS);
    expect(legacy).toBe(canonical);
  });

  test('canonical CMS alias responds 200', async ({ page }) => {
    const res = await page.request.get(CANONICAL_CMS);
    expect(res.status()).toBe(200);
  });

  test('legacy CMS alias responds 200', async ({ page }) => {
    const res = await page.request.get(LEGACY_CMS);
    expect(res.status()).toBe(200);
  });

  test('site HTML has revalidation cache-control header', async ({ page }) => {
    const res = await page.request.get(SITE);
    const cc = res.headers()['cache-control'] || '';
    expect(cc).toContain('no-cache');
  });

  test('site hashed assets have immutable cache header', async ({ page }) => {
    const res = await page.request.get(`${SITE}/assets/styles-BVqUSxVx.css`);
    const cc = res.headers()['cache-control'] || '';
    expect(cc).toContain('immutable');
  });

  test('no raw TipTap JSON on homepage (site)', async ({ page }) => {
    await page.goto(SITE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const body = await page.evaluate(() => document.body.innerText);
    const forbidden = ['"type"', '"doc"', '"content"', '{"type"', '"paragraph"'];
    for (const key of forbidden) {
      expect(body).not.toContain(key);
    }
  });
});
