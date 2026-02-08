import Utils from "./Utils";

/**
 * Configシートの削除ルールを基づいて、Gmail上の系統的にメールを削除します。
 * 
 * **処理フロー**:
 * 1. Configシートからすべてを計算に読んだます
 * 2. 空行スキップします
 * 3. 基準日を計算します（本日 - 保有期間）
 * 4. Gmailを検索クエリを作成します: `label:<label> before:<YYYY-MM-DD>`
 * 5. 検索結果まで最大50件を一括処理します（えぐ射時間上限回避）
 * 6. 各メールを条件付けでフィルタします（スター付き、接吻時モーク付き保有）
 * 7. 古いメールをゴミ箱に移動します
 * 
 * @returns {void}
 * 
 * @note 
 * - 誤動きが起こった場合、例外を出力して次回実行まで遅延します。
 * - 最大50件を一括に処理することで、GASの実行時間上限を回避できます。
 */
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
