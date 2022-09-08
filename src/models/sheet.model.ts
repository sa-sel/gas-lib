export type Sheet = GoogleAppsScript.Spreadsheet.Sheet;
export type Range = GoogleAppsScript.Spreadsheet.Range;
export type SheetsOnEditEvent = GoogleAppsScript.Events.SheetsOnEdit;

export type ReadDataFromSheetFunctions<T> = {
  /**
   * Function to map each row element to a data object
   * @default (row: any[]) => row
   */
  map?: (row: any[]) => T;

  /**
   * Function to filter rows
   * @default (row: any[]) => row.some(cell => cell)
   */
  filter?: (row: any[]) => boolean;
};
