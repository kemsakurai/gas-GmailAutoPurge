import { initialize } from "./initialize";
import { createSchedule } from "./createSchedule";
import { updateSchedule } from "./updateSchedule";
import { purgeEmail } from "./purgeEmail";
import { getSettings } from "./getSettings";
import { getSetting } from "./getSetting";
import { saveConfig } from "./saveConfig";
import { deleteSetting } from "./deleteSetting";
import { addSetting } from "./addSetting";
import { getTriggerInfo } from "./getTriggerInfo";
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
function test_setting1() {
  return getSetting(1);
}

function test_setting2() {
  return getSetting(2);
}
function test_setting0() {
  return getSetting(3);
}
/* eslint-disable @typescript-eslint/no-explicit-any */
declare let global: any;
global.onOpen = onOpen;
global.initialize = initialize;
global.purgeEmail = purgeEmail;
global.createSchedule = createSchedule;
global.updateSchedule = updateSchedule;
global.doGet = doGet;
global.getSettings = getSettings;
global.getSetting = getSetting;
global.saveConfig = saveConfig;
global.deleteSetting = deleteSetting;
global.addSetting = addSetting;
global.getTriggerInfo = getTriggerInfo;
global.test_setting0 = test_setting0;
global.test_setting1 = test_setting1;
global.test_setting2 = test_setting2;
