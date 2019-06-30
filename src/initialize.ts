import Utils from './Utils';

export const initialize = (): void => {
  console.info('initialize start');
  const configSheetName: string = Utils.getConfigSheetName();
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    sheet.setName(configSheetName);
    const range = sheet.getRange('A1:D1');
    range.setBackground('yellow');
    const headers: string[] = new Array();
    headers.push('Notes');
    headers.push('label');
    headers.push('Retention period');
    headers.push('Leave starred email');
    range.setValues([headers]);
  }
  console.info('initialize end');
};
