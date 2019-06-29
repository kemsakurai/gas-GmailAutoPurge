export default class Utils {
  /**
   * checkNotEmpty
   */
  public static checkNotEmpty(value: string, message: string) {
    if (typeof value === 'undefined' || value == '') {
      throw new Error(message);
    }
  }
  /**
   * getConfigSheetName
   */
  public static getConfigSheetName(): string {
    return 'Config';
  }
  /**
   * convertCellValue2Boolean
   * @param value 
   */
  public static convertCellValue2Boolean(value: string) :boolean {
    if("TRUE" == value.toUpperCase()) {
      return true;
    }
    if("1" == value) {
      return true;
    }
    return false;
  }
}
