import Utils from './Utils';

export const purgeEmail = (): void => {
  console.info('purgeEmail start');
  
  let sheet: GoogleAppsScript.Spreadsheet.Sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    Utils.getConfigSheetName()
  );

  let range: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3);
  let queries: any[][] = range.getValues();

  for (let elem of queries) {
    // Notes、Query、Leave starred email の設定がなければ、処理の対象外
    if (elem[0] == '' || elem[1] == '' || elem[2] == '' || elem[3] == '') {
      continue;
    }

    let age = new Date();  
    age.setDate(age.getDate() - elem[2]);
    let leaveStarredEmail = Utils.convertCellValue2Boolean(elem[2]);
    let purge  = Utilities.formatDate(age, Session.getTimeZone(), "yyyy-MM-dd");
    let search = "label:" + elem[1] + " before:" + purge;
    
    try {
      // We are processing 50 messages in a batch to prevent script errors.
      // Else it may throw Exceed Maximum Execution Time exception in Apps Script
      let threads = GmailApp.search(search, 0, 50);

      // An email thread may have multiple messages and the timestamp of 
      // individual messages can be different.
      for (let i = 0; i < threads.length; i++) {
        let messages = GmailApp.getMessagesForThread(threads[i]);

        for (let j=0; j < messages.length; j++) {
          let email = messages[j];
          if(leaveStarredEmail && email.isStarred) {
            continue;
          }
          email.moveToTrash();
        }
      }
    // If the script fails for some reason or catches an exception, 
    // it will simply defer auto-purge until the next day.
    } catch (e) {
      throw e;
    }
  }
  console.info('purgeEmail end');
};
