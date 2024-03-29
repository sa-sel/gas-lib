import { Document, File, Spreadsheet } from '@lib/models';

export const substituteVariablesInFile = (template: File, variables: Record<string, string>): File => {
  const isSheet = template.getMimeType() === MimeType.GOOGLE_SHEETS;

  if (!isSheet && template.getMimeType() !== MimeType.GOOGLE_DOCS) {
    throw TypeError(`Template ${template.getName()} should be Sheet or Doc, but instead is ${template.getMimeType()}.`);
  }

  const converted = isSheet ? SpreadsheetApp.open(template) : DocumentApp.openById(template.getId());
  const sheet = converted as Spreadsheet;
  const doc = converted as Document;

  Object.entries(variables).forEach(([variable, value]) => {
    if (isSheet) {
      sheet.createTextFinder(variable).replaceAllWith(value);
    } else {
      doc.getHeader().replaceText(variable, value);
      doc.getBody().replaceText(variable, value);
      doc.getFooter().replaceText(variable, value);
    }
  });

  if (!isSheet) {
    doc.saveAndClose();
  }

  return template;
};

export const substituteVariablesInString = (str: string, variables: Record<string, string>): string =>
  Object.entries(variables).reduce((result, [variable, value]) => result.replaceAll(variable, value), str);
