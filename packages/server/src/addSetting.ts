import Utils from "./Utils";

/**
 * Configシートに新しい削除ルールを追加します。
 * 最初の空いている行に、新しいルール設定を挿入します。
 * 
 * @param {Object} configRow - 追加対象の行。以下のkeyを所有していることが最須:
 * - notes: 抜き記（文字列）
 * - label: Gmailラベル名（文字列）
 * - retentionPeriod: 保有期間（日数（数値））
 * - leaveStarredEmail: スター付きメール保有（真偽値）
 * - leaveImportantEmail: 接吻時モーク付きメール保有（真偽値）
 * 
 * @returns {Object} 追加結果。成功時 { success: true, rowId: number }、失敗時 { error: string }
 * 
 * @example
 * addSetting({
 *   notes: "New rule",
 *   label: "NewLabel",
 *   retentionPeriod: 45,
 *   leaveStarredEmail: false,
 *   leaveImportantEmail: true
 * });
 * // { success: true, rowId: 3 }
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const addSetting = (configRow: any): any => {
  console.info("addSetting start");
  console.info(configRow);

  try {
    // Validate input
    Utils.checkNotEmpty(configRow["notes"], "notes is required");
    Utils.checkNotEmpty(configRow["label"], "label is required");

    const configSheetName: string = Utils.getConfigSheetName();
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);

    if (!sheet) {
      return { error: "Config sheet not found" };
    }

    // Find the first empty row (skip header)
    const lastRow = sheet.getLastRow();
    const values = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();

    let insertRowNumber = lastRow + 1;
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      // Check if row is empty (Notes column is empty)
      if (!row[0] || row[0] === "") {
        insertRowNumber = i + 1;
        break;
      }
    }

    // Prepare data to insert
    const elems = [
      configRow["notes"],
      configRow["label"],
      configRow["retentionPeriod"],
      configRow["leaveStarredEmail"],
      configRow["leaveImportantEmail"],
    ];

    // Insert the new row
    sheet
      .getRange(insertRowNumber, 1, 1, sheet.getLastColumn())
      .setValues([elems]);

    // Convert back to 0-based rowId for client
    const rowId = insertRowNumber - 2; // -1 for header, -1 for 0-based indexing

    console.info("addSetting end");
    return { success: true, rowId: rowId };
  } catch (err) {
    console.error(`addSetting error: ${err}`);
    return { error: `Failed to add setting: ${err}` };
  }
};
