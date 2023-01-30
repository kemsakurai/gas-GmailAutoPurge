import { initialize } from "./initialize";
import { createSchedule } from "./createSchedule";
import { updateSchedule } from "./updateSchedule";
import { purgeEmail } from "./purgeEmail";
import { getSettings } from "./getSettings";
import { getConfig } from "./getConfig";
import { saveConfig } from "./saveConfig";
import doGet from "./doGet";

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
function test() {
  return "test";
}
/* eslint-disable @typescript-eslint/no-explicit-any */
declare let global: any;
global.onOpen = onOpen;
global.test = test;
global.initialize = initialize;
global.purgeEmail = purgeEmail;
global.createSchedule = createSchedule;
global.updateSchedule = updateSchedule;
global.doGet = doGet;
global.getSettings = getSettings;
global.getConfig = getConfig;
global.saveConfig = saveConfig;
