import Utils from "./Utils";

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
