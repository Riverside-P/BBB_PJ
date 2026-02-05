// @ts-check
import { test, expect } from '@playwright/test';

/**
 * 画面間の基本遷移を確認するためのテスト
 * ボタンクリックで期待されるURLに遷移するかを検証します。
 */

test.describe('画面遷移テスト', () => {

  test('Home画面から送金ページへ遷移できる', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err));

    await page.goto('/');
    await expect(page.getByRole('button', { name: '送金', exact: true })).toBeVisible();
    await page.getByRole('button', { name: '送金', exact: true }).click();
    await expect(page).toHaveURL('/send');
    await page.waitForLoadState('networkidle');
  });

  test('Home画面から請求ページへ遷移できる', async ({ page }) => {
    await page.goto('/');
    const requestButton = page.getByRole('button', { name: '請求', exact: true });
    await requestButton.waitFor({ state: 'visible' });
    await requestButton.click();
    await expect(page).toHaveURL('/request');
  });

  test('Home画面から請求履歴ページへ遷移できる', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '請求履歴', exact: true }).click();
    await expect(page).toHaveURL('/reqhis');
  });

  // --- 追加：送金履歴のテスト ---
  test('Home画面から送金履歴ページへ遷移できる', async ({ page }) => {
    await page.goto('/');
    // 画面の読み込みを待ってから操作
    await page.waitForLoadState('networkidle');
    
    // 「送金履歴」ボタンをクリック
    await page.getByRole('button', { name: '送金履歴', exact: true }).click();
    
    // URLの遷移を確認（パスは仕様に合わせて /sendhis などに調整してください）
    await expect(page).toHaveURL('/transfer-history');
  });

});