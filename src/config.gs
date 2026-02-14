/**
 * 設定値を保持するオブジェクト
 *
 * ・main.gs や各処理から参照される
 * ・設定変更はこのファイルのみで行う
 */
let CONFIG = {};

/**
 * 設定読み込み処理
 *
 * ・main() の冒頭で必ず呼び出す
 * ・設定値の初期化と簡易バリデーションを行う
 */
function loadConfig() {

  // ------------------------------------------------------------
  // Gmail 検索条件
  // ------------------------------------------------------------
  CONFIG.gmail = {
    // 送信元メールアドレス（完全一致 or 部分一致）
    from: 'example@example.com',

    // 件名に含まれる文字列
    subjectKeyword: '請求書',

    // 検索対象期間（日数）
    // 例: 7 → 過去7日分
    searchDays: 7
  };

  // ------------------------------------------------------------
  // スプレッドシート設定
  // ------------------------------------------------------------
  CONFIG.spreadsheet = {
    // 出力先スプレッドシートID
    spreadsheetId: 'YOUR_SPREADSHEET_ID',

    // 書き込み先シート名
    sheetName: 'records',

    // ヘッダー行の有無
    hasHeader: true
  };

  // ------------------------------------------------------------
  // 処理済み管理（冪等性）
  // ------------------------------------------------------------
  CONFIG.processed = {
    // 処理済み情報を記録するシート名
    sheetName: '_processed'
  };

  // ------------------------------------------------------------
  // エラー通知設定
  // ------------------------------------------------------------
  CONFIG.notification = {
    // エラー時に通知するかどうか
    notifyOnError: false
  };

  // ------------------------------------------------------------
  // 設定値の簡易チェック
  // ------------------------------------------------------------
  validateConfig();
}

/**
 * 設定値の簡易バリデーション
 *
 * ・必須項目が未設定の場合は例外を投げる
 * ・本格的なチェックは不要（最小限）
 */
function validateConfig() {

  if (!CONFIG.gmail.from) {
    throw new Error('CONFIG.gmail.from is not set');
  }

  if (!CONFIG.spreadsheet.spreadsheetId) {
    throw new Error('CONFIG.spreadsheet.spreadsheetId is not set');
  }

  if (!CONFIG.spreadsheet.sheetName) {
    throw new Error('CONFIG.spreadsheet.sheetName is not set');
  }
}

/**
 * エラー通知有無の取得
 *
 * ・error.gs から呼ばれる想定
 */
function isNotifyOnError() {
  return CONFIG.notification.notifyOnError === true;
}
