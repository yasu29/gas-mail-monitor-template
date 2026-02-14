/**
 * メール解析処理（テンプレ型）
 *
 * ・GmailMessage → record へ変換
 * ・案件固有ロジックは transformToRecord() に集約
 */

/**
 * 対象メール群を解析
 *
 * @param {GmailMessage[]} mails
 * @return {Object[]} records
 */
function parseMails(mails) {

  const results = [];

  for (const mail of mails) {

    try {

      const record = parseSingleMail(mail);

      if (!record) {
        logWarn(`skip mail (no record): ${mail.getId()}`);
        continue;
      }

      results.push(record);

    } catch (e) {

      logWarn(`parse failed: ${mail.getId()}`);
      logWarn(String(e));
    }
  }

  logInfo(`parsed record count: ${results.length}`);

  return results;
}

/**
 * 1通のメールを解析
 *
 * @param {GmailMessage} mail
 * @return {Object|null}
 */
function parseSingleMail(mail) {

  const baseData = extractBaseMailInfo(mail);

  const record = transformToRecord(baseData);

  return record;
}

/**
 * メールから基本情報を抽出（汎用）
 */
function extractBaseMailInfo(mail) {

  return {
    messageId: mail.getId(),
    receivedAt: formatDate(mail.getDate()),
    from: mail.getFrom(),
    subject: mail.getSubject(),
    body: mail.getPlainBody()
  };
}

/**
 * ★案件固有ロジック
 *
 * baseData をスプレッドシート用 record に変換
 *
 * ここだけ差し替えれば別案件に対応可能
 */
function transformToRecord(baseData) {

  // テンプレではそのまま返す
  // 実案件ではここで抽出ロジックを書く

  return baseData;
}

/**
 * 日付フォーマット
 */
function formatDate(date) {
  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    'yyyy-MM-dd HH:mm:ss'
  );
}
