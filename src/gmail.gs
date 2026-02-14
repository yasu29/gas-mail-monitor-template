/**
 * 処理対象メールを検索する
 * @return {GmailMessage[]} 対象メール配列
 */
function searchTargetMails() {
  const queries = [];

  // ------------------------------------------------------------
  // Gmail 検索条件（CONFIG から取得）
  // ------------------------------------------------------------

  // 送信元アドレス
  if (CONFIG.gmail.from) {
    queries.push(`from:${CONFIG.gmail.from}`);
  }

  // 件名キーワード
  if (CONFIG.gmail.subjectKeyword) {
    queries.push(`subject:${CONFIG.gmail.subjectKeyword}`);
  }

  // 検索期間（日数）
  if (CONFIG.gmail.searchDays) {
    queries.push(`newer_than:${CONFIG.gmail.searchDays}d`);
  }

  // 処理済み除外（ラベル方式ではなく processed.gs で管理するため不要なら削除可）
  // queries.push(`-label:${PROCESSED_LABEL_NAME}`);

  const searchQuery = queries.join(' ');

  logInfo(`Gmail検索クエリ: ${searchQuery}`);

  // スレッド単位で取得
  const threads = GmailApp.search(searchQuery);

  if (threads.length === 0) {
    return [];
  }

  // スレッド → メッセージに展開
  const messages = [];

  threads.forEach(thread => {
    const threadMessages = thread.getMessages();
    threadMessages.forEach(message => {
      messages.push(message);
    });
  });

  logInfo(`検索結果メール件数: ${messages.length}`);

  return messages;
}
