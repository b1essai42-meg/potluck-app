// e2e/tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // テスト前にテスト用 DB をリセット（API にリセットエンドポイントを用意するか、直接 MongoDB をクリア）
});

/**
 * E2E-01: 新規登録からダッシュボードへ
 */
test('E2E-01: 新規登録からダッシュボードへ', async ({ page }) => {
  await page.goto('http://localhost:3000/register');

  await page.fill('input[name="displayName"]', 'テストユーザー');
  await page.fill('input[name="email"]', `test_${Date.now()}@example.com`);
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="passwordConfirm"]', 'password123');
  await page.click('button[type="submit"]');

  // ログイン画面に遷移したことを確認
  await expect(page).toHaveURL(/\/login/);

  // ログイン
  await page.fill('input[name="email"]', `test_${Date.now()}@example.com`);
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // ダッシュボードに遷移したことを確認
  await expect(page).toHaveURL(/\/dashboard/);
});

/**
 * E2E-02: 未ログイン状態でダッシュボードにアクセス → ログインページにリダイレクト
 */
test('E2E-02: 未ログインでダッシュボードへのアクセスはリダイレクト', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page).toHaveURL(/\/login/);
});
