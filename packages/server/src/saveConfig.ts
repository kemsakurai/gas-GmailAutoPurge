import Utils from "./Utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const saveConfig = (configRow: any): string => {
  console.info("saveConfig start");
  console.info(configRow);
  const configSheetName: string = Utils.getConfigSheetName();
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  let ret = "";
  try {
    if (sheet) {
      const elems = [
        configRow["notes"],
        configRow["label"],
        configRow["retentionPeriod"],
        configRow["leaveStarredEmail"],
        configRow["leaveImportantEmail"],
      ];
      sheet
        .getRange(Number(configRow["rowId"] + 1), 1, 1, sheet.getLastColumn())
        .setValues([elems]);
      ret = "success";
    }
  } catch (err) {
    ret = "failed";
  }
  return ret;
};
