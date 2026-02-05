import { test, expect } from '@playwright/test';

async function getPayId(page) {
  await expect(page).toHaveURL(/\/pay\/\d+/);
  const match = page.url().match(/\/pay\/(\d+)/);
  return match ? match[1] : null;
}

// Home → 請求履歴 遷移テスト
test('Home画面から届いている請求(Pay)へ遷移できる', async ({ page }) => {
  await page.goto('/');
  
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).click();
  
  const id = await getPayId(page);
  await expect(page).toHaveURL(`/pay/${id}`);
});

/*
// 届いている請求→ Home 遷移テスト
test('届いている請求(Pay) → Home へ戻れる', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).click();
  
  // await expect(page.getByText('今すぐ支払う')).toBeVisible({ timeout: 10000 });
  
  await page.getByRole('button', { name: 'キャンセル' }).click();
  
  await expect(page).toHaveURL('/');
  await expect(page.getByText('マイページ')).toBeVisible({ timeout: 10000 });
});
*/

/*
// 往復遷移テスト
test('Home → 届いている請求(Pay) → Home の往復遷移ができる', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('マイページ')).toBeVisible({ timeout: 10000 });
  
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).click();
  const id = await getPayId(page);
  await expect(page).toHaveURL(`/pay/${id}`);
  // await expect(page.getByText('今すぐ支払う')).toBeVisible({ timeout: 10000 });
  
  await page.getByRole('button', { name: 'キャンセル' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByText('マイページ')).toBeVisible({ timeout: 10000 });
});
*/

// 往復テスト
test('Home → 届いている請求(Pay) → Home の往復遷移ができる', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).click();
  const id = await getPayId(page);
  await expect(page).toHaveURL(`/pay/${id}`);
  await page.getByRole('button', { name: 'キャンセル' }).click();
  await expect(page).toHaveURL('/');
  
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).click();
  await expect(page).toHaveURL(`/pay/${id}`);
  await page.getByRole('button', { name: 'キャンセル' }).click();
  await expect(page).toHaveURL('/');
  
  await expect(page.getByText('マイページ')).toBeVisible({ timeout: 10000 });
});

// Pay => Completeのテスト（都合上Home => Pay => Complete）
test('届いている請求(Pay)から送金完了画面へ遷移できる', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: '今すぐ支払う', exact: true }).click();
  
  const id = await getPayId(page);
  await expect(page).toHaveURL(`/pay/${id}`);

  await page.getByRole('button', { name: '送金する', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: '送金する', exact: true }).click();
  // await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL('/complete');

  await expect(page.getByText('送金完了')).toBeVisible({ timeout: 10000 });
});

// Complete => Homeのテスト
test('Complete画面からHome画面へ遷移できる', async ({ page }) => {
  await page.goto('/complete');
  
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'ホームへ戻る', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: 'ホームへ戻る', exact: true }).click();
  
  await expect(page).toHaveURL('/');
});