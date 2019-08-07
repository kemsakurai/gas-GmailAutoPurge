import Utils from './Utils';

export const saveConfig = (configRow: any): string => {
  console.info('saveConfig start');
  const configSheetName: string = Utils.getConfigSheetName();
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  let resultJson;
  if (sheet) {
    let values = sheet.getDataRange().getValues();
    //タイトル行を取得する
    let title = values.splice(0, 1)[0];
    // labelと一致する行をフィルタリング
    values = values.filter(value => configRow == value[1]);
    console.log(values);
    //JSONデータを生成する
    resultJson = values.map(function(row) {
      var json = {};
      row.map(function(item, index) {
        json[title[index]] = item;
      });
      return json;
    });
  }
  if (resultJson.length == 1) {
    console.info(resultJson[0]);
    return resultJson[0];
  } else {
    console.info(resultJson);
    return null;
  }
};
