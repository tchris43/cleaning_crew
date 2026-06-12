import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: path.join(__dirname, 'tests', 'e2e'),
  timeout: 30_000,
  expect: { timeout: 5000 },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    cwd: __dirname,
    reuseExistingServer: false,
  },
  use: {
    baseURL: 'http://127.0.0.1:3000',
    headless: true,
  }
});
