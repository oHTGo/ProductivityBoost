import { getClientId, getClientSecret } from '@shared/configurations/auth';
import common from '@shared/constants/common';
import { setLocalStorage } from '@shared/utils/storage';
import ky from 'ky';
import type { BackgroundFunction } from '@pages/background';

const redirectUrl = chrome.identity.getRedirectURL('oauth2');
const scopes = ['https://www.googleapis.com/auth/gmail.modify'];

function parseRedirectUrl(redirectUrl: string) {
  const params = new URLSearchParams(redirectUrl.split('?')?.[1]);
  const code = params.get('code') ?? '';

  return { code };
}

export const auth: BackgroundFunction<void, void> = async () => {
  const urlResponse = await chrome.identity.launchWebAuthFlow({
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
  if (!urlResponse) return;

  const { code } = parseRedirectUrl(urlResponse);
  if (!code) return;

  const tokenResponse = await ky
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
  if (!tokenResponse) return;

  const { access_token, refresh_token } = tokenResponse;

  if (!access_token || !refresh_token) return;

  await setLocalStorage(common.ACCESS_TOKEN, access_token);
  await setLocalStorage(common.REFRESH_TOKEN, refresh_token);
};
