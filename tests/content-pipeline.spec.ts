import { test, expect } from '@playwright/test';

const TEMPLATES = ['services/autognosia', 'services/iadc', 'services/emdr', 'services/anadromiki-therapeia',
  'services/focusing', 'services/reiki', 'services/pre-therapy', 'services/mindfulness',
  'services/esoteriko-paidi', 'services/dialogismos-oramatismos', 'services/anthoiamata-mpach',
  'services/monopati-eytyxias', 'services/epignosi', 'services/omades', 'services/seminar-omilies',
  'services/365-1-meres-mesa-sta-thaymata',
  'about', 'blog', 'blog/eygnomosyni-egkefalos-zoi', 'blog/omada-monopati-eytyxias',
  'blog/omades-prosopikis-anaptyxis',
];

test.describe('Content Pipeline — Rich Content Integrity', () => {

  test('extractPlainText compatibility matrix', async ({ page }) => {
    const testCases = [
      { input: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Γεια σου κόσμε"}]}]}', expectText: 'Γεια σου κόσμε' },
      { input: 'Απλό κείμενο', expectText: 'Απλό κείμενο' },
      { input: '', expectText: '' },
      { input: null, expectText: '' },
      { input: '{}', expectText: '{}' },
      { input: '{"type":"doc","content":[]}', expectText: '' },
      { input: 'not json at all', expectText: 'not json at all' },
      { input: '{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Τίτλος"}]},{"type":"paragraph","content":[{"type":"text","text":"Κείμενο με "},{"type":"text","marks":[{"type":"bold"}],"text":"bold"},{"type":"text","text":" και "},{"type":"text","marks":[{"type":"italic"}],"text":"italic"},{"type":"text","text":"."}]}]}', expectText: 'Τίτλος Κείμενο με  bold  και  italic .' },
    ];
    for (const tc of testCases) {
      const result = await page.evaluate((input) => {
        function extractPlainText(val: any): string {
          if (!val) return '';
          try {
            const parsed = typeof val === 'string' ? JSON.parse(val) : val;
            if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
              const texts: string[] = [];
              function walk(n: any) {
                if (n.type === 'text') texts.push(n.text || '');
                if (n.content) n.content.forEach(walk);
              }
              walk(parsed);
              return texts.join(' ').trim();
            }
          } catch {}
          return typeof val === 'string' ? val : '';
        }
        return extractPlainText(input);
      }, tc.input);
      expect(result).toBe(tc.expectText);
    }
  });

  test('all services pages: no raw TipTap JSON keys visible', async ({ page }) => {
    test.setTimeout(180000);
    const forbidden = ['"type"', '"doc"', '"content"', '{"type"', '"paragraph"', '"text"'];
    for (const path of TEMPLATES) {
      if (!path.startsWith('services/')) continue;
      await page.goto(`https://kolokotronis-website.choliasmenos-panos.workers.dev/${path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const body = await page.evaluate(() => document.body.innerText);
      for (const key of forbidden) {
        expect(body).not.toContain(key);
      }
    }
  });

  test('all info pages: no raw TipTap JSON keys visible', async ({ page }) => {
    test.setTimeout(120000);
    const forbidden = ['"type"', '"doc"', '"content"', '{"type"', '"paragraph"', '"text"'];
    const info = ['/', '/about', '/blog', '/services', '/books', '/contact'];
    for (const path of info) {
      await page.goto(`https://kolokotronis-website.choliasmenos-panos.workers.dev${path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const body = await page.evaluate(() => document.body.innerText);
      for (const key of forbidden) {
        expect(body).not.toContain(key);
      }
    }
  });
});
