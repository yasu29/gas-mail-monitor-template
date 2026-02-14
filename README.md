# GAS Mail Monitor Template

Google Apps Script (GAS) を用いた  
Gmail監視・スプレッドシート自動記録テンプレートです。

定期実行（時間トリガー）を前提とし、  
**冪等性・安全性・運用性** を重視した設計になっています。

---

## 🚀 特徴

- Gmail条件検索（from / subject / 日数指定）
- スレッド単位の冪等処理（重複防止）
- `_processed` シートによる安全な処理管理
- スプレッドシート自動追記
- ログ出力（INFO / WARN / ERROR）
- 例外一元管理（handleError）
- モジュール分割設計

---

## 🏗 設計思想

本テンプレートは、Linuxの cron バッチ設計思想を  
Google Apps Script に転用しています。

重視しているポイント：

- 再実行しても壊れない設計（Idempotency）
- 途中失敗時の安全停止
- ログによる追跡可能性
- モジュール分割による保守性

---

## 📂 ディレクトリ構成

```
gas-mail-monitor-template/
├─ README.md
└─ src/
   ├─ main.gs
   ├─ config.gs
   ├─ gmail.gs
   ├─ parser.gs
   ├─ writer.gs
   ├─ processed.gs
   ├─ logger.gs
   └─ error.gs
```

---

## 🔄 処理フロー

1. 設定読み込み
2. Gmail検索（message単位取得）
3. 対象なし判定
4. 既処理チェック（messageId）
5. メール解析
6. スプレッドシート追記
7. 処理済み登録
8. 正常終了

---

## ⚙ 設定項目

`config.gs` にて一元管理します。

### Gmail

- `CONFIG.gmail.from`
- `CONFIG.gmail.subjectKeyword`
- `CONFIG.gmail.searchDays`

### Spreadsheet

- `CONFIG.spreadsheet.spreadsheetId`
- `CONFIG.spreadsheet.sheetName`

### 冪等管理

- `CONFIG.processed.sheetName`

### 通知

- `CONFIG.notification.notifyOnError`

---

## 🛡 冪等性（Idempotency）

同一メールは `_processed` シートに messageId を記録し、
再実行時に自動スキップします。

これにより：

- 二重書き込み防止
- 手動実行と定期実行の併用可能
- 安全なリトライ
- 再実行しても状態が壊れない設計

を実現しています。

---

## 🧪 想定利用例

- 請求書メールの自動記録
- 問い合わせ受付管理
- 定型通知のログ蓄積
- 社内業務メールの自動整理

---

## 📌 今後の拡張例

- 添付ファイル解析
- 通知機能（Chat / Slack）
- レート制限対応
- エラー通知の高度化
- GASライブラリ化

---

## 👤 Author

運用バッチ設計をベースにした  
安全重視の自動化テンプレートとして作成しました。

拡張・流用を前提とした構成です。

---

## 📝 License

MIT License (modify as needed)

---

## ⚠ 注意事項

- Gmail / Spreadsheet API の実行制限に依存します
- 大量メール処理用途には向いていません
- 本テンプレートは業務利用を想定していますが、利用は自己責任でお願いします
