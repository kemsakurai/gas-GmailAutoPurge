import Utils from "./Utils";

export const purgeEmail = (): void => {
  console.info("purgeEmail start");
  // eslint-disable-next-line
  const sheet: any =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      Utils.getConfigSheetName()
    );
    
  const range: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    5
  );
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const queries: any[][] = range.getValues();
  for (const elem of queries) {
    // Notes、Query、Leave starred email の設定がなければ、処理の対象外
    if (
      elem[0] == "" ||
      elem[1] == "" ||
      elem[2] == "" ||
      elem[3] == "" ||
      elem[4] == ""
    ) {
      continue;
    }

    const age = new Date();
    age.setDate(age.getDate() - elem[2]);
    const leaveStarredEmail = Utils.convertCellValue2Boolean(elem[3]);
    const leaveImportantEmail = Utils.convertCellValue2Boolean(elem[4]);
    const purge = Utilities.formatDate(
      age,
      Session.getTimeZone(),
      "yyyy-MM-dd"
    );
    const search = "label:" + elem[1] + " before:" + purge;

    try {
      // We are processing 50 messages in a batch to prevent script errors.
      // Else it may throw Exceed Maximum Execution Time exception in Apps Script
      const threads = GmailApp.search(search, 0, 50);

      // An email thread may have multiple messages and the timestamp of
      // individual messages can be different.
      for (let i = 0; i < threads.length; i++) {
        if (leaveImportantEmail && threads[i].isImportant()) {
          continue;
        }
        const messages = GmailApp.getMessagesForThread(threads[i]);
        for (let j = 0; j < messages.length; j++) {
          const email = messages[j];
          if (leaveStarredEmail && email.isStarred()) {
            continue;
          }
          if (email.getDate() < age) {
            email.moveToTrash();
          }
        }
      }
      // If the script fails for some reason or catches an exception,
      // it will simply defer auto-purge until the next day.
    } catch (e) {
      console.log("Error occured.. searcQuery=" + search);
      throw e;
    }
  }
  console.info("purgeEmail end");
};
