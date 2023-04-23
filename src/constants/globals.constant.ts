/** The global script namespace. */
export class GS {
  /** The active spreadsheet */
  static ss = SpreadsheetApp.getActiveSpreadsheet();

  /** The active document */
  static doc = DocumentApp.getActiveDocument();

  /** The Google Sheet's user interface */
  static get ssui(): GoogleAppsScript.Base.Ui {
    return SpreadsheetApp.getUi();
  }

  /** The active apps's user interface */
  static get ui(): GoogleAppsScript.Base.Ui {
    return DocumentApp.getUi() || FormApp.getUi() || SpreadsheetApp.getUi() || SlidesApp.getUi();
  }
}
