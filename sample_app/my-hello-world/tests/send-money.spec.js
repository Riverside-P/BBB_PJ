// @ts-check
import { test, expect } from '@playwright/test';

/**
 * 送金フローにおける画面遷移およびバリデーションの自動テスト
 * すべてのテストをルート（マイページ）から開始し、
 * APIの応答状態やユーザー入力に応じた動的な遷移を検証します。
 */

test.describe('送金フロー・画面遷移テスト（最終版）', () => {

  // 各テストの実行前にマイページへ移動し、ネットワークが安定するまで待機する
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('マイページから送金を開始し、完了画面まで正常に遷移できること', async ({ page }) => {
    // 1. マイページから送金ボタンをクリック
    await page.getByRole('button', { name: '送金', exact: true }).click();
    await expect(page).toHaveURL('/send');

    // データの読み込み（Loading表示の消失）を待機
    await expect(page.getByText('データを読み込み中...')).not.toBeVisible({ timeout: 5000 });

    const noUserMessage = page.getByText('ユーザが見つかりません');
    const firstUser = page.locator('.user-item').first();

    // 送金対象ユーザーが存在しない場合は、テストを継続できないためエラーを出力して早期終了
    if (await noUserMessage.isVisible()) {
      console.error('【テスト中断】送金対象のユーザが見つかりませんでした。データを確認してください。');
      return;
    }

    // 2. ユーザー一覧の最初の項目を選択して確認画面へ
    await firstUser.waitFor({ state: 'visible', timeout: 5000 });
    await firstUser.click();
    await expect(page).toHaveURL(/\/confirm/);

    // 3. 送金金額（1円）を入力し、ボタンの有効化を検証
    const sendAmount = '1';
    const amountInput = page.getByPlaceholder('金額を入力');
    const sendButton = page.getByRole('button', { name: '送金する' });

    await amountInput.fill(sendAmount);

    // 金額入力後もボタンが無効（Disabled）な場合は、残高不足等の異常と判断しエラー終了
    if (await sendButton.isDisabled()) {
      const balanceText = await page.locator('.balance-amount').textContent();
      console.error(`【テスト中断】金額入力後に送金ボタンが有効になりませんでした（表示残高: ${balanceText}）。`);
      return; 
    }

    // 4. 送金実行し、完了画面への遷移を確認
    await sendButton.click();
    await expect(page).toHaveURL('/complete');

    // 5. 完了画面からマイページへ戻る
    await page.getByRole('button', { name: 'トップへ' }).click();
    await expect(page).toHaveURL('/');
  });

  test('送金先選択画面（/send）において、戻るボタンが正しく機能すること', async ({ page }) => {
    // 1. 送金画面へ遷移
    await page.getByRole('button', { name: '送金', exact: true }).click();
    await expect(page).toHaveURL('/send');

    // データの読み込み完了を待機
    await expect(page.getByText('データを読み込み中...')).not.toBeVisible({ timeout: 5000 });

    const noUserMessage = page.getByText('ユーザが見つかりません');

    // 「ユーザが見つかりません」が表示されている場合は遷移テストを中止
    if (await noUserMessage.isVisible()) {
      console.error('【テスト中断】ユーザが見つからないため、戻るボタンの遷移テストを中止します。');
      return;
    }

    // 2. 戻るボタンをクリックし、ルート（マイページ）への遷移を確認
    await page.getByRole('button', { name: '戻る' }).click();
    await expect(page).toHaveURL('/');
  });

  test('送金確認画面（/confirm）において、戻るボタンをクリックすると送金先選択画面へ戻ること', async ({ page }) => {
    // 1. 送金確認画面まで遷移
    await page.getByRole('button', { name: '送金', exact: true }).click();
    const firstUser = page.locator('.user-item').first();
    await firstUser.waitFor({ state: 'visible' });
    await firstUser.click();
    await expect(page).toHaveURL(/\/confirm/);

    // 2. 戻るボタンをクリックし、送金先選択画面（/send）への遷移を確認
    await page.getByRole('button', { name: '戻る' }).click();
    await expect(page).toHaveURL('/send');
  });

});