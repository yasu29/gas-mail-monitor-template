/**
 * ============================================
 * 処理済み管理モジュール（冪等性保証）
 * ============================================
 *
 * 目的：
 *  - 同じメール（message）を二度処理しない
 *  - 再実行しても安全な構造を保証する
 *
 * 管理方法：
 *  - スプレッドシート内に専用シート（_processed）を用意
 *  - messageId を保存することで再処理を防止
 *
 * 設計方針：
 *  - Gmailラベルには依存しない
 *  - 書き込み成功後のみ記録する
 *  - 状態を可視化できる構造とする
 */


/**
 * 指定メールが既に処理済みかどうか判定する
 *
 * @param {string} messageId GmailメッセージID
 * @return {boolean} true=処理済み / false=未処理
 */
function isProcessed(messageId) {

  const sheet = getProcessedSheet();

  if (sheet.getLastRow() <= 1) {
    return false;
  }

  const values = sheet
    .getRange(2, 2, sheet.getLastRow() - 1, 1)
    .getValues()
    .flat();

  return values.includes(messageId);
}


/**
 * メールを処理済みとして記録する
 *
 * ★ 必ずスプレッドシート書き込み成功後に呼び出すこと
 *
 * @param {string} messageId GmailメッセージID
 */
function markAsProcessed(messageId) {

  const sheet = getProcessedSheet();

  const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyy-MM-dd HH:mm:ss'
  );

  sheet.appendRow([now, messageId]);

  logInfo(`marked as processed: ${messageId}`);
}


/**
 * _processed シートを取得する
 *
 * ・存在しない場合は自動作成する
 * ・初回実行時の初期化をここで完結させる
 *
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getProcessedSheet() {

  const spreadsheet = SpreadsheetApp.openById(
    CONFIG.spreadsheet.spreadsheetId
  );

  let sheet = spreadsheet.getSheetByName(
    CONFIG.processed.sheetName
  );

  if (!sheet) {

    sheet = spreadsheet.insertSheet(
      CONFIG.processed.sheetName
    );

    sheet.getRange(1, 1, 1, 2).setValues([
      ['processedAt', 'messageId']
    ]);

    logInfo('created _processed sheet');
  }

  return sheet;
}
