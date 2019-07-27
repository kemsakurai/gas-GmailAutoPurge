import Utils from './Utils';

export const getSettings = (): Object => {
  console.info('getSettings start');
  const configSheetName: string = Utils.getConfigSheetName();
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  let resultJson = new Array();
  if (sheet) {
    let values = sheet.getDataRange().getValues();
    //タイトル行を取得する
    let title = values.splice(0, 1)[0];
    //JSONデータを生成する
    resultJson = values.map(function(row) {
      var json = {};
      row.map(function(item, index) {
        json[title[index]] = item;
      });
      return json;
    });
  }
  console.info('getSettings end');
  return resultJson;
};
