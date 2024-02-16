import {
  checkCustomClient,
  getConsentClientId,
  getCustomClientId,
  getCustomClientSecret,
} from '@shared/configurations/auth';
import common from '@shared/constants/common';
import { getLocalStorage, setLocalStorage } from '@shared/utils/storage';
import ky from 'ky';
import type { BackgroundFunction } from '@shared/types/commons';

const redirectUrl = chrome.identity.getRedirectURL('oauth2');
const scopes = chrome.runtime.getManifest().oauth2?.scopes ?? [];
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

const defaultAuth = async (): Promise<boolean> => {
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
  if (!accessToken) return false;

  const profile = await getProfile(accessToken);
  if (!profile) return false;

  const { id, name, email } = profile;
  await setLocalStorage(common.USER_ID, id);
  await setLocalStorage(common.USER_NAME, name);
  await setLocalStorage(common.USER_EMAIL, email);
  return true;
};
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

const customAuth = async (): Promise<boolean> => {
  const code = await getAuthorizationCode();
  if (!code) return false;

  const tokens = await getTokens(code);
  if (!tokens) return false;

  const { accessToken, refreshToken } = tokens;
  await setLocalStorage(common.ACCESS_TOKEN, accessToken);
  await setLocalStorage(common.REFRESH_TOKEN, refreshToken);

  const profile = await getProfile(accessToken);
  if (!profile) return false;

  const { id, name, email } = profile;
  await setLocalStorage(common.USER_ID, id);
  await setLocalStorage(common.USER_NAME, name);
  await setLocalStorage(common.USER_EMAIL, email);
  return true;
};
const getAuthorizationCode = async (): Promise<string | undefined> => {
  const clientId = await getCustomClientId();
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
  const clientId = await getCustomClientId();
  const clientSecret = await getCustomClientSecret();
  if (!clientId || !clientSecret) return;

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

export const login: BackgroundFunction<void, boolean> = async () => {
  try {
    const isCustomAuth = await checkCustomClient();
    return (isCustomAuth ? customAuth : defaultAuth)();
  } catch (err) {
    return false;
  }
};

export const isLoggedIn: BackgroundFunction<void, boolean> = async () => {
  const userId = await getLocalStorage(common.USER_ID);
  return !!userId;
};
