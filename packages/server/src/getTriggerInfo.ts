/**
 * 現在設定されているpurgeEmail()関数のトリガー情報を取得します。
 * 有効なトリガーがない場合は null を返します。
 * 
 * @returns {Object | null} トリガー情報。トリガーが有効な場合：
 * {
 *   enabled: true,
 *   functionName: "purgeEmail",
 *   triggerSource: "CLOCK",
 *   handlerFunction: "purgeEmail"
 * }
 * トリガーがない場合は null
 * 
 * @example
 * getTriggerInfo();
 * // { enabled: true, functionName: "purgeEmail", ... }
 * 
 * // または
 * // null (when no trigger is set)
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getTriggerInfo = (): any => {
  console.info("getTriggerInfo start");

  try {
    // Get all project triggers
    const allTriggers = ScriptApp.getProjectTriggers();

    // Find purgeEmail trigger
    for (const trigger of allTriggers) {
      if (trigger.getHandlerFunction() === "purgeEmail") {
        console.info("getTriggerInfo: Found purgeEmail trigger");
        return {
          enabled: true,
          functionName: trigger.getHandlerFunction(),
          triggerSource: String(trigger.getTriggerSource()),
          eventType: String(trigger.getEventType()),
        };
      }
    }

    // No trigger found
    console.info("getTriggerInfo: No purgeEmail trigger found");
    return null;
  } catch (err) {
    console.error(`getTriggerInfo error: ${err}`);
    return null;
  }
};
