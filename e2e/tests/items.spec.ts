// e2e/tests/items.spec.ts
import { test, expect } from '@playwright/test';

const TEST_EMAIL = `e2e_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';
const TEST_PARTY_ID = 'TEST_PARTY_ID'; // 事前に作成したパーティーID

/**
 * E2E-03: アイテム登録・一覧確認フロー
 */
test('E2E-03: アイテムを追加して一覧に表示される', async ({ page }) => {
  // 事前にログインしてパーティーに参加する状態にする
  await page.goto(`http://localhost:3000/parties/${TEST_PARTY_ID}/items`);

  // アイテム追加ボタンをクリック
  await page.click('text=アイテムを追加');

  // フォーム入力
  await page.fill('input[name="name"]', '唐揚げ');
  await page.selectOption('select[name="category"]', '料理');
  await page.fill('input[name="quantity"]', '4人前');
  await page.click('button[type="submit"]');

  // 一覧画面に戻り、追加したアイテムが表示される
  await expect(page).toHaveURL(/\/items$/);
  await expect(page.locator('text=唐揚げ')).toBeVisible();
});

/**
 * E2E-05: 権限チェック — 参加者が主催者専用画面にアクセスできない
 */
test('E2E-05: 参加者が主催者専用画面にアクセスできない', async ({ page }) => {
  // 参加者ロールでログインする
  // ※ loginAs ヘルパーが必要な場合は fixtures で定義
  await page.goto(`http://localhost:3000/parties/${TEST_PARTY_ID}/settings`);

  // 403 ページまたはリダイレクトされることを確認
  await expect(page.locator('text=アクセス権限がありません')).toBeVisible();
});
