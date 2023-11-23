import { getConsentClientId } from '@shared/configurations/auth';
import common from '@shared/constants/common';
import { getLocalStorage, setLocalStorage } from '@shared/utils/storage';
import ky from 'ky';
import type { BackgroundFunction } from '@pages/background';

const redirectUrl = chrome.identity.getRedirectURL('oauth2');
const scopes = chrome.runtime.getManifest().oauth2?.scopes ?? [];

const getToken = async (): Promise<string | undefined> => {
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

const getAuthorizationCode = async (): Promise<string | undefined> => {
  const clientId = await getLocalStorage(common.CUSTOM_CLIENT_ID);
  if (!clientId) return;

  const response = await chrome.identity.launchWebAuthFlow({
    url:
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        scope: scopes.join(' '),
        response_type: 'code',
        redirect_uri: redirectUrl,
        client_id: clientId,
        prompt: 'consent',
        access_type: 'offline',
      }).toString(),
    interactive: true,
  });
  if (!response) return;

  const params = new URLSearchParams(response.split('?')?.[1]);
  const code = params.get('code') ?? '';

  return code;
};

const getTokens = async (code: string): Promise<{ accessToken: string; refreshToken: string } | undefined> => {
  const clientId = await getLocalStorage(common.CUSTOM_CLIENT_ID);
  if (!clientId) return;

  const clientSecret = await getLocalStorage(common.CUSTOM_CLIENT_SECRET);
  if (!clientSecret) return;

  const response = await ky
    .post('https://oauth2.googleapis.com/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUrl,
        grant_type: 'authorization_code',
      }).toString(),
    })
    .json<{ access_token: string; refresh_token: string }>();
  if (!response) return;

  const { access_token, refresh_token } = response;
  if (!access_token || !refresh_token) return;

  return { accessToken: access_token, refreshToken: refresh_token };
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

const defaultAuth = async (): Promise<void> => {
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

const customAuth = async (): Promise<void> => {
  const code = await getAuthorizationCode();
  if (!code) return;

  const tokens = await getTokens(code);
  if (!tokens) return;

  const { accessToken, refreshToken } = tokens;
  await setLocalStorage(common.ACCESS_TOKEN, accessToken);
  await setLocalStorage(common.REFRESH_TOKEN, refreshToken);

  const profile = await getProfile(accessToken);
  if (!profile) return;

  const { id, name, email } = profile;
  await setLocalStorage(common.USER_ID, id);
  await setLocalStorage(common.USER_NAME, name);
  await setLocalStorage(common.USER_EMAIL, email);
};

export const auth: BackgroundFunction<void, void> = async () => {
  await setLocalStorage(
    common.CUSTOM_CLIENT_ID,
    '883947601238-nfshkfrkmkasoc7p07hcv069jga030s7.apps.googleusercontent.com',
  );
  await setLocalStorage(common.CUSTOM_CLIENT_SECRET, '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');

  const isCustomAuth =
    Boolean(await getLocalStorage(common.CUSTOM_CLIENT_ID)) &&
    Boolean(await getLocalStorage(common.CUSTOM_CLIENT_SECRET));

  if (isCustomAuth) await customAuth();
  else await defaultAuth();
};
