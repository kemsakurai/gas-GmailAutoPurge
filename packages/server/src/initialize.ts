import Utils from "./Utils";

/**
 * Configシートを初期化し、削除ルールのテンプレートを作成します。
 * 
 * **Configシートの項目構成**:
 * | 列 | 項目名 | 型 | 説明 |
 * |---|---|---|---|
 * | A | Notes | 文字列 | このルール削除ルールの説明（自由記述） |
 * | B | label | 文字列 | Gmailラベル名。削除対象を指定します |
 * | C | Retention period | 数値（日数） | 指定日数以削除のメールを削除 |
 * | D | Leave starred email | 真偽値 | true=スター付きメールは保持。false=削除対象 |
 * | E | Leave important email | 真偽値 | true=接吻時モーク付きメールは保持。false=削除対象 |
 * 
 * @example
 * // Configシートの例を以下に挙げます。
 * // 行1: ヘッダー（黄背景）
 * // 行2以降: 削除ルール設定
 * 
 * Notes: "Old emails"
 * label: "Inbox"
 * Retention period: 30
 * Leave starred email: true
 * Leave important email: false
 * 
 * @throws {Error} スプレッドシート存在しない場合、エラーになります
 */
export const initialize = (): void => {
  console.info("initialize start");
  const configSheetName: string = Utils.getConfigSheetName();
  let sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    sheet.setName(configSheetName);
    const range = sheet.getRange("A1:E1");
    range.setBackground("yellow");
    const headers: string[] = [];
    headers.push("Notes");
    headers.push("label");
    headers.push("Retention period");
    headers.push("Leave starred email");
    headers.push("Leave important email");
    range.setValues([headers]);
  }
  console.info("initialize end");
};
