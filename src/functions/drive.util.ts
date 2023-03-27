import { File, Folder } from '@lib/models';

export const copyFolderTo = (
  name: string,
  originDir: Folder,
  targetDir: Folder,
  formatFilename = (name: string) => name,
  processFile: (file: File) => any = f => f,
) => {
  const files = originDir.getFiles();
  const folders = originDir.getFolders();

  const newFolder = targetDir.createFolder(name);

  while (folders.hasNext()) {
    const folder = folders.next();

    copyFolderTo(formatFilename(folder.getName()), folder, targetDir);
  }

  while (files.hasNext()) {
    const file = files.next();

    processFile(file.makeCopy(formatFilename(file.getName()), newFolder));
  }
};

export const copyInsides = (
  originDir: Folder,
  targetDir: Folder,
  formatFilename = (name: string) => name,
  processFile: (file: File) => any = f => f,
) => {
  const files = originDir.getFiles();
  const folders = originDir.getFolders();

  while (folders.hasNext()) {
    const folder = folders.next();

    copyFolderTo(formatFilename(folder.getName()), folder, targetDir, formatFilename, processFile);
  }

  while (files.hasNext()) {
    const file = files.next();

    processFile(file.makeCopy(formatFilename(file.getName()), targetDir));
  }
};
