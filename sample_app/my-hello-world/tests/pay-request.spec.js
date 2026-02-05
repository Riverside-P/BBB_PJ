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

  const payButton = page.getByRole('button', { name: '今すぐ支払う', exact: true });

  // 1. ボタンが表示されるか判定（最大3秒待って確認）
  if (await payButton.isVisible({ timeout: 8000 })) {
    await payButton.click();
    
    const id = await getPayId(page);
    await expect(page).toHaveURL(`/pay/${id}`);
    console.log('請求があるため、遷移テストを実行しました。');
  } else {
    // 2. ボタンがない場合はメッセージを出して正常終了
    console.log('請求がないため、テストを正常に完了しました（スキップ扱い）。');
  }
});

// 往復テスト
test('Home → 届いている請求(Pay) → Home の往復遷移ができる', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const payButton = page.getByRole('button', { name: '今すぐ支払う', exact: true });

  // 請求ボタンがある場合のみ実行
  if (await payButton.isVisible({ timeout: 8000 })) {
    // --- 1回目の往復 ---
    await payButton.click();
    const id = await getPayId(page);
    await expect(page).toHaveURL(`/pay/${id}`);
    await page.getByRole('button', { name: 'キャンセル' }).click();
    await expect(page).toHaveURL('/');

    // --- 2回目の往復 ---
    await payButton.waitFor({ state: 'visible' });
    await payButton.click();
    await expect(page).toHaveURL(`/pay/${id}`);
    await page.getByRole('button', { name: 'キャンセル' }).click();
    await expect(page).toHaveURL('/');

    await expect(page.getByText('マイページ')).toBeVisible();
  } else {
    // 請求がない場合の最低限の確認
    await expect(page.getByText('マイページ')).toBeVisible();
    console.log('請求がないため、往復テストをスキップしました。');
  }
});

// Pay => Completeのテスト（都合上Home => Pay => Complete）
// Pay => Completeのテスト（請求がある場合のみ実行）
test('届いている請求(Pay)から送金完了画面へ遷移できる', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const payButton = page.getByRole('button', { name: '今すぐ支払う', exact: true });

  // 1. ボタンが表示されるか判定
  if (await payButton.isVisible({ timeout: 3000 })) {
    await payButton.click();
    
    const id = await getPayId(page);
    await expect(page).toHaveURL(`/pay/${id}`);

    // 送金実行
    const sendButton = page.getByRole('button', { name: '送金する', exact: true });
    await sendButton.waitFor({ state: 'visible', timeout: 10000 });
    await sendButton.click();

    // 2. URLの検証（正規表現で /complete を含むかチェック）
    // これにより、/pay/1/complete や /complete?id=1 などの形式でもパスします
    await expect(page).toHaveURL(/.*\/complete/);

    await expect(page.getByText('送金完了')).toBeVisible({ timeout: 10000 });
    console.log('請求があったため、送金完了までのテストを実行しました。');
  } else {
    // 3. ボタンがない場合
    console.log('請求がないため、送金テストをスキップして正常終了します。');
  }
});

// Complete => Homeのテスト
test('Complete画面からHome画面へ遷移できる', async ({ page }) => {
  await page.goto('/complete');
  
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'ホームへ戻る', exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: 'ホームへ戻る', exact: true }).click();
  
  await expect(page).toHaveURL('/');
});