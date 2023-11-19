import { getClientId, getClientSecret } from '@shared/configurations/auth';
import common from '@shared/constants/common';
import { setLocalStorage } from '@shared/utils/storage';
import ky from 'ky';
import type { BackgroundFunction } from '@pages/background';

const redirectUrl = chrome.identity.getRedirectURL('oauth2');
const scopes = ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.modify'];

const getAuthorizationCode = async (): Promise<string | undefined> => {
  const response = await chrome.identity.launchWebAuthFlow({
    url:
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        scope: scopes.join(' '),
        response_type: 'code',
        redirect_uri: redirectUrl,
        client_id: getClientId(),
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
  const response = await ky
    .post('https://oauth2.googleapis.com/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: getClientId(),
        client_secret: getClientSecret(),
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

export const auth: BackgroundFunction<void, void> = async () => {
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
