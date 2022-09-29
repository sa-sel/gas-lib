import { Document, Sheet, Spreadsheet } from '@lib/models';

export const substituteVariables = (variables: Record<string, string>, template: Spreadsheet | Sheet | Document): void => {
  const isSheet = !!(template as Spreadsheet).createTextFinder;

  Object.entries(variables).forEach(([variable, value]) => {
    if (isSheet) {
      (template as Spreadsheet).createTextFinder(variable).replaceAllWith(value);
    } else {
      (template as Document).getBody().replaceText(variable, value);
    }
  });
};
