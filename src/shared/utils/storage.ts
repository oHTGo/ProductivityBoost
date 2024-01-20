export const getLocalStorage = async <T>(key: string): Promise<T | undefined> => {
  return (await chrome.storage.local.get(key))?.[key];
};

export const setLocalStorage = async <T>(key: string, value: T): Promise<void> => {
  await chrome.storage.local.set({ [key]: value });
};

export const updateLocalStorage = async <T extends object>(key: string, value: Partial<T>): Promise<void> => {
  const prev = await getLocalStorage<T>(key);
  await setLocalStorage(key, { ...prev, ...value });
};
