import { File } from '@lib/models';

export const exportToPdf = (file: File): File => {
  const blob = file.getAs('application/pdf').setName(`${file.getName()}.pdf`);
  const pdf = DriveApp.createFile(blob);

  return pdf;
};
