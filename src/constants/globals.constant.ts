/** The global spreadsheet namespace. */
export class GS {
  /** The whole spreadsheet. */
  static ss = SpreadsheetApp.getActiveSpreadsheet();

  /** The Google Sheet's user interface. */
  static get ssui(): GoogleAppsScript.Base.Ui {
    return SpreadsheetApp.getUi();
  }
}
