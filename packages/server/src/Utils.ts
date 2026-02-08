/**
 * GASの汎用ユーティリティクラス。スプレッドシート操作、型変換などの汎用的な処理を提供します。
 */
export default class Utils {
  /**
   * バッチ処理の最大件数
   */
  public static readonly MAX_BATCH_SIZE: number = 10;

  /**
   * チェックポイント情報を保存するPropertyキー
   */
  private static readonly CHECKPOINT_KEY: string = "PURGE_EMAIL_LAST_ROW_INDEX";
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

  /**
   * バッチ処理の最後に処理した行番号を取得します。
   * チェックポイント情報をProperties Serviceから読み込みます。
   * 
   * @returns {number} 最後に処理した行番号（2ベース）。初回実行時は1を返す
   */
  public static getLastProcessedRowIndex(): number {
    const scriptProperties = PropertiesService.getScriptProperties();
    const lastRow = scriptProperties.getProperty(this.CHECKPOINT_KEY);
    return lastRow ? parseInt(lastRow, 10) : 1;
  }

  /**
   * バッチ処理の最後に処理した行番号を更新します。
   * チェックポイント情報をProperties Serviceに保存します。
   * 
   * @param {number} rowIndex - 最後に処理した行番号（2ベース）
   */
  public static updateLastProcessedRowIndex(rowIndex: number): void {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty(this.CHECKPOINT_KEY, rowIndex.toString());
  }

  /**
   * バッチ処理のチェックポイント情報をリセットします。
   * 新規に処理を始めるときに明示的に呼び出します。
   */
  public static resetCheckpoint(): void {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.deleteProperty(this.CHECKPOINT_KEY);
  }

  /**
   * Config シート設定値からGmail検索クエリを動的に組み立てます。
   * 
   * このメソッドにより、ラベルと日付をベースに、条件フラグに応じて
   * スター付きメール除外（-is:starred）や重要マーク除外（-is:important）を
   * クエリレベルで追加でき、Gmail API検索効率を向上させます。
   * 
   * @param {string} label - Gmailラベル名
   * @param {string} beforeDate - YYYY-MM-DD形式の日付（この日付より前のメール対象）
   * @param {boolean} leaveStarredEmail - true=スター付きメール除外（-is:starred追加）
   * @param {boolean} leaveImportantEmail - true=重要マーク付きメール除外（-is:important追加）
   * @returns {string} Gmail検索クエリ文字列
   * 
   * @example
   * // 基本クエリ
   * buildGmailSearchQuery("Inbox", "2024-01-01", false, false)
   * // => "label:Inbox before:2024-01-01"
   * 
   * // スター付きを除外
   * buildGmailSearchQuery("Inbox", "2024-01-01", true, false)
   * // => "label:Inbox before:2024-01-01 -is:starred"
   * 
   * // スター付きと重要マークを除外
   * buildGmailSearchQuery("Inbox", "2024-01-01", true, true)
   * // => "label:Inbox before:2024-01-01 -is:starred -is:important"
   */
  public static buildGmailSearchQuery(
    label: string,
    beforeDate: string,
    leaveStarredEmail: boolean,
    leaveImportantEmail: boolean
  ): string {
    let search = `label:${label} before:${beforeDate}`;
    
    if (leaveStarredEmail) {
      search += " -is:starred";
    }
    
    if (leaveImportantEmail) {
      search += " -is:important";
    }
    
    return search;
  }
}
