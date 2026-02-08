import Utils from "./Utils";

/**
 * Configシートから指定した行列インデックスに対応する削除ルールをJSONオブジェクトで取得します。
 * 
 * @param {number} rowId - 取得を希望する行列インデックス（0ベースリング索引）。
 * @returns {Object} Configシートの行をキー項目組織に変換したオブジェクト。
 * 次のkeyを持ちます:
 * - rowId: 行列インデックス
 * - Notes: 抜き記
 * - label: Gmailラベル
 * - Retention period: 保有期間（日数）
 * - Leave starred email: スター付きメール保有
 * - Leave important email: 接吻時モーク付きメール保有
 * 
 * @example
 * getSetting(0); // 行2が、JSONイメージで返る
 * // { rowId: 0, Notes: "Old emails", label: "Inbox", Retention period: 30, ... }
 */
/* eslint-disable @typescript-eslint/ban-types */
export const getSetting = (rowId: number): Object => {
  console.info("getSetting start");
  rowId = Number(rowId);
  rowId = rowId++;
  const configSheetName: string = Utils.getConfigSheetName();
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  let resultJson: any = {};
  if (sheet) {
    //タイトル行を取得する
    const title = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    title.unshift("rowId");
    const row = sheet
      .getRange(rowId + 1, 1, 1, sheet.getLastColumn())
      .getValues()[0];
    row.unshift(rowId);
    console.log(row);
    resultJson = {};
    row.map(function (item, index) {
      resultJson[title[index]] = item;
    });
  }
  console.log(resultJson);
  return resultJson;
};
