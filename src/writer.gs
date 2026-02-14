/**
 * スプレッドシートへデータを書き込む
 *
 * 設計方針：
 * ・record のキーをそのまま列ヘッダーとして利用
 * ・処理日時（processedAt）を先頭列に自動付与
 * ・ヘッダー不整合はエラーとする（安全設計）
 * ・CONFIG から設定値を取得（グローバル定数は使わない）
 *
 * @param {Object[]} records - 解析済みレコード配列
 */
function writeToSpreadsheet(records) {

  // ------------------------------------------------------------
  // ガード節：空配列の場合は何もしない
  // ------------------------------------------------------------
  if (!records || records.length === 0) {
    logWarn('writeToSpreadsheet called with empty records');
    return;
  }

  // ------------------------------------------------------------
  // スプレッドシート取得（CONFIG依存）
  // ------------------------------------------------------------
  const spreadsheet = SpreadsheetApp.openById(
    CONFIG.spreadsheet.spreadsheetId
  );

  const sheet = getOrCreateSheet(
    spreadsheet,
    CONFIG.spreadsheet.sheetName
  );

  // ------------------------------------------------------------
  // record のキーをヘッダーとして利用
  // （最初の1件から列構造を決定）
  // ------------------------------------------------------------
  const recordHeaders = Object.keys(records[0]);

  // 先頭列に処理日時を追加
  const headers = ['processedAt', ...recordHeaders];

  // ------------------------------------------------------------
  // ヘッダー整合性チェック
  // ・初回は自動生成
  // ・既存ヘッダーと不一致なら例外
  // ------------------------------------------------------------
  ensureHeaderRow(sheet, headers);

  // ------------------------------------------------------------
  // 現在時刻を一度だけ取得（全行共通）
  // ------------------------------------------------------------
  const now = getNowString();

  // ------------------------------------------------------------
  // 書き込み用2次元配列を生成
  // ------------------------------------------------------------
  const values = records.map(record => {

    // record に存在しないキーは空文字で埋める
    const row = recordHeaders.map(h => record[h] ?? '');

    return [now, ...row];
  });

  // ------------------------------------------------------------
  // append 書き込み
  // ------------------------------------------------------------
  sheet
    .getRange(
      sheet.getLastRow() + 1,
      1,
      values.length,
      headers.length
    )
    .setValues(values);

  logInfo(`writeToSpreadsheet: ${values.length} rows appended`);
}

/**
 * シート取得（存在しなければ作成）
 */
function getOrCreateSheet(spreadsheet, sheetName) {

  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    logInfo(`created sheet: ${sheetName}`);
  }

  return sheet;
}

/**
 * ヘッダー行の整合性チェック
 *
 * ・1行目が空ならヘッダーを自動生成
 * ・既存ヘッダーと一致しない場合は例外
 *   → 列崩壊を防ぐ安全設計
 */
function ensureHeaderRow(sheet, headers) {

  // 初回実行（空シート）
  if (sheet.getLastRow() === 0) {
    sheet
      .getRange(1, 1, 1, headers.length)
      .setValues([headers]);

    logInfo('header row created');
    return;
  }

  // 既存ヘッダー取得
  const existingHeaders = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0];

  const mismatch =
    headers.length !== existingHeaders.length ||
    headers.some((h, i) => h !== existingHeaders[i]);

  if (mismatch) {
    throw new Error('Header mismatch detected.');
  }
}

/**
 * 現在日時文字列取得
 *
 * ・タイムゾーンはスクリプト設定に従う
 * ・フォーマット統一
 */
function getNowString() {
  return Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyy-MM-dd HH:mm:ss'
  );
}
