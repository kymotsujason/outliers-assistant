import { createStorage, StorageEnum } from '../base/index.js';

export const defaultTabStorage = createStorage<number>('default-tab-index', 0, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});
