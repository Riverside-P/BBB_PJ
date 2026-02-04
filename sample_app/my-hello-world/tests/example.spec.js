// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Home画面から送金ページへ遷移できる', async ({ page }) => {
  // ★ コンソールとエラーを監視
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  await page.goto('/');
  
  await expect(page.getByRole('button', { name: '送金', exact: true })).toBeVisible();
  
  await page.getByRole('button', { name: '送金', exact: true }).click();
  
  await expect(page).toHaveURL('/send');
  
  // ★ ネットワークレスポンスを待つ
  await page.waitForLoadState('networkidle');
  
  // ★ ページの内容を確認
  const content = await page.textContent('body');
  console.log('Page content:', content);
  
  // ★ 読み込み中のままなら、ここでエラーメッセージが表示される
  const loadingText = await page.textContent('.users-list');
  console.log('Users list text:', loadingText);
});

test('Home画面から請求ページへ遷移できる', async ({ page }) => {
  await page.goto('/');
  
  // exact: true で「請求」のみにマッチさせる（「請求履歴」は除外）
  await page.getByRole('button', { name: '請求', exact: true }).waitFor({ state: 'visible' });
  
  await page.getByRole('button', { name: '請求', exact: true }).click();
  
  await expect(page).toHaveURL('/request');
});

test('Home画面から請求履歴ページへ遷移できる', async ({ page }) => {
  await page.goto('/');
  
  await page.waitForLoadState('networkidle');
  
  await page.getByRole('button', { name: '請求履歴', exact: true }).click();
  
  await expect(page).toHaveURL('/reqhis');
});
