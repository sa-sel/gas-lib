import { suppressError } from '@lib/functions/function.util';

/** The global script namespace. */
export class GS {
  /** The active spreadsheet */
  static ss = SpreadsheetApp.getActiveSpreadsheet();

  /** The active document */
  static doc = DocumentApp.getActiveDocument();

  /**
   * The Google Sheet's user interface
   *
   * @deprecated this is still here only for backwards compatibility, you should use GS.ui instead
   */
  static get ssui(): GoogleAppsScript.Base.Ui {
    return SpreadsheetApp.getUi();
  }

  /** The active apps's user interface */
  static get ui(): GoogleAppsScript.Base.Ui {
    return (
      suppressError(DocumentApp.getUi) ||
      suppressError(FormApp.getUi) ||
      suppressError(SpreadsheetApp.getUi) ||
      suppressError(SlidesApp.getUi)
    );
  }
}
