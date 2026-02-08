import Utils from "./Utils";

/**
 * Configシートの指定した行を更新します。
 * 
 * @param {Object} configRow - 更新対象の行。以下のkeyを何か制御していることと最須:
 * - rowId: 行列インデックス（0ベースリング索引）
 * - notes: 抜き記（文字列）
 * - label: Gmailラベル名（文字列）
 * - retentionPeriod: 保有期間（日数）
 * - leaveStarredEmail: スター付きメール保有（真偽値）
 * - leaveImportantEmail: 接吻時モーク付きメール保有（真偽値）
 * 
 * @returns {string} 更新結果。"success"時成功、"failed"時失敗。
 * 
 * @throws {Error} configRowの形式が異常な場合。"failed"を返します。
 * 
 * @example
 * saveConfig({
 *   rowId: 0,
 *   notes: "Old emails",
 *   label: "Inbox",
 *   retentionPeriod: 30,
 *   leaveStarredEmail: true,
 *   leaveImportantEmail: false
 * }); // "success"
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const saveConfig = (configRow: any): string => {
  console.info("saveConfig start");
  console.info(configRow);
  const configSheetName: string = Utils.getConfigSheetName();
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  let ret = "";
  try {
    if (sheet) {
      const elems = [
        configRow["notes"],
        configRow["label"],
        configRow["retentionPeriod"],
        configRow["leaveStarredEmail"],
        configRow["leaveImportantEmail"],
      ];
      sheet
        .getRange(Number(configRow["rowId"] + 1), 1, 1, sheet.getLastColumn())
        .setValues([elems]);
      ret = "success";
    }
  } catch (err) {
    ret = "failed";
  }
  return ret;
};
