import { Folder } from '@lib/models';

export const createOrGetFolder = (name: string, parent: Folder): Folder => {
  const iterator = parent.getFoldersByName(name);

  return iterator.hasNext() ? iterator.next() : parent.createFolder(name);
};
