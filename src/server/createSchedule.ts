export const createSchedule = (): void => {
  let htmlOutput = HtmlService.createHtmlOutputFromFile('createSchedule')
    .setWidth(600)
    .setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Create schedule');
};
