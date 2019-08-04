import { initialize } from './initialize';
import { createSchedule } from './createSchedule';
import { updateSchedule } from './updateSchedule';
import { purgeEmail } from './purgeEmail';
import { getConfigs } from './getConfigs';
import { getConfig } from './getConfig';
import doGet from './doGet';

function onOpen() {
  var lang = Session.getActiveUserLocale();
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('gas-GmailAutoPurge')
    .addSubMenu(
      ui
        .createMenu(lang === 'ja' ? '初期設定' : 'Initial setting')
        .addItem(lang === 'ja' ? '設定シート作成' : 'Create config sheets', 'initialize')
    )
    .addSeparator()
    .addItem(lang === 'ja' ? 'メールを削除する' : 'Purge Email', 'purgeEmail')
    .addItem(lang === 'ja' ? 'スケジュール実行' : 'Schedule', 'createSchedule')
    .addToUi();
}

declare let global: any;
global.onOpen = onOpen;
global.initialize = initialize;
global.purgeEmail = purgeEmail;
global.createSchedule = createSchedule;
global.updateSchedule = updateSchedule;
global.doGet = doGet;
global.getConfigs = getConfigs;
global.getConfig = getConfig;
