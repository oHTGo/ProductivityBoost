import { createStorage, StorageType } from '@shared/storages/base';
import type { BaseStorage } from '@shared/storages/base';

type Theme = 'light' | 'dark';

type ThemeStorage = BaseStorage<Theme> & {
  toggle: () => void;
};

const storage = createStorage<Theme>('theme-storage-key', 'light', {
  storageType: StorageType.Local,
});

const exampleThemeStorage: ThemeStorage = {
  ...storage,
  toggle: () => {
    storage.set((currentTheme) => {
      return currentTheme === 'light' ? 'dark' : 'light';
    });
  },
};

export default exampleThemeStorage;
