import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',  // 失敗時にスクリーンショットを保存
    video: 'retain-on-failure',     // 失敗時に動画を保存
  },
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      cwd: '../frontend',
      reuseExistingServer: true,
    },
  ],
});
