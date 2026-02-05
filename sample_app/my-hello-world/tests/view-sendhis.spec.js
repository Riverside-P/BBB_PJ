// @ts-check
import { test, expect } from '@playwright/test';

/**
 * 送金履歴画面の遷移テスト
 * ルートから履歴画面への遷移、および履歴画面からホームへの戻りを確認します。
 */

test.describe('送金履歴画面の遷移テスト', () => {

  test.beforeEach(async ({ page }) => {
    // 全テストの開始前にルート（マイページ）へ移動
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('送金履歴ボタンから /transfer-history へ遷移し、ホームへ戻れること', async ({ page }) => {
    // 1. ルートで「送金履歴」ボタンをクリック
    // ※Home.jsのボタン名に合わせて調整してください
    await page.getByRole('button', { name: '送金履歴', exact: true }).click();
    
    // 2. URLが /transfer-history に遷移したことを確認
    await expect(page).toHaveURL('/transfer-history');

    // 3. 「ホームへ戻る」ボタンをクリック
    // ※実際のボタンテキスト（「戻る」や「トップへ」など）に合わせて調整してください
    await page.getByRole('button', { name: 'ホームへ戻る', exact: true }).click();

    // 4. 再びルート（/）に戻ったことを確認
    await expect(page).toHaveURL('/');
  });

});