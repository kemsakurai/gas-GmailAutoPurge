import Utils from "./Utils";

/**
 * Configシートの指定した行を削除します。
 * 実装上、削除ではなく行を空にすることで、行番号を保持します。
 * 
 * @param {number} rowId - 削除対象の行列インデックス（0ベースリング索引）
 * @returns {Object} 削除結果。成功時 { success: true }、失敗時 { error: string }
 * 
 * @example
 * deleteSetting(0); 
 * // { success: true }
 * 
 * deleteSetting(999); 
 * // { error: "Row not found" }
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteSetting = (rowId: number): any => {
  console.info("deleteSetting start");
  try {
    rowId = Number(rowId);
    const configSheetName: string = Utils.getConfigSheetName();
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);

    if (!sheet) {
      return { error: "Config sheet not found" };
    }

    // Check if row exists (valid rowId range)
    if (rowId < 0 || rowId >= sheet.getLastRow() - 1) {
      return { error: "Row index out of range" };
    }

    // Clear the row instead of deleting it (to preserve row numbers)
    // rowId is 0-based, so we add 2 (1 for header, 1 for 0-based indexing)
    const range = sheet.getRange(rowId + 2, 1, 1, sheet.getLastColumn());
    range.clearContent();

    console.info("deleteSetting end");
    return { success: true };
  } catch (err) {
    console.error(`deleteSetting error: ${err}`);
    return { error: `Failed to delete setting: ${err}` };
  }
};
