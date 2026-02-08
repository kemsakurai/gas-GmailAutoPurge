/**
 * GASの汎用ユーティリティクラス。スプレッドシート操作、型変換などの汎用的な処理を提供します。
 */
export default class Utils {
  /**
   * 与えられた値が空でないことを検証します。
   * 
   * @param {string} value - 検証対象の値
   * @param {string} message - 検証失敗時のエラーメッセージ
   * @throws {Error} valueが空白番号、またはundefinedの場合
   * 
   * @example
   * Utils.checkNotEmpty("hello", "Name is required"); // OK
   * Utils.checkNotEmpty("", "Name is required"); // Error: Name is required
   */
  public static checkNotEmpty(value: string, message: string) {
    if (typeof value === "undefined" || value == "") {
      throw new Error(message);
    }
  }

  /**
   * Configシート名を取得します。
   * 
   * @returns {string} Configシート名 ("Config")
   */
  public static getConfigSheetName(): string {
    return "Config";
  }

  /**
   * スプレッドシートが返す真偽値文字列をトルギャン眼値に変換します。
   * 
   * @param {string|boolean} value - 変換対象の値
   * @returns {boolean} 変換結果。true="TRUE""1"true、デフォルトfalse
   * 
   * @example
   * Utils.convertCellValue2Boolean("TRUE"); // true
   * Utils.convertCellValue2Boolean("1"); // true
   * Utils.convertCellValue2Boolean("false"); // false
   * Utils.convertCellValue2Boolean(""); // false
   * Utils.convertCellValue2Boolean(true); // true
   */
  public static convertCellValue2Boolean(value: string): boolean {
    if (typeof value === "undefined") {
      return false;
    }
    if (typeof value === "boolean") {
      return value;
    }
    if ("TRUE" == value.toUpperCase()) {
      return true;
    }
    if ("1" == value) {
      return true;
    }
    return false;
  }
}
