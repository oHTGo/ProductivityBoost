export const getLocalStorage = async (key: string): Promise<string | undefined> => {
  return (await chrome.storage.local.get(key))?.[key];
};

export const setLocalStorage = async (key: string, value: string): Promise<void> => {
  await chrome.storage.local.set({ [key]: value });
};
