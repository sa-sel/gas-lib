import { Sheet } from './sheet.model';

export type SaveNewDataParams<T> = {
  /** Function that creates a function to validate data. */
  dataValidatorFactory?: (newData?: T[]) => (data: T) => boolean;

  /** Functions to be executed in different steps of the process. */
  hooks?: {
    success?: () => void;
    afterAppend?: (sheet: Sheet) => void;
  };

  /** Message to be shown when there's invalid data in the `new data` sheet. */
  invalidDataErrorMessage?: string;

  /** Sheet that contains the new data. */
  newDataSheet: Sheet;

  /** Function that converts a data object to a row array (cells can be skipped with `undefined`). */
  parseDataToRow: (obj: T, sheet?: Sheet) => any[];

  /** Function that converts a row array to a data object. */
  parseRowToData: (row: any[]) => T;

  /** List of sheets to which the new data must be saved. */
  targetSheets: Sheet[];
};

export type FetchDataFunctions<T> = {
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
