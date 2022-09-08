/* eslint-disable @typescript-eslint/no-namespace*/

/** The global spreadsheet namespace. */
export namespace GS {
  /** The whole spreadsheet. */
  export const ss = SpreadsheetApp.getActiveSpreadsheet();
  /** Factory for the Google Sheet's user interface. */
  export const ui = () => SpreadsheetApp.getUi();
}
