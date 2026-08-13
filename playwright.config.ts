import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', fullyParallel: true, forbidOnly: !!process.env.CI, retries: process.env.CI ? 2 : 0,
  reporter: [['html',{open:'never'}],['list']],
  use: { baseURL:'http://127.0.0.1:3103', trace:'on-first-retry' },
  webServer: { command:'pnpm --filter @casauran/visual-tests dev --port 3103', url:'http://127.0.0.1:3103', reuseExistingServer:!process.env.CI },
  projects:[
    {name:'chromium',use:{...devices['Desktop Chrome']}},
    {name:'firefox',use:{...devices['Desktop Firefox']}},
    {name:'webkit',use:{...devices['Desktop Safari']}},
  ],
});
