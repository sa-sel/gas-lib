export type Range = GoogleAppsScript.Spreadsheet.Range;
export type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
export type SheetsOnEditEvent = GoogleAppsScript.Events.SheetsOnEdit;
export type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;

export type ReadDataFromSheetFunctions<T> = {
  /**
   * Function to map each row element to a data object
   * @default row => row
   */
  map?: (row: any[]) => T;

  /**
   * Function to filter rows
   * @default row => row.some(cell => cell)
   */
  filter?: (row: any[]) => boolean;
};
