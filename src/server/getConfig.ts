import Utils from './Utils';

export const getConfig = (rowId: number): Object => {
  console.info('getConfig start');
  rowId = Number(rowId);
  const configSheetName: string = Utils.getConfigSheetName();
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  let resultJson;
  if (sheet) {
    //タイトル行を取得する
    let title = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    title.unshift('rowId');
    let row = sheet.getRange(rowId + 1, 1, 1, sheet.getLastColumn()).getValues()[0];
    row.unshift(rowId);
    console.log(row);
    resultJson = {};
    row.map(function(item, index) {
      resultJson[title[index]] = item;
    });
  }
  console.log(resultJson);
  return resultJson;
};
