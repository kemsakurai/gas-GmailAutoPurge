import Utils from "./Utils";

/**
 * Configシートの削除ルールを基づいて、Gmail上の系統的にメールを削除します。
 * 
 * **処理フロー**:
 * 1. 前回処理したチェックポイントから続きを読ます
 * 2. 最大10件のルールをバッチで読み込みます
 * 3. 空行をスキップします
 * 4. 基準日を計算します（本日 - 保有期間）
 * 5. Config シート設定値からGmail検索クエリを動的に組み立てます
 *    - ベース: `label:<label> before:<YYYY-MM-DD>`
 *    - Leave starred=true なら `-is:starred` を追加（スター付きを除外）
 *    - Leave important=true なら `-is:important` を追加（重要マークを除外）
 * 6. 検索結果をすべて処理します（1ルールごとに複数回に分割可能）
 * 7. 古いメールをゴミ箱に移動します
 * 8. チェックポイント情報を更新します
 * 
 * @returns {void}
 * 
 * @note 
 * - 最大10件のルールをバッチで処理することで、GASの実行時間上限を回避できます
 * - Gmail検索クエリレベルでフィルタリング（isStar, isImportant）により、API効率を向上
 * - チェックポイント情報はProperties Serviceに保存されます
 * - 誤動きが起こった場合、例外を出力して次回実行まで遅延します
 */
export const purgeEmail = (): void => {
  const startTime = new Date().getTime();
  console.info("=".repeat(60));
  console.info(`purgeEmail start at ${new Date().toISOString()}`);
  console.info("=".repeat(60));
  
  // eslint-disable-next-line
  const sheet: any =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      Utils.getConfigSheetName()
    );
  
  if (!sheet) {
    console.warn("Config sheet not found");
    return;
  }

  // チェックポイントから前回の処理位置を取得
  let currentRowIndex = Utils.getLastProcessedRowIndex();
  const totalRows = sheet.getLastRow();
  
  // データ行は2行目から始まる（1行目はヘッダー）
  if (currentRowIndex < 2) {
    currentRowIndex = 2;
  }

  // 最大10件のバッチサイズで処理の終了行を計算
  const endRowIndex = Math.min(
    currentRowIndex + Utils.MAX_BATCH_SIZE - 1,
    totalRows
  );

  console.info(
    `📊 Batch Info: Processing rows ${currentRowIndex}-${endRowIndex} / ${totalRows} total rows`
  );
  console.info(`📦 Batch size: ${endRowIndex - currentRowIndex + 1} rules`);

  let totalThreadsProcessed = 0;
  let totalMessagesDeleted = 0;

  // 指定範囲のデータを取得
  if (currentRowIndex <= totalRows) {
    const batchSize = endRowIndex - currentRowIndex + 1;
    const range: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
      currentRowIndex,
      1,
      batchSize,
      5
    );
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const queries: any[][] = range.getValues();
    
    for (let i = 0; i < queries.length; i++) {
      const ruleStartTime = new Date().getTime();
      const elem = queries[i];
      const actualRowIndex = currentRowIndex + i;
      
      console.info("");
      console.info(`🔄 Row ${actualRowIndex}: Starting rule processing...`);
      
      // Notes、Query、Leave starred email の設定がなければ、処理の対象外
      if (
        elem[0] == "" ||
        elem[1] == "" ||
        elem[2] == "" ||
        elem[3] == "" ||
        elem[4] == ""
      ) {
        console.info(`⏭️  Row ${actualRowIndex}: Skipped (empty field)`);
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
      
      // Config シート設定値からGmail検索クエリを動的に組み立て
      const search = Utils.buildGmailSearchQuery(
        elem[1],
        purge,
        leaveStarredEmail,
        leaveImportantEmail
      );

      console.info(`📝 Row ${actualRowIndex}: Notes="${elem[0]}"`);
      console.info(`🔍 Row ${actualRowIndex}: Query="${search}"`);
      console.info(`⚙️  Row ${actualRowIndex}: Leave starred=${leaveStarredEmail}, Leave important=${leaveImportantEmail}`);

      try {
        const searchStartTime = new Date().getTime();
        
        // We are processing 50 messages in a batch to prevent script errors.
        // Else it may throw Exceed Maximum Execution Time exception in Apps Script
        const threads = GmailApp.search(search, 0, 50);
        
        const searchElapsed = new Date().getTime() - searchStartTime;
        console.info(`✅ Row ${actualRowIndex}: Found ${threads.length} threads (search took ${searchElapsed}ms)`);

        if (threads.length === 0) {
          console.info(`✨ Row ${actualRowIndex}: No emails to delete`);
          const ruleElapsed = new Date().getTime() - ruleStartTime;
          console.info(`⏱️  Row ${actualRowIndex}: Completed in ${ruleElapsed}ms`);
          continue;
        }

        let deletedCount = 0;
        let skippedStarred = 0;
        let skippedImportant = 0;
        let skippedTooNew = 0;

        // An email thread may have multiple messages and the timestamp of
        // individual messages can be different.
        for (let j = 0; j < threads.length; j++) {
          const thread = threads[j];
          const messages = GmailApp.getMessagesForThread(thread);
          
          for (let k = 0; k < messages.length; k++) {
            const email = messages[k];
            
            // NOTE: クエリレベルでフィルタされているが、
            // スレッド/メールレベルでの追加確認は安全性のため保持
            if (leaveStarredEmail && email.isStarred()) {
              skippedStarred++;
              continue;
            }
            
            if (leaveImportantEmail && thread.isImportant()) {
              skippedImportant++;
              continue;
            }
            
            if (email.getDate() < age) {
              email.moveToTrash();
              deletedCount++;
            } else {
              skippedTooNew++;
            }
          }
          
          // 進捗表示（10スレッドごと）
          if ((j + 1) % 10 === 0) {
            const progressElapsed = new Date().getTime() - searchStartTime;
            console.info(`   📌 Row ${actualRowIndex}: Progress ${j + 1}/${threads.length} threads (${progressElapsed}ms elapsed)`);
          }
        }

        totalThreadsProcessed += threads.length;
        totalMessagesDeleted += deletedCount;

        const ruleElapsed = new Date().getTime() - ruleStartTime;
        console.info(`🗑️  Row ${actualRowIndex}: Deleted ${deletedCount} messages`);
        
        if (skippedStarred > 0) {
          console.info(`⭐ Row ${actualRowIndex}: Skipped ${skippedStarred} starred messages`);
        }
        if (skippedImportant > 0) {
          console.info(`❗ Row ${actualRowIndex}: Skipped ${skippedImportant} important messages`);
        }
        if (skippedTooNew > 0) {
          console.info(`📅 Row ${actualRowIndex}: Skipped ${skippedTooNew} messages (too new)`);
        }
        
        console.info(`⏱️  Row ${actualRowIndex}: Completed in ${ruleElapsed}ms`);
        
        // 実行時間の警告（5分経過）
        const totalElapsed = new Date().getTime() - startTime;
        if (totalElapsed > 300000) {
          console.warn(`⚠️  Warning: Total execution time ${Math.round(totalElapsed / 1000)}s - approaching time limit!`);
        }
        
        // If the script fails for some reason or catches an exception,
        // it will simply defer auto-purge until the next day.
      } catch (e) {
        const ruleElapsed = new Date().getTime() - ruleStartTime;
        console.error(
          `❌ Row ${actualRowIndex}: Error occurred after ${ruleElapsed}ms`
        );
        console.error(`   Query: ${search}`);
        console.error(`   Error: ${e}`);
        throw e;
      }
    }
  }

  // チェックポイント情報を更新
  Utils.updateLastProcessedRowIndex(endRowIndex + 1);

  const totalElapsed = new Date().getTime() - startTime;
  
  console.info("");
  console.info("=".repeat(60));
  console.info("📊 Execution Summary");
  console.info("=".repeat(60));
  console.info(`✅ Processed ${endRowIndex - currentRowIndex + 1} rules`);
  console.info(`📧 Processed ${totalThreadsProcessed} threads`);
  console.info(`🗑️  Deleted ${totalMessagesDeleted} messages`);
  console.info(`⏱️  Total execution time: ${Math.round(totalElapsed / 1000)}s (${totalElapsed}ms)`);
  console.info(`⚡ Average per rule: ${Math.round(totalElapsed / (endRowIndex - currentRowIndex + 1))}ms`);

  // すべてのデータ行の処理が完了したかをチェック
  if (endRowIndex >= totalRows) {
    console.info("🎉 All rows processed. Resetting checkpoint.");
    Utils.resetCheckpoint();
  } else {
    console.info(
      `💾 Checkpoint updated. Next batch will start from row ${endRowIndex + 1}`
    );
    console.info(`📊 Progress: ${Math.round((endRowIndex / totalRows) * 100)}% complete`);
  }

  console.info("=".repeat(60));
  console.info(`purgeEmail end at ${new Date().toISOString()}`);
  console.info("=".repeat(60));
};
