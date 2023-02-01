import Utils from "./Utils";

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
