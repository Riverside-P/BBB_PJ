// @ts-check
import { test, expect } from '@playwright/test';

/**
 * 画面間の基本遷移を確認するためのテスト
 * ボタンクリックで期待されるURLに遷移するかを検証します。
 */

test.describe('画面遷移テスト', () => {

  test('Home画面から送金ページへ遷移できる', async ({ page }) => {
    // ページ内ログの監視（デバッグ用）
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err));

    await page.goto('/');
    
    // ボタンが表示されるまで待機し、確認
    await expect(page.getByRole('button', { name: '送金', exact: true })).toBeVisible();
    
    // クリック
    await page.getByRole('button', { name: '送金', exact: true }).click();
    
    // URLの遷移を確認
    await expect(page).toHaveURL('/send');
    
    // ネットワークが落ち着くまで待機（API通信などの完了を待つ）
    await page.waitForLoadState('networkidle');
  });

  test('Home画面から請求ページへ遷移できる', async ({ page }) => {
    await page.goto('/');
    
    // exact: true により「請求履歴」ボタンとの誤認を防ぐ
    const requestButton = page.getByRole('button', { name: '請求', exact: true });
    await requestButton.waitFor({ state: 'visible' });
    
    await requestButton.click();
    
    await expect(page).toHaveURL('/request');
  });

  test('Home画面から請求履歴ページへ遷移できる', async ({ page }) => {
    await page.goto('/');
    
    // 画面の読み込みを待ってから操作
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('button', { name: '請求履歴', exact: true }).click();
    
    await expect(page).toHaveURL('/reqhis');
  });

});