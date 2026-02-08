import { initialize } from "./initialize";
import { createSchedule } from "./createSchedule";
import { updateSchedule } from "./updateSchedule";
import { purgeEmail } from "./purgeEmail";

function onOpen() {
  const lang = Session.getActiveUserLocale();
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("gas-GmailAutoPurge")
    .addSubMenu(
      ui
        .createMenu(lang === "ja" ? "初期設定" : "Initial setting")
        .addItem(
          lang === "ja" ? "設定シート作成" : "Create config sheets",
          "initialize"
        )
    )
    .addSeparator()
    .addItem(lang === "ja" ? "メールを削除する" : "Purge Email", "purgeEmail")
    .addItem(lang === "ja" ? "スケジュール実行" : "Schedule", "createSchedule")
    .addToUi();
}
/* eslint-disable @typescript-eslint/no-explicit-any */
declare let global: any;
global.onOpen = onOpen;
global.initialize = initialize;
global.purgeEmail = purgeEmail;
global.createSchedule = createSchedule;
global.updateSchedule = updateSchedule;
