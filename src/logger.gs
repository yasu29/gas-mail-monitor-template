/**
 * ログ出力ユーティリティ
 * 処理の開始・終了・情報・警告・エラーを記録する
 */

/**
 * 処理開始ログ
 */
function logStart() {
  logInfo('処理開始');
}

/**
 * 処理終了ログ
 */
function logEnd() {
  logInfo('処理正常終了');
}

/**
 * 処理対象が存在しなかった場合のログ
 */
function logNoTarget() {
  logInfo('no target mail found, nothing to do');
}

/**
 * 情報ログ
 */
function logInfo(message) {
  writeLog('INFO', message);
}

/**
 * 警告ログ
 */
function logWarn(message) {
  writeLog('WARN', message);
}

/**
 * エラーログ
 */
function logError(message) {
  writeLog('ERROR', message);
}

/**
 * 実ログ出力処理（内部用）
 */
function writeLog(level, message) {
  const timestamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyy-MM-dd HH:mm:ss'
  );

  console.log(`[${timestamp}] [${level}] ${message}`);
}
