import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL || 'https://kolokotronis-website.choliasmenos-panos.workers.dev',
    headless: true,
  },
  webServer: undefined,
});
