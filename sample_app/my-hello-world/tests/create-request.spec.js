// @ts-check
import { test, expect } from '@playwright/test';

test('Home画面から請求ページへ遷移できる', async ({ page }) => {
  await page.goto('/');
  
  // exact: true で「請求」のみにマッチさせる（「請求履歴」は除外）
  await page.getByRole('button', { name: '請求', exact: true }).waitFor({ state: 'visible' });
  
  await page.getByRole('button', { name: '請求', exact: true }).click();
  
  await expect(page).toHaveURL('/request');
});

test('請求ページからHome画面へ遷移できる', async ({ page }) => {
  await page.goto('/');
  
  // exact: true で「請求」のみにマッチさせる（「請求履歴」は除外）
  await page.getByRole('button', { name: '請求', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: '請求', exact: true }).click();
  
  await expect(page).toHaveURL('/request');

  await page.getByRole('button', { name: '戻る', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: '戻る', exact: true }).click();

  await expect(page).toHaveURL('/');
});

test('請求ページから請求先選択ページへ遷移できる', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '請求', exact: true }).click();

  // 「ユーザを選択」ボタンが表示されるのを待ってクリック
  // 部分一致でヒットさせるため exact: false (デフォルト) でOK
  await page.getByRole('button', { name: 'ユーザを選択' }).click();

  await expect(page).toHaveURL('/payerselect');
});

test('請求先選択ページから請求ページへ遷移できる', async ({ page }) => {
  // まず請求先選択ページまで進める
  await page.goto('/');
  await page.getByRole('button', { name: '請求', exact: true }).click();
  await page.getByRole('button', { name: 'ユーザを選択' }).click();

  // 「戻る」ボタンをクリックして戻る
  await page.getByRole('button', { name: '戻る' }).click();

  await expect(page).toHaveURL('/request');
});

// ...（前半の遷移テストは変更なし）

test('請求ページからリンクページへ遷移できる', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '請求', exact: true }).click();

  // 1. 金額を入力
  await page.getByPlaceholder('0').fill('1000');

  // 2. ユーザ選択画面へ移動（★ここから追加手順）
  await page.getByRole('button', { name: 'ユーザを選択' }).click();

  // 3. ユーザリストが表示されるのを待って、1人目を選択
  // （.user-item クラスを持つボタンの1つ目をクリック）
  await page.locator('.user-item').first().waitFor();
  await page.locator('.user-item').first().click();

  // 4. Request画面に戻ったことを確認
  await expect(page).toHaveURL('/request');

  // 5. リンク作成ボタンをクリック
  await page.getByRole('button', { name: 'リンク作成' }).click();

  // 成功してリンク画面へ遷移
  await expect(page).toHaveURL('/link');
});

test('リンクページからホーム画面へ遷移できる', async ({ page }) => {
  // --- リンク作成までの手順（上と同じ） ---
  await page.goto('/');
  await page.getByRole('button', { name: '請求', exact: true }).click();
  
  // 金額入力
  await page.getByPlaceholder('0').fill('500');
  
  // ユーザ選択（★必須手順）
  await page.getByRole('button', { name: 'ユーザを選択' }).click();
  await page.locator('.user-item').first().waitFor();
  await page.locator('.user-item').first().click();
  
  // 作成実行
  await page.getByRole('button', { name: 'リンク作成' }).click();
  await expect(page).toHaveURL('/link');

  // --- ここから本題のテスト ---
  
  // 「TOPへ」ボタンをクリック
  await page.getByRole('button', { name: 'TOPへ' }).click();

  // ホーム画面に戻っていることを確認
  await expect(page).toHaveURL('/');
});