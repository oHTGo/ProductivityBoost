import common from '@shared/constants/common';
import { getLocalStorage } from '@shared/utils/storage';
import ky from 'ky';

const instance = ky.create({
  throwHttpErrors: false,
  hooks: {
    beforeRequest: [
      async (request) => {
        const userId = await getLocalStorage(common.USER_ID);
        if (!userId) return request;

        const { token } = await chrome.identity.getAuthToken({
          interactive: false,
          account: {
            id: userId,
          },
        });
        if (!token) return request;

        request.headers.set('Authorization', `Bearer ${token}`);
        return request;
      },
    ],
  },
});

const api = {
  get: async <T>(url: string): Promise<T | undefined> => instance.get(url).json(),
  post: async <T>(url: string, data?: unknown): Promise<T | undefined> => instance.post(url, { json: data }).json(),
  put: async <T>(url: string, data?: unknown): Promise<T | undefined> => instance.put(url, { json: data }).json(),
  patch: async <T>(url: string, data?: unknown): Promise<T | undefined> => instance.patch(url, { json: data }).json(),
  delete: async <T>(url: string): Promise<T | undefined> => instance.delete(url).json(),
};

export default api;
