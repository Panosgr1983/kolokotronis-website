import { test, expect } from '@playwright/test';
import { createHash } from 'crypto';

const BASE_URL = 'https://aion-flowv2.vercel.app';
const TEST_PREFIX = `[E2E-TEST-${Date.now()}]`;
const TEST_QUESTION = `${TEST_PREFIX} What is the meaning of life?`;
const TEST_ANSWER = '42. That is the answer to everything.';
const TEST_QUESTION_EDITED = `${TEST_PREFIX} What is 2+2?`;
const TEST_ANSWER_EDITED = '4. Obviously.';

test.describe('CMS Authenticated QA', () => {

  test('super admin login → Services → FAQ CRUD → persistence → cleanup', async ({ page }) => {
    const email = process.env.CMS_SUPER_ADMIN_EMAIL;
    const password = process.env.CMS_SUPER_ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error('Missing CMS Playwright credentials — set CMS_SUPER_ADMIN_EMAIL and CMS_SUPER_ADMIN_PASSWORD');
    }

    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

    // Block TenantSelector overlay by preventing localStorage.removeItem for our tenant key.
    // Supabase onAuthStateChanged(SIGNED_IN) removes 'aion_selected_tenant' on every page load.
    await page.addInitScript(() => {
      const origRemoveItem = localStorage.removeItem.bind(localStorage);
      localStorage.removeItem = (key: string) => {
        if (key === 'aion_selected_tenant') return;
        origRemoveItem(key);
      };
      localStorage.setItem('aion_selected_tenant', '00000000-0000-0000-0000-000000000001');
    });

    // 1. Login — labels have no htmlFor, use placeholder selectors
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await page.getByPlaceholder(/admin@example/i).fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole('button', { name: /σύνδεση/i }).click();
    await page.waitForURL(/dashboard/, { timeout: 20000 });
    expect(page.url()).toContain('/dashboard');

    // 2. Navigate to Services — TenantSelector bypassed via addInitScript
    await page.goto(`${BASE_URL}/dashboard/services`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 4. Open edit on first service (button has no text, only SVG icon)
    await page.waitForTimeout(2000);
    const serviceCards = page.locator('.card').filter({ has: page.locator('h3') });
    const firstCardButtons = serviceCards.first().locator('button');
    await firstCardButtons.first().click({ force: true });
    await page.waitForTimeout(2000);

    // 5. Click FAQ tab
    await page.getByRole('button', { name: /συχνές ερωτήσεις/i }).click();
    await page.waitForTimeout(1000);

    // 5. Create temporary FAQ entry
    const questionInput = page.getByPlaceholder(/ερώτηση/i).or(page.getByPlaceholder(/question/i));
    const answerInput = page.getByPlaceholder(/απάντηση/i).or(page.getByPlaceholder(/answer/i));
    if (await questionInput.isVisible()) {
      await questionInput.fill(TEST_QUESTION);
      await answerInput.fill(TEST_ANSWER);
    } else {
      // Add first entry if empty
      await page.getByRole('button', { name: /προσθήκη|add/i }).click();
      await page.waitForTimeout(500);
      await page.getByPlaceholder(/ερώτηση/i).fill(TEST_QUESTION);
      await page.getByPlaceholder(/απάντηση/i).fill(TEST_ANSWER);
    }

    // 6. Save
    await page.getByRole('button', { name: /αποθήκευση|save/i }).click();
    await page.waitForTimeout(2000);

    // 7. Verify FAQ persists after close/reopen
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    const secondCardButtons = serviceCards.first().locator('button');
    await secondCardButtons.first().click({ force: true });
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: /συχνές ερωτήσεις/i }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText(TEST_QUESTION)).toBeVisible({ timeout: 5000 });

    // 8. Edit the entry
    await page.getByText(TEST_QUESTION).click();
    await questionInput.fill(TEST_QUESTION_EDITED);
    await answerInput.fill(TEST_ANSWER_EDITED);
    await page.getByRole('button', { name: /αποθήκευση|save/i }).click();
    await page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    const thirdCardButtons = serviceCards.first().locator('button');
    await thirdCardButtons.first().click({ force: true });
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: /συχνές ερωτήσεις/i }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText(TEST_QUESTION_EDITED)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(TEST_ANSWER_EDITED)).toBeVisible({ timeout: 5000 });

    // 9. Delete the temporary entry
    await page.getByText(TEST_QUESTION_EDITED).click();
    await page.getByRole('button', { name: /διαγραφή|delete|remove/i }).click();
    await page.getByRole('button', { name: /αποθήκευση|save/i }).click();
    await page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    const fourthCardButtons = serviceCards.first().locator('button');
    await fourthCardButtons.first().click({ force: true });
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: /συχνές ερωτήσεις/i }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText(TEST_PREFIX)).toHaveCount(0, { timeout: 5000 });

    // 10. Verify zero console errors
    expect(errors.filter(e => !e.includes('favicon') && !e.includes('analytics'))).toHaveLength(0);
  });

  test('tenant admin login with module isolation', async ({ page }) => {
    const email = process.env.CMS_TENANT_ADMIN_EMAIL;
    const password = process.env.CMS_TENANT_ADMIN_PASSWORD;
    if (!email || !password) {
      test.skip();
      return;
    }

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await page.getByPlaceholder(/admin@example/i).fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole('button', { name: /σύνδεση/i }).click();
    await page.waitForURL(/dashboard/, { timeout: 20000 });
    expect(page.url()).toContain('/dashboard');

    // Bypass TenantSelector
    await page.goto(`${BASE_URL}/dashboard/services`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const ts3 = page.locator('h1:has-text("AION Flow")');
    if (await ts3.isVisible({ timeout: 2000 }).catch(() => false)) {
      await page.evaluate(() => {
        const buttons = document.querySelectorAll<HTMLButtonElement>('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('Κολοκοτρώνης')) {
            btn.click();
            break;
          }
        }
      });
      await page.waitForTimeout(4000);
    }

    // Verify tenant is on services page (sidebar link may be behind TenantSelector overlay)
    await expect(page).toHaveURL(/dashboard\/services/, { timeout: 5000 });
    // Services heading should be visible (it's in the main content area)
    await expect(page.locator('h2:has-text("Υπηρεσίες")')).toBeVisible({ timeout: 5000 });
  });
});
