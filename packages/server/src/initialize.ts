import Utils from "./Utils";

export const initialize = (): void => {
  console.info("initialize start");
  const configSheetName: string = Utils.getConfigSheetName();
  let sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    sheet.setName(configSheetName);
    const range = sheet.getRange("A1:E1");
    range.setBackground("yellow");
    const headers: string[] = [];
    headers.push("Notes");
    headers.push("label");
    headers.push("Retention period");
    headers.push("Leave starred email");
    headers.push("Leave important email");
    range.setValues([headers]);
  }
  console.info("initialize end");
};
