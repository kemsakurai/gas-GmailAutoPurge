import Utils from "./Utils";

/**
 * Configシートのすべての削除ルールをJSON配列で取得します。
 * 
 * @returns {Object[]} Configシートのすべてを、以下のkeyを持つオブジェクト配列。空行は含まれません。
 * - rowId: 行列インデックス（1ベースリング索引）
 * - Notes: 抜き記
 * - label: Gmailラベル
 * - Retention period: 保有期間（日数）
 * - Leave starred email: スター付きメール保有
 * - Leave important email: 接吻時モーク付きメール保有
 * 
 * @example
 * getSettings(); 
 * // [ 
 * //   { rowId: 1, Notes: "Old emails", label: "Inbox", Retention period: 30, ... },
 * //   { rowId: 2, Notes: "Archive emails", label: "Archive", Retention period: 60, ... }
 * // ]
 */
/* eslint-disable @typescript-eslint/ban-types */
export const getSettings = (): Object => {
  console.info("getSettings start");
  const configSheetName: string = Utils.getConfigSheetName();
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  let resultJson: any = [];
  if (sheet) {
    const values = sheet.getDataRange().getValues();
    //タイトル行を取得する
    const title = values.splice(0, 1)[0];
    title.unshift(["rowId"]);
    //JSONデータを生成する
    let rowId = 1;
    resultJson = values.map(function (row) {
      const json : any = {};
      row.unshift([rowId]);
      row.map(function (item, index) {
        json[title[index]] = item;
      });
      rowId++;
      return json;
    });
  }
  console.info("getSettings end");
  return resultJson;
};
