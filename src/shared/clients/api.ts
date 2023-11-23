import common from '@shared/constants/common';
import { getLocalStorage, setLocalStorage } from '@shared/utils/storage';
import ky from 'ky';
import type { NormalizedOptions } from 'ky';

const getNewAccessToken = async (): Promise<string | undefined> => {
  const refreshToken = await getLocalStorage(common.REFRESH_TOKEN);
  if (!refreshToken) return;

  const clientId = await getLocalStorage(common.CUSTOM_CLIENT_ID);
  const clientSecret = await getLocalStorage(common.CUSTOM_CLIENT_SECRET);

  const response = await ky
    .post('https://oauth2.googleapis.com/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    })
    .json<{ access_token: string; refresh_token: string }>();

  if (!response) return;

  const { access_token } = response;
  return access_token;
};

const defaultBeforeInterceptor = async (request: Request) => {
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
};
const customBeforeInterceptor = async (request: Request) => {
  const token = await getLocalStorage(common.ACCESS_TOKEN);
  if (!token) return request;

  request.headers.set('Authorization', `Bearer ${token}`);
  return request;
};
const defaultAfterInterceptor = async (request: Request, options: NormalizedOptions, response: Response) => {
  if (response.status === 401) {
    const accessToken = await getNewAccessToken();
    if (!accessToken) return new Response(null, { status: response.status });

    await setLocalStorage(common.ACCESS_TOKEN, accessToken);
    request.headers.set('Authorization', `Bearer ${accessToken}`);
    return ky(request);
  }

  if (response.status >= 400) {
    return new Response(null, { status: response.status });
  }

  return response;
};

const instance = ky.create({
  throwHttpErrors: false,
  hooks: {
    beforeRequest: [
      async (request) => {
        const isCustomAuth =
          Boolean(await getLocalStorage(common.CUSTOM_CLIENT_ID)) &&
          Boolean(await getLocalStorage(common.CUSTOM_CLIENT_SECRET));

        if (isCustomAuth) return await customBeforeInterceptor(request);
        return await defaultBeforeInterceptor(request);
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        const isCustomAuth =
          Boolean(await getLocalStorage(common.CUSTOM_CLIENT_ID)) &&
          Boolean(await getLocalStorage(common.CUSTOM_CLIENT_SECRET));
        if (isCustomAuth) return await defaultAfterInterceptor(request, options, response);
        return response;
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
