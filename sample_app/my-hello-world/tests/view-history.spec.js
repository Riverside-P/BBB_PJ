// @ts-check
import { test, expect } from '@playwright/test';

// タイムアウトを延長
test.setTimeout(30000);

// Home → 請求履歴 遷移テスト
test('Home画面から請求履歴ページへ遷移できる', async ({ page }) => {
  await page.goto('/');
  
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: '請求履歴', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  
  await page.getByRole('button', { name: '請求履歴', exact: true }).click();
  
  await expect(page).toHaveURL('/reqhis');
});

// 請求履歴 → Home 遷移テスト
test('請求履歴 → Home へ戻れる', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: '請求履歴', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: '請求履歴', exact: true }).click();
  
  await expect(page.getByText('請求履歴')).toBeVisible({ timeout: 10000 });
  
  await page.getByRole('button', { name: '戻る' }).click();
  
  await expect(page).toHaveURL('/');
  await expect(page.getByText('マイページ')).toBeVisible({ timeout: 10000 });
});

// 往復遷移テスト
test('Home → 請求履歴 → Home の往復遷移ができる', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('マイページ')).toBeVisible({ timeout: 10000 });
  
  await page.getByRole('button', { name: '請求履歴', exact: true }).click();
  await expect(page).toHaveURL('/reqhis');
  await expect(page.getByText('請求履歴')).toBeVisible({ timeout: 10000 });
  
  await page.getByRole('button', { name: '戻る' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByText('マイページ')).toBeVisible({ timeout: 10000 });
});

// 複数回往復テスト
test('複数回の往復遷移ができる', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: '請求履歴', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  
  await page.getByRole('button', { name: '請求履歴', exact: true }).click();
  await expect(page).toHaveURL('/reqhis');
  await page.getByRole('button', { name: '戻る' }).click();
  await expect(page).toHaveURL('/');
  
  await page.getByRole('button', { name: '請求履歴', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: '請求履歴', exact: true }).click();
  await expect(page).toHaveURL('/reqhis');
  await page.getByRole('button', { name: '戻る' }).click();
  await expect(page).toHaveURL('/');
  
  await expect(page.getByText('マイページ')).toBeVisible({ timeout: 10000 });
});
