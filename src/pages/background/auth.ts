import { getConsentClientId } from '@shared/configurations/auth';
import common from '@shared/constants/common';
import { setLocalStorage } from '@shared/utils/storage';
import ky from 'ky';
import type { BackgroundFunction } from '@pages/background';

const redirectUrl = chrome.identity.getRedirectURL('oauth2');
const getToken = async (): Promise<string | undefined> => {
  const scopes = chrome.runtime.getManifest().oauth2?.scopes ?? [];
  const response = await chrome.identity.launchWebAuthFlow({
    url:
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        scope: scopes.join(' '),
        response_type: 'token',
        redirect_uri: redirectUrl,
        client_id: getConsentClientId(),
        prompt: 'consent',
      }).toString(),
    interactive: true,
  });
  if (!response) return;

  const params = new URLSearchParams(response.split('#')?.[1]);
  const token = params.get('access_token') ?? '';

  return token;
};

const getProfile = async (accessToken: string): Promise<{ id: string; name: string; email: string } | undefined> => {
  const response = await ky
    .get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<{ id: string; name: string; email: string }>();
  if (!response) return;

  const { id, name, email } = response;
  return { id, name, email };
};

export const auth: BackgroundFunction<void, void> = async () => {
  const { token } = await chrome.identity.getAuthToken({
    interactive: true,
  });
  if (token) {
    await chrome.identity.removeCachedAuthToken({ token });
    await setLocalStorage(common.USER_ID, '');
    await setLocalStorage(common.USER_NAME, '');
    await setLocalStorage(common.USER_EMAIL, '');
  }

  const accessToken = await getToken();
  if (!accessToken) return;

  const profile = await getProfile(accessToken);
  if (!profile) return;

  const { id, name, email } = profile;
  await setLocalStorage(common.USER_ID, id);
  await setLocalStorage(common.USER_NAME, name);
  await setLocalStorage(common.USER_EMAIL, email);
};
