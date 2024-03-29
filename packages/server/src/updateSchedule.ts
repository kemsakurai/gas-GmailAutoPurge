const KEY = "trigger";
const FUNCTION_NAME = "purgeEmail";

const weekDay = [
  ScriptApp.WeekDay.MONDAY,
  ScriptApp.WeekDay.TUESDAY,
  ScriptApp.WeekDay.WEDNESDAY,
  ScriptApp.WeekDay.THURSDAY,
  ScriptApp.WeekDay.FRIDAY,
  ScriptApp.WeekDay.SATURDAY,
  ScriptApp.WeekDay.SUNDAY,
];

type FormData = {
  automate: number;
  interval: number;
  hourOfDay: number;
  dayOfWeek: number;
  dayOfMonth: number;
  minitueOfHour: number;
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateSchedule = (formData: any): void => {
  const data: FormData = toJson_(formData);
  Logger.log(data);
  if (data != null) {
    if (data.automate == 0) {
      deleteTrigger_();
    } else if (data.automate == 1) {
      if (data.interval == 0) {
        deleteTrigger_();
        const triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .everyMinutes(data.minitueOfHour)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval == 1) {
        deleteTrigger_();
        const triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .everyHours(1)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval == 2) {
        deleteTrigger_();
        const triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .atHour(data.hourOfDay)
          .everyDays(1)
          .inTimezone(Session.getTimeZone())
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval == 3) {
        deleteTrigger_();
        const triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .onWeekDay(weekDay[data.dayOfWeek])
          .atHour(data.hourOfDay)
          .nearMinute(30)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval == 4) {
        deleteTrigger_();
        const triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .onMonthDay(data.dayOfMonth)
          .atHour(data.hourOfDay)
          .nearMinute(30)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else {
        throw new Error("Illegal Argments...");
      }
    }
  }
};

//serializeArrayをjsonに変換する
function toJson_(formData : any): FormData {
  const result : any = {};
  let automateValue = 0;
  /* eslint-disable @typescript-eslint/no-unused-vars */
  formData.forEach(function (elem :any, i :number) {
    if (elem["name"] == "automate" && elem["value"] == 1) {
      automateValue = 1;
    }
    result[elem.name] = elem.value;
  });
  result["automate"] = automateValue;

  const data: FormData = {
    automate: result["automate"],
    interval: result["interval"],
    hourOfDay: result["hourOfDay"],
    dayOfWeek: result["dayOfWeek"],
    dayOfMonth: result["dayOfMonth"],
    minitueOfHour: result["minitueOfHour"],
  };
  return data;
}

//指定したkeyに保存されているトリガーIDを使って、トリガーを削除する
function deleteTrigger_() {
  const triggerId = PropertiesService.getScriptProperties().getProperty(KEY);
  if (!triggerId) return;
  ScriptApp.getProjectTriggers()
    .filter(function (trigger) {
      return trigger.getUniqueId() == triggerId;
    })
    .forEach(function (trigger) {
      ScriptApp.deleteTrigger(trigger);
    });
  PropertiesService.getScriptProperties().deleteProperty(KEY);
}

//トリガーを発行
function setTrigger_(triggerId : any) {
  //あとでトリガーを削除するためにトリガーIDを保存しておく
  PropertiesService.getScriptProperties().setProperty(KEY, triggerId);
}
