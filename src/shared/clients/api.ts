import { getClientId, getClientSecret } from '@shared/configurations/auth';
import common from '@shared/constants/common';
import { getLocalStorage, setLocalStorage } from '@shared/utils/storage';
import ky from 'ky';

const getNewAccessToken = async (): Promise<string | undefined> => {
  const refreshToken = await getLocalStorage(common.REFRESH_TOKEN);
  if (!refreshToken) return;

  const response = await ky
    .post('https://oauth2.googleapis.com/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: getClientId(),
        client_secret: getClientSecret(),
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    })
    .json<{ access_token: string; refresh_token: string }>();

  if (!response) return;

  const { access_token } = response;
  return access_token;
};

const instance = ky.create({
  throwHttpErrors: false,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await getLocalStorage(common.ACCESS_TOKEN);
        request.headers.set('Authorization', `Bearer ${token}`);

        return request;
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
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
