import Utils from './Utils';

export const getConfigs = (): Object => {
  console.info('getConfigs start');
  const configSheetName: string = Utils.getConfigSheetName();
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  let resultJson = new Array();
  if (sheet) {
    let values = sheet.getDataRange().getValues();
    //タイトル行を取得する
    let title = values.splice(0, 1)[0];
    title.unshift(['rowId']);

    //JSONデータを生成する
    let rowId = 1;
    resultJson = values.map(function(row) {
      var json = {};
      row.unshift([rowId]);
      row.map(function(item, index) {
        json[title[index]] = item;
      });
      rowId++;
      return json;
    });
  }
  console.info('getConfigs end');
  return resultJson;
};
